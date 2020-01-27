import router from "./routerApi";
import express from 'express';
import bodyParser from "body-parser"
import compression from "compression"

export default () => {
const app = express();
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use("/api", compression())
app.use("/api", router)
console.log("Server started")
return app.listen(process.env.PORT || 3000)
}