import { Controller } from '../Controller';
import { Router, Request, Response } from 'express';
import { Repository, createConnection, getConnection, QueryFailedError } from 'typeorm';
import { Materiel } from '../../entities/Materiel';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { NextFunction } from 'express';

export default class LouerController extends Controller {
    materielRepository: Repository<Materiel>
    reservationRepository: Repository<Reservation>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<any> {
        this.connection = await createConnection(ormconfig)
        this.materielRepository = this.connection.getRepository(Materiel)
        this.reservationRepository = this.connection.getRepository(Reservation)
    }
    async addGet(router: Router): Promise<void> {
        router.get("/:idReservation/materiels", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    var query: string =
                        `SELECT "idMateriel", "nomMateriel", "nbStock", "nbLouee" FROM "Materiel"
                    INNER JOIN "Louer" ON "Materiel"."idMateriel" = "Louer"."Materiel_idMateriel" WHERE "Louer"."Reservation_idReservation" = ${idReservation} ;`
                    var materielsDispoRaw = await getConnection().createEntityManager().query(query)
                    var materiels: Object = {};
                    (materielsDispoRaw as Array<Object>).forEach(materiel => {
                        materiels[Number(materiel["idMateriel"])] = materiel
                    });
                    await this.sendResponse(res, 200, { data: materiels })
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
        router.post("/:idReservation/materiels", async (req: Request, res: Response, next: NextFunction) => {
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
                            `INSERT INTO "Louer" VALUES ${values.join(" , ")};`
                        await getConnection().createEntityManager().query(query)
                    }
                    await this.sendResponse(res, 201, { message: "Materiel added to reservation" })
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
        router.delete("/:idReservation/materiels/:idMateriel", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                var idMateriel: Number = Number(req.params.idMateriel)
                try {
                    await this.reservationRepository.findOneOrFail(idReservation.toString())
                    await this.materielRepository.findOneOrFail(idMateriel.toString())
                    var query: string =
                        `DELETE FROM "Louer" WHERE "Louer"."Reservation_idReservation" = ${idReservation} AND "Louer"."Materiel_idMateriel" = ${idMateriel};`
                    await getConnection().createEntityManager().query(query)
                    await this.sendResponse(res, 204, { message: "Materiel deleted to reservation" })
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
        router.put("/:idReservation/materiels", async (req: Request, res: Response, next: NextFunction) => {
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
                Object.keys(changes).forEach((idMateriel) => {
                    var nbLouee = changes[idMateriel];
                    if (nbLouee == 0) {
                        deleteConditions.push(`"Reservation_idReservation" = ${idReservation} AND "Materiel_idMateriel" = ${idMateriel}`);
                    }
                    else {
                        updateQueries.push(`UPDATE "Louer" SET "nbLouee" = ${nbLouee} WHERE "Reservation_idReservation" = ${idReservation} AND "Materiel_idMateriel" = ${idMateriel};`);
                    }
                });
                var deleteQuery: string = deleteConditions.length > 0 ? `DELETE FROM "Louer" WHERE ${deleteConditions.join(" OR ")};` : ``;
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