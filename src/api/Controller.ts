import { Router } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
import router from './routerApi';
import { Connection } from 'typeorm';
export abstract class Controller{
    mainRouter: Router = Router()
    connection : Connection
    abstract async createConnectionAndAssignRepository() : Promise<any>;
    protected async addAllRoutes(router : Router):Promise<void>{
        await this.addGet(router)
        await this.addPost(router)
        await this.addDelete(router)
        await this.addPut(router)
        await this.addErrorHandler(router)
    }

    abstract async addGet(router : Router):Promise<void>;
    abstract async addPost(router : Router):Promise<void>;
    abstract async addDelete(router : Router):Promise<void>;
    abstract async addPut(router : Router):Promise<void>;
    protected async addErrorHandler(router: Router) {
        router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(err)
            this.sendResponse(res, 500, { error: err })
        })
    }

    protected async sendResponse(response: Response, statusCode: number, data: Object) {
        response.status(statusCode).json(data)
    }
    protected async passErrorToExpress(err: Error, next: NextFunction) {
        next(err)
    }
}