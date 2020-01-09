"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ClientController_1 = __importDefault(require("./routes/ClientController"));
var ReservationController_1 = __importDefault(require("./routes/ReservationController"));
var router = express_1.default.Router();
router.use("/clients", new ClientController_1.default().mainRouter);
router.use("/reservations", new ReservationController_1.default().mainRouter);
exports.default = router;
//# sourceMappingURL=routerApi.js.map