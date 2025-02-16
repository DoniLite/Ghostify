import { Request, Response } from 'express';
import { prismaClient } from '../config/db';

export const projects = async (req: Request, res: Response) => {
  const projects = await prismaClient.project.findMany();
  const { Theme } = req.session;

  res.render('projects', { projects, theme: Theme });
};
