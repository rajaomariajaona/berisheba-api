import 'reflect-metadata';
import RunServer from './api/RunServer';
import {MyWebSocket} from "./websocket/ws";
const server = RunServer();
const WebSocket = new MyWebSocket(server);