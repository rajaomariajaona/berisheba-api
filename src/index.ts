import 'reflect-metadata';
import RunServer from './api/RunServer';
import {MyWebSocket} from "./websocket/ws";
import dotenv from 'dotenv'
import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from './config';
import { User } from './entities/User';
import { Paiement } from './entities/Paiement';
dotenv.config()
const server = RunServer();
const WebSocket = new MyWebSocket(server);
createConnection(ormconfig).then( async (connection) => {
    let userRepository = connection.getRepository(User);
    await userRepository.count().then(async (count) => {
        if(count <= 0){
            var defaultUser = new User();
            defaultUser.username = "admin"
            defaultUser.email = "mamyseheno1@gmail.com"
            defaultUser.password = "$2b$10$VxrrwC4cmwaO1OZ6dk72KeTOh8s2gx7m8BCzHmh.NjsWt7D2wxDxq"
            await userRepository.save(defaultUser)
        }
    })
    let paiementRepository = connection.getRepository(Paiement);
    let typePaiements = ["avance", "reste", "remise"]
    let toDelete: string[] = []
    await paiementRepository.find().then(async paiements => {
        paiements.forEach(async (paiement: Paiement) => {
            if(!typePaiements.includes(paiement.typePaiement)){
                toDelete.push( `"typePaiement" = ${paiement.typePaiement}`)
            }
        })
    })
    let toSave: Paiement[] = []
    typePaiements.forEach( type => {
        let p = new Paiement()
        p.typePaiement = type
        toSave.push(p)
    })
    if(toDelete.length > 0)
    await getConnection().createEntityManager().query(`DELETE FROM "Paiement" WHERE ${toDelete.join(" OR ")}`)
    await paiementRepository.save(toSave)

})