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

        router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
            if (!req.session.loggedin) {
                res.render("pages/login")
            }else{
                res.redirect("/admin")
            }
        })
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            if (req.session.loggedin) {
                res.render("pages/dashboard")
            }else{
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

                        var user: User = await this.userRepository.findOneOrFail({ where: { username: username} })
                        var bcrypt = require("bcrypt")
                        bcrypt.compare(password, user.password,(err, isSame) => {
                            if(!err && isSame){
                                req.session.loggedin = true
                                res.redirect("./")
                            }else{
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
    }
}