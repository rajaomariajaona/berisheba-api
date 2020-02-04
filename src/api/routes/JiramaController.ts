import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Paiement } from '../../entities/Paiement';
import router from '../routerApi';
import { Appareil } from '../../entities/Appareil';
import { Utiliser } from '../../entities/Utiliser';
import { Reservation } from '../../entities/Reservation';
import { print } from "util";

export default class JiramaController extends Controller {

    appareilRepository: Repository<Appareil>
    utiliserRepository: Repository<Utiliser>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.utiliserRepository = connection.getRepository(Utiliser)
            this.appareilRepository = connection.getRepository(Appareil)
        } catch (error) {
            console.log(error)
        }

    }

    async addGet(router: Router): Promise<void> {
        await this.getJiramaByIdReservation(router)
    }
    private async getJiramaByIdReservation(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var utilisers: Utiliser[] = await this.fetchJiramaFromDatabase(Number(req.params.id))
                var stats = (await getConnection().createEntityManager().query(`SELECT CEIL(CEIL(SUM(("Utiliser"."duree" * puissance) / 3600))/1000) as consommation FROM "Utiliser" INNER JOIN "Appareil" ON "Appareil"."idAppareil" = "Utiliser"."Appareil_idAppareil" WHERE "Reservation_idReservation" = ${req.params.id};`) as Array<Object>)[0];
                if (await this.isJiramaExist(utilisers)) {
                    await this.sendResponse(res, 200, { data: utilisers, stats: stats})
                } else {
                    await this.sendResponse(res, 404, { message: "Jirama Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchJiramaFromDatabase(id: number): Promise<Utiliser[]> {
        return this.utiliserRepository.find({
            where: {
                reservationIdReservation: id
            }
        })
    }
    private async isJiramaExist(jirama: Utiliser[]): Promise<boolean> {
        return jirama !== undefined
    }

    async addPost(router: Router): Promise<void> {
        await this.postJirama(router)
    }

    async postJirama(router: Router) {
        router.post("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation = await getConnection().getRepository(Reservation).findOneOrFail(req.params.idReservation)
                var appareilToSave: Appareil = await this.createAppareilFromRequest(req)
                if(req.body.puissanceType === "a"){
                    appareilToSave.puissance = 220 * req.body.puissance
                }
                var appareilSaved: Appareil = await this.saveAppareilToDatabase(appareilToSave)
                var utiliserToSave: Utiliser = new Utiliser()
                utiliserToSave.appareilIdAppareil = appareilSaved;
                utiliserToSave.duree = req.body.duree;
                utiliserToSave.reservationIdReservation = reservation
                var utiliserSaved: Utiliser = await this.saveUtiliserToDatabase(utiliserToSave)
                if (await this.isUtiliserSaved(utiliserSaved))
                    await this.sendResponse(res, 201, { message: "Jirama Added Successfully" })
                else
                    await this.sendResponse(res, 403, { message: "Jirama Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async isUtiliserSaved(utiliser: Utiliser): Promise<boolean> {
        return utiliser !== undefined
    }

    private async createAppareilFromRequest(req: Request): Promise<Appareil> {
        return this.appareilRepository.create(req.body as Object)
    }
    private async saveAppareilToDatabase(appareil: Appareil): Promise<Appareil> {
        return await this.appareilRepository.save(appareil);
    }
    private async saveUtiliserToDatabase(utiliser: Utiliser): Promise<Utiliser> {
        return await this.utiliserRepository.save(utiliser);
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idAppareil", async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.removeAppareilInDatabase(req)
                res.status(204).json({ message: "deleted successfully" })
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private async removeAppareilInDatabase(req: Request): Promise<DeleteResult> {
        return await this.appareilRepository.delete(req.params.idAppareil)
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:idReservation", async (req, res, next) => {
            try {
                var appareil: Appareil = await this.appareilRepository.findOneOrFail(req.body.idAppareil)            
                var appareilToModify: Appareil = await this.mergeAppareilFromRequest(appareil, req)
                var appareilModified: Appareil = await this.saveAppareilToDatabase(appareilToModify)
                var result = getConnection().query(`UPDATE "Utiliser" SET "duree" = ${req.body.duree} WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Appareil_idAppareil" = ${appareilModified.idAppareil}`)
                if (result) {
                    await this.sendResponse(res, 204, { message: "Jirama Modified Successfully" })
                } else {
                    await this.sendResponse(res, 404, { message: "Jirama Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private async mergeAppareilFromRequest(appareil: Appareil, req: Request): Promise<Appareil> {
        appareil.nomAppareil = req.body.nomAppareil
        appareil.puissance = req.body.puissance
        return appareil
    }

}