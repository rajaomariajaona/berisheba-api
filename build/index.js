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
    connection.manager.save(new Client_1.Client());
    app.get('/', function (req, res) {
        connection.getRepository(Client_1.Client).find().then(function (clients) {
            res.json({ data: clients });
        });
    });
});
var app = express_1.default();
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=index.js.map