import { Request, Response } from "express";



export const documentView = async (req: Request, res: Response) => {
    res.render('documentInput', {
        service: 'poster'
    });
}