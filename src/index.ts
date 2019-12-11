import 'reflect-metadata';
import {createConnection} from 'typeorm'
import express, {  Request, Response } from "express"
import { Client } from './entities/Client';
const app = express();
createConnection().then(connection => {
    app.get("/", (req, res) => {
        var repos = connection.getRepository(Client)
        repos.save(new Client())
        repos.find().then((clients: Client[]) => {
            res.json({data : clients})
        })
        
    })
    console.log("OK")
}).then(() => {
    app.listen(process.env.PORT || 3000)
})