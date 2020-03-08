import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection, Like, createQueryBuilder } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Paiement } from '../../entities/Paiement';
import router from '../routerApi';
import { Appareil } from '../../entities/Appareil';
import { Utiliser } from '../../entities/Utiliser';
import { Reservation } from '../../entities/Reservation';
import { print } from "util";
import { Payer } from '../../entities/Payer';

export default class PaiementController extends Controller {

    paiementRepository: Repository<Paiement>
    payerRepository: Repository<Payer>
    reservationRepository: Repository<Reservation>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.paiementRepository = connection.getRepository(Paiement)
            this.payerRepository = connection.getRepository(Payer)
            this.reservationRepository = connection.getRepository(Reservation)
        } catch (error) {
            console.log(error)
        }

    }

    async addGet(router: Router): Promise<void> {
        await this.getPayerByIdReservation(router)
    }
    private async getPayerByIdReservation(router: Router) {
        router.get("/:idReservation", async (req, res, next) => {
            try {
                try {
                    var em = getConnection().createEntityManager()
                    try {
                        getConnection().getRepository(Reservation).findOneOrFail(req.params.idReservation)
                    } catch (error) {
                        await this.sendResponse(res, 404, { message: "Reservation Not Found" })
                        return
                    }
                    var prixPayee: number
                    var prixTotal: number
                    var remise: number

                    var queryTotal = `SELECT (
                        -- Prix de location Chambre
                            (SELECT SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2))
                            FROM "Reservation" INNER JOIN "Constituer" 
                            ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" 
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation}
                            GROUP BY "Reservation"."idReservation")
                        -- Prix de location Chambre
                             +
                        -- Prix Autre
                            (SELECT COALESCE(SUM("prixAutre"), 0) as "prixTotalAutre"
                            FROM "Reservation" INNER JOIN "Doit" 
                            ON "Doit"."Reservation_idReservation" = "Reservation"."idReservation"
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation})
                        -- Prix Autre
                        +
                        -- Prix Jirama
                            (SELECT COALESCE(SUM(CEIL(CEIL((("Utiliser"."duree" * "puissance") / 3600))/1000) * "prixKW"), 0)
                            as "prixTotalJirama"
                            FROM "Reservation" INNER JOIN "Utiliser" 
                            ON "Utiliser"."Reservation_idReservation" = "Reservation"."idReservation"
                            INNER JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil"
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation})
                        -- Prix Jirama
                        
                    ) as "prixTotal"`
                    var queryPayee = `SELECT COALESCE(SUM("sommePayee"),0) as "prixPayee" FROM "Payer" WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Payer"."Paiement_typePaiement" <> 'remise'`
                    var queryRemise = `SELECT COALESCE(SUM("sommePayee"),0) as "remise" FROM "Payer" WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Payer"."Paiement_typePaiement" = 'remise'`
                    var queryTotalResult:Array<any> = await em.query(queryTotal)
                    var queryPayeeResult:Array<any> = await em.query(queryPayee)
                    var queryRemiseResult:Array<any> = await em.query(queryRemise)
                    prixTotal = queryTotalResult[0]["prixTotal"]
                    prixPayee = queryPayeeResult[0]["prixPayee"]
                    remise = queryRemiseResult[0]["remise"]

                    var payers: Payer[] = await this.payerRepository.find({ where: { reservationIdReservation: req.params.idReservation }, order: { paiementTypePaiement: 'ASC' } })

                    await this.sendResponse(res, 200, { data: payers, stats: { prixTotal: prixTotal, prixPayee: prixPayee, remise: remise } })
                } catch (error) {
                    console.log(error)
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        await this.postPaiement(router)
    }

    async postPaiement(router: Router) {
        router.post("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var em = getConnection().createEntityManager()
                var typePaiement: string = req.body.typePaiement
                var sommePayee: number = Number(req.body.sommePayee)
                if (typePaiement == undefined) {
                    this.sendResponse(res, 400, { message: "Some field required" })
                    return;
                }
                try {
                    this.reservationRepository.findOneOrFail(req.params.idReservation)
                } catch (error) {
                    this.sendResponse(res, 404, { message: "Reservation not found" })
                }

                var prixPayee: number
                    var prixTotal: number
                    var remise: number

                    var queryTotal = `SELECT (
                        -- Prix de location Chambre
                            (SELECT SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2))
                            FROM "Reservation" INNER JOIN "Constituer" 
                            ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" 
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation}
                            GROUP BY "Reservation"."idReservation")
                        -- Prix de location Chambre
                             +
                        -- Prix Autre
                            (SELECT COALESCE(SUM("prixAutre"), 0) as "prixTotalAutre"
                            FROM "Reservation" INNER JOIN "Doit" 
                            ON "Doit"."Reservation_idReservation" = "Reservation"."idReservation"
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation})
                        -- Prix Autre
                        +
                        -- Prix Jirama
                            (SELECT COALESCE(SUM(CEIL(CEIL((("Utiliser"."duree" * "puissance") / 3600))/1000) * "prixKW"), 0)
                            as "prixTotalJirama"
                            FROM "Reservation" INNER JOIN "Utiliser" 
                            ON "Utiliser"."Reservation_idReservation" = "Reservation"."idReservation"
                            INNER JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil"
                            WHERE "Reservation"."idReservation" = ${req.params.idReservation})
                        -- Prix Jirama
                        
                    ) as "prixTotal"`
                    var queryPayee = `SELECT COALESCE(SUM("sommePayee"),0) as "prixPayee" FROM "Payer" WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Payer"."Paiement_typePaiement" <> 'remise'`
                    var queryRemise = `SELECT COALESCE(SUM("sommePayee"),0) as "remise" FROM "Payer" WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Payer"."Paiement_typePaiement" = 'remise'`
                    var queryTotalResult:Array<any> = await em.query(queryTotal)
                    var queryPayeeResult:Array<any> = await em.query(queryPayee)
                    var queryRemiseResult:Array<any> = await em.query(queryRemise)
                    prixTotal = queryTotalResult[0]["prixTotal"]
                    prixPayee = queryPayeeResult[0]["prixPayee"]
                    remise = queryRemiseResult[0]["remise"]

                try {

                    switch (typePaiement) {
                        case 'avance':
                            if (sommePayee != undefined) {

                                var count: number = await this.payerRepository.count({ where: { reservationIdReservation: req.params.idReservation, paiementTypePaiement: "avance" } })
                                if (count > 0) {
                                    var query: string = `UPDATE "Payer" SET "sommePayee" = "sommePayee" + ${sommePayee} WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Paiement_typePaiement" = '${typePaiement}';`
                                    await em.query(query)
                                    this.sendResponse(res, 200, { message: "Avance added" })
                                } else {
                                    var query: string = `INSERT INTO "Payer" ("Reservation_idReservation", "Paiement_typePaiement", "sommePayee") VALUES(${req.params.idReservation},'${typePaiement}', ${sommePayee});`
                                    await em.query(query)
                                    this.sendResponse(res, 200, { message: "Avance added" })
                                }
                            }
                            break;
                        case 'reste':
                            var count: number = await this.payerRepository.count({ where: { reservationIdReservation: req.params.idReservation, paiementTypePaiement: "reste" } })
                            if (count > 0) {
                                this.sendResponse(res, 400, { message: "Reste is already exist" })
                                return
                            }
                            else {
                                var query: string = `INSERT INTO "Payer" ("Reservation_idReservation", "Paiement_typePaiement", "sommePayee") VALUES(${req.params.idReservation},'${typePaiement}', ${prixTotal - prixPayee - remise});`
                                await em.query(query)
                                this.sendResponse(res, 200, { message: "Reste added" })
                                return
                            }
                            break;
                        case 'remise':
                            if (sommePayee != undefined) {
                                if (sommePayee > prixTotal) {
                                    this.sendResponse(res, 400, { message: "Remise > prixTotal" })
                                    return;
                                }
                                var count: number = await this.payerRepository.count({ where: { reservationIdReservation: req.params.idReservation, paiementTypePaiement: "remise" } })

                                if (count > 0) {
                                    var query: string = `UPDATE "Payer" SET "sommePayee" = "sommePayee" + ${sommePayee} WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Paiement_typePaiement" = '${typePaiement}';`
                                    await em.query(query)
                                    this.sendResponse(res, 200, { message: "Remise added" })
                                } else {
                                    var query: string = `INSERT INTO "Payer" ("Reservation_idReservation", "Paiement_typePaiement", "sommePayee") VALUES(${req.params.idReservation},'${typePaiement}', ${sommePayee});`
                                    await em.query(query)
                                    this.sendResponse(res, 200, { message: "Remise added" })
                                }
                            }
                            break;
                        default:
                            break;
                    }

                    await this.sendResponse(res, 200, { message: "Paiement Added Successfully" })
                    return
                } catch (error) {
                    await this.sendResponse(res, 403, { message: "Paiement Not Added" })
                }

                await this.sendResponse(res, 400, { message: "Requete incomplete" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addDelete(router: Router): Promise<void> {
        router.delete("/:idReservation/:typePaiement", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var result = await getConnection().createQueryBuilder().delete().from(Payer).where("reservationIdReservation = :idReservation AND paiementTypePaiement = :typePaiement ", { idReservation: req.params.idReservation, typePaiement: req.params.typePaiement }).execute()
                if (result.affected > 0) {
                    res.status(204).json({ message: "deleted successfully" })
                } else {
                    res.status(400).json({ message: "Nothing deleted" })
                }
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:idReservation/:typePaiement", async (req, res, next) => {
            try {
                var sommePayee: number = Number(req.body.sommePayee)
                if (sommePayee != undefined && !isNaN(sommePayee)) {
                    try {
                        var query: string = `
                        UPDATE "Payer" SET "sommePayee" = ${sommePayee} WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Paiement_typePaiement" = '${req.params.typePaiement}'
                        `
                        getConnection().createEntityManager().query(query)
                    await this.sendResponse(res, 204, { message: "Paiement Modified Successfully" })
                    } catch (error) {
                        await this.sendResponse(res, 404, {message: "Payer not found"})
                    }
                } else {
                    await this.sendResponse(res, 400, { message: "Somme Payee absent or not Number" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

}