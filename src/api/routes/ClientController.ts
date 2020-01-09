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
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        var connection: Connection = await createConnection(ormconfig)
        this.clientRepository = connection.getRepository(Client)
    }
    addAllRoutes(router: Router): void {
        this.addGet(router)
        this.addPost(router)
        this.addDelete(router)
        this.addPut(router)
        this.addErrorHandler(router)
    }
    addGet(router: Router): void {
        this.getAllClient(router)
        this.getSingleClient(router)
    }

    async getAllClient(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var clients: Client[] = await this.fetchClientsFromDatabase()
                var structuredClientData = this.useIdClientAsKey(clients)
                this.sendResponse(res, 200, { data: structuredClientData })
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    async fetchClientsFromDatabase(): Promise<Client[]> {
        return this.clientRepository.find()
    }

    useIdClientAsKey(clients: Client[]): Object {
        var obj = {};
        clients.forEach((client) => {
            obj[client["idClient"]] = client;
        });
        return obj
    }

    async getSingleClient(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var client: Client = await this.fetchClientFromDatabase(req.params.id)
                if (this.isClientExist(client)) {
                    this.sendResponse(res, 200, { data: client })
                } else {
                    this.sendResponse(res, 404, { message: "Client Not Found" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }
    async fetchClientFromDatabase(id: string): Promise<Client> {
        return this.clientRepository.findOne(id)
    }
    isClientExist(client: Client): boolean {
        return client !== undefined
    }

    addPost(router: Router): void {
        this.postClient(router)
    }

    postClient(router: Router) {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!this.isDeletingMode(req)) {
                    var clientToSave: Client[] = this.createClientFromRequest(req)
                    var clientSaved: Client[] = await this.saveClientToDatabase(clientToSave)
                    if (this.isClientSaved(clientSaved))
                        this.sendResponse(res, 201, { message: "Client Added Successfully" })
                    else
                        this.sendResponse(res, 403, { message: "Client Not Added" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    isClientSaved(client: Client[]): boolean {
        return client !== undefined
    }

    isDeletingMode(req: Request): boolean {
        return req.body.deleteList;
    }

    createClientFromRequest(req: Request): Client[] {
        return this.clientRepository.create(req.body)
    }
    async saveClientToDatabase(client: Client[]): Promise<Client[]> {
        return this.clientRepository.save(client);
    }

    addDelete(router: Router): void {
        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (this.isDeletingMode(req)) {
                    await this.removeClientInDatabase(req)
                    res.status(201).json({ message: "deleted successfully" })
                }
                next()
            } catch (err) {
                this.passErrorToExpress(err, next)
            }
        })
    }

    async removeClientInDatabase(req: Request): Promise<DeleteResult> {
        return this.clientRepository.delete(this.parseRemoveListFromRequest(req))
    }
    parseRemoveListFromRequest(req: Request): number[] {
        return JSON.parse(req.body.deleteList)
    }

    addPut(router: Router): void {
        router.put("/:id", async (req, res, next) => {
            try {

                var clientToModify: Client = await this.fetchClientFromDatabase(req.params.id)
                if (this.isClientExist(clientToModify)) {
                    var clientModifiedReadyToSave: Client = await this.mergeClientFromRequest(clientToModify, req)
                    var clientModified: Client = await this.updateClientInDatabase(clientModifiedReadyToSave)
                    if (this.isClientExist(clientModified))
                        this.sendResponse(res, 204, { message: "Client Modified Successfully" })
                    else
                        this.sendResponse(res, 403, { message: "Client Not Modified" })
                } else {
                    this.sendResponse(res, 404, { message: "Client Not Found" })
                }
                next()
            } catch (err) {
                next(err)

            }
        })
    }

    async mergeClientFromRequest(clientToModify: Client, req: Request): Promise<Client> {
        return this.clientRepository.merge(clientToModify, req.body)
    }
    async updateClientInDatabase(clientToUpdate: Client): Promise<Client> {
        return this.clientRepository.save(clientToUpdate)
    }

}