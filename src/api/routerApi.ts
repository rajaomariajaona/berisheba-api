import express from "express"
import ClientController from './routes/ClientController';
import ReservationController from './routes/ReservationController';
import SalleController from './routes/SalleController';
import MaterielController from './routes/MaterielController';
import ConstituerController from './routes/ConstituerController';
import JiramaController from './routes/JiramaController';
var router = express.Router()
router.use("/clients", new ClientController().mainRouter);
router.use("/reservations", new ReservationController().mainRouter);
router.use("/salles", new SalleController().mainRouter);
router.use("/materiels", new MaterielController().mainRouter);
router.use("/constituers", new ConstituerController().mainRouter);
router.use("/jirama", new JiramaController().mainRouter);
export default router;