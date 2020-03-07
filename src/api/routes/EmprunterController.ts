import { Controller } from '../Controller';
import { Router, Request, Response } from 'express';
import { Repository, createConnection, getConnection, QueryFailedError } from 'typeorm';
import { Ustensile } from '../../entities/Ustensile';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { NextFunction } from 'express';

export default class EmprunterController extends Controller {
    ustensileRepository: Repository<Ustensile>
    reservationRepository: Repository<Reservation>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<any> {
        this.connection = await createConnection(ormconfig)
        this.ustensileRepository = this.connection.getRepository(Ustensile)
        this.reservationRepository = this.connection.getRepository(Reservation)
    }
    async addGet(router: Router): Promise<void> {
        router.get("/:idReservation/ustensiles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    var query: string =
                        `SELECT "idUstensile", "nomUstensile", "nbTotal", "nbEmprunte" FROM "Ustensile"
                        INNER JOIN "Emprunter" ON "Ustensile"."idUstensile" = "Emprunter"."Ustensile_idUstensile"
                         WHERE "Emprunter"."Reservation_idReservation" = ${idReservation} ;`
                    var ustensilesDispoRaw = await getConnection().createEntityManager().query(query)
                    var ustensiles: Object = {};
                    (ustensilesDispoRaw as Array<Object>).forEach(ustensile => {
                        ustensiles[Number(ustensile["idUstensile"])] = ustensile
                    });
                    await this.sendResponse(res, 200, { data: ustensiles })
                    next()

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })

    }
    async addPost(router: Router): Promise<void> {
        router.post("/:idReservation/ustensiles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                    return;
                }
                try {
                    var data: Object = JSON.parse(req.body.data)
                    var values: string[] = Object.keys(data).filter((key) => {
                        return data[key] > 0;
                    }).map((key) => {
                        return `(${idReservation},${key}, ${data[key]})`
                    })
                    if (values.length > 0) {
                        var query: string =
                            `INSERT INTO "Emprunter" ("Reservation_idReservation", "Ustensile_idUstensile", "nbEmprunte") VALUES ${values.join(" , ")};`
                        await getConnection().createEntityManager().query(query)
                    }
                    await this.sendResponse(res, 201, { message: "Ustensile added to reservation" })
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
        router.delete("/:idReservation/ustensiles/:idUstensile", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                var idUstensile: Number = Number(req.params.idUstensile)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    await this.ustensileRepository.findOneOrFail(idUstensile.toString())
                    var query: string =
                        `DELETE FROM "Emprunter" WHERE "Emprunter"."Reservation_idReservation" = ${idReservation} AND "Emprunter"."Ustensile_idUstensile" = ${idUstensile};`
                    await getConnection().createEntityManager().query(query)
                    await this.sendResponse(res, 204, { message: "Ustensile deleted to reservation" })
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
        router.put("/:idReservation/ustensiles", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation)
                } catch (error) {
                    this.sendResponse(res,404,{message: "Reservation not Fount"})
                    return
                }
                var changes: Object = JSON.parse(req.body.data);
                var updateQueries: String[] = [];
                var deleteConditions: String[] = [];
                Object.keys(changes).forEach((idUstensile) => {
                    var nbEmprunte = changes[idUstensile];
                    if (nbEmprunte == 0) {
                        deleteConditions.push(`"Reservation_idReservation" = ${idReservation} AND "Ustensile_idUstensile" = ${idUstensile}`);
                    }
                    else {
                        updateQueries.push(`UPDATE "Emprunter" SET "nbEmprunte" = ${nbEmprunte} WHERE "Reservation_idReservation" = ${idReservation} AND "Ustensile_idUstensile" = ${idUstensile};`);
                    }
                });
                var deleteQuery: string = deleteConditions.length > 0 ? `DELETE FROM "Emprunter" WHERE ${deleteConditions.join(" OR ")};` : ``;
                var updateQuery: string = updateQueries.length > 0 ? `${updateQueries.join(" ")}` : ``;
                var query: string = `${deleteQuery} ${updateQuery}`;
                var ress = await getConnection().createEntityManager().query(query);
                await this.sendResponse(res, 204, { message: "Changes successfully" });
            }
            catch (error) {
                this.passErrorToExpress(error, next);
            }
        });
    }


}