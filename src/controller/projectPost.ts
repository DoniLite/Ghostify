// @ts-types="@types/express"
import { Request, Response } from 'express';
import { BodyXData } from '../@types/index.d.ts';
import { prismaClient } from '../config/db.ts';

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
  } = req.body as BodyXData<{
    title: string;
    description: string;
    github: string;
    gitlab: string;
    bitbucket: string;
    link: string;
    license: string;
    collaboration: 'Collaboration' | 'Free' | 'Subscription';
    collaborationMessage: string;
    // participationType: 'Collaborator' | 'Viewer';
  }>;

  const project = await prismaClient.project.create({
    data: {
      title: title,
      description: description,
      github: github || null,
      gitlab: gitlab || null,
      bitbucket: bitbucket || null,
      license: license,
      link: link,
      participation: collaborationMessage,
      participationType: collaboration,
    },
  });

  if (project) {
    console.log(project);
    res.send(JSON.stringify({ success: true, project }));
    return;
  }

  res.send(JSON.stringify({ success: false, project }));
};
