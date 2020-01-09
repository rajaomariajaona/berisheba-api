import { Controller } from '../Controller';
import { Router } from 'express';
import { Repository, Connection } from 'typeorm';
import { Reservation } from '../../entities/Reservation';
import { ormconfig } from '../../config';
import { createConnection } from 'typeorm';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
import { Constituer } from '../../entities/Constituer';


export default class ReservationController extends Controller{
    reservationRepository : Repository<Reservation>
    constituerRepository : Repository<Constituer>

    constructor() {
        super()
        this.createConnectionAndAssignRepository().then((_) => {
            this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository() : Promise<void> {
        var connection: Connection = await createConnection(ormconfig)
        this.reservationRepository = connection.getRepository(Reservation)
        this.constituerRepository = connection.getRepository(Constituer)
    }    
    addAllRoutes(router: Router): void {
        this.addGet(router)
        this.addPost(router)
        this.addDelete(router)
        this.addPut(router)
        this.addErrorHandler(router)
    }
    addGet(router: Router): void {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var constituers : Constituer[] = await this.constituerRepository.find({ relations: ["demiJournee","reservationIdReservation"] })
                this.sendResponse(res,200,{data: constituers})
            }catch(err){
                this.passErrorToExpress(err,next)
            }
        })
    }
    addPost(router: Router): void {
        
    }
    addDelete(router: Router): void {
        
    }
    addPut(router: Router): void {
        
    }
}