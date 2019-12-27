import { Router, Response, Request, NextFunction } from "express";
import { createConnection } from "typeorm";
import { Client } from '../../entities/Client';
import {ormconfig} from "../../config";
var clientRoute  = Router()
createConnection(ormconfig).then((connection) => {
    var clientRepository = connection.getRepository(Client)
    clientRoute.get("/", (req, res, next) =>{
        clientRepository.find().then((clients: Client[]) =>{
            res.status(200).json({data : clients})
            next();
        })
    })
    clientRoute.get("/:id", (req, res, next) =>{
        clientRepository.findOne(req.params.id).then((client: Client) =>{
            if(client)
                res.status(200).json({data : client})
            else
                res.status(404).json({message : "Not found"})
            next()
        })
    })
    clientRoute.delete("/:id", (req, res, next) =>{
        clientRepository.delete(req.params.id).then((result) =>{
            if(result.affected)
                res.status(204).json({message : "deleted successfully"})
            else
                res.status(404).json({message : "Not found"})
            next()
        })
    })
    clientRoute.post("/",  (req, res, next) =>{
        if(req.body.deleteList){
            clientRepository.delete(JSON.parse(req.body.deleteList)).then(() => {
                    res.status(201).json({message : "deleted successfully"})
                }).catch((error) =>
                    res.status(400).json({message : "Not found", error : error})
            );
        }else{
            var c = clientRepository.create(req.body)
        clientRepository.save(c).then(client => {
            if(client)
                res.status(201).json({message : "added successfully"})
            else
                res.status(400).json({message : "Not found"})
        });
        }
    
    })
    clientRoute.put("/:id", async (req, res, next) =>{   
        var c = await clientRepository.findOne(req.params.id)   
        clientRepository.merge(c, req.body)
        clientRepository.save(c).then(client => {
            if(client)
                res.status(201).json({message : "modified successfully"})
            else
                res.status(400).json({message : "Not found"})
        });
    })
}).catch(error => { 
    console.log(error);
})

export default clientRoute;