import { Router } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
export abstract class Controller{
    mainRouter: Router = Router()
    abstract createConnectionAndAssignRepository() : any;
    abstract addAllRoutes(router : Router):void;
    abstract addGet(router : Router):void;
    abstract addPost(router : Router):void;
    abstract addDelete(router : Router):void;
    abstract addPut(router : Router):void;
    addErrorHandler(router: Router) {
        router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(err)
            this.sendResponse(res, 500, { error: err })
        })
    }

    sendResponse(response: Response, statusCode: number, data: Object) {
        response.status(statusCode).json(data)
    }
    passErrorToExpress(err: Error, next: NextFunction) {
        next(err)
    }
}