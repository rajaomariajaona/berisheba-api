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
            this.addGet(this.router)
        }).catch(error => console.log(error))
    }
    addGet(router: Router) {
        router.get("/:deviceid", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var device: Device = await this.deviceRepository.findOneOrFail(req.params.deviceid)
                res.status(200).send({ data: device })
            } catch (error) {
                res.status(404).send({ message: "Device not found" })
            }

        });
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
                    if (device.description != req.body["description"]) {
                        device.description = req.body["description"]
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
                    if ((req.body["deviceid"] as string).toLowerCase() != "unknow") {
                        var device: Device = this.deviceRepository.create(req.body as Object)
                        device.authorized = null
                        await this.deviceRepository.save(device)
                    }
                    res.status(401).send({ message: "device not authorized" })
                })
        });
    }
}