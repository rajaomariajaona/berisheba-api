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
var Client_1 = require("../../entities/Client");
var TypeReservation_1 = require("../../entities/TypeReservation");
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
                        this.clientRepository = connection.getRepository(Client_1.Client);
                        this.demiJourneeRepository = connection.getRepository(DemiJournee_1.DemiJournee);
                        this.typeReservationRepository = connection.getRepository(TypeReservation_1.TypeReservation);
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
                        return [4 /*yield*/, this.fetchReservationsByWeekFromDatabase(this.parseWeekFromRequest(req))];
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
    ReservationController.prototype.fetchReservationsByWeekFromDatabase = function (week) {
        var query = "SELECT \"Reservation\".\"idReservation\", \"Reservation\".\"nomReservation\", \"Reservation\".\"descReservation\", \"Reservation\".\"etatReservation\", \"Client\".\"nomClient\", \"Client\".\"prenomClient\", MIN(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateEntree\", MAX(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateSortie\" FROM \"DemiJournee\" JOIN \"Constituer\" ON \"Constituer\".\"DemiJournee_date\" = \"DemiJournee\".date AND \"Constituer\".\"DemiJournee_TypeDemiJournee\" = \"DemiJournee\".\"TypeDemiJournee\" JOIN \"Reservation\" ON \"Constituer\".\"Reservation_idReservation\" = \"Reservation\".\"idReservation\" JOIN \"Client\" ON \"Client\".\"idClient\" = \"Reservation\".\"Client_idClient\" GROUP BY \"Reservation\".\"idReservation\", \"Client\".\"idClient\" HAVING DATE_PART('week', MIN(\"date\")) <= " + week + " AND  DATE_PART('week', MAX(\"date\")) >= " + week;
        return typeorm_1.getConnection().createEntityManager().query(query);
    };
    ReservationController.prototype.addPost = function (router) {
        var _this = this;
        router.post("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var demiJourneesToSave, _a, demiJourneesSaved, constituersToSave, reservationToSave, _b, _c, reservationSaved, err_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        _a = this.createDemiJourneeInstances;
                        return [4 /*yield*/, this.parseDataTimeFromRequest(req)];
                    case 1: return [4 /*yield*/, _a.apply(this, [_d.sent()])];
                    case 2:
                        demiJourneesToSave = _d.sent();
                        console.log(demiJourneesToSave);
                        return [4 /*yield*/, this.demiJourneeRepository.save(demiJourneesToSave)];
                    case 3:
                        demiJourneesSaved = _d.sent();
                        console.log(demiJourneesSaved);
                        constituersToSave = new Array();
                        reservationToSave = this.reservationRepository.create(req.body);
                        _b = reservationToSave;
                        return [4 /*yield*/, this.clientRepository.findOne(req.body.idClient)];
                    case 4:
                        _b.clientIdClient = _d.sent();
                        _c = reservationToSave;
                        return [4 /*yield*/, this.typeReservationRepository.findOne(req.body.typeReservation)];
                    case 5:
                        _c.typeReservationTypeReservation = _d.sent();
                        return [4 /*yield*/, this.reservationRepository.save(reservationToSave)];
                    case 6:
                        reservationSaved = _d.sent();
                        demiJourneesSaved.forEach(function (demiJournee) {
                            var constituer = new Constituer_1.Constituer();
                            constituer.demiJournee = demiJournee;
                            constituer.nbPersonne = Number(req.body.nbPersonne);
                            constituer.reservationIdReservation = reservationSaved;
                            constituersToSave.push(constituer);
                        });
                        return [4 /*yield*/, this.constituerRepository.save(constituersToSave)];
                    case 7:
                        _d.sent();
                        this.sendResponse(res, 200, { message: "Reservation has been created" });
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _d.sent();
                        this.passErrorToExpress(err_2, next);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    };
    ReservationController.prototype.parseDataTimeFromRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    dateEntree: req.body.dateEntree,
                    typeDemiJourneeEntree: req.body.typeDemiJourneeEntree,
                    dateSortie: req.body.dateSortie,
                    typeDemiJourneeSortie: req.body.typeDemiJourneeSortie
                };
                console.log(data);
                if (data.dateEntree == undefined || data.dateSortie == undefined || data.typeDemiJourneeEntree == undefined || data.typeDemiJourneeSortie == undefined)
                    throw new Error("Some Field Uncompleted");
                if (moment(data.dateEntree).isAfter(moment(data.dateSortie)) || (moment(data.dateEntree).isSame(moment(data.dateSortie)) && data.typeDemiJourneeEntree == 'Nuit' && data.typeDemiJourneeSortie == 'Jour'))
                    throw new Error("Invalid data at in the demi journee data");
                return [2 /*return*/, data];
            });
        });
    };
    ReservationController.prototype.createDemiJourneeInstances = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, typeDemiJournee, demiJournees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = moment(data.dateEntree);
                        typeDemiJournee = ["Jour", "Nuit"];
                        demiJournees = new Array();
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.isOnInterval(currentDate, data)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.isOnSortieAndNotEntree(currentDate, data)];
                    case 3:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.cursorOnDateSortie(demiJournees, currentDate, typeDemiJournee, data)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 5: return [4 /*yield*/, this.isOnEntreeAndSortie(currentDate, data)];
                    case 6:
                        if (!_a.sent()) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.cursorOnDateEntreeAndSortie(demiJournees, currentDate, typeDemiJournee, data)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 8: return [4 /*yield*/, this.isOnEntree(currentDate, data)];
                    case 9:
                        if (!_a.sent()) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.cursorOnDateEntree(demiJournees, currentDate, typeDemiJournee, data)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, this.cursorOnDateMilieu(demiJournees, currentDate, typeDemiJournee, data)];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        this.incrementDateOneDay(currentDate);
                        _a.label = 14;
                    case 14: return [3 /*break*/, 1];
                    case 15: return [2 /*return*/, demiJournees];
                }
            });
        });
    };
    ReservationController.prototype.isOnInterval = function (currentDate, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, currentDate.isBefore(moment(data.dateSortie).add(1, 'd'))];
            });
        });
    };
    ReservationController.prototype.isOnSortieAndNotEntree = function (currentDate, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, currentDate.isSame(moment(data.dateSortie)) && !moment(data.dateSortie).isSame(moment(data.dateEntree))];
            });
        });
    };
    ReservationController.prototype.isOnEntree = function (currentDate, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, currentDate.isSame(moment(data.dateEntree))];
            });
        });
    };
    ReservationController.prototype.isOnEntreeAndSortie = function (currentDate, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (currentDate.isSame(moment(data.dateEntree))) && (currentDate.isSame(moment(data.dateSortie)))];
            });
        });
    };
    ReservationController.prototype.cursorOnDateSortie = function (demiJournees, date, typeDemiJournee, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])];
                    case 1:
                        _a.sent();
                        if (!(data.typeDemiJourneeSortie === typeDemiJournee[0])) return [3 /*break*/, 2];
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.cursorOnDateEntreeAndSortie = function (demiJournees, date, typeDemiJournee, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeEntree)];
                    case 1:
                        _a.sent();
                        if (!(data.typeDemiJourneeEntree !== data.typeDemiJourneeSortie)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, data.typeDemiJourneeSortie)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.cursorOnDateEntree = function (demiJournees, date, typeDemiJournee, data) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = typeDemiJournee.indexOf(data.typeDemiJourneeEntree);
                        return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[index])];
                    case 1:
                        _a.sent();
                        if (!(index === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.cursorOnDateMilieu = function (demiJournees, date, typeDemiJournee, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[0])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addNewDemiJournee(demiJournees, date, typeDemiJournee[1])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.addNewDemiJournee = function (list, date, typeDemiJournee) {
        return __awaiter(this, void 0, void 0, function () {
            var demiJournee;
            return __generator(this, function (_a) {
                demiJournee = new DemiJournee_1.DemiJournee();
                demiJournee.TypeDemiJournee = typeDemiJournee;
                demiJournee.date = date.format("YYYY-MM-DD");
                list.push(demiJournee);
                return [2 /*return*/];
            });
        });
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