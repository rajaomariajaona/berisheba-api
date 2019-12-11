"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Client_1 = require("./entities/Client");
var express_1 = __importDefault(require("express"));
typeorm_1.createConnection().then(function (connection) {
    console.log(connection.getRepository(Client_1.Client));
});
var app = express_1.default();
app.get('/', function (req, res) {
    res.json({ message: "De aona ry Cyri e? ;p " });
});
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=index.js.map