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
var typeorm_1 = require("typeorm");
var Client_1 = require("../../entities/Client");
var config_1 = require("../../config");
var Controller_1 = require("../Controller");
var ClientController = /** @class */ (function (_super) {
    __extends(ClientController, _super);
    function ClientController() {
        var _this = _super.call(this) || this;
        _this.createConnectionAndAssignRepository().then(function (_) {
            _this.addAllRoutes(_this.mainRouter);
        });
        return _this;
    }
    ClientController.prototype.createConnectionAndAssignRepository = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, typeorm_1.createConnection(config_1.ormconfig)];
                    case 1:
                        connection = _a.sent();
                        this.clientRepository = connection.getRepository(Client_1.Client);
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientController.prototype.addAllRoutes = function (router) {
        this.addGet(router);
        this.addPost(router);
        this.addDelete(router);
        this.addPut(router);
        this.addErrorHandler(router);
    };
    ClientController.prototype.addGet = function (router) {
        this.getAllClient(router);
        this.getSingleClient(router);
    };
    ClientController.prototype.getAllClient = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.get("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var clients, structuredClientData, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.fetchClientsFromDatabase()];
                            case 1:
                                clients = _a.sent();
                                structuredClientData = this.useIdClientAsKey(clients);
                                this.sendResponse(res, 200, { data: structuredClientData });
                                next();
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                this.passErrorToExpress(err_1, next);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ClientController.prototype.fetchClientsFromDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.find()];
            });
        });
    };
    ClientController.prototype.useIdClientAsKey = function (clients) {
        var obj = {};
        clients.forEach(function (client) {
            obj[client["idClient"]] = client;
        });
        return obj;
    };
    ClientController.prototype.getSingleClient = function (router) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                router.get("/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var client, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.fetchClientFromDatabase(req.params.id)];
                            case 1:
                                client = _a.sent();
                                if (this.isClientExist(client)) {
                                    this.sendResponse(res, 200, { data: client });
                                }
                                else {
                                    this.sendResponse(res, 404, { message: "Client Not Found" });
                                }
                                next();
                                return [3 /*break*/, 3];
                            case 2:
                                err_2 = _a.sent();
                                this.passErrorToExpress(err_2, next);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ClientController.prototype.fetchClientFromDatabase = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.findOne(id)];
            });
        });
    };
    ClientController.prototype.isClientExist = function (client) {
        return client !== undefined;
    };
    ClientController.prototype.addPost = function (router) {
        this.postClient(router);
    };
    ClientController.prototype.postClient = function (router) {
        var _this = this;
        router.post("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var clientToSave, clientSaved, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!this.isDeletingMode(req)) return [3 /*break*/, 2];
                        clientToSave = this.createClientFromRequest(req);
                        return [4 /*yield*/, this.saveClientToDatabase(clientToSave)];
                    case 1:
                        clientSaved = _a.sent();
                        if (this.isClientSaved(clientSaved))
                            this.sendResponse(res, 201, { message: "Client Added Successfully" });
                        else
                            this.sendResponse(res, 403, { message: "Client Not Added" });
                        _a.label = 2;
                    case 2:
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        this.passErrorToExpress(err_3, next);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ClientController.prototype.isClientSaved = function (client) {
        return client !== undefined;
    };
    ClientController.prototype.isDeletingMode = function (req) {
        return req.body.deleteList;
    };
    ClientController.prototype.createClientFromRequest = function (req) {
        return this.clientRepository.create(req.body);
    };
    ClientController.prototype.saveClientToDatabase = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.save(client)];
            });
        });
    };
    ClientController.prototype.addDelete = function (router) {
        var _this = this;
        router.post("/", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!this.isDeletingMode(req)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.removeClientInDatabase(req)];
                    case 1:
                        _a.sent();
                        res.status(201).json({ message: "deleted successfully" });
                        _a.label = 2;
                    case 2:
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        this.passErrorToExpress(err_4, next);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ClientController.prototype.removeClientInDatabase = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.delete(this.parseRemoveListFromRequest(req))];
            });
        });
    };
    ClientController.prototype.parseRemoveListFromRequest = function (req) {
        return JSON.parse(req.body.deleteList);
    };
    ClientController.prototype.addPut = function (router) {
        var _this = this;
        router.put("/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var clientToModify, clientModifiedReadyToSave, clientModified, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.fetchClientFromDatabase(req.params.id)];
                    case 1:
                        clientToModify = _a.sent();
                        if (!this.isClientExist(clientToModify)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.mergeClientFromRequest(clientToModify, req)];
                    case 2:
                        clientModifiedReadyToSave = _a.sent();
                        return [4 /*yield*/, this.updateClientInDatabase(clientModifiedReadyToSave)];
                    case 3:
                        clientModified = _a.sent();
                        if (this.isClientExist(clientModified))
                            this.sendResponse(res, 204, { message: "Client Modified Successfully" });
                        else
                            this.sendResponse(res, 403, { message: "Client Not Modified" });
                        return [3 /*break*/, 5];
                    case 4:
                        this.sendResponse(res, 404, { message: "Client Not Found" });
                        _a.label = 5;
                    case 5:
                        next();
                        return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        next(err_5);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    ClientController.prototype.mergeClientFromRequest = function (clientToModify, req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.merge(clientToModify, req.body)];
            });
        });
    };
    ClientController.prototype.updateClientInDatabase = function (clientToUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientRepository.save(clientToUpdate)];
            });
        });
    };
    return ClientController;
}(Controller_1.Controller));
exports.default = ClientController;
//# sourceMappingURL=ClientController.js.map