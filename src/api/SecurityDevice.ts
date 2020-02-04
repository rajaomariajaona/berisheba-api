
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createConnection, getConnection, Connection } from 'typeorm';
import { ormconfig } from '../config';
import { Device } from '../entities/Device';
export default function securityDevice(req: Request, res: Response, next: NextFunction) {
    var jwtToken: string = req.headers["authorization"]
    console.log(jwtToken)
    if (jwtToken == undefined) {
        res.status(401).send({
            message: "JWT token Missing"
        })
        return;
    }
    try {
        jwt.verify(jwtToken.split(" ")[1], process.env.AUTHORIZATION_PASS_PHRASE, (error, payload) => {
            if (error == null) {
                var connection: Connection = getConnection()
                connection.getRepository(Device).findOneOrFail(payload.deviceid)
                    .then((device) => {
                        if (device.authorized) {
                            next()
                            return;
                        } else {
                            res.status(401).send({
                                message: "device not authorized"
                            })
                        }
                    }).catch(error => {
                        res.status(401).send({
                            message: "device not authorized"
                        })
                    })
            }else{
                res.status(401).send({
                    message: error.message
                })
            }
        })
    } catch (error) {
        res.status(401).send({
            message: error.message
        })
        return;
    }
}