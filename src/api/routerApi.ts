import express from "express"
import ClientController from './routes/ClientController';
var router = express.Router()
router.use("/clients", new ClientController().clientRouter);
export default router;