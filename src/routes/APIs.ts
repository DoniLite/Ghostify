import { Request, Response } from "express";


export const apiGaming = async (req: Request, res: Response) => {
    const theme = req.session.Theme;
    
    res.render('gameHome', {
      auth:
        typeof req.session.Auth !== 'undefined'
          ? req.session.Auth.authenticated
          : undefined,
      theme,
    });
}