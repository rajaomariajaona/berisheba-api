import 'reflect-metadata';
import RunServer from './api/RunServer';
import {MyWebSocket} from "./websocket/ws";
import dotenv from 'dotenv'
import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { User } from './entities/User';
dotenv.config()
const server = RunServer();
const WebSocket = new MyWebSocket(server);
createConnection(ormconfig).then( async (connection) => {
    let repos = connection.getRepository(User);
    await repos.count().then(async (count) => {
        if(count <= 0){
            var defaultUser = new User();
            defaultUser.username = "admin"
            defaultUser.email = "mamyseheno1@gmail.com"
            defaultUser.password = "$2b$10$VxrrwC4cmwaO1OZ6dk72KeTOh8s2gx7m8BCzHmh.NjsWt7D2wxDxq"
            await repos.save(defaultUser)
        }
    })
})