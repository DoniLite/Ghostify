import { Request, Response } from "express";
import { prismaClient } from "../config/db";


export const apiGaming = async (req: Request, res: Response) => {
    const theme = req.session.Theme;

    const apps = await prismaClient.gameData.findMany({
      select: {
        icon: true,
        title: true,
      }
    });
    const modules = await prismaClient.apiModule.findMany();
    
    res.render('gameHome', {
      auth:
        typeof req.session.Auth !== 'undefined'
          ? req.session.Auth.authenticated
          : undefined,
      theme,
      apps,
      modules,
    });
}