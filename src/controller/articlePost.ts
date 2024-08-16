import { FastifyReply, FastifyRequest } from "fastify";
import { BodyData, BodyXData } from "../@types";
import { prismaClient } from "../config/db";
import { create } from "domain";


export const articlePost = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, slug, date, content, category, description}  = req.body as BodyXData

    console.log(title, slug, date, content, category)

    const postCategory = await prismaClient.category.findUnique({
        where: {
            title: category,
        }
    })

    if (postCategory) {
        const post = await prismaClient.post.create({
          data: {
            title: title,
            description: description,
            slug: slug,
            date: new Date(date),
            content: content,
            category: {
                connect: postCategory
            },
            safe: true,
            visites: 0,
          },
        });
        if (post) {
          console.log(post);
          return res.send(JSON.stringify({ success: true, post }));
        }
    }
    
    const post = await prismaClient.post.create({
      data: {
        title: title,
        slug: slug,
        safe: true,
        visites: 0,
        description: description,
        date: new Date(date),
        content: content,
        category: {
          create: {
            title: category,
          },
        },
      },
    });

    if (post) {
      console.log(post);
      return res.send(JSON.stringify({ success: true, post }));
    }

    return res.send(JSON.stringify({ success: false, post }));
}