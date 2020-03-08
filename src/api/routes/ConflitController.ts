import { Controller } from '../Controller';
import { Router, Request, Response } from 'express';
import { Repository, createConnection, getConnection, QueryFailedError } from 'typeorm';
import { Salle } from '../../entities/Salle';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { NextFunction } from 'express';
import { isArray } from 'util';
import { Payer } from '../../entities/Payer';

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
                    var materielConflit: Object = await this.fetchMaterielConflit(idReservation)
                    var salleConflit: Object = await this.fetchSalleConflit(idReservation)
                    var ustensileConflit: Object = await this.fetchUstensileConflit(idReservation)
                    var payerConflit: Object = await this.fetchPayerConflit(idReservation)
                    await this.sendResponse(res, 200, { salle: salleConflit, materiel: materielConflit, ustensile: ustensileConflit, payer: payerConflit });
                }
                catch (error) {
                }
            }
            catch (err) {
                await this.passErrorToExpress(err, next);
            }
        });

    }
    private async fetchMaterielConflit(idReservation: Number): Promise<Object> {
        var queryCheckConflict: string =
            ` SELECT DISTINCT 
            "Materiel"."idMateriel", "Materiel"."nomMateriel","Materiel"."nbStock", 
            to_jsonb(array_to_json(array_agg("nbLouee" ORDER BY "idReservation")))as "nbLouees",
            to_jsonb(array_to_json(array_agg("nomReservation" ORDER BY "idReservation"))) as "nomReservations",
            to_jsonb(array_to_json(array_agg("idReservation" ORDER BY "idReservation"))) as "idReservations" 
            FROM "Materiel" 
            INNER JOIN "Louer" 
            ON "Louer"."Materiel_idMateriel" = "Materiel"."idMateriel"
            INNER JOIN "Reservation" 
            ON "Reservation"."idReservation" = "Louer"."Reservation_idReservation"
            INNER JOIN "Constituer" 
            ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
            INNER JOIN 
            (SELECT "Materiel"."idMateriel", ("Materiel"."nbStock" - SUM("Louer"."nbLouee")) 
            as "difference", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee" FROM "Reservation" 
            INNER JOIN "Constituer" 
            ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" INNER JOIN 
            (SELECT "DemiJournee_date", "DemiJournee_typeDemiJournee" 
            FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}) as "Demi" 
            ON "Demi"."DemiJournee_date" = "Constituer"."DemiJournee_date" 
            AND "Demi"."DemiJournee_typeDemiJournee" = "Constituer"."DemiJournee_typeDemiJournee"
            INNER JOIN "Louer" ON "Louer"."Reservation_idReservation" = "Reservation"."idReservation"
            INNER JOIN "Materiel" ON "Materiel"."idMateriel" = "Louer"."Materiel_idMateriel"
            GROUP BY "Louer"."Materiel_idMateriel", "Materiel"."idMateriel", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee"
            HAVING ("Materiel"."nbStock" - SUM("Louer"."nbLouee")) < 0
            ORDER BY "Materiel"."idMateriel" ASC, "Constituer"."DemiJournee_date" ASC, "Constituer"."DemiJournee_typeDemiJournee" ASC)
            as "Conflit"
            ON "Conflit"."DemiJournee_date" = "Constituer"."DemiJournee_date" 
            AND "Conflit"."DemiJournee_typeDemiJournee" = "Constituer"."DemiJournee_typeDemiJournee" AND "Conflit"."idMateriel" = "Materiel"."idMateriel"
            GROUP BY "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee", "Materiel"."idMateriel"
              ORDER BY "Materiel"."nomMateriel" ASC`
        var conflicts = await getConnection().createEntityManager().query(queryCheckConflict);
        var conflictByIdMateriel: Object = {}
        conflicts.forEach(conflict => {
            if (!conflictByIdMateriel.hasOwnProperty(conflict["idMateriel"]))
                conflictByIdMateriel[conflict["idMateriel"]] = []
            conflictByIdMateriel[conflict["idMateriel"]].push(conflict)
        });
        Object.keys(conflictByIdMateriel).forEach((key) => {
            var temp = conflictByIdMateriel[key].slice()
            conflictByIdMateriel[key] = temp.filter(element => {
                return !temp.some(el => {
                    var b = (element["idReservations"].length < el["idReservations"].length)
                    var a = this.contains(element["idReservations"], el["idReservations"])
                    console.log(a)
                    console.log(b)
                    return a && b;
                })
            })
        })
        return conflictByIdMateriel;
    }

    private contains(arr1: Array<any>, arr2: Array<any>): boolean {
        return arr1.every(element => arr2.indexOf(element) > -1);
    }

    private isEqual(arr1: Array<any>, arr2: Array<any>): boolean {
        return arr1.length == arr2.length && this.contains(arr1, arr2);
    }
    private async fetchUstensileConflit(idReservation: Number): Promise<Object> {
        var queryCheckConflict: string =
            ` SELECT DISTINCT 
                "Ustensile"."idUstensile", "Ustensile"."nomUstensile","Ustensile"."nbTotal", 
                to_jsonb(array_to_json(array_agg("nbEmprunte" ORDER BY "idReservation")))as "nbEmpruntes",
                to_jsonb(array_to_json(array_agg("nomReservation" ORDER BY "idReservation"))) as "nomReservations",
                to_jsonb(array_to_json(array_agg("idReservation" ORDER BY "idReservation"))) as "idReservations" 
                FROM "Ustensile" 
                 INNER JOIN "Emprunter" 
                 ON "Emprunter"."Ustensile_idUstensile" = "Ustensile"."idUstensile"
                 INNER JOIN "Reservation" 
                 ON "Reservation"."idReservation" = "Emprunter"."Reservation_idReservation"
                 INNER JOIN "Constituer" 
                 ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
                 INNER JOIN 
                 (SELECT "Ustensile"."idUstensile", ("Ustensile"."nbTotal" - SUM("Emprunter"."nbEmprunte")) 
                 as "difference", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee" FROM "Reservation" 
                 INNER JOIN "Constituer" 
                 ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" INNER JOIN 
                 (SELECT "DemiJournee_date", "DemiJournee_typeDemiJournee" 
                 FROM "Constituer" WHERE "Reservation_idReservation" = ${idReservation}) as "Demi" 
                 ON "Demi"."DemiJournee_date" = "Constituer"."DemiJournee_date" 
                 AND "Demi"."DemiJournee_typeDemiJournee" = "Constituer"."DemiJournee_typeDemiJournee"
                 INNER JOIN "Emprunter" ON "Emprunter"."Reservation_idReservation" = "Reservation"."idReservation"
                 INNER JOIN "Ustensile" ON "Ustensile"."idUstensile" = "Emprunter"."Ustensile_idUstensile"
                 GROUP BY "Emprunter"."Ustensile_idUstensile", "Ustensile"."idUstensile", "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee"
                 HAVING ("Ustensile"."nbTotal" - SUM("Emprunter"."nbEmprunte")) < 0
                 ORDER BY "Ustensile"."idUstensile" ASC, "Constituer"."DemiJournee_date" ASC, "Constituer"."DemiJournee_typeDemiJournee" ASC)
                 as "Conflit"
                 ON "Conflit"."DemiJournee_date" = "Constituer"."DemiJournee_date" 
                 AND "Conflit"."DemiJournee_typeDemiJournee" = "Constituer"."DemiJournee_typeDemiJournee" AND "Conflit"."idUstensile" = "Ustensile"."idUstensile"
                 GROUP BY "Constituer"."DemiJournee_date", "Constituer"."DemiJournee_typeDemiJournee", "Ustensile"."idUstensile"
                   ORDER BY "Ustensile"."nomUstensile" ASC`
        var conflicts = await getConnection().createEntityManager().query(queryCheckConflict);
        var conflictByIdUstensile: Object = {}
        conflicts.forEach(conflict => {
            if (!conflictByIdUstensile.hasOwnProperty(conflict["idUstensile"]))
                conflictByIdUstensile[conflict["idUstensile"]] = []
            conflictByIdUstensile[conflict["idUstensile"]].push(conflict)
        });
        Object.keys(conflictByIdUstensile).forEach((key) => {
            var temp = conflictByIdUstensile[key].slice()
            conflictByIdUstensile[key] = temp.filter(element => {
                return !temp.some(el => {
                    var b = (element["idReservations"].length < el["idReservations"].length)
                    var a = this.contains(element["idReservations"], el["idReservations"])
                    console.log(a)
                    console.log(b)
                    return a && b;
                })
            })
        })
        return conflictByIdUstensile;
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

    private async fetchPayerConflit(idReservation: Number): Promise<Object> {
        var queryPrixTotal: string = `
        SELECT (
            -- Prix de location Chambre
                (SELECT SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2))
                FROM "Reservation" INNER JOIN "Constituer" 
                ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" 
                WHERE "Reservation"."idReservation" = ${idReservation}
                GROUP BY "Reservation"."idReservation")
            -- Prix de location Chambre
                 +
            -- Prix Autre
                (SELECT COALESCE(SUM("prixAutre"), 0) as "prixTotalAutre"
                FROM "Reservation" INNER JOIN "Doit" 
                ON "Doit"."Reservation_idReservation" = "Reservation"."idReservation"
                WHERE "Reservation"."idReservation" = ${idReservation})
            -- Prix Autre
            +
            -- Prix Jirama
                (SELECT COALESCE(SUM(CEIL(CEIL((("Utiliser"."duree" * "puissance") / 3600))/1000) * "prixKW"), 0)
                as "prixTotalJirama"
                FROM "Reservation" INNER JOIN "Utiliser" 
                ON "Utiliser"."Reservation_idReservation" = "Reservation"."idReservation"
                INNER JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil"
                WHERE "Reservation"."idReservation" = ${idReservation})
            -- Prix Jirama
            
        ) as "prixTotal"
        `;
        var prixTotal: number = (await getConnection().createEntityManager().query(queryPrixTotal))[0]["prixTotal"];
        let payerRepository: Repository<Payer> = await getConnection().getRepository(Payer)
        let payers: Payer[] = await payerRepository.find({ where: { reservationIdReservation: idReservation } })
        let isReste: boolean = false;
        let totalTemp: number = 0;
        payers.forEach(payer => {
            if (payer.paiementTypePaiement.typePaiement == "reste")
                isReste = true;
            totalTemp += payer.sommePayee
        });
        var conflictRestructured: Object = {};
        if ((isReste && totalTemp != prixTotal) || (prixTotal < totalTemp)) {
            conflictRestructured["payers"] = payers
            conflictRestructured["prixTotal"] = prixTotal
        }
        return conflictRestructured
    }

    async addPut(router: Router): Promise<void> {
        this.patchFixConflit(router);
    }



    private patchFixConflit(router: Router) {
        this.patchFixUstensiles(router);
        this.patchFixSalle(router);
        this.patchFixMateriels(router);
        this.patchFixPayer(router);
    }

    private patchFixUstensiles(router: Router) {
        router.patch("/ustensiles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var changes: Object = JSON.parse(req.body.changes);
                var updateQueries: String[] = [];
                var deleteConditions: String[] = [];
                Object.keys(changes).forEach((idUstensile) => {
                    Object.keys(changes[idUstensile]).forEach((idReservation) => {
                        var nbEmprunte = changes[idUstensile][idReservation];
                        if (nbEmprunte == 0) {
                            deleteConditions.push(`"Reservation_idReservation" = ${idReservation} AND "Ustensile_idUstensile" = ${idUstensile}`);
                        }
                        else {
                            updateQueries.push(`UPDATE "Emprunter" SET "nbEmprunte" = ${nbEmprunte} WHERE "Reservation_idReservation" = ${idReservation} AND "Ustensile_idUstensile" = ${idUstensile};`);
                        }
                    });
                });
                var deleteQuery: string = deleteConditions.length > 0 ? `DELETE FROM "Emprunter" WHERE ${deleteConditions.join(" OR ")};` : ``;
                var updateQuery: string = updateQueries.length > 0 ? `${updateQueries.join(" ")}` : ``;
                var query: string = `${deleteQuery} ${updateQuery}`;
                var ress = await getConnection().createEntityManager().query(query);
                await this.sendResponse(res, 204, { message: "Conflict resolved" });
            }
            catch (error) {
                this.passErrorToExpress(error, next);
            }
        });
    }

    private patchFixMateriels(router: Router) {
        router.patch("/materiels", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var changes: Object = JSON.parse(req.body.changes);
                var updateQueries: String[] = [];
                var deleteConditions: String[] = [];
                Object.keys(changes).forEach((idMateriel) => {
                    Object.keys(changes[idMateriel]).forEach((idReservation) => {
                        var nbLouee = changes[idMateriel][idReservation];
                        if (nbLouee == 0) {
                            deleteConditions.push(`"Reservation_idReservation" = ${idReservation} AND "Materiel_idMateriel" = ${idMateriel}`);
                        }
                        else {
                            updateQueries.push(`UPDATE "Louer" SET "nbLouee" = ${nbLouee} WHERE "Reservation_idReservation" = ${idReservation} AND "Materiel_idMateriel" = ${idMateriel};`);
                        }
                    });
                });
                var deleteQuery: string = deleteConditions.length > 0 ? `DELETE FROM "Louer" WHERE ${deleteConditions.join(" OR ")};` : ``;
                var updateQuery: string = updateQueries.length > 0 ? `${updateQueries.join(" ")}` : ``;
                var query: string = `${deleteQuery} ${updateQuery}`;
                var ress = await getConnection().createEntityManager().query(query);
                await this.sendResponse(res, 204, { message: "Conflict resolved" });
            }
            catch (error) {
                this.passErrorToExpress(error, next);
            }
        });
    }

    private patchFixPayer(router: Router) {
        router.patch("/payers/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                try {
                    await getConnection().getRepository(Reservation).findOneOrFail(req.params.idReservation)
                } catch (error) {
                    this.sendResponse(res, 404, { message: "Reservation not found" })
                }
                var changes: Object = JSON.parse(req.body.changes);
                var deleteQuery: string = `DELETE FROM "Payer"
                WHERE "Reservation_idReservation" = ${req.params.idReservation}`
                var addQuery: string[] = []
                Object.keys(changes).forEach((typePaiement) => {
                    if (changes[typePaiement] > 0) {
                        addQuery.push(`( ${req.params.idReservation}, '${typePaiement}', ${changes[typePaiement]})`)
                    }
                });

                var query: string = `INSERT INTO "Payer"(
                    "Reservation_idReservation", "Paiement_typePaiement", "sommePayee")
                    VALUES ${addQuery.join(", ")}`;
                await getConnection().createEntityManager().query(deleteQuery);
                var ress = await getConnection().createEntityManager().query(query);
                await this.sendResponse(res, 204, { message: "Conflict resolved" });
            }
            catch (error) {
                this.passErrorToExpress(error, next);
            }
        });
    }
    private patchFixSalle(router: Router) {
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