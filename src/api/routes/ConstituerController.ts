import { Controller } from "../Controller";
import { Repository, Connection, createConnection, getConnection, Raw } from "typeorm";
import { Constituer } from "../../entities/Constituer";
import { ormconfig } from '../../config';
import { Router, Request, Response, NextFunction } from "express"
import { Reservation } from '../../entities/Reservation';
import { DemiJournee } from '../../entities/DemiJournee';
export default class ConstituerController extends Controller {
    constituerRepository: Repository<Constituer>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }

    async createConnectionAndAssignRepository(): Promise<any> {
        try {
            this.connection = await createConnection(ormconfig)
            this.constituerRepository = this.connection.getRepository(Constituer)
        } catch (error) {
            console.log(error)
        }
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllConstituer(router)
    }
    private async getAllConstituer(router: Router): Promise<void> {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var constituers: Constituer[] = await this.fetchConstituersFromDatabase(this.checkAndReturnIdReservation(req))
                var stat = await getConnection().createEntityManager().query(`SELECT ROUND(AVG("Constituer"."nbPersonne"), 1) as "nbMoyennePersonne", ROUND(COUNT("DemiJournee_date") / 2.0, 1) as "nbJours" FROM "Constituer" WHERE "Reservation_idReservation" = ${this.checkAndReturnIdReservation(req)};`)
                await this.sendResponse(res, 200, { data: constituers, stat: (stat as Array<Object>)[0]})
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    checkAndReturnIdReservation(req: Request): number {
        return isNaN(Number(req.params.idReservation)) ? 0 : Number(req.params.idReservation)
    }
    async fetchConstituersFromDatabase(idReservation: number): Promise<Constituer[]> {
        return this.constituerRepository
        .createQueryBuilder("constituer")
        .innerJoin("constituer.reservationIdReservation","reservation", "reservation.idReservation = :idReservation", {
            idReservation : idReservation
        })
        .innerJoinAndSelect("constituer.demiJournee", "demiJournee")
        .orderBy("demiJournee.date", "ASC")
        .addOrderBy("demiJournee.TypeDemiJournee", "ASC")
        .getMany()
    }
    async addPost(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }
    async addPut(router: Router): Promise<void> {
        router.put("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation;
                try {
                    reservation = await this.connection.getRepository(Reservation).findOneOrFail(this.checkAndReturnIdReservation(req))

                } catch (error) {
                    this.sendResponse(res, 200, { data: "This Reservation not found" })
                    next()
                    return
                }
                var data: Object = JSON.parse(req.headers["data"].toString())
                var constituersToSave: Constituer[] = new Array<Constituer>();
                var demiJourneesToSave: Array<DemiJournee> = new Array<DemiJournee>();

                (data["changes"] as Array<Object>).forEach(value => {

                    var demiJournee: DemiJournee = new DemiJournee()
                    demiJournee.date = value["date"]
                    demiJournee.TypeDemiJournee = value["TypeDemiJournee"]
                    demiJourneesToSave.push(demiJournee)

                    var constituer: Constituer = new Constituer()
                    constituer.demiJournee = demiJournee
                    constituer.nbPersonne = isNaN(Number(value["nbPersonne"])) ? 0 : Number(value["nbPersonne"])
                    constituer.reservationIdReservation = reservation
                    constituersToSave.push(constituer)
                })
                await this.connection.getRepository(DemiJournee).save(demiJourneesToSave).then(_ => {
                    this.constituerRepository.save(constituersToSave)
                })
                this.deleteConstituers(this.checkAndReturnIdReservation(req), data)
                this.sendResponse(res, 200, { data: "Update successfully" })
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })

    }

    async deleteConstituers(idReservation: number, data: Object) {
        if((data["delete"] as Array<Object>).length == 0)
            return

        var deleteQueries : string[] = (data["delete"] as Array<Object>).map<string>(value => {
            return `("Constituer"."DemiJournee_TypeDemiJournee" = '${value["TypeDemiJournee"]}' AND "Constituer"."DemiJournee_date" = '${value["date"]}')`
        })

        var deleteQuery : string = deleteQueries.join(" OR ")
        var query = `DELETE FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation} AND (${deleteQuery})`
        await getConnection().createEntityManager().query(query);
    }
}

