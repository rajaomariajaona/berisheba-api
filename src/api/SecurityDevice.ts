
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export default function securityDevice(req: Request, res: Response, next: NextFunction){
    var jwtToken: string = req.headers["authorization"]
    if(jwtToken == undefined){
        res.status(401).send({
            message: "JWT token absent"
        })
        return;
    }
    try {
        jwt.verify(jwtToken.split(" ")[1], process.env.AUTHORIZATION_PASS_PHRASE)
    } catch (error) {
        res.status(401).send({
            message: error.message
        })
        return;
    }
    next()
}