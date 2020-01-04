"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var MyWebSocket = /** @class */ (function () {
    function MyWebSocket(server) {
        if (MyWebSocket.unique == null) {
            MyWebSocket.wss = new ws_1.default.Server({ server: server });
            MyWebSocket.wss.on('connection', function connection(ws) {
                var _this = this;
                ws["isAlive"] = true;
                ws.on('message', function incoming(message) {
                    MyWebSocket.wss.clients.forEach(function (client) {
                        if (client != ws)
                            client.send(message);
                    });
                });
                ws.on('pong', function () {
                    console.log("pong");
                    _this["isAlive"] = true;
                });
                ws.send('something');
            });
            var interval = setInterval(function () {
                MyWebSocket.wss.clients.forEach(function (ws) {
                    if (ws["isAlive"] === false)
                        return ws.terminate();
                    ws["isAlive"] = false;
                    ws.ping(function () { });
                });
            }, 30000);
            MyWebSocket.unique = this;
        }
        else {
            return MyWebSocket.unique;
        }
    }
    MyWebSocket.unique = null;
    return MyWebSocket;
}());
exports.MyWebSocket = MyWebSocket;
//# sourceMappingURL=ws.js.map