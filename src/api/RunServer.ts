import router from "./routerApi";
import express from 'express';
import bodyParser from "body-parser"

export default () => {
const app = express();
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use("/api", router)
app.listen(process.env.PORT || 3000)
return app;
}