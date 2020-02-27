import { Router } from 'express';
export default class AdminController {


    router: Router

    constructor() {
        this.router = Router()
        this.addRoutes(this.router)
    }

    addRoutes(router: Router) {
        router.get("/", async (req, res, next) => {

            res.render("pages/login")
        })
    }
}