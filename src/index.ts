import 'reflect-metadata';
import {createConnection} from 'typeorm'
import { Client } from './entities/Client';
import { Utiliser } from './entities/Utiliser';

import express, {  Request, Response } from "express"

createConnection().then(connection => {
    connection.manager.save(new Client());
    app.get('/', (req: Request, res: Response) => {
        
        connection.getRepository(Client).find().then((clients: Client[]) => {
            res.json({data : clients})
        })
    })
})

const app = express();

app.listen(process.env.PORT || 3000)