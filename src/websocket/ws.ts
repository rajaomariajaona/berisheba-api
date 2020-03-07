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
                    console.log(message);
                    MyWebSocket.wss.clients.forEach((client: WebSocket) => {
                        client.send(message);
                    })
                });
                ws.on('ping', () => {
                    ws.pong(() => {
                    })
                });
                ws.on('pong', () => {
                    ws["isAlive"] = true;
                });
                ws.send('Connected');
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