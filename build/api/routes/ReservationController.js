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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, typeorm_2.createConnection(config_1.ormconfig)];
                    case 1:
                        _a.connection = _b.sent();
                        this.reservationRepository = this.connection.getRepository(Reservation_1.Reservation);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.addGet = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getReservationAndDateByWeek(router)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.getReservationAndDateByWeek = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.get("/:week", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var reservations, _a, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 5, , 7]);
                                _a = this.fetchReservationsByWeekFromDatabase;
                                return [4 /*yield*/, this.parseWeekFromRequest(req)];
                            case 1: return [4 /*yield*/, _b.sent()];
                            case 2: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                            case 3:
                                reservations = _b.sent();
                                return [4 /*yield*/, this.sendResponse(res, 200, { data: reservations })];
                            case 4:
                                _b.sent();
                                return [3 /*break*/, 7];
                            case 5:
                                err_1 = _b.sent();
                                return [4 /*yield*/, this.passErrorToExpress(err_1, next)];
                            case 6:
                                _b.sent();
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.parseWeekFromRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, req.params.week];
            });
        });
    };
    ReservationController.prototype.fetchReservationsByWeekFromDatabase = function (week) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT \"Reservation\".\"idReservation\", \"Reservation\".\"nomReservation\", \"Reservation\".\"descReservation\", \"Reservation\".\"etatReservation\", \"Client\".\"nomClient\", \"Client\".\"prenomClient\", MIN(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateEntree\", MAX(CONCAT(\"date\", ' ' ,\"TypeDemiJournee\")) as \"DateSortie\" FROM \"DemiJournee\" JOIN \"Constituer\" ON \"Constituer\".\"DemiJournee_date\" = \"DemiJournee\".date AND \"Constituer\".\"DemiJournee_TypeDemiJournee\" = \"DemiJournee\".\"TypeDemiJournee\" JOIN \"Reservation\" ON \"Constituer\".\"Reservation_idReservation\" = \"Reservation\".\"idReservation\" JOIN \"Client\" ON \"Client\".\"idClient\" = \"Reservation\".\"Client_idClient\" GROUP BY \"Reservation\".\"idReservation\", \"Client\".\"idClient\" HAVING DATE_PART('week', MIN(\"date\")) <= " + week + " AND  DATE_PART('week', MAX(\"date\")) >= " + week;
                        return [4 /*yield*/, typeorm_1.getConnection().createEntityManager().query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ReservationController.prototype.addPost = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.post("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var err_2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 1, , 3]);
                                this.connection.transaction(function (entityManager) { return __awaiter(_this, void 0, void 0, function () {
                                    var demiJournees, _a, reservation, constituers;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = this.createDemiJournees;
                                                return [4 /*yield*/, this.parseDataTimeFromRequest(req)];
                                            case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                                            case 2:
                                                demiJournees = _b.sent();
                                                return [4 /*yield*/, this.createReservationFromRequestAndTransactionalEntityManager(req, entityManager)];
                                            case 3:
                                                reservation = _b.sent();
                                                return [4 /*yield*/, this.createConstituersFromRequest(demiJournees, reservation, req)];
                                            case 4:
                                                constituers = _b.sent();
                                                return [4 /*yield*/, this.saveAllInDatabase(entityManager, demiJournees, reservation, constituers)];
                                            case 5:
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })
                                    .then(function (_) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sendResponse(res, 200, { message: "Reservation has been created" })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })
                                    .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.sendResponse(res, 403, { message: "Reservation Not Created" })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [3 /*break*/, 3];
                            case 1:
                                err_2 = _a.sent();
                                return [4 /*yield*/, this.passErrorToExpress(err_2, next)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.createDemiJournees = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, typeDemiJournee, demiJournees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentDate = moment(data.dateEntree);
                        typeDemiJournee = ["Jour", "Nuit"];
                        demiJournees = new Array();
                        return [4 /*yield*/, this.addDemiJourneeToSaveInList(demiJournees, currentDate, data, typeDemiJournee)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, demiJournees];
                }
            });
        });
    };
    ReservationController.prototype.addDemiJourneeToSaveInList = function (demiJournees, currentDate, data, typeDemiJournee) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isOnInterval(currentDate, data)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.isOnSortieAndNotEntree(currentDate, data)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cursorOnDateSortie(demiJournees, currentDate, typeDemiJournee, data)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 4: return [4 /*yield*/, this.isOnEntreeAndSortie(currentDate, data)];
                    case 5:
                        if (!_a.sent()) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.cursorOnDateEntreeAndSortie(demiJournees, currentDate, typeDemiJournee, data)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 7: return [4 /*yield*/, this.isOnEntree(currentDate, data)];
                    case 8:
                        if (!_a.sent()) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.cursorOnDateEntree(demiJournees, currentDate, typeDemiJournee, data)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.cursorOnDateMilieu(demiJournees, currentDate, typeDemiJournee, data)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [4 /*yield*/, this.incrementDateOneDay(currentDate)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [3 /*break*/, 0];
                    case 15: return [2 /*return*/];
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                date.add(1, "d");
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.parseDataTimeFromRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            dateEntree: req.body.dateEntree,
                            typeDemiJourneeEntree: req.body.typeDemiJourneeEntree,
                            dateSortie: req.body.dateSortie,
                            typeDemiJourneeSortie: req.body.typeDemiJourneeSortie
                        };
                        return [4 /*yield*/, this.handleDataTimeError(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    ReservationController.prototype.handleDataTimeError = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleRequestDataTimeIncompleteError(data)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.handleRequestDataTimeIncoherentError(data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.handleRequestDataTimeIncompleteError = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (data.dateEntree == undefined || data.dateSortie == undefined || data.typeDemiJourneeEntree == undefined || data.typeDemiJourneeSortie == undefined)
                    throw new Error("Some Field Uncompleted");
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.handleRequestDataTimeIncoherentError = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (moment(data.dateEntree).isAfter(moment(data.dateSortie)) || (moment(data.dateEntree).isSame(moment(data.dateSortie)) && data.typeDemiJourneeEntree == 'Nuit' && data.typeDemiJourneeSortie == 'Jour'))
                    throw new Error("Invalid data at in the request data");
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.createReservationFromRequestAndTransactionalEntityManager = function (req, entityManager) {
        return __awaiter(this, void 0, void 0, function () {
            var reservation, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        reservation = entityManager.create(Reservation_1.Reservation, req.body);
                        _a = reservation;
                        return [4 /*yield*/, entityManager.findOneOrFail(Client_1.Client, req.body.idClient)];
                    case 1:
                        _a.clientIdClient = _c.sent();
                        _b = reservation;
                        return [4 /*yield*/, entityManager.findOneOrFail(TypeReservation_1.TypeReservation, req.body.typeReservation)];
                    case 2:
                        _b.typeReservationTypeReservation = _c.sent();
                        return [2 /*return*/, reservation];
                }
            });
        });
    };
    ReservationController.prototype.createConstituersFromRequest = function (demiJournees, reservation, req) {
        return __awaiter(this, void 0, void 0, function () {
            var constituers;
            var _this = this;
            return __generator(this, function (_a) {
                constituers = new Array();
                demiJournees.forEach(function (demiJournee) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.addConstituerToSavedList(constituers, demiJournee, reservation, req)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, constituers];
            });
        });
    };
    ReservationController.prototype.addConstituerToSavedList = function (constituers, demiJournee, reservation, req) {
        return __awaiter(this, void 0, void 0, function () {
            var constituer;
            return __generator(this, function (_a) {
                constituer = new Constituer_1.Constituer();
                constituer.demiJournee = demiJournee;
                constituer.nbPersonne = Number(req.body.nbPersonne);
                constituer.reservationIdReservation = reservation;
                constituers.push(constituer);
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.saveAllInDatabase = function (entityManager, demiJournees, reservation, constituers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, entityManager.save(DemiJournee_1.DemiJournee, demiJournees)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, entityManager.save(Reservation_1.Reservation, reservation)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, entityManager.save(Constituer_1.Constituer, constituers)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReservationController.prototype.addDelete = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.delete("/:idReservation", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, _a, _b, err_3;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 8, , 10]);
                                _b = (_a = this.reservationRepository).delete;
                                return [4 /*yield*/, this.parseIdReservationFromRequest(req)];
                            case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                            case 2:
                                result = _c.sent();
                                return [4 /*yield*/, this.isDeleted(result)];
                            case 3:
                                if (!_c.sent()) return [3 /*break*/, 5];
                                return [4 /*yield*/, this.sendResponse(res, 204, { message: "Reservation deleted successfully" })];
                            case 4:
                                _c.sent();
                                return [3 /*break*/, 7];
                            case 5: return [4 /*yield*/, this.sendResponse(res, 403, { message: "None Reservation has been deleted" })];
                            case 6:
                                _c.sent();
                                _c.label = 7;
                            case 7: return [3 /*break*/, 10];
                            case 8:
                                err_3 = _c.sent();
                                return [4 /*yield*/, this.passErrorToExpress(err_3, next)];
                            case 9:
                                _c.sent();
                                return [3 /*break*/, 10];
                            case 10: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.parseIdReservationFromRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, req.params.idReservation];
            });
        });
    };
    ReservationController.prototype.isDeleted = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, result.affected !== 0];
            });
        });
    };
    ReservationController.prototype.addPut = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.put("/idReservation", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var reservation, _a, _b, reservationMerged, err_4;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 6, , 8]);
                                _b = (_a = this.reservationRepository).findOneOrFail;
                                return [4 /*yield*/, this.parseIdReservationFromRequest(req)];
                            case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                            case 2:
                                reservation = _c.sent();
                                return [4 /*yield*/, this.mergeReservationWithRequest(reservation, req)];
                            case 3:
                                reservationMerged = _c.sent();
                                return [4 /*yield*/, this.updateReservationInDatabase(reservationMerged)];
                            case 4:
                                _c.sent();
                                return [4 /*yield*/, this.sendResponse(res, 200, { message: "Reservation Updated" })];
                            case 5:
                                _c.sent();
                                return [3 /*break*/, 8];
                            case 6:
                                err_4 = _c.sent();
                                return [4 /*yield*/, this.passErrorToExpress(err_4, next)];
                            case 7:
                                _c.sent();
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ReservationController.prototype.mergeReservationWithRequest = function (reservation, req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.reservationRepository.merge(req.body, reservation)];
            });
        });
    };
    ReservationController.prototype.updateReservationInDatabase = function (reservation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ReservationController;
}(Controller_1.Controller));
exports.default = ReservationController;
//# sourceMappingURL=ReservationController.js.map