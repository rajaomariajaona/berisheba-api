import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection, Like, createQueryBuilder, EntityManager } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";

export default class StatistiqueController extends Controller {
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
        this.getAllStatGroupByAnnee(router);
        this.getStatByAnnee(router);
    }
    private getAllStatGroupByAnnee(router: Router) {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            var statQuery: string = `
                SELECT array_agg(json_build_object('x',"MoisAnnee"."mois", 'y', COALESCE("y", 0))) as data, 
                FLOOR(AVG(COALESCE("y", 0))) as moyenne, "MoisAnnee"."annee"
                FROM (SELECT DATE_PART('month',"dateSortie") as mois, 
                DATE_PART('year',"dateSortie") as annee, 
                      COALESCE(SUM("prixTotalAutre" 
                                + "prixTotalChambre" + 
                                "prixTotalJirama" 
                                - "remise"
                               ), 0) as "y" FROM 
                
                (SELECT "idReservation", SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2)) as "prixTotalChambre"
                FROM "Reservation" INNER JOIN "Constituer" 
                ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" 
                GROUP BY "Reservation"."idReservation") as "Chambre"
                
                
                INNER JOIN 
                
                
                (SELECT "Reservation"."idReservation", COALESCE("Remises"."remise", 0) as "remise"
                FROM "Reservation" 
                LEFT Join 
                (SELECT "Reservation"."idReservation", "sommePayee" as "remise"
                FROM "Reservation" 
                INNER JOIN "Payer" 
                ON "Payer"."Reservation_idReservation" = "Reservation"."idReservation" 
                WHERE "Payer"."Paiement_typePaiement" = 'remise' ) as "Remises" ON 
                "Reservation"."idReservation"  =  "Remises"."idReservation" 
                ) as "Remise" ON "Remise"."idReservation" = "Chambre"."idReservation" 
                
                
                INNER JOIN 
                
                
                (SELECT  "Reservation"."idReservation", COALESCE(SUM("prixAutre"), 0) as "prixTotalAutre"
                FROM "Reservation" LEFT JOIN "Doit" 
                ON "Doit"."Reservation_idReservation" = "Reservation"."idReservation"
                GROUP BY "Reservation"."idReservation") as "Autre" ON "Chambre"."idReservation" = "Autre"."idReservation" 
                
                
                INNER JOIN 
                
                
                (SELECT "idReservation", COALESCE(SUM(CEIL(CEIL((("Utiliser"."duree" * "puissance") / 3600))/1000) * "prixKW"), 0)
                as "prixTotalJirama"
                FROM "Reservation" LEFT JOIN "Utiliser" 
                ON "Utiliser"."Reservation_idReservation" = "Reservation"."idReservation"
                LEFT JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil"
                GROUP BY "Reservation"."idReservation") as "Jirama" ON "Jirama"."idReservation" = "Chambre"."idReservation" 
                
                INNER JOIN 
                (SELECT "idReservation", to_date(split_part(Max(Concat("Constituer"."DemiJournee_date",' ' ,"Constituer"."DemiJournee_typeDemiJournee")),' ',  1), 'YYYY-MM-DD') 
                as "dateSortie" FROM "Reservation" 
                INNER JOIN "Constituer" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
                GROUP BY "idReservation") as "Timer" ON "Timer"."idReservation" = "Chambre"."idReservation"
                GROUP BY DATE_PART('month',"dateSortie"),DATE_PART('year',"dateSortie")
                HAVING DATE_PART('year',"dateSortie") in (SELECT DISTINCT(DATE_PART('year', "DemiJournee_date")) as annee FROM "Constituer")
                ) as "Raw" RIGHT JOIN 
                (SELECT * FROM (SELECT DISTINCT(DATE_PART('year', "DemiJournee_date")) as annee FROM "Constituer") as annee
                CROSS JOIN (SELECT unnest(array[1,2,3,4,5,6,7,8,9,10,11,12])as "mois") as mois) as "MoisAnnee" 
                ON "MoisAnnee"."mois" = "Raw"."mois" AND "MoisAnnee"."annee" = "Raw"."annee"
                GROUP BY "MoisAnnee"."annee"
                `;
            var response = await this.entityManager.query(statQuery);
            this.sendResponse(res, 200, { ...response[0] });
        });
    }

    private getStatByAnnee(router: Router) {
        router.get("/:annee", async (req: Request, res: Response, next: NextFunction) => {
            var annee: number = Number(req.params.annee);
            if (annee != undefined && !isNaN(annee)) {
                var statQuery: string = `
                        SELECT array_agg(json_build_object('x',"x", 'y', COALESCE("y", 0))) as data, FLOOR(AVG(COALESCE("y", 0))) as moyenne FROM (SELECT DATE_PART('month',"dateSortie") as mois, DATE_PART('year',"dateSortie") as annee, COALESCE(SUM("prixTotalAutre" 
                        + "prixTotalChambre" + 
                        "prixTotalJirama" 
                        - "remise"
                    ), 0) as "y" FROM 

        (SELECT "idReservation", SUM("nbPersonne" * ("Reservation"."prixPersonne" / 2)) as "prixTotalChambre"
        FROM "Reservation" INNER JOIN "Constituer" 
        ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation" 
        GROUP BY "Reservation"."idReservation") as "Chambre"


        INNER JOIN 


        (SELECT "Reservation"."idReservation", COALESCE("Remises"."remise", 0) as "remise"
        FROM "Reservation" 
        LEFT Join 
        (SELECT "Reservation"."idReservation", "sommePayee" as "remise"
        FROM "Reservation" 
        INNER JOIN "Payer" 
        ON "Payer"."Reservation_idReservation" = "Reservation"."idReservation" 
        WHERE "Payer"."Paiement_typePaiement" = 'remise' ) as "Remises" ON 
        "Reservation"."idReservation"  =  "Remises"."idReservation" 
        ) as "Remise" ON "Remise"."idReservation" = "Chambre"."idReservation" 


        INNER JOIN 


        (SELECT  "Reservation"."idReservation", COALESCE(SUM("prixAutre"), 0) as "prixTotalAutre"
        FROM "Reservation" LEFT JOIN "Doit" 
        ON "Doit"."Reservation_idReservation" = "Reservation"."idReservation"
        GROUP BY "Reservation"."idReservation") as "Autre" ON "Chambre"."idReservation" = "Autre"."idReservation" 


        INNER JOIN 


        (SELECT "idReservation", COALESCE(SUM(CEIL(CEIL((("Utiliser"."duree" * "puissance") / 3600))/1000) * "prixKW"), 0)
        as "prixTotalJirama"
        FROM "Reservation" LEFT JOIN "Utiliser" 
        ON "Utiliser"."Reservation_idReservation" = "Reservation"."idReservation"
        LEFT JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil"
        GROUP BY "Reservation"."idReservation") as "Jirama" ON "Jirama"."idReservation" = "Chambre"."idReservation" 

        INNER JOIN 
        (SELECT "idReservation", to_date(split_part(Max(Concat("Constituer"."DemiJournee_date",' ' ,"Constituer"."DemiJournee_typeDemiJournee")),' ',  1), 'YYYY-MM-DD') 
        as "dateSortie" FROM "Reservation" 
        INNER JOIN "Constituer" ON "Constituer"."Reservation_idReservation" = "Reservation"."idReservation"
        GROUP BY "idReservation") as "Timer" ON "Timer"."idReservation" = "Chambre"."idReservation"
        GROUP BY DATE_PART('month',"dateSortie"),DATE_PART('year',"dateSortie")
        HAVING DATE_PART('year',"dateSortie") = ${annee}
        ) as "Raw" RIGHT JOIN (SELECT unnest(array[1,2,3,4,5,6,7,8,9,10,11,12]) as "x") as "Mois" ON "x" = "mois"
                `;
                var response = await this.entityManager.query(statQuery);
                this.sendResponse(res, 200, { ...response[0] });
            }
            else {
                this.sendResponse(res, 400, { message: "annee is incorrect" });
            }
        });
    }

    async addPost(router: Router): Promise<void> {
    }
    async addDelete(router: Router): Promise<void> {

    }
    async addPut(router: Router): Promise<void> {

    }
}