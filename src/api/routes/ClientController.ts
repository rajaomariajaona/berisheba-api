import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { createConnection, DeleteResult, Repository, Connection, UpdateResult } from "typeorm";
import { Client } from '../../entities/Client';
import { ormconfig } from "../../config";
import { Controller } from "../Controller";
import { Paiement } from '../../entities/Paiement';
import router from '../routerApi';

export default class ClientController extends Controller {

    clientRepository: Repository<Client>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.clientRepository = connection.getRepository(Client)    
        } catch (error) {
            console.log(error)
        }
        
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllClient(router)
        await this.getSingleClient(router)
    }

    private async getAllClient(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var clients: Client[] = await this.fetchClientsFromDatabase()
                var structuredClientData = await this.useIdClientAsKey(clients)
                await this.sendResponse(res, 200, { data: structuredClientData })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchClientsFromDatabase(): Promise<Client[]> {
        return await this.clientRepository.find()
    }

    private async useIdClientAsKey(clients: Client[]): Promise<Object> {
        var obj = {};
        clients.forEach((client) => {
            obj[client["idClient"]] = client;
        });
        return obj
    }

    private async getSingleClient(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var client: Client = await this.fetchClientFromDatabase(req.params.id)
                if (await this.isClientExist(client)) {
                    await this.sendResponse(res, 200, { data: client })
                } else {
                    await this.sendResponse(res, 404, { message: "Client Not Found" })
                }
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }
    private async fetchClientFromDatabase(id: string): Promise<Client> {
        return this.clientRepository.findOne(id)
    }
    private async isClientExist(client: Client): Promise<boolean> {
        return client !== undefined
    }

    async addPost(router: Router): Promise<void> {
        await this.postClient(router)
    }

    async postClient(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                    var clientToSave: Client = await this.createClientFromRequest(req)
                    var clientSaved: Client = await this.saveClientToDatabase(clientToSave)
                    if (await this.isClientSaved(clientSaved))
                        await this.sendResponse(res, 201, { message: "Client Added Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Client Not Added" })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async isClientSaved(client: Client): Promise<boolean> {
        return client !== undefined
    }

    private async createClientFromRequest(req: Request): Promise<Client> {
        return this.clientRepository.create(req.body as Object)
    }
    private async saveClientToDatabase(client: Client): Promise<Client> {
        return await this.clientRepository.save(client);
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteMultiple(router);
        await this.deleteById(router);
    }
    
    private async deleteById(router: Router): Promise<void>{
        router.delete("/:idClient", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var client: Client = await this.clientRepository.findOne(req.params.idClient)
                await this.clientRepository.remove(client)
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
                await this.removeClientInDatabase(req);
                res.status(204).json({ message: "deleted successfully" });
            }
            catch (err) {
                this.passErrorToExpress(err, next);
            }
        });
    }

    private async removeClientInDatabase(req: Request): Promise<DeleteResult> {
        return await this.clientRepository.delete(await this.parseRemoveListFromRequest(req))
    }
    private async parseRemoveListFromRequest(req: Request): Promise<number[]> {
        var rawDeleteList: any = req.headers["deletelist"]
        return JSON.parse(rawDeleteList)
    }

    async addPut(router: Router): Promise<void> {
        router.put("/:id", async (req, res, next) => {
            try {

                var clientToModify: Client = await this.fetchClientFromDatabase(req.params.id)
                if (this.isClientExist(clientToModify)) {
                    var clientModifiedReadyToSave: Client = await this.mergeClientFromRequest(clientToModify, req)
                    var clientModified: Client = await this.updateClientInDatabase(clientModifiedReadyToSave)
                    if (await this.isClientExist(clientModified))
                        await this.sendResponse(res, 204, { message: "Client Modified Successfully" })
                    else
                        await this.sendResponse(res, 403, { message: "Client Not Modified" })
                } else {
                    await this.sendResponse(res, 404, { message: "Client Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    private async mergeClientFromRequest(clientToModify: Client, req: Request): Promise<Client> {
        return this.clientRepository.merge(clientToModify, req.body)
    }
    private async updateClientInDatabase(clientToUpdate: Client): Promise<Client> {
        return await this.clientRepository.save(clientToUpdate)
    }

}