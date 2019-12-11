import 'reflect-metadata';
import {createConnection} from 'typeorm'
import { Client } from './entities/Client';
import { Utiliser } from './entities/Utiliser';

import express, {  Request, Response } from "express"

createConnection().then(connection => {
    console.log(connection.getRepository(Client))
})

const app = express();
app.get('/', (req: Request, res: Response) => {
    res.json({message: "De aona ry Cyri e? ;p "})
})
app.listen(process.env.PORT || 3000)