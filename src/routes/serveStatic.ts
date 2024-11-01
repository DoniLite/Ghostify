import { Request, Response } from "express"
import jwt from 'jsonwebtoken';
import path from "node:path";



export const serveStatic = (req: Request, res: Response) => {
    const {tokenPath} = req.params
    const resourceDir = path.resolve(__dirname, '../../static');
    try {
        const rPath = jwt.verify(tokenPath, process.env.JWT_SECRET);
        if(typeof rPath === 'string') {
            const resourcePath = path.join(resourceDir, rPath);
            res.status(200).sendFile(resourcePath);
            return;
        }
        res.status(404).send('Invalid credentials');
        return;
    } catch (err) {
        console.error(err);
        res.status(404).send('cannot access to this resource');
    }
}