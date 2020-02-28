import { Router, Request, Response, NextFunction } from 'express';
import { Repository, createConnection } from 'typeorm';
import { Device } from '../../entities/Device';
import { ormconfig } from '../../config';
import jwt from 'jsonwebtoken';
export default class DeviceController {
    router: Router = Router()
    deviceRepository: Repository<Device>
    constructor() {
        createConnection(ormconfig).then((connection) => {
            this.deviceRepository = connection.getRepository(Device)
            this.addPost(this.router)
        }).catch(error => console.log(error))
    }
    addPost(router: Router) {
        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            if (req.body["deviceid"] === undefined) {
                res.status(400).send({ message: "Deviceid not provided" })
                return
            }

            this.deviceRepository.findOneOrFail(req.body["deviceid"])
                .then(async (device) => {
                    var changed: boolean = false
                    if (device.information != req.body["information"]) {
                        device.information = req.body["information"]
                        changed = true
                    }
                    if (device.utilisateur != req.body["utilisateur"]) {
                        device.utilisateur = req.body["utilisateur"]
                        changed = true
                    }
                    if (device.email != req.body["email"]) {
                        device.email = req.body["email"]
                        changed = true
                    }
                    if (changed)
                        await this.deviceRepository.save(device)
                    if (device.authorized) {
                        res.status(200).send({
                            token: jwt.sign({ deviceid: device.deviceid }, process.env.AUTHORIZATION_PASS_PHRASE, { expiresIn: "1h" })
                        })
                        return
                    } else {
                        res.status(401).send({ message: "device not authorized" })
                    }
                })
                .catch(async error => {
                    if ((req.body["deviceid"] as string).toLowerCase() != "unknow" ) {
                        var device: Device = this.deviceRepository.create(req.body as Object)
                        device.authorized = false
                        await this.deviceRepository.save(device)
                    }
                    res.status(401).send({ message: "device not authorized" })
                })
        });
    }
}