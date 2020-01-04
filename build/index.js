"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var RunServer_1 = __importDefault(require("./api/RunServer"));
var ws_1 = require("./websocket/ws");
var server = RunServer_1.default();
var WebSocket = new ws_1.MyWebSocket(server);
//# sourceMappingURL=index.js.map