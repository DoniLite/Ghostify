import { Request, Response } from 'express';
import { BodyXData } from '../@types';
import { prismaClient } from '../config/db';

export const projectPost = async (req: Request, res: Response) => {
  const {
    title,
    description,
    github,
    gitlab,
    bitbucket,
    link,
    license,
    collaboration,
    collaborationMessage,
  } = req.body as BodyXData;

  const project = await prismaClient.project.create({
    data: {
      title: title,
      description: description,
      github: github,
      gitLab: gitlab,
      bitbucket: bitbucket,
      license: license,
      link: link,
      participation: collaborationMessage,
      participationType: collaboration,
    },
  });

  if (project) {
    console.log(project);
    res.send(JSON.stringify({ success: true, project }));
  }

  res.send(JSON.stringify({ success: false, project }));
};
