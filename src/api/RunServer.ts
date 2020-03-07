import router from "./routerApi";
import securityDevice from "./SecurityDevice"
import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import DeviceController from './routes/DeviceController';
import AdminController from '../backoffice/AdminController';
import { Request, NextFunction, Response } from 'express';
import session from 'express-session';

export default () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use("/api", compression())
    app.use("/api", securityDevice)
    app.use("/api", router)
    app.use("/device", new DeviceController().router)
    app.set('views', './src/backoffice/views');
    app.set("view engine", "ejs")
    app.use(express.static(__dirname.replace("/api", "") + '/backoffice/views/assets'))
    app.use("/admin", session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }), disableCache(),
        new AdminController().router)
    app.use("/", (req: Request, res: Response, next: NextFunction) => {
        if (!res.headersSent)
            res.redirect("/admin")
    })
    console.log("Server started")
    return app.listen(process.env.PORT || 3000)
}

function disableCache() {
    return (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
    };
}
