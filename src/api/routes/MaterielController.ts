import { Controller } from "../Controller";
import { Repository, Connection, createConnection, getConnection, DeleteResult} from "typeorm";
import { Materiel } from "../../entities/Materiel";
import { ormconfig } from '../../config';
import {Router, Request, Response, NextFunction} from "express"
import { Reservation } from '../../entities/Reservation';
export default class MaterielController extends Controller {
    materielRepository: Repository<Materiel>

    connection : Connection
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }

    async createConnectionAndAssignRepository(): Promise<any> {
        try{
            this.connection = await createConnection(ormconfig)
        this.materielRepository = this.connection.getRepository(Materiel)
        }catch(error){
            console.log(error)
        }
    }
    async addGet(router: Router): Promise<void> {
        await this.getMaterielDispo(router)
        await this.getAllMateriel(router)
    }
    private async getMaterielDispo(router: Router): Promise<void> {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await getConnection().getRepository(Reservation).findOneOrFail(idReservation.toString())
                    var query: string =
                        `SELECT "idMateriel", "nomMateriel", "nbStock" FROM "Materiel"
                        WHERE "Materiel"."idMateriel" not in 
                        (SELECT "Louer"."Materiel_idMateriel" FROM "Louer" WHERE "Louer"."Reservation_idReservation" = ${idReservation});`
                    var materielsDispoRaw = await getConnection().createEntityManager().query(query)
                    var materielsDispo: Object = {};
                    (materielsDispoRaw as Array<Object>).forEach(materiel => {
                        materielsDispo[materiel["idMateriel"]] = materiel
                    });
                    await this.sendResponse(res, 200, { data: materielsDispo })
                    next()

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async getAllMateriel(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var materiels: Materiel[] = await this.fetchMaterielsFromDatabase()
                var structuredMaterielData = await this.useIdMaterielAsKey(materiels)
                await this.sendResponse(res, 200, { data: structuredMaterielData })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async fetchMaterielsFromDatabase(): Promise<Materiel[]> {
        return this.materielRepository.find()
    }
    private async useIdMaterielAsKey(materiels: Materiel[]): Promise<Object> {
        var obj = {};
        materiels.forEach((materiel) => {
            obj[materiel["idMateriel"]] = materiel;
        });
        return obj
    }
    async addPost(router: Router): Promise<void> {
        this.saveMaterielIntoDatabase(router)
    }

    async saveMaterielIntoDatabase(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                    var materielToSave: Materiel = await this.materielRepository.create(req.body as Object)
                    var materielSaved: Materiel = await this.saveMaterielToDatabase(materielToSave)
                    if (await this.isMaterielSaved(materielSaved))
                        await this.sendResponse(res, 201, { message: "Materiel Added Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Materiel Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async isMaterielSaved(materiel: Materiel) : Promise<boolean> {
        return materiel !== undefined
    }
    async saveMaterielToDatabase(materielToSave: Materiel): Promise<Materiel> {
        return this.materielRepository.save(materielToSave);
    }

    async addDelete(router: Router): Promise<void> {
        this.deleteById(router)
        this.deleteMultiple(router)
    }
    private async deleteById(router: Router): Promise<void>{
        router.delete("/:idMateriel", async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.materielRepository.remove(await this.materielRepository.findOne(req.params.idMateriel))
                res.status(204).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async deleteMultiple(router: Router) {
        router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.removeMaterielInDatabase(req);
                res.status(204).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async removeMaterielInDatabase(req: Request): Promise<DeleteResult> {
        return await this.materielRepository.delete(await this.parseRemoveListFromRequest(req))
    }
    private async parseRemoveListFromRequest(req: Request): Promise<number[]> {
        var rawDeleteList: any = req.headers["deletelist"]
        return JSON.parse(rawDeleteList)
    }
    async addPut(router: Router): Promise<void> {
        router.put("/:idMateriel", async (req, res, next) => {
            try {

                var materielToModify: Materiel = await this.fetchMaterielFromDatabase(Number(req.params.idMateriel))
                if (this.isMaterielExist(materielToModify)) {
                    var materielModifiedReadyToSave: Materiel = await this.mergeMaterielFromRequest(materielToModify, req)
                    var materielModified: Materiel = await this.updateMaterielInDatabase(materielModifiedReadyToSave)
                    if (await this.isMaterielExist(materielModified))
                        await this.sendResponse(res, 204, { message: "Materiel Modified Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Materiel Not Modified" })
                } else {
                    await this.sendResponse(res, 404, { message: "Materiel Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })

    }
    async fetchMaterielFromDatabase(id: number): Promise<Materiel> {
        return this.materielRepository.findOneOrFail(id)
    }

    private async isMaterielExist(materiel: Materiel): Promise<boolean> {
        return materiel !== undefined
    }
    private async mergeMaterielFromRequest(materielToModify: Materiel, req: Request): Promise<Materiel> {
        if(req.body.idMateriel != undefined && materielToModify.idMateriel != req.body.idMateriel)
            req.body.idMateriel = materielToModify.idMateriel
        return this.materielRepository.merge(materielToModify, req.body)
    }
    private async updateMaterielInDatabase(materielToUpdate: Materiel): Promise<Materiel> {
        return await this.materielRepository.save(materielToUpdate)
    }
}
