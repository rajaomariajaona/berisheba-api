import { Controller } from '../Controller';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository, Connection, Raw, getConnection } from 'typeorm';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { createConnection } from 'typeorm';
import { Constituer } from '../../entities/Constituer';
import moment = require('moment')
import { DemiJournee } from '../../entities/DemiJournee';


export default class ReservationController extends Controller {
    reservationRepository: Repository<Reservation>
    constituerRepository: Repository<Constituer>

    constructor() {
        super()
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        var connection: Connection = await createConnection(ormconfig)
        this.reservationRepository = connection.getRepository(Reservation)
        this.constituerRepository = connection.getRepository(Constituer)
    }
    addAllRoutes(router: Router): void {
        this.addGet(router)
        this.addPost(router)
        this.addDelete(router)
        this.addPut(router)
        this.addErrorHandler(router)
    }
    addGet(router: Router): void {
        this.getReservationAndDateByWeek(router)
    }

    private getReservationAndDateByWeek(router: Router) {
        router.get("/:week", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservations: Object = await this.fetchReservationFromDatabase(this.parseWeekFromRequest(req))
                this.sendResponse(res, 200, { data: reservations })
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private parseWeekFromRequest(req: Request): string {
        return req.params.week
    }

    private fetchReservationFromDatabase(week: string): Promise<any> {
        var query: string = `SELECT "Reservation"."idReservation", "Reservation"."nomReservation", "Reservation"."descReservation", "Reservation"."etatReservation", "Client"."nomClient", "Client"."prenomClient", MIN(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateEntree", MAX(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateSortie" FROM "DemiJournee" JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_TypeDemiJournee" = "DemiJournee"."TypeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient" HAVING DATE_PART(\'week\', MIN("date")) <= ${week} AND  DATE_PART(\'week\', MAX("date")) >= ${week}`
        return getConnection().createEntityManager().query(query)
    }

    addPost(router: Router): void {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation[] = this.reservationRepository.create(req.body)
                console.log(this.createDemiJourneeInstances(this.parseDataTimeFromRequest(req)))

                this.sendResponse(res, 200, { message: "Reservation has been created" })
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private createDemiJourneeInstances(data: any): Array<DemiJournee> {
        var currentDate: moment.Moment = moment(data.dateEntree);
        const typeDemiJournee = ["Jour", "Nuit"]
        var demiJournees: DemiJournee[] = new Array<DemiJournee>()
        while (this.isOnInterval(currentDate, data)) {
            if (this.isOnSortieAndNotEntree(currentDate, data)) {
                this.cursorOnDateSortie(demiJournees, currentDate, typeDemiJournee, data)
                break
            } else {
                if(this.isOnEntreeAndSortie(currentDate,data)){
                    this.cursorOnDateEntreeAndSortie(demiJournees, currentDate, typeDemiJournee, data)
                }
                else if (this.isOnEntree(currentDate, data)) {
                    this.cursorOnDateEntree(demiJournees, currentDate, typeDemiJournee, data)
                } else {
                    this.cursorOnDateMilieu(demiJournees, currentDate, typeDemiJournee, data)
                }
                this.incrementDateOneDay(currentDate)
            }
        }
        return demiJournees
    }

    private isOnInterval(currentDate: moment.Moment, data: any): boolean {
        return currentDate.isBefore(moment(data.dateSortie).add(1, 'd'))
    }
    private isOnSortieAndNotEntree(currentDate: moment.Moment, data: any): boolean {
        return currentDate.isSame(moment(data.dateSortie)) && !moment(data.dateSortie).isSame(moment(data.dateEntree))
    }
    private isOnEntree(currentDate: moment.Moment, data: any): boolean {
        return currentDate.isSame(moment(data.dateEntree));
    }
    private isOnEntreeAndSortie( currentDate: moment.Moment, data: any) : boolean{
        return (currentDate.isSame(moment(data.dateEntree))) && (currentDate.isSame(moment(data.dateSortie))) ;
    }

    private cursorOnDateSortie(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])
        if (data.typeDemiJourneeSortie === typeDemiJournee[0])
            return;
        else {
            this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
            return;
        }
    }

    private cursorOnDateEntreeAndSortie(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeEntree)
        if (data.typeDemiJourneeEntree !== data.typeDemiJourneeSortie)
            this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeSortie)
        return;
    }

    private cursorOnDateEntree(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        var index: number = typeDemiJournee.indexOf(data.typeDemiJourneeEntree);
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[index])
        if (index === 0) {
            this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
        }
    }
    private cursorOnDateMilieu(demiJournees: DemiJournee[], date: moment.Moment, typeDemiJournee: Array<string>, data: any) {
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])
    }

    private parseDataTimeFromRequest(req: Request): any {
        var data: any = {
            dateEntree: req.body.dateEntree,
            typeDemiJourneeEntree: req.body.typeDemiJourneeEntree,
            dateSortie: req.body.dateSortie,
            typeDemiJourneeSortie: req.body.typeDemiJourneeSortie
        }
        if (data.dateEntree == undefined || data.dateSortie == undefined || data.typeDemiJourneeEntree == undefined || data.typeDemiJourneeSortie == undefined)
            throw new Error("Some Field Uncompleted");
        if(moment(data.dateEntree).isAfter(moment(data.dateSortie)) || (moment(data.dateEntree).isSame(moment(data.dateSortie)) && data.typeDemiJourneeEntree == 'Nuit' && data.typeDemiJourneeSortie == 'Jour'))
            throw new Error("Invalid data at in the demi journee data")
        return data
    }

    private addNewDemiJournee(list: DemiJournee[], date: moment.Moment, typeDemiJournee: string) {
        var demiJournee: DemiJournee = new DemiJournee()
        demiJournee.TypeDemiJournee = typeDemiJournee
        demiJournee.date = date.format("YYYY-MM-DD")
        list.push(demiJournee)
    }

    private incrementDateOneDay(date: moment.Moment) {
        date.add(1, "d")
    }

    addDelete(router: Router): void {

    }
    addPut(router: Router): void {

    }
}