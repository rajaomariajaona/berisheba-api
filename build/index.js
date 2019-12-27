"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var RunServer_1 = __importDefault(require("./api/RunServer"));
var server = RunServer_1.default();
server.get("/", function (req, res, next) {
    res.send("<h1> test </h1>");
});
//# sourceMappingURL=index.js.map