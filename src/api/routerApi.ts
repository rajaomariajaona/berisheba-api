import express from "express"
import ClientController from './routes/ClientController';
import ReservationController from './routes/ReservationController';
import SalleController from './routes/SalleController';
import MaterielController from './routes/MaterielController';
var router = express.Router()
router.use("/clients", new ClientController().mainRouter);
router.use("/reservations", new ReservationController().mainRouter);
router.use("/salles", new SalleController().mainRouter);
router.use("/materiels", new MaterielController().mainRouter);
export default router;