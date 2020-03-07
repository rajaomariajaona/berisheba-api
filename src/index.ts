import 'reflect-metadata';
import RunServer from './api/RunServer';
import {MyWebSocket} from "./websocket/ws";
import dotenv from 'dotenv'
dotenv.config()
const server = RunServer();
const WebSocket = new MyWebSocket(server);