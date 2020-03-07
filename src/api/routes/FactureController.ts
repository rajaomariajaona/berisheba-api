import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection, Like, createQueryBuilder, EntityManager } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Reservation } from '../../entities/Reservation';

export default class FactureController extends Controller {
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    entityManager: EntityManager
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.entityManager = getConnection().createEntityManager()
        } catch (error) {
            console.log(error)
        }

    }

    async addGet(router: Router): Promise<void> {
        this.getFactureByIdReservation(router);
    }
    private getFactureByIdReservation(router: Router) {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            var idReservation: Number = Number(req.params.idReservation)
            try {
                await getConnection().getRepository(Reservation).findOneOrFail(idReservation.toString())
            } catch (error) {
                await this.sendResponse(res, 404, { message: "Reservation not found" })
                return;
            }
            var query: string = `
            SELECT * FROM ((SELECT jsonb_agg("Appareil"."nomAppareil") as "appareilListe"
 , CEIL(CEIL(SUM(("Utiliser"."duree" * puissance) / 3600))/1000) * 
            "prixKW" as "prixJirama"  
 FROM "Utiliser" INNER JOIN "Appareil" 
            ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil" 
            INNER JOIN "Reservation" ON "Reservation"."idReservation" = "Reservation_idReservation"
            WHERE "Reservation_idReservation" = ${idReservation} 
            GROUP BY "Reservation"."idReservation") UNION 
			(SELECT null as "appareilListe",0 as "prixJirama" 
			 WHERE NOT EXISTS (SELECT jsonb_agg("Appareil"."nomAppareil") as "appareilListe"
 , CEIL(CEIL(SUM(("Utiliser"."duree" * puissance) / 3600))/1000) * 
            "prixKW" as "prixJirama"  
 FROM "Utiliser" INNER JOIN "Appareil" 
            ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil" 
            INNER JOIN "Reservation" ON "Reservation"."idReservation" = "Reservation_idReservation"
            WHERE "Reservation_idReservation" = ${idReservation} 
            GROUP BY "Reservation"."idReservation"))) as x
            ,
            (SELECT "idReservation", ROUND(COUNT(*) / 2.0,1) as "nbJours",ROUND( AVG("nbPersonne"),1) as "nbPersonne", SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2)) as "prixTotalChambre"
                FROM "Reservation" INNER JOIN "Constituer" 
                ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
                GROUP BY "Reservation"."idReservation"
                HAVING "Reservation"."idReservation" = ${idReservation}) as y
            ,
            ( (SELECT 
            jsonb_agg(json_build_object("Autre"."motif","Doit"."prixAutre") ) as "autresMotifs", SUM("Doit"."prixAutre") as "prixTotalAutre"
            FROM "Autre" 
            INNER JOIN "Doit" ON "Doit"."Autre_idAutre" = "Autre"."idAutre"
            GROUP BY "Doit"."Reservation_idReservation"
            HAVING "Doit"."Reservation_idReservation" = ${idReservation}
            ) UNION (SELECT null as "autresMotif", 0 as "prixTotalAutre" WHERE NOT EXISTS (SELECT 
            jsonb_agg(json_build_object("Autre"."motif","Doit"."prixAutre") ) as "autresMotifs", SUM("Doit"."prixAutre") as "prixTotalAutre"
            FROM "Autre" 
            INNER JOIN "Doit" ON "Doit"."Autre_idAutre" = "Autre"."idAutre"
            GROUP BY "Doit"."Reservation_idReservation"
            HAVING "Doit"."Reservation_idReservation" = ${idReservation}
            ))) as z, 
            (SELECT COALESCE(SUM("sommePayee"),0) as "remise" FROM "Payer" 
             WHERE "Reservation_idReservation" = 
             4 AND "Payer"."Paiement_typePaiement" = 'remise') as rem,
             (SELECT COALESCE(SUM("sommePayee"),0) as "avance" FROM "Payer" 
             WHERE "Reservation_idReservation" = 
             4 AND "Payer"."Paiement_typePaiement" = 'avance') as av,
             (SELECT (
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
                                    
                                ) as "prixTotal") as "prixTotal",
                                (SELECT "nomClient", "prenomClient", "adresseClient", "numTelClient" FROM "Client" 
            INNER JOIN "Reservation" ON "Reservation"."Client_idClient" = "Client"."idClient"
            WHERE "Reservation"."idReservation" = ${idReservation}) as "Client"
                `;
            var response = await this.entityManager.query(query);
            this.sendResponse(res, 200, { ...response[0]});
        });
    }
    async addPost(router: Router): Promise<void> {
    }
    async addDelete(router: Router): Promise<void> {

    }
    async addPut(router: Router): Promise<void> {

    }
}