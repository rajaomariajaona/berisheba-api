"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Controller_1 = require("../Controller");
var typeorm_1 = require("typeorm");
var Reservation_1 = require("../../entities/Reservation");
var config_1 = require("../../config");
var typeorm_2 = require("typeorm");
var Constituer_1 = require("../../entities/Constituer");
var moment = require("moment");
var DemiJournee_1 = require("../../entities/DemiJournee");
var ReservationController = /** @class */ (function (_super) {
    __extends(ReservationController, _super);
    function ReservationController() {
        var _this = _super.call(this) || this;
        _this.createConnectionAndAssignRepository().then(function (_) {
            _this.addAllRoutes(_this.mainRouter);
        });
        return _this;
    }
    ReservationController.prototype.createConnectionAndAssignRepository = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, typeorm_2.createConnection(config_1.ormconfig)];
                    case 1:
                        connection = _a.sent();
                        this.reservationRepository = connection.getRepository(Reservation_1.Reservation);
                        this.constituerRepository = connection.getRepository(Constituer_1.Constituer);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.addAllRoutes = function (router) {
        this.addGet(router);
        this.addPost(router);
        this.addDelete(router);
        this.addPut(router);
        this.addErrorHandler(router);
    };
    ReservationController.prototype.addGet = function (router) {
        this.getReservationAndDateByWeek(router);
    };
    ReservationController.prototype.getReservationAndDateByWeek = function (router) {
        var _this = this;
        router.get("/:week", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var reservations, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetchReservationFromDatabase(this.parseWeekFromRequest(req))];
                    case 1:
                        reservations = _a.sent();
                        this.sendResponse(res, 200, { data: reservations });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.passErrorToExpress(err_1, next);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ReservationController.prototype.parseWeekFromRequest = function (req) {
        return req.params.week;
    };
    ReservationController.prototype.fetchReservationFromDatabase = function (week) {
        var query = "SELECT \"Reservation\".\"idReservation\", \"Reservation\".\"nomReservation\", \"Reservation\".\"descReservation\", \"Reservation\".\"etatReservation\", \"Client\".\"nomClient\", \"Client\".\"prenomClient\", MIN(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateEntree\", MAX(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateSortie\" FROM \"DemiJournee\" JOIN \"Constituer\" ON \"Constituer\".\"DemiJournee_date\" = \"DemiJournee\".date AND \"Constituer\".\"DemiJournee_TypeDemiJournee\" = \"DemiJournee\".\"TypeDemiJournee\" JOIN \"Reservation\" ON \"Constituer\".\"Reservation_idReservation\" = \"Reservation\".\"idReservation\" JOIN \"Client\" ON \"Client\".\"idClient\" = \"Reservation\".\"Client_idClient\" GROUP BY \"Reservation\".\"idReservation\", \"Client\".\"idClient\" HAVING DATE_PART('week', MIN(\"date\")) <= " + week + " AND  DATE_PART('week', MAX(\"date\")) >= " + week;
        return typeorm_1.getConnection().createEntityManager().query(query);
    };
    ReservationController.prototype.addPost = function (router) {
        var _this = this;
        router.post("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var reservation;
            return __generator(this, function (_a) {
                try {
                    reservation = this.reservationRepository.create(req.body);
                    console.log(this.createDemiJourneeInstances(this.parseDataTimeFromRequest(req)));
                    this.sendResponse(res, 200, { message: "Reservation has been created" });
                }
                catch (err) {
                    this.passErrorToExpress(err, next);
                }
                return [2 /*return*/];
            });
        }); });
    };
    ReservationController.prototype.createDemiJourneeInstances = function (data) {
        var currentDate = moment(data.dateEntree);
        var typeDemiJournee = ["Jour", "Nuit"];
        var demiJournees = new Array();
        while (this.isOnInterval(currentDate, data)) {
            if (this.isOnSortieAndNotEntree(currentDate, data)) {
                this.cursorOnDateSortie(demiJournees, currentDate, typeDemiJournee, data);
                break;
            }
            else {
                if (this.isOnEntreeAndSortie(currentDate, data)) {
                    this.cursorOnDateEntreeAndSortie(demiJournees, currentDate, typeDemiJournee, data);
                }
                else if (this.isOnEntree(currentDate, data)) {
                    this.cursorOnDateEntree(demiJournees, currentDate, typeDemiJournee, data);
                }
                else {
                    this.cursorOnDateMilieu(demiJournees, currentDate, typeDemiJournee, data);
                }
                this.incrementDateOneDay(currentDate);
            }
        }
        return demiJournees;
    };
    ReservationController.prototype.isOnInterval = function (currentDate, data) {
        return currentDate.isBefore(moment(data.dateSortie).add(1, 'd'));
    };
    ReservationController.prototype.isOnSortieAndNotEntree = function (currentDate, data) {
        return currentDate.isSame(moment(data.dateSortie)) && !moment(data.dateSortie).isSame(moment(data.dateEntree));
    };
    ReservationController.prototype.isOnEntree = function (currentDate, data) {
        return currentDate.isSame(moment(data.dateEntree));
    };
    ReservationController.prototype.isOnEntreeAndSortie = function (currentDate, data) {
        return (currentDate.isSame(moment(data.dateEntree))) && (currentDate.isSame(moment(data.dateSortie)));
    };
    ReservationController.prototype.cursorOnDateSortie = function (demiJournees, date, typeDemiJournee, data) {
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0]);
        if (data.typeDemiJourneeSortie === typeDemiJournee[0])
            return;
        else {
            this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1]);
            return;
        }
    };
    ReservationController.prototype.cursorOnDateEntreeAndSortie = function (demiJournees, date, typeDemiJournee, data) {
        this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeEntree);
        if (data.typeDemiJourneeEntree !== data.typeDemiJourneeSortie)
            this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeSortie);
        return;
    };
    ReservationController.prototype.cursorOnDateEntree = function (demiJournees, date, typeDemiJournee, data) {
        var index = typeDemiJournee.indexOf(data.typeDemiJourneeEntree);
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[index]);
        if (index === 0) {
            this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1]);
        }
    };
    ReservationController.prototype.cursorOnDateMilieu = function (demiJournees, date, typeDemiJournee, data) {
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0]);
        this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1]);
    };
    ReservationController.prototype.parseDataTimeFromRequest = function (req) {
        var data = {
            dateEntree: req.body.dateEntree,
            typeDemiJourneeEntree: req.body.typeDemiJourneeEntree,
            dateSortie: req.body.dateSortie,
            typeDemiJourneeSortie: req.body.typeDemiJourneeSortie
        };
        if (data.dateEntree == undefined || data.dateSortie == undefined || data.typeDemiJourneeEntree == undefined || data.typeDemiJourneeSortie == undefined)
            throw new Error("Some Field Uncompleted");
        if (moment(data.dateEntree).isAfter(moment(data.dateSortie)) || (moment(data.dateEntree).isSame(moment(data.dateSortie)) && data.typeDemiJourneeEntree == 'Nuit' && data.typeDemiJourneeSortie == 'Jour'))
            throw new Error("Invalid data at in the demi journee data");
        return data;
    };
    ReservationController.prototype.addNewDemiJournee = function (list, date, typeDemiJournee) {
        var demiJournee = new DemiJournee_1.DemiJournee();
        demiJournee.TypeDemiJournee = typeDemiJournee;
        demiJournee.date = date.format("YYYY-MM-DD");
        list.push(demiJournee);
    };
    ReservationController.prototype.incrementDateOneDay = function (date) {
        date.add(1, "d");
    };
    ReservationController.prototype.addDelete = function (router) {
    };
    ReservationController.prototype.addPut = function (router) {
    };
    return ReservationController;
}(Controller_1.Controller));
exports.default = ReservationController;
//# sourceMappingURL=ReservationController.js.map