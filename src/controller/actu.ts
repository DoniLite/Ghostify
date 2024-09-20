import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryXData } from 'index';
import util from 'util';
import fs, { promises as fsP } from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { randomInt } from 'crypto';
import { prismaClient } from '../config/db';

const pump = util.promisify(pipeline);

export const uploadActu = async (req: FastifyRequest, res: FastifyReply) => {
  let title;
  let content;
  let fName;
  const part = await req.file();
  const fields = part.fields as Record<string, { value?: unknown }>;
  console.log(fields);
  for (const field in fields) {
    if (field === 'title') {
      title = fields[field].value;
    } else if (field === 'content') {
      content = fields[field].value;
    } else {
      continue;
    }
  }
  console.log(title, content);
  if (typeof title !== 'string' || typeof content !== 'string')
    return res.code(404);

  const dPath = path.resolve(__dirname, '../../src/public/uploads/actues');

  if (!fs.existsSync(dPath)) await fsP.mkdir(dPath);

  // if ((!title && !content) || !content) {
  //   return res.code(500).send(JSON.stringify({ message: 'bad request' }));
  // }

  if (part.file) {
    const ext = path.extname(part.filename);
    const date = new Date();
    const r = randomInt(date.getTime()).toString();
    fName = `${date.getTime().toString() + r}${ext}`;
    console.log(fName);
    const xPath = path.resolve(__dirname, '../../src/public/uploads/actues');
    const uploadPath = path.join(xPath, fName);
    await pump(part.file, fs.createWriteStream(uploadPath));
  }

  const newComment = await prismaClient.comment.create({
    data: {
      promoted: false,
      meta: title,
      content: content,
      file: `/static/uploads/actues/${fName}`,
      isAnActu: false,
    },
  });
  const resData = await prismaClient.comment.update({
    where: {
      id: newComment.id,
    },
    data: {
      url: `/actu?ref=${newComment.id}`,
    },
  });

  return res.send(JSON.stringify({ link: resData.url }));
};

export const comment = async (req: FastifyRequest, res: FastifyReply) => {
  const { ref, root } = req.query as QueryXData<{
    ref: unknown;
    root: unknown;
  }>;

  if (root) {
    const actu = await prismaClient.comment.findUnique({
      where: {
        id: Number(ref),
      },
    });
    const connectedComments = await prismaClient.comment.findMany({
      where: {
        commentId: actu.id,
      }
    })
    if (actu) {
      const clientActu = {
        link: actu.url,
        file: actu.file ?? actu.file,
        meta: actu.meta,
        content: actu.content,
        replies: connectedComments,
        root: true,
      };
      return res.view('/src/views/components/actu.ejs', { data: clientActu });
    }
    return res.code(404).send('access denied');
  }

  if (ref && typeof ref === 'string') {
    const actu = await prismaClient.comment.findUnique({
      where: {
        id: Number(ref),
      },
    });
    const connectedComments = await prismaClient.comment.findMany({
      where: {
        commentId: actu.id,
      },
    });
    if (actu) {
      const clientActu = {
        link: actu.url,
        file: actu.file ?? actu.file,
        meta: actu.meta,
        content: actu.content,
        replies: connectedComments,
      };
      return res.view('/src/views/components/actu.ejs', { data: clientActu });
    }
    return res.code(404);
  }
};
