"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var typeorm_1 = require("typeorm");
var Client_1 = require("../../entities/Client");
var config_1 = require("../../config");
var clientRoute = express_1.Router();
typeorm_1.createConnection(config_1.ormconfig).then(function (connection) {
    var clientRepository = connection.getRepository(Client_1.Client);
    clientRoute.get("/", function (req, res, next) {
        clientRepository.find().then(function (clients) {
            res.status(200).json({ data: clients });
            next();
        });
    });
    clientRoute.get("/:id", function (req, res, next) {
        clientRepository.findOne(req.params.id).then(function (client) {
            if (client)
                res.status(200).json({ data: client });
            else
                res.status(404).json({ message: "Not found" });
            next();
        });
    });
    clientRoute.delete("/:id", function (req, res, next) {
        clientRepository.delete(req.params.id).then(function (result) {
            if (result.affected)
                res.status(204).json({ message: "deleted successfully" });
            else
                res.status(404).json({ message: "Not found" });
            next();
        });
    });
    clientRoute.post("/", function (req, res, next) {
        if (req.body.deleteList) {
            clientRepository.delete(JSON.parse(req.body.deleteList)).then(function () {
                res.status(201).json({ message: "deleted successfully" });
            }).catch(function (error) {
                return res.status(400).json({ message: "Not found", error: error });
            });
        }
        else {
            var c = clientRepository.create(req.body);
            clientRepository.save(c).then(function (client) {
                if (client)
                    res.status(201).json({ message: "added successfully" });
                else
                    res.status(400).json({ message: "Not found" });
            });
        }
    });
    clientRoute.put("/:id", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clientRepository.findOne(req.params.id)];
                case 1:
                    c = _a.sent();
                    clientRepository.merge(c, req.body);
                    clientRepository.save(c).then(function (client) {
                        if (client)
                            res.status(201).json({ message: "modified successfully" });
                        else
                            res.status(400).json({ message: "Not found" });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}).catch(function (error) {
    console.log(error);
});
exports.default = clientRoute;
//# sourceMappingURL=ClientController.js.map