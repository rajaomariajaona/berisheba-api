import { Router } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
export abstract class Controller{
    mainRouter: Router = Router()
    protected abstract createConnectionAndAssignRepository() : any;
    protected abstract addAllRoutes(router : Router):void;
    protected abstract addGet(router : Router):void;
    protected abstract addPost(router : Router):void;
    protected abstract addDelete(router : Router):void;
    protected abstract addPut(router : Router):void;
    protected addErrorHandler(router: Router) {
        router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(err)
            this.sendResponse(res, 500, { error: err })
        })
    }

    protected sendResponse(response: Response, statusCode: number, data: Object) {
        response.status(statusCode).json(data)
    }
    protected passErrorToExpress(err: Error, next: NextFunction) {
        next(err)
    }
}