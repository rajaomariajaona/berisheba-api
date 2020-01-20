import { Controller } from "../Controller";
import { Repository, Connection, createConnection } from "typeorm";
import { Salle } from "../../entities/Salle";
import { ormconfig } from '../../config';
import {Router, Request, Response, NextFunction} from "express"
export default class SalleController extends Controller {
    salleRepository: Repository<Salle>

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
        this.salleRepository = this.connection.getRepository(Salle)
        }catch(error){
            console.log(error)
        }
    }
    async addGet(router: Router): Promise<void> {
        await this.getAllSalle(router)
    }
    private async getAllSalle(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var salles: Salle[] = await this.fetchSallesFromDatabase()
                var structuredSalleData = await this.useIdSalleAsKey(salles)
                await this.sendResponse(res, 200, { data: structuredSalleData })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async fetchSallesFromDatabase(): Promise<Salle[]> {
        return this.salleRepository.find()
    }
    private async useIdSalleAsKey(salles: Salle[]): Promise<Object> {
        var obj = {};
        salles.forEach((salle) => {
            obj[salle["idSalle"]] = salle;
        });
        return obj
    }
    async addPost(router: Router): Promise<void> {
        this.saveSalleIntoDatabase(router)
    }

    async saveSalleIntoDatabase(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                    var salleToSave: Salle = await this.salleRepository.create(req.body as Object)
                    var salleSaved: Salle = await this.saveSalleToDatabase(salleToSave)
                    if (await this.isSalleSaved(salleSaved))
                        await this.sendResponse(res, 201, { message: "Salle Added Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Salle Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    async isSalleSaved(salle: Salle) : Promise<boolean> {
        return salle !== undefined
    }
    async saveSalleToDatabase(salleToSave: Salle): Promise<Salle> {
        return this.salleRepository.save(salleToSave);
    }

    async addDelete(router: Router): Promise<void> {
        router.delete("/:idSalle", async (req: Request, res: Response, next: NextFunction) => {
            try {
                    await this.removeSalleInDatabase(req)
                    res.status(201).json({ message: "deleted successfully" })
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }
    async removeSalleInDatabase(req: Request) {
        this.salleRepository.delete(req.params["idSalle"])
    }
    async addPut(router: Router): Promise<void> {
        router.put("/:idSalle", async (req, res, next) => {
            try {

                var salleToModify: Salle = await this.fetchSalleFromDatabase(Number(req.params.idSalle))
                if (this.isSalleExist(salleToModify)) {
                    var salleModifiedReadyToSave: Salle = await this.mergeSalleFromRequest(salleToModify, req)
                    var salleModified: Salle = await this.updateSalleInDatabase(salleModifiedReadyToSave)
                    if (await this.isSalleExist(salleModified))
                        await this.sendResponse(res, 204, { message: "Salle Modified Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Salle Not Modified" })
                } else {
                    await this.sendResponse(res, 404, { message: "Salle Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })

    }
    async fetchSalleFromDatabase(id: number): Promise<Salle> {
        return this.salleRepository.findOneOrFail(id)
    }

    private async isSalleExist(salle: Salle): Promise<boolean> {
        return salle !== undefined
    }
    private async mergeSalleFromRequest(salleToModify: Salle, req: Request): Promise<Salle> {
        if(req.body.idSalle != undefined && salleToModify.idSalle != req.body.idSalle)
            req.body.idSalle = salleToModify.idSalle
        return this.salleRepository.merge(salleToModify, req.body)
    }
    private async updateSalleInDatabase(salleToUpdate: Salle): Promise<Salle> {
        return await this.salleRepository.save(salleToUpdate)
    }
}
