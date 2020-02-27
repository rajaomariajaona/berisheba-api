import { Router, Request, NextFunction, Response } from 'express';
import { Connection, createConnection, Repository } from 'typeorm';
import { ormconfig } from '../config';
import { User } from '../entities/User';
export default class AdminController {


    router: Router
    userRepository: Repository<User>
    constructor() {
        this.router = Router()
        this.addRoutes(this.router)
        createConnection(ormconfig).then((connection) => {

            this.userRepository = connection.getRepository(User)
        })
    }

    addRoutes(router: Router) {

        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.session)
            if (!req.session.loggedin) {
                res.render("pages/login")
            }
            else {
                res.render("pages/dashboard")
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

                        await this.userRepository.findOneOrFail({ where: { username: username, password: password } })
                        req.session.loggedin = true
                        res.redirect("./")
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
    }
}