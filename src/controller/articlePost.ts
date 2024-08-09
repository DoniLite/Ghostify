import { FastifyReply, FastifyRequest } from "fastify";
import { BodyData, BodyXData } from "index";
import { prismaClient } from "../config/db";
import { create } from "domain";


export const articlePost = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, slug, date, content, category}  = req.body as BodyXData

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
            slug: slug,
            date: new Date(date),
            content: content,
            category: {
                connect: postCategory
            },
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
            date: new Date(date),
            content: content,
            category: {
                create: {
                    title: category,
                }
            },
        }
    })

    if (post) {
      console.log(post);
      return res.send(JSON.stringify({ success: true, post }));
    }

    return res.send(JSON.stringify({ success: false, post }));
}