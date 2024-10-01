import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const protectedRoutes = [
  '/api/v1',
  '/api/v1/playground',
  '/api/v1/poster/save',
  '/api/notifications',
  '/api/store',
  '/api/webhooks',
  '/articlePost',
  '/projectPost',
  '/assetsPost',
];

export const veriry = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    console.log(token);
    let decoded
    if (protectedRoutes.includes(req.url)) {
        if(!token || typeof token !== 'string') {
            res.status(403).json({error: 'Access denied'});
            next();
        }
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.session.Token = decoded as string;
        } catch (e) {
            console.error(e);
        };
        next();
    }
    next();
}