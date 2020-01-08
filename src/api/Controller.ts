import { Router } from 'express';
export interface Controller{
    createConnectionAndAssignRepository() : any;
    addAllRoutes(router : Router):void;
    addGet(router : Router):void;
    addPost(router : Router):void;
    addDelete(router : Router):void;
    addPut(router : Router):void;
}