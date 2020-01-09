import express from "express"
import ClientController from './routes/ClientController';
import ReservationController from './routes/ReservationController';
var router = express.Router()
router.use("/clients", new ClientController().mainRouter);
router.use("/reservations", new ReservationController().mainRouter);
export default router;