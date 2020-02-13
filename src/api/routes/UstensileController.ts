import { Controller } from "../Controller";
import { Repository, Connection, createConnection, getConnection, DeleteResult} from "typeorm";
import { Ustensile } from "../../entities/Ustensile";
import { ormconfig } from '../../config';
import {Router, Request, Response, NextFunction} from "express"
import { Reservation } from '../../entities/Reservation';
export default class UstensileController extends Controller {
    ustensileRepository: Repository<Ustensile>

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
        this.ustensileRepository = this.connection.getRepository(Ustensile)
        }catch(error){
            console.log(error)
        }
    }
    async addGet(router: Router): Promise<void> {
        await this.getUstensileDispo(router)
        await this.getAllUstensile(router)
    }
    private async getUstensileDispo(router: Router): Promise<void> {
        router.get("/:idReservation", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var idReservation: Number = Number(req.params.idReservation)
                try {
                    await getConnection().getRepository(Reservation).findOneOrFail(idReservation.toString())
                    var query: string =
                        `SELECT "idUstensile", "nomUstensile", "nbStock" FROM "Ustensile"
                        WHERE "Ustensile"."idUstensile" not in 
                        (SELECT "Emprunter"."Ustensile_idUstensile" FROM "Emprunter" WHERE "Emprunter"."Reservation_idReservation" = ${idReservation});`
                    var ustensilesDispoRaw = await getConnection().createEntityManager().query(query)
                    var ustensilesDispo: Object = {};
                    (ustensilesDispoRaw as Array<Object>).forEach(ustensile => {
                        ustensilesDispo[ustensile["idUstensile"]] = ustensile
                    });
                    await this.sendResponse(res, 200, { data: ustensilesDispo })
                    next()

                } catch (error) {
                    await this.sendResponse(res, 404, { message: "Reservation not found" })
                }
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async getAllUstensile(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var ustensiles: Ustensile[] = await this.fetchUstensilesFromDatabase()
                var structuredUstensileData = await this.useIdUstensileAsKey(ustensiles)
                await this.sendResponse(res, 200, { data: structuredUstensileData })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async fetchUstensilesFromDatabase(): Promise<Ustensile[]> {
        return this.ustensileRepository.find()
    }
    private async useIdUstensileAsKey(ustensiles: Ustensile[]): Promise<Object> {
        var obj = {};
        ustensiles.forEach((ustensile) => {
            obj[ustensile["idUstensile"]] = ustensile;
        });
        return obj
    }
    async addPost(router: Router): Promise<void> {
        this.saveUstensileIntoDatabase(router)
    }

    async saveUstensileIntoDatabase(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                    var ustensileToSave: Ustensile = await this.ustensileRepository.create(req.body as Object)
                    var ustensileSaved: Ustensile = await this.saveUstensileToDatabase(ustensileToSave)
                    if (await this.isUstensileSaved(ustensileSaved))
                        await this.sendResponse(res, 201, { message: "Ustensile Added Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Ustensile Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async isUstensileSaved(ustensile: Ustensile) : Promise<boolean> {
        return ustensile !== undefined
    }
    async saveUstensileToDatabase(ustensileToSave: Ustensile): Promise<Ustensile> {
        return this.ustensileRepository.save(ustensileToSave);
    }

    async addDelete(router: Router): Promise<void> {
        this.deleteById(router)
        this.deleteMultiple(router)
    }
    private async deleteById(router: Router): Promise<void>{
        router.delete("/:idUstensile", async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.ustensileRepository.remove(await this.ustensileRepository.findOne(req.params.idUstensile))
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
                await this.removeUstensileInDatabase(req);
                res.status(204).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async removeUstensileInDatabase(req: Request): Promise<DeleteResult> {
        return await this.ustensileRepository.delete(await this.parseRemoveListFromRequest(req))
    }
    private async parseRemoveListFromRequest(req: Request): Promise<number[]> {
        var rawDeleteList: any = req.headers["deletelist"]
        return JSON.parse(rawDeleteList)
    }
    async addPut(router: Router): Promise<void> {
        router.put("/:idUstensile", async (req, res, next) => {
            try {

                var ustensileToModify: Ustensile = await this.fetchUstensileFromDatabase(Number(req.params.idUstensile))
                if (this.isUstensileExist(ustensileToModify)) {
                    var ustensileModifiedReadyToSave: Ustensile = await this.mergeUstensileFromRequest(ustensileToModify, req)
                    var ustensileModified: Ustensile = await this.updateUstensileInDatabase(ustensileModifiedReadyToSave)
                    if (await this.isUstensileExist(ustensileModified))
                        await this.sendResponse(res, 204, { message: "Ustensile Modified Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Ustensile Not Modified" })
                } else {
                    await this.sendResponse(res, 404, { message: "Ustensile Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })

    }
    async fetchUstensileFromDatabase(id: number): Promise<Ustensile> {
        return this.ustensileRepository.findOneOrFail(id)
    }

    private async isUstensileExist(ustensile: Ustensile): Promise<boolean> {
        return ustensile !== undefined
    }
    private async mergeUstensileFromRequest(ustensileToModify: Ustensile, req: Request): Promise<Ustensile> {
        if(req.body.idUstensile != undefined && ustensileToModify.idUstensile != req.body.idUstensile)
            req.body.idUstensile = ustensileToModify.idUstensile
        return this.ustensileRepository.merge(ustensileToModify, req.body)
    }
    private async updateUstensileInDatabase(ustensileToUpdate: Ustensile): Promise<Ustensile> {
        return await this.ustensileRepository.save(ustensileToUpdate)
    }
}
