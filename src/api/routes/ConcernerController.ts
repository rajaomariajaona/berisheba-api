import { Controller } from '../Controller';
import { Router, Request, Response } from 'express';
import { Repository, createConnection, getConnection, QueryFailedError } from 'typeorm';
import { Salle } from '../../entities/Salle';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { NextFunction } from 'express';

export default class ConcernerController extends Controller {
    salleRepository: Repository<Salle>
    reservationRepository: Repository<Reservation>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<any> {
        this.connection = await createConnection(ormconfig)
        this.salleRepository = this.connection.getRepository(Salle)
        this.reservationRepository = this.connection.getRepository(Reservation)
    }
    async addGet(router: Router): Promise<void> {
        router.get("/:idReservation/salles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    var query: string =
                        `SELECT "idSalle", "nomSalle" FROM "Salle"
                    INNER JOIN "Concerner" ON "Salle"."idSalle" = "Concerner"."salleIdSalle" WHERE "Concerner"."reservationIdReservation" = ${idReservation} ;`
                    var sallesDispoRaw = await getConnection().createEntityManager().query(query)
                    var salles: Object = {};
                    (sallesDispoRaw as Array<Object>).forEach(salle => {
                        salles[Number(salle["idSalle"])] = salle
                    });
                    await this.sendResponse(res, 200, { data: salles })
                    next()

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
        router.get("/:idReservation/conflict", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                    return
                }
                try {
                    var queryCheckConflict: string = `SELECT
                    "idSalle",
                    "idReservation",
                    "nomSalle",
                    "nomReservation",
                    "nomClient",
                    "prenomClient",
                    "dateEntree",
                    "typeDemiJourneeEntree",
                    "dateSortie",
                    "typeDemiJourneeSortie"
                    FROM 
                    (SELECT 
                    "Concerner"."salleIdSalle" as "salleID",
                    "Reservation"."idReservation" as "reservationID"
                    FROM "DemiJournee" 
                    JOIN "Constituer" 
                    ON "Constituer"."DemiJournee_date" = "DemiJournee".date 
                    AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" 
                    JOIN "Reservation" ON
                    "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
                    JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" 
                    JOIN "Concerner" ON
                    "Concerner"."reservationIdReservation" = "Reservation"."idReservation"
                    WHERE ((CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee") 
                             >= 
                             (SELECT min(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee"))
                              FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))
                            AND
                    (CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee")
                     <= 
                     (SELECT max(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee"))
                      FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation})))
                    GROUP BY "Reservation"."idReservation", "Client"."idClient", "Concerner"."salleIdSalle"
                    HAVING "Concerner"."salleIdSalle" in 
                    (--GET CONFLICTED SALLE
                    SELECT "salleIdSalle" FROM "Concerner" WHERE "Concerner"."reservationIdReservation" = ${idReservation} AND "salleIdSalle" not in 
                    (SELECT "idSalle" FROM "Salle"
                    WHERE "Salle"."idSalle" not in 
                    (SELECT "Concerner"."salleIdSalle" FROM "Reservation" INNER JOIN "Concerner" 
                    ON "Concerner"."reservationIdReservation" = "Reservation"."idReservation"
                    WHERE "idReservation" in
                    (SELECT DISTINCT("Reservation"."idReservation") FROM "Reservation" 
                    inner join "Constituer" 
                    ON "Constituer"."Reservation_idReservation" = 
                    "Reservation"."idReservation" 
                    GROUP BY "Reservation"."idReservation", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee"
                    HAVING ((CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee") >= 
                    (SELECT min(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee")) 
                     FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))
                    AND
                    (CONCAT("Constituer"."DemiJournee_date", ' ',
                    "Constituer"."DemiJournee_typeDemiJournee") <=
                     (SELECT max(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee")
                    ) FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))) 
                     AND "Reservation"."idReservation" <> ${idReservation}))))
                    ) AS SalleReservation
                    INNER JOIN "Salle" on "salleID" = "Salle"."idSalle"
                    INNER JOIN (SELECT "Reservation"."idReservation" as "idReservation", "Reservation"."nomReservation","Client"."nomClient", "Client"."prenomClient", split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 1) as "dateEntree",
                            split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', ${idReservation}) as "typeDemiJourneeEntree", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 1) as "dateSortie", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 2) as "typeDemiJourneeSortie" FROM "DemiJournee"  JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient")
                            AS RerservationWithDetails ON "idReservation" = "reservationID"`
                    var conflict = await getConnection().createEntityManager().query(queryCheckConflict)
                    var conflictRestructured: Object = {};
                    (conflict as Array<Object>).forEach(value => {
                        if (conflictRestructured[value["idSalle"]] === undefined) {
                            conflictRestructured[value["idSalle"]] = {}
                        }
                        if (value["idReservation"] == idReservation) {
                            conflictRestructured[value["idSalle"]]["new"] = value
                        } else {
                            if (conflictRestructured[value["idSalle"]]["old"] == undefined) {
                                conflictRestructured[value["idSalle"]]["old"] = []
                            }
                            conflictRestructured[value["idSalle"]]["old"].push(value)
                        }
                    });
                    await this.sendResponse(res, 200, { data: conflictRestructured })
                } catch (error) {

                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addPost(router: Router): Promise<void> {
        router.post("/:idReservation/salles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                var idSalle: Number = Number(req.body.idSalle)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                    return;
                }
                try {
                    var queryCheckConflict: string = `SELECT
                    "idSalle",
                    "idReservation",
                    "nomSalle",
                    "nomReservation",
                    "nomClient",
                    "prenomClient",
                    "dateEntree",
                    "typeDemiJourneeEntree",
                    "dateSortie",
                    "typeDemiJourneeSortie"
                    FROM 
                    (SELECT 
                    "Concerner"."salleIdSalle" as "salleID",
                    "Reservation"."idReservation" as "reservationID"
                    FROM "DemiJournee" 
                    JOIN "Constituer" 
                    ON "Constituer"."DemiJournee_date" = "DemiJournee".date 
                    AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" 
                    JOIN "Reservation" ON
                    "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
                    JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" 
                    JOIN "Concerner" ON
                    "Concerner"."reservationIdReservation" = "Reservation"."idReservation"
                    WHERE ((CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee") 
                             >= 
                             (SELECT min(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee"))
                              FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))
                            AND
                    (CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee")
                     <= 
                     (SELECT max(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee"))
                      FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation})))
                    GROUP BY "Reservation"."idReservation", "Client"."idClient", "Concerner"."salleIdSalle"
                    HAVING "Concerner"."salleIdSalle" in 
                    (--GET CONFLICTED SALLE
                    SELECT "salleIdSalle" FROM "Concerner" WHERE "Concerner"."reservationIdReservation" = ${idReservation} AND "salleIdSalle" not in 
                    (SELECT "idSalle" FROM "Salle"
                    WHERE "Salle"."idSalle" not in 
                    (SELECT "Concerner"."salleIdSalle" FROM "Reservation" INNER JOIN "Concerner" 
                    ON "Concerner"."reservationIdReservation" = "Reservation"."idReservation"
                    WHERE "idReservation" in
                    (SELECT DISTINCT("Reservation"."idReservation") FROM "Reservation" 
                    inner join "Constituer" 
                    ON "Constituer"."Reservation_idReservation" = 
                    "Reservation"."idReservation" 
                    GROUP BY "Reservation"."idReservation", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee"
                    HAVING ((CONCAT("Constituer"."DemiJournee_date", ' ',"Constituer"."DemiJournee_typeDemiJournee") >= 
                    (SELECT min(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee")) 
                     FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))
                    AND
                    (CONCAT("Constituer"."DemiJournee_date", ' ',
                    "Constituer"."DemiJournee_typeDemiJournee") <=
                     (SELECT max(Concat("DemiJournee_date", ' ', "DemiJournee_typeDemiJournee")
                    ) FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}))) 
                     AND "Reservation"."idReservation" <> ${idReservation}))))
                    ) AS SalleReservation
                    INNER JOIN "Salle" on "salleID" = "Salle"."idSalle"
                    INNER JOIN (SELECT "Reservation"."idReservation" as "idReservation", "Reservation"."nomReservation","Client"."nomClient", "Client"."prenomClient", split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', 1) as "dateEntree",
                            split_part(MIN(CONCAT("date", ' ' ,"typeDemiJournee")),' ', ${idReservation}) as "typeDemiJourneeEntree", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 1) as "dateSortie", split_part(MAX(CONCAT("date", ' ' ,"typeDemiJournee")), ' ', 2) as "typeDemiJourneeSortie" FROM "DemiJournee"  JOIN "Constituer" ON "Constituer"."DemiJournee_date" = "DemiJournee".date AND "Constituer"."DemiJournee_typeDemiJournee" = "DemiJournee"."typeDemiJournee" JOIN "Reservation" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" JOIN "Client" ON "Client"."idClient" = "Reservation"."Client_idClient" GROUP BY "Reservation"."idReservation", "Client"."idClient")
                            AS RerservationWithDetails ON "idReservation" = "reservationID"`
                    var query: string =
                        `INSERT INTO "Concerner" VALUES (${idReservation},${idSalle}) ;`
                    await getConnection().createEntityManager().query(query)
                    var conflict = await getConnection().createEntityManager().query(queryCheckConflict)
                    var conflictRestructured: Object = {};
                    (conflict as Array<Object>).forEach(value => {
                        if (conflictRestructured[value["idSalle"]] === undefined) {
                            conflictRestructured[value["idSalle"]] = {}
                        }
                        if (value["idReservation"] == idReservation) {
                            conflictRestructured[value["idSalle"]]["new"] = value
                        } else {
                            if (conflictRestructured[value["idSalle"]]["old"] == undefined) {
                                conflictRestructured[value["idSalle"]]["old"] = []
                            }
                            conflictRestructured[value["idSalle"]]["old"].push(value)
                        }
                    });
                    await this.sendResponse(res, 201, { message: "Salle added to reservation", conflict: conflictRestructured })
                } catch (error) {
                    await this.sendResponse(res, 400, { message: "Already exist" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addDelete(router: Router): Promise<void> {
        router.delete("/:idReservation/salles/:idSalle", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                var idSalle: Number = Number(req.params.idSalle)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    await this.salleRepository.findOneOrFail(idSalle.toString())
                    var query: string =
                        `DELETE FROM "Concerner" WHERE "Concerner"."reservationIdReservation" = ${idReservation} AND "Concerner"."salleIdSalle" = ${idSalle};`
                    await getConnection().createEntityManager().query(query)
                    await this.sendResponse(res, 204, { message: "Salle deleted to reservation" })
                    next()
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addPut(router: Router): Promise<void> {
        
    }


}