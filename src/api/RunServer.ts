import router from "./routerApi";
import securityDevice from "./SecurityDevice"
import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import DeviceController from './routes/DeviceController';
import AdminController from '../backoffice/AdminController';

export default () => {
const app = express();
app.use("/api", bodyParser.urlencoded({extended : true}))
app.use("/api", bodyParser.json())
app.use("/api", compression())
app.use("/api", securityDevice)
app.use("/api", router)
app.use("/device", new DeviceController().router)
app.set('views', './src/backoffice/views');
app.set("view engine", "ejs")
app.use("/admin", new AdminController().router)
console.log("Server started")
return app.listen(process.env.PORT || 3000)
}