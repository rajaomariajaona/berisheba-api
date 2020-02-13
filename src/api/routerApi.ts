import express from "express"
import ClientController from './routes/ClientController';
import ReservationController from './routes/ReservationController';
import SalleController from './routes/SalleController';
import MaterielController from './routes/MaterielController';
import ConstituerController from './routes/ConstituerController';
import JiramaController from './routes/JiramaController';
import AutreController from './routes/AutreController';
import ConcernerController from './routes/ConcernerController';
import ConflitController from './routes/ConflitController';
import LouerController from './routes/LouerController';
var router = express.Router()
router.use("/clients", new ClientController().mainRouter);
router.use("/reservations", new ReservationController().mainRouter);
router.use("/salles", new SalleController().mainRouter);
router.use("/materiels", new MaterielController().mainRouter);
router.use("/reservations", new ConstituerController().mainRouter);
router.use("/jirama", new JiramaController().mainRouter);
router.use("/autres", new AutreController().mainRouter);
router.use("/reservations", new ConcernerController().mainRouter);
router.use("/reservations", new LouerController().mainRouter);
router.use("/conflits", new ConflitController().mainRouter);
export default router;