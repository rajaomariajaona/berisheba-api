import router from "./routerApi";
import securityDevice from "./SecurityDevice"
import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"
import DeviceController from './routes/DeviceController';

export default () => {
const app = express();
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use("/api", compression())
app.use("/api", securityDevice)
app.use("/api", router)
app.use("/device", new DeviceController().router)
console.log("Server started")
return app.listen(process.env.PORT || 3000)
}