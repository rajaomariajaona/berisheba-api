import { Controller } from '../Controller';
import { Router, Request, Response } from 'express';
import { Repository, createConnection, getConnection, QueryFailedError } from 'typeorm';
import { Salle } from '../../entities/Salle';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { NextFunction } from 'express';

export default class ConflitController extends Controller {
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<any> {
        this.connection = await createConnection(ormconfig)
    }
    async addGet(router: Router): Promise<void> {
        this.getConflitSalle(router)
    }
    private getConflitSalle(router: Router) {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation);
                try {
                    await getConnection().getRepository(Reservation).findOneOrFail(idReservation.toString());
                }
                catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" });
                    return;
                }
                try {
                    var salleConflit: Object = await this.fetchSalleConflit(idReservation)
                    await this.sendResponse(res, 200, { salle: salleConflit });
                }
                catch (error) {
                }
            }
            catch (err) {
                await this.passErrorToExpress(err, next);
            }
        });
        
    }

    private async fetchSalleConflit(idReservation: Number): Promise<Object> {
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
                            AS RerservationWithDetails ON "idReservation" = "reservationID"`;
        var conflict = await getConnection().createEntityManager().query(queryCheckConflict);
        var conflictRestructured: Object = {};
        (conflict as Array<Object>).forEach(value => {
            if (conflictRestructured[value["idSalle"]] === undefined) {
                conflictRestructured[value["idSalle"]] = {};
            }
            if (value["idReservation"] == idReservation) {
                conflictRestructured[value["idSalle"]]["new"] = value;
            }
            else {
                if (conflictRestructured[value["idSalle"]]["old"] == undefined) {
                    conflictRestructured[value["idSalle"]]["old"] = [];
                }
                conflictRestructured[value["idSalle"]]["old"].push(value);
            }
        });
        /*
        {
            idSalle: {
                new: {}
                old: [
                    {},
                    {},
                ]
            },
            idSalle2: {
                new: {}
                old: [
                    {},
                    {},
                ]
            }
        }
        */
        return conflictRestructured
    }

    async addPut(router: Router): Promise<void> {
        this.patchConflitSalle(router);
    }



    private patchConflitSalle(router: Router) {
        //DELETE CONFLICTED PARTIE
        router.patch("/salles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var deleteList: Array<Object> = JSON.parse(req.body.deleteList);
                var deleteQueries: String[] = deleteList.map<String>((value: Object) => {
                    return `("Concerner"."reservationIdReservation" = ${Object.values(value)[0]} AND "Concerner"."salleIdSalle" = ${Object.keys(value)[0]})`;
                });
                var query: string = `DELETE FROM "Concerner" WHERE ${deleteQueries.join(" OR ")}`;
                await getConnection().createEntityManager().query(query);
                await this.sendResponse(res, 204, { message: "Conflict resolved" });
            }
            catch (error) {
                this.passErrorToExpress(error, next);
            }
        });
    }

    async addPost(router: Router): Promise<void> {
    }
    async addDelete(router: Router): Promise<void> {
    }


}