"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var express_1 = __importDefault(require("express"));
var Client_1 = require("./entities/Client");
var app = express_1.default();
typeorm_1.createConnection().then(function (connection) {
    app.get("/", function (req, res) {
        var repos = connection.getRepository(Client_1.Client);
        repos.save(new Client_1.Client());
        repos.find().then(function (clients) {
            res.json({ data: clients });
        });
    });
    console.log("OK");
}).then(function () {
    app.listen(process.env.PORT || 3000);
});
//# sourceMappingURL=index.js.map