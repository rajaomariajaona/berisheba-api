import WebSocket, { Server } from 'ws';

export class MyWebSocket {
    static wss: Server;
    static unique: MyWebSocket = null;
    constructor(server) {
        if (MyWebSocket.unique == null) {

            MyWebSocket.wss = new WebSocket.Server({ server });
            MyWebSocket.wss.on('connection', function connection(ws) {
                ws["isAlive"] = true;
                ws.on('message', function incoming(message) {
                    MyWebSocket.wss.clients.forEach((client: WebSocket) => {
                        if (client != ws)
                            client.send(message);
                    })
                });
                ws.on('pong', () => {
                    console.log("pong");
                    this["isAlive"] = true;
                });
                ws.send('something');
            });

            const interval = setInterval(() => {
                MyWebSocket.wss.clients.forEach((ws) => {
                    if (ws["isAlive"] === false)
                        return ws.terminate();
                    ws["isAlive"] = false;
                    ws.ping(() => { });
                })
            }, 30000);
            MyWebSocket.unique = this;
        }else{
            return MyWebSocket.unique;
        }
    }
}