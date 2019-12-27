import 'reflect-metadata';
import RunServer from './api/RunServer';


const server = RunServer();

server.get("/", (req, res,next) => {
    res.send("<h1> test </h1>")
})