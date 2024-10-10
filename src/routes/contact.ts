import { Request, Response } from "express";



export const contact = (req: Request, res: Response) => {
    const theme = req.session.Theme;

    res.render('contact', {theme});
}