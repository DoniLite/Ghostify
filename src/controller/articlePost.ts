// import { FastifyReply, FastifyRequest } from 'fastify';
import { Request, Response } from 'express';
import { BodyXData } from '../@types';
import { prismaClient } from '../config/db';

export const articlePost = async (req: Request, res: Response) => {
  const { title, slug, date, content, category, description, keys } =
    req.body as BodyXData;

  console.log(title, slug, date, content, category);

  const postCategory = await prismaClient.category.findUnique({
    where: {
      title: category,
    },
  });

  if (postCategory) {
    const post = await prismaClient.post.create({
      data: {
        title: title,
        description: description,
        slug: slug,
        content: content,
        category: {
          connect: postCategory,
        },
        safe: true,
        visites: 0,
        visibility: 'Public'
      },
    });
    if (post) {
      console.log(post);
       res.send(JSON.stringify({ success: true, post }));
    }
  }

  const post = await prismaClient.post.create({
    data: {
      title: title,
      slug: slug,
      safe: true,
      visites: 0,
      visibility: 'Public',
      description: description,
      content: content,
      category: {
        create: {
          title: category,
          keys: keys,
        },
      },
    },
  });

  if (post) {
    console.log(post);
     res.send(JSON.stringify({ success: true, post }));
  }

   res.send(JSON.stringify({ success: false, post }));
};
