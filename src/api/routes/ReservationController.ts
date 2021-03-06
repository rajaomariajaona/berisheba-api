import { Controller } from '../Controller';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository, Connection, Raw, getConnection, UpdateResult, EntityManager, createConnection } from 'typeorm';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { Constituer } from '../../entities/Constituer';
import moment = require('moment')
import { DemiJournee } from '../../entities/DemiJournee';
import { Client } from '../../entities/Client';
import { DeleteResult } from 'typeorm';


export default class ReservationController extends Controller {
    reservationRepository: Repository<Reservation>
    connection : Connection
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
        await this.getReservationAndDateById(router)
        await this.getReservationAndDateByWeek(router)
    }

    private async getReservationAndDateById(router: Router) {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservations: Object = (await this.fetchReservationsByIdFromDatabase(await this.parseIdFromRequest(req)))[0]
                if(reservations === undefined || reservations === null){
                    await this.sendResponse(res, 404, { message: "Reservation not found"})
                }else{
                    await this.sendResponse(res, 200, { data: reservations})
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async parseIdFromRequest(req : Request): Promise<number>{
        return Number(req.params.idReservation)
    }
    private async fetchReservationsByIdFromDatabase(idReservation : number): Promise<any> {
        var query: string = `SELECT "Reservation"."idReservation", "Client"."idClient","Reservation"."nomReservation", "Reservation"."descReservation", "Reservation"."prixPersonne", "Reservation"."prixKW","Reservation"."couleur", "Reservation"."etatReservation", "Client"."nomClient", "Client"."prenomClient", split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 1) as "dateEntree",
        split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 2) as "typeDemiJourneeEntree", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 1) as "dateSortie", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 2) as "typeDemiJourneeSortie", DATE_PART('week', MIN("date")) as "semaineEntree", DATE_PART('week', MAX("date")) as "semaineSortie" FROM "DemiJournee"  JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient" HAVING "Reservation"."idReservation" = ${idReservation}`
        var res = await getConnection().createEntityManager().query(query)
        return res
    }
    private async getReservationAndDateByWeek(router: Router) {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                
                var reservations: Object = await this.fetchReservationsByWeekFromDatabase(await this.parseWeekFromRequest(req))
                var reservationsById: Object = {}
                Object.keys(reservations).map((index : string) => {
                    return reservations[index]
                }).forEach((reservation : Object) => {
                    reservationsById[reservation["idReservation"]] = reservation
                })
                await this.sendResponse(res, 200, { data: reservationsById})
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async parseWeekFromRequest(req: Request): Promise<Object> {
        var weeks: Object = {}
        var range = new Array<Array<number>>();
        var unique = new Array<number>();
        if(req.headers["range"]){
            var raw: any = req.headers["range"];
            var splitByComma: Array<string> = raw.split(",");
            if(splitByComma.length == 0)
                throw new Error(`${req.headers["range"]} is not Valid range of week`);
                
            splitByComma.forEach(async (rangeOrUnique) => {
                
                if(this.isRange(rangeOrUnique)){
                    this.addRange(rangeOrUnique, range)
                }else if(this.isUnique(rangeOrUnique)){
                    this.addUnique(rangeOrUnique,unique)
                }else{
                    throw new Error("Not Range and Not Number");  
                }
            })
        }else{
            throw new Error("No Weeks Added in body");
        }
        weeks["range"] = range
        weeks["unique"] = unique
        return weeks
    }
    private isRange(rangeOrUnique: string): boolean{
        return new RegExp("^\\d+-\\d+$").test(rangeOrUnique)
    }
    private isUnique(rangeOrUnique: string) : boolean {
        return new RegExp("^\\d+$").test(rangeOrUnique)
    }
    private addRange(rangeOrUnique: string, range: Array<number[]>){
        var splitByMinus: Array<number> = rangeOrUnique.split("-").map((number) => {
            return Number(number)
        })
        if(splitByMinus[0] > splitByMinus[1])
            throw new Error("Range error")
        else{
            range.push(splitByMinus)
        }
    }
    private addUnique(rangeOrUnique: string, unique: Array<Number>){
        unique.push(Number(rangeOrUnique))
    }
    private async fetchReservationsByWeekFromDatabase(weeks: Object): Promise<any> {
        var havingConditions: Array<string> = new Array<string>();
        weeks["unique"].forEach((week : number) => {
            havingConditions.push(`(DATE_PART('week', MIN("date")) <= ${week} AND  DATE_PART('week', MAX("date")) >= ${week})`)
        })
        weeks["range"].forEach((week : Array<number>) => {
            havingConditions.push(`(DATE_PART('week', MIN("date")) <= ${week[1]} AND  DATE_PART('week', MAX("date")) >= ${week[0]})`)
        })
        var query: string = `SELECT "Reservation"."idReservation", "Client"."idClient", "Reservation"."nomReservation", "Reservation"."descReservation", "Reservation"."prixKW", "Reservation"."prixPersonne", "Reservation"."couleur", "Reservation"."etatReservation", "Client"."nomClient", "Client"."prenomClient", split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 1) as "dateEntree",
        split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 2) as "typeDemiJourneeEntree", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 1) as "dateSortie", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 2) as "typeDemiJourneeSortie", DATE_PART('week', MIN("date")) as "semaineEntree", DATE_PART('week', MAX("date")) as "semaineSortie" FROM "DemiJournee"  JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient" ${havingConditions.length > 0 ? 'HAVING' : ''} ${havingConditions.join(" OR ")}`
        return await getConnection().createEntityManager().query(query)
    }

    async addPost(router: Router): Promise<void> {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                console.log(req.body)
                this.connection.transaction(async (entityManager: EntityManager) => {
                    var demiJournees: DemiJournee[] = await this.createDemiJournees(await this.parseDataTimeFromRequest(req))
                    var reservation: Reservation = await this.createReservationFromRequestAndTransactionalEntityManager(req, entityManager)
                    var constituers: Constituer[] = await this.createConstituersFromRequest(demiJournees, reservation, req)
                    await this.saveAllInDatabase(entityManager, demiJournees, reservation, constituers)
                })
                .then(async (_) => {
                    await this.sendResponse(res, 201, { message: "Reservation has been created"})
                })
                .catch(async (err) => {
                    console.log(err)
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
        demiJournee.typeDemiJournee = typeDemiJournee
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

    private async saveAllInDatabase(entityManager: EntityManager, demiJournees: DemiJournee[], reservation: Reservation, constituers: Constituer[]){
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
        await this.patchReservation(router);
        await this.putReservation(router);
    }
    private async patchReservation(router: Router): Promise<void> {
        router.patch("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            if(req.body.prixKW !== undefined){
                var reservation: Reservation = await this.reservationRepository.findOneOrFail(req.params.idReservation)
                reservation.prixKW = Number(req.body.prixKW)
                await this.reservationRepository.save(reservation)
                await this.sendResponse(res, 200, { message: "Prix KW Updated" });
                return;
            }
            await this.sendResponse(res, 400, { message: "Prix KW not Provided" });
        })
    }

    private async putReservation(router: Router): Promise<void> {
        router.put("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation;
                try {
                    reservation = await this.reservationRepository.findOneOrFail(await this.parseIdReservationFromRequest(req));
                }
                catch (err) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" });
                }
                var reservationMerged: Reservation = await this.mergeReservationWithRequest(reservation, req);
                console.log(reservationMerged);
                await this.updateReservationInDatabase(reservationMerged);
                await this.sendResponse(res, 200, { message: "Reservation Updated" });
                next();
            }
            catch (err) {
                await this.passErrorToExpress(err, next);
            }
        });
        router.patch("/:idReservation/etatReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation;
                try {
                    reservation = await this.reservationRepository.findOneOrFail(await this.parseIdReservationFromRequest(req));
                }
                catch (err) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" });
                }
                reservation.etatReservation = req.body.etatReservation;
                await this.reservationRepository.save(reservation);
                await this.sendResponse(res, 200, { message: "Reservation Updated" });
                next();
            }
            catch (err) {
                await this.passErrorToExpress(err, next);
            }
        });
    }

    private async mergeReservationWithRequest(reservation: Reservation, req: Request): Promise<Reservation> {
        var reservationMerged : Reservation = this.reservationRepository.merge(reservation, req.body)
        if(reservation.clientIdClient != req.body.idClient)
            reservationMerged.clientIdClient = await this.connection.getRepository(Client).findOneOrFail(req.body.idClient)
        return reservationMerged
    }
    private async updateReservationInDatabase(reservation: Reservation): Promise<Reservation> {
        return await this.reservationRepository.save(reservation)
    }
}