"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = /** @class */ (function () {
    function default_1(server) {
        var wss = new WebSocket.Server({ server: server });
        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                wss.clients.forEach(function (client) {
                    if (client != ws)
                        client.send(message);
                });
            });
            ws.send('something');
        });
    }
    return default_1;
}());
//# sourceMappingURL=websocket.js.map