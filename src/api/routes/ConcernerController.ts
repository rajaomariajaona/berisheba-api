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
                    var query: string =
                        `INSERT INTO "Concerner"("reservationIdReservation", "salleIdSalle") VALUES (${idReservation},${idSalle}) ;`
                    await getConnection().createEntityManager().query(query)
                    await this.sendResponse(res, 201, { message: "Salle added to reservation"})
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