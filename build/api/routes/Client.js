"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("../../entities/Client");
exports.default = (function (route, connection) {
    route.get("/clients", function (req, res, next) {
        connection.getRepository(Client_1.Client).find().then(function (clients) {
            res.writeHead(200);
            res.json({ data: clients });
        }).catch(function (_) {
            res.writeHead(500);
            res.json({ message: "Erreur interne" });
        });
        next();
    });
});
//# sourceMappingURL=Client.js.map