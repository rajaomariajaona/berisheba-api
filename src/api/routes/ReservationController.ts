import { Controller } from '../Controller';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository, Connection, Raw, getConnection, UpdateResult, EntityManager } from 'typeorm';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { createConnection } from 'typeorm';
import { Constituer } from '../../entities/Constituer';
import moment = require('moment')
import { DemiJournee } from '../../entities/DemiJournee';
import { Client } from '../../entities/Client';
import { TypeReservation } from '../../entities/TypeReservation';
import { DeleteResult } from 'typeorm';


export default class ReservationController extends Controller {
    reservationRepository: Repository<Reservation>
    connection: Connection
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        this.connection = await createConnection(ormconfig)
        this.reservationRepository = this.connection.getRepository(Reservation)
    }
    async addGet(router: Router): Promise<void> {
        await this.getReservationAndDateByWeek(router)
    }

    private async getReservationAndDateByWeek(router: Router) {
        router.get("/:week", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservations: Object = await this.fetchReservationsByWeekFromDatabase(await await this.parseWeekFromRequest(req))
                await this.sendResponse(res, 200, { data: reservations })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async parseWeekFromRequest(req: Request): Promise<string> {
        return req.params.week
    }

    private async fetchReservationsByWeekFromDatabase(week: string): Promise<any> {
        var query: string = `SELECT "Reservation"."idReservation", "Reservation"."nomReservation", "Reservation"."descReservation", "Reservation"."etatReservation", "Client"."nomClient", "Client"."prenomClient", MIN(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateEntree", MAX(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateSortie" FROM "DemiJournee" JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_TypeDemiJournee" = "DemiJournee"."TypeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient" HAVING DATE_PART(\'week\', MIN("date")) <= ${week} AND  DATE_PART(\'week\', MAX("date")) >= ${week}`
        return await getConnection().createEntityManager().query(query)
    }

    async addPost(router: Router): Promise<void> {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.connection.transaction(async (entityManager: EntityManager) => {
                    var demiJournees: DemiJournee[] = await this.createDemiJournees(await this.parseDataTimeFromRequest(req))
                    var reservation: Reservation = await this.createReservationFromRequestAndTransactionalEntityManager(req, entityManager)
                    var constituers: Constituer[] = await this.createConstituersFromRequest(demiJournees, reservation, req)
                    await this.saveAllInDatabase(entityManager, demiJournees, reservation, constituers)
                })
                .then(async (_) => {
                    await this.sendResponse(res, 200, { message: "Reservation has been created" })
                })
                .catch(async (err) => {
                    await this.sendResponse(res, 403, { message: "Reservation Not Created" })
                })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async createDemiJournees(data: any): Promise<Array<DemiJournee>> {
        var currentDate: moment.Moment = moment(data.dateEntree);
        const typeDemiJournee = ["Jour", "Nuit"]
        var demiJournees: DemiJournee[] = new Array<DemiJournee>()
        await this.addDemiJourneeToSaveInList(demiJournees, currentDate, data, typeDemiJournee)
        return demiJournees
    }

    private async addDemiJourneeToSaveInList(demiJournees: DemiJournee[], currentDate: moment.Moment, data: any, typeDemiJournee: Array<string>) {
        while (await this.isOnInterval(currentDate, data)) {
            if (await this.isOnSortieAndNotEntree(currentDate, data)) {
                await this.cursorOnDateSortie(demiJournees, currentDate, typeDemiJournee, data)
                break
            } else {
                if (await this.isOnEntreeAndSortie(currentDate, data)) {
                    await this.cursorOnDateEntreeAndSortie(demiJournees, currentDate, typeDemiJournee, data)
                }
                else if (await this.isOnEntree(currentDate, data)) {
                    await this.cursorOnDateEntree(demiJournees, currentDate, typeDemiJournee, data)
                } else {
                    await this.cursorOnDateMilieu(demiJournees, currentDate, typeDemiJournee, data)
                }
                await this.incrementDateOneDay(currentDate)
            }
        }
    }
    private async isOnInterval(currentDate: moment.Moment, data: any): Promise<boolean> {
        return currentDate.isBefore(moment(data.dateSortie).add(1, 'd'))
    }
    private async isOnSortieAndNotEntree(currentDate: moment.Moment, data: any): Promise<boolean> {
        return currentDate.isSame(moment(data.dateSortie)) && !moment(data.dateSortie).isSame(moment(data.dateEntree))
    }
    private async isOnEntree(currentDate: moment.Moment, data: any): Promise<boolean> {
        return currentDate.isSame(moment(data.dateEntree));
    }
    private async isOnEntreeAndSortie(currentDate: moment.Moment, data: any): Promise<boolean> {
        return (currentDate.isSame(moment(data.dateEntree))) && (currentDate.isSame(moment(data.dateSortie)));
    }

    private async cursorOnDateSortie(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])
        if (data.typeDemiJourneeSortie === typeDemiJournee[0])
            return;
        else {
            await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
            return;
        }
    }

    private async cursorOnDateEntreeAndSortie(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        await this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeEntree)
        if (data.typeDemiJourneeEntree !== data.typeDemiJourneeSortie)
            await this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeSortie)
        return;
    }

    private async cursorOnDateEntree(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        var index: number = typeDemiJournee.indexOf(data.typeDemiJourneeEntree);
        await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[index])
        if (index === 0) {
            await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
        }
    }
    private async cursorOnDateMilieu(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])
        await this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
    }

    private async addNewDemiJournee(list: DemiJournee[], date: moment.Moment, typeDemiJournee: string) {
        var demiJournee: DemiJournee = new DemiJournee()
        demiJournee.TypeDemiJournee = typeDemiJournee
        demiJournee.date = date.format("YYYY-MM-DD")
        list.push(demiJournee)
    }

    private async incrementDateOneDay(date: moment.Moment) {
        date.add(1, "d")
    }


    private async parseDataTimeFromRequest(req: Request): Promise<any> {
        var data: any = {
            dateEntree: req.body.dateEntree,
            typeDemiJourneeEntree: req.body.typeDemiJourneeEntree,
            dateSortie: req.body.dateSortie,
            typeDemiJourneeSortie: req.body.typeDemiJourneeSortie
        }
        await this.handleDataTimeError(data)
        return data
    }

    private async handleDataTimeError(data: any) {
        await this.handleRequestDataTimeIncompleteError(data)
        await this.handleRequestDataTimeIncoherentError(data)
    }
    private async handleRequestDataTimeIncompleteError(data: any) {
        if (data.dateEntree == undefined || data.dateSortie == undefined || data.typeDemiJourneeEntree == undefined || data.typeDemiJourneeSortie == undefined)
            throw new Error("Some Field Uncompleted");
    }
    private async handleRequestDataTimeIncoherentError(data: any) {
        if (moment(data.dateEntree).isAfter(moment(data.dateSortie)) || (moment(data.dateEntree).isSame(moment(data.dateSortie)) && data.typeDemiJourneeEntree == 'Nuit' && data.typeDemiJourneeSortie == 'Jour'))
            throw new Error("Invalid data at in the request data")
    }

    private async createReservationFromRequestAndTransactionalEntityManager(req: Request, entityManager: EntityManager): Promise<Reservation> {
        var reservation: Reservation = entityManager.create(Reservation, req.body as Object)
        reservation.clientIdClient = await entityManager.findOneOrFail(Client, req.body.idClient)
        reservation.typeReservationTypeReservation = await entityManager.findOneOrFail(TypeReservation, req.body.typeReservation)
        return reservation
    }

    private async createConstituersFromRequest(demiJournees: DemiJournee[], reservation: Reservation, req: Request): Promise<Array<Constituer>> {
        var constituers: Constituer[] = new Array<Constituer>()
        demiJournees.forEach(async (demiJournee: DemiJournee) => {
            await this.addConstituerToSavedList(constituers, demiJournee, reservation, req)
        })
        return constituers
    }
    private async addConstituerToSavedList(constituers: Constituer[], demiJournee: DemiJournee, reservation: Reservation, req: Request) {
        var constituer: Constituer = new Constituer()
        constituer.demiJournee = demiJournee
        constituer.nbPersonne = Number(req.body.nbPersonne)
        constituer.reservationIdReservation = reservation
        constituers.push(constituer)
    }

    private async saveAllInDatabase(entityManager: EntityManager, demiJournees: DemiJournee[], reservation: Reservation, constituers: Constituer[]) {
        await entityManager.save(DemiJournee, demiJournees)
        await entityManager.save(Reservation, reservation)
        await entityManager.save(Constituer, constituers)
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var result: DeleteResult = await this.reservationRepository.delete(await this.parseIdReservationFromRequest(req))
                if (await this.isDeleted(result)) {
                    await this.sendResponse(res, 204, { message: "Reservation deleted successfully" })
                } else {
                    await this.sendResponse(res, 403, { message: "None Reservation has been deleted" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async parseIdReservationFromRequest(req: Request): Promise<string> {
        return req.params.idReservation
    }
    private async isDeleted(result: DeleteResult): Promise<Boolean> {
        return result.affected !== 0
    }
    async addPut(router: Router) {
        router.put("/idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation = await this.reservationRepository.findOneOrFail(await this.parseIdReservationFromRequest(req))
                var reservationMerged: Reservation = await this.mergeReservationWithRequest(reservation, req)
                await this.updateReservationInDatabase(reservationMerged);
                await this.sendResponse(res, 200, { message: "Reservation Updated" })
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async mergeReservationWithRequest(reservation: Reservation, req: Request): Promise<Reservation> {
        return this.reservationRepository.merge(req.body, reservation)
    }
    private async updateReservationInDatabase(reservation: Reservation): Promise<Reservation> {
        return await this.reservationRepository.save(reservation)
    }
}