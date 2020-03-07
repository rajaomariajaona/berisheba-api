import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult, getConnection } from "typeorm";
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Paiement } from '../../entities/Paiement';
import router from '../routerApi';
import { Autre } from '../../entities/Autre';
import { Doit } from '../../entities/Doit';
import { Reservation } from '../../entities/Reservation';
import { print } from "util";

export default class AutreController extends Controller {

    autreRepository: Repository<Autre>
    doitRepository: Repository<Doit>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.doitRepository = connection.getRepository(Doit)
            this.autreRepository = connection.getRepository(Autre)
        } catch (error) {
            console.log(error)
        }

    }

    async addGet(router: Router): Promise<void> {
        await this.getAutresByIdReservation(router)
    }
    private async getAutresByIdReservation(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var doits: Doit[] = await this.fetchAutresFromDatabase(Number(req.params.id))
                 var stats = (await getConnection().createEntityManager().query(`SELECT SUM("Doit"."prixAutre") as somme FROM "Autre" INNER JOIN "Doit" ON "Doit"."Autre_idAutre" = "Autre"."idAutre" WHERE "Doit"."Reservation_idReservation" = ${req.params.id};`) as Array<Object>)[0];
                if (await this.isAutresExist(doits)) {
                    await this.sendResponse(res, 200, { data: doits, stats: stats})
                } else {
                    await this.sendResponse(res, 404, { message: "Autres Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchAutresFromDatabase(id: number): Promise<Doit[]> {
        return this.doitRepository.find({
            where: {
                reservationIdReservation: id
            }
        })
    }
    private async isAutresExist(autres: Doit[]): Promise<boolean> {
        return autres !== undefined
    }

    async addPost(router: Router): Promise<void> {
        await this.postAutres(router)
    }

    async postAutres(router: Router) {
        router.post("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var reservation: Reservation = await getConnection().getRepository(Reservation).findOneOrFail(req.params.idReservation)
                var autreToSave: Autre = await this.createAutreFromRequest(req)
                var autreSaved: Autre = await this.saveAutreToDatabase(autreToSave)
                var doitToSave: Doit = new Doit()
                doitToSave.autreIdAutre = autreSaved;
                doitToSave.prixAutre = req.body.prixAutre
                doitToSave.reservationIdReservation = reservation
                var doitSaved: Doit = await this.saveDoitToDatabase(doitToSave)
                if (await this.isDoitSaved(doitSaved))
                    await this.sendResponse(res, 201, { message: "Autres Added Successfully" })
                else
                    await this.sendResponse(res, 403, { message: "Autres Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async isDoitSaved(doit: Doit): Promise<boolean> {
        return doit !== undefined
    }

    private async createAutreFromRequest(req: Request): Promise<Autre> {
        return this.autreRepository.create(req.body as Object)
    }
    private async saveAutreToDatabase(autre: Autre): Promise<Autre> {
        return await this.autreRepository.save(autre);
    }
    private async saveDoitToDatabase(doit: Doit): Promise<Doit> {
        return await this.doitRepository.save(doit);
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idAutre", async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.removeAutreInDatabase(req)
                res.status(204).json({ message: "deleted successfully" })
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private async removeAutreInDatabase(req: Request): Promise<DeleteResult> {
        return await this.autreRepository.delete(req.params.idAutre)
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:idReservation", async (req, res, next) => {
            try {
                var autre: Autre = await this.autreRepository.findOneOrFail(req.body.idAutre)            
                var autreToModify: Autre = await this.mergeAutreFromRequest(autre, req)
                var autreModified: Autre = await this.saveAutreToDatabase(autreToModify)
                var result = getConnection().query(`UPDATE "Doit" SET "prixAutre" = ${req.body.prixAutre} WHERE "Reservation_idReservation" = ${req.params.idReservation} AND "Autre_idAutre" = ${autreModified.idAutre}`)
                if (result) {
                    await this.sendResponse(res, 204, { message: "Autres Modified Successfully" })
                } else {
                    await this.sendResponse(res, 404, { message: "Autres Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private async mergeAutreFromRequest(autre: Autre, req: Request): Promise<Autre> {
        autre.motif = req.body.motif;
        return autre
    }

}