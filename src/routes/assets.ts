import { FastifyReply, FastifyRequest } from "fastify";
import { prismaClient } from "../config/db";

export const terms = async (req: FastifyRequest, res: FastifyReply) => {
    const asset = await prismaClient.assets.findUnique({
        where: {
            type: 'Page',
            uid: 'terms'
        }
    });
    if(!asset) 
        return res
          .code(404)
          .send(JSON.stringify({ message: 'No asset found' }));
    return res.view('/src/views/page.ejs', {
      content: asset.content,
      title: asset.title,
      service: undefined,
      theme: req.session.Theme,
      auth: false,
    });
};

export const license = async (req: FastifyRequest, res: FastifyReply) => {
    const asset = await prismaClient.assets.findUnique({
      where: {
        type: 'Page',
        uid: 'license',
      },
    });
    if (!asset)
      return res.code(404).send(JSON.stringify({ message: 'No asset found' }));
    return res.view('/src/views/page.ejs', {
      content: asset.content,
      title: asset.title,
      service: undefined,
      theme: req.session.Theme,
      auth: false,
    });
};

export const about = async (req: FastifyRequest, res: FastifyReply) => {
    const asset = await prismaClient.assets.findUnique({
      where: {
        type: 'Page',
        uid: 'about',
      },
    });
    if (!asset)
      return res.code(404).send(JSON.stringify({ message: 'No asset found' }));
    return res.view('/src/views/page.ejs', {
      content: asset.content,
      title: asset.title,
      service: undefined,
      theme: req.session.Theme,
      auth: false,
    });
};

export const policy = async (req: FastifyRequest, res: FastifyReply) => {
    const asset = await prismaClient.assets.findUnique({
      where: {
        type: 'Page',
        uid: 'policy',
      },
    });
    if (!asset)
      return res.code(404).send(JSON.stringify({ message: 'No asset found' }));
    return res.view('/src/views/page.ejs', {
      content: asset.content,
      title: asset.title,
      service: undefined,
      theme: req.session.Theme,
      auth: false,
    });
};

export const conditions = async (req: FastifyRequest, res: FastifyReply) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'conditions',
    },
  });
  if (!asset)
    return res.code(404).send(JSON.stringify({ message: 'No asset found' }));
  return res.view('/src/views/page.ejs', {
    content: asset.content,
    title: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
  });
};

export const FAQ = async (req: FastifyRequest, res: FastifyReply) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'FAQ',
    },
  });
  if (!asset)
    return res.code(404).send(JSON.stringify({ message: 'No asset found' }));
  return res.view('/src/views/page.ejs', {
    content: asset.content,
    title: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
  });
};