import { Router, Request, NextFunction, Response } from 'express';
import { Connection, createConnection, Repository } from 'typeorm';
import { ormconfig } from '../config';
import { User } from '../entities/User';
import { Device } from '../entities/Device';
export default class AdminController {

    router: Router
    userRepository: Repository<User>
    deviceRepository: Repository<Device>
    constructor() {
        this.router = Router()
        this.addRoutes(this.router)
        createConnection(ormconfig).then((connection) => {

            this.userRepository = connection.getRepository(User)
            this.deviceRepository = connection.getRepository(Device)
        })
    }

    addRoutes(router: Router) {

        router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
            if (!req.session.loggedin) {
                res.render("pages/login")
            } else {
                res.redirect("/admin")
            }
        })
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.loggedin) {
                res.render("pages/dashboard", { data: (await this.deviceRepository.find()) })
            } else {
                res.redirect("/admin/login")
            }
        })
        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.loggedin)
                res.redirect("./")
            else {
                var username = req.body.username
                var password = req.body.password
                if (username != undefined && password != undefined) {

                    try {

                        var user: User = await this.userRepository.findOneOrFail({ where: { username: username } })
                        var bcrypt = require("bcrypt")
                        bcrypt.compare(password, user.password, (err, isSame) => {
                            if (!err && isSame) {
                                req.session.loggedin = true
                                res.redirect("./")
                            } else {
                                res.render("pages/error")
                            }
                        })

                    } catch (error) {
                        res.render("pages/error")
                    }
                } else {
                    res.render("pages/error")
                }

            }
        })
        router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
            req.session.loggedin = false
            req.session.destroy((error) => {
                res.redirect("/")
            })
        })
        router.post("/device", async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.loggedin) {
                try {
                    var device: Device = await this.deviceRepository.findOneOrFail(req.body.deviceid)
                    var email:boolean =false
                    if(device.authorized == null && device.email != null){
                        email = true;
                    }
                    device.authorized = (req.body.choice == 'true') ? true : false;
                    //TODO: Send mail
                    await this.deviceRepository.save(device)
                } catch (error) {
                }
                res.redirect("/")

            } else {
                res.render('pages/error')
            }
        })
    }
}