"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routerApi_1 = __importDefault(require("./routerApi"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
exports.default = (function () {
    var app = express_1.default();
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use("/api", routerApi_1.default);
    app.listen(process.env.PORT || 3000);
    return app;
});
//# sourceMappingURL=RunServer.js.map