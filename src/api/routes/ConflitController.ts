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
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {

                try {

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async addPut(router: Router): Promise<void> {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {

                try {

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }



    async addPost(router: Router): Promise<void> {
    }
    async addDelete(router: Router): Promise<void> {
    }


}