// @ts-types="@types/formidable"
import { IncomingForm } from 'formidable';
// @ts-types="@types/express"
import { Request, Response } from 'express';
// import { BodyXData } from '../@types/index.d.ts';
import path from 'node:path';
import { renaming } from '../utils.ts';
import { prismaClient } from '../config/db.ts';

export const comment = async (req: Request, res: Response) => {
  const STATIC_DIR = `../../static/comments`;
  const form = new IncomingForm({
    uploadDir: path.resolve(__dirname, STATIC_DIR),
    keepExtensions: true,
    multiples: true, // Permet de gérer plusieurs fichiers
    allowEmptyFiles: true,
    minFileSize: 0,
    filter: function ({ mimetype }) {
      // keep only images
      return mimetype && mimetype.includes('image');
    },
  });
  let pointerId: number | null = null;
  let comment: string | null = null;
  let pointerType: 'user' | 'post' | 'comment' | 'article' | 'project' | null =
    null;
  let result: string | false = false;
  const [fields, files] = await form.parse(req);
  const file = files?.commentFile?.[0];
  for (const field in fields) {
    if (field === 'pointerId') {
      pointerId = Number(fields[field].toString());
    } else if (field === 'comment') {
      comment = fields[field].toString();
    } else if (field === 'pointerType') {
      pointerType = fields[field].toString() as
        | 'user'
        | 'post'
        | 'comment'
        | 'article'
        | 'project';
    }
  }

  if (!pointerId || !pointerType) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (file) {
    try {
      result = await renaming(file, path.resolve(__dirname, STATIC_DIR));
      if (result === false) {
        res.status(400).json({ message: 'Error while renaming CV file' });
        return;
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error while processing CV file' });
      return;
    }
  }

  switch (pointerType) {
    case 'user': {
      const user = await prismaClient.user.update({
        where: {
          id: pointerId,
        },
        data: {
          Comment: {
            create: {
              content: comment,
              file: (result as string) || null,
              isAnActu: true,
              isForumPost: true,
              author:
                req.session!.Auth!.username || req.session!.Auth!.fullname,
            },
          },
        },
        select: {
          Comment: true,
        },
      });
      res.status(200).json({ success: true, user });
      break;
    }

    case 'post': {
      const post = await prismaClient.post.update({
        where: {
          id: pointerId,
        },
        data: {
          Comment: {
            create: {
              content: comment,
              file: (result as string) || null,
              author:
                req.session!.Auth!.username || req.session!.Auth!.fullname,
              userId: req.session!.Auth!.id,
            },
          },
        },
        select: {
          Comment: true,
        },
      });
      res.status(200).json({ success: true, post });
      break;
    }
    case 'comment': {
      const reply = await prismaClient.comment.update({
        where: {
          id: pointerId,
        },
        data: {
          comments: {
            create: {
              content: comment,
              file: (result as string) || null,
              author:
                req.session!.Auth!.username || req.session!.Auth!.fullname,
              userId: req.session!.Auth!.id,
            },
          },
        },
        select: {
          comments: true,
        },
      });
      res.status(200).json({ success: true, reply });
      break;
    }
    case 'article': {
      const article = await prismaClient.post.update({
        where: {
          id: pointerId,
        },
        data: {
          Comment: {
            create: {
              content: comment,
              file: (result as string) || null,
              author: req.session!.Auth!.username || req.session!.Auth!.fullname,
              userId: req.session!.Auth!.id,
            },
          },
        },
        select: {
          Comment: true,
        },
      });
      res.status(200).json({ success: true, article });
      break;
    }
    case 'project': {
      const project = await prismaClient.project.update({
        where: {
          id: pointerId,
        },
        data: {
          comments: {
            create: {
              content: comment,
              file: (result as string) || null,
              author: req.session!.Auth!.username || req.session!.Auth!.fullname,
              userId: req.session!.Auth!.id,
            },
          },
        },
        select: {
          comments: true,
        },
      });
      res.status(200).json({ success: true, project });
      break;
    }
    default:
      res.status(400).json({ message: 'Invalid pointer type' });
      return;
  }
};
