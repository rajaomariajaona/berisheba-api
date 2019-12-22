"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __importDefault(require("./router"));
var express_1 = __importDefault(require("express"));
module.exports = function () {
    var app = express_1.default();
    app.use("/api", router_1.default);
    app.listen(process.env.PORT || 3000);
};
//# sourceMappingURL=server.js.map