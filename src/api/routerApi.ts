import express from "express"
import clientRoute from './routes/ClientController';
var router = express.Router()
router.use("/clients", clientRoute);
export default router;