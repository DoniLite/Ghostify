import { Request, Response } from "express";



export const billing = async (req: Request, res: Response) => {
    res.render('billing', {service: 'billing'});
}