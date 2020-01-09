import { Controller } from '../Controller';
import { Router, Request, Response, NextFunction} from 'express';
import { Repository, Connection, Raw, getConnection } from 'typeorm';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { createConnection } from 'typeorm';
import { Constituer } from '../../entities/Constituer';

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
                var reservations : Object = await this.fetchReservationFromDatabase(this.parseWeekFromRequest(req))
                this.sendResponse(res, 200, { data: reservations })
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private parseWeekFromRequest(req : Request) : string{
        return req.params.week
    }

    private fetchReservationFromDatabase(week : string) : Promise<any>{
        var query : string = `SELECT "Reservation"."idReservation", "Reservation"."nomReservation", "Reservation"."descReservation", "Reservation"."etatReservation", "Client"."nomClient", "Client"."prenomClient", MIN(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateEntree", MAX(CONCAT("date", \' \' ,"TypeDemiJournee")) as "DateSortie" FROM "DemiJournee" JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_TypeDemiJournee" = "DemiJournee"."TypeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient" HAVING DATE_PART(\'week\', MIN("date")) <= ${week} AND  DATE_PART(\'week\', MAX("date")) >= ${week}`
        return getConnection().createEntityManager().query(query)
    }

    addPost(router: Router): void {

    }
    addDelete(router: Router): void {

    }
    addPut(router: Router): void {

    }
}