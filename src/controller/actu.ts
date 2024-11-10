import { QueryXData } from 'index';
// import util from 'util';
import fs, { promises as fsP } from 'fs';
import path from 'node:path';
// import { pipeline } from 'stream';
import { randomInt } from 'crypto';
import { prismaClient } from '../config/db';
import { Request, Response } from 'express';
import { IncomingForm } from 'formidable';
import { tokenGenerator } from '../server';
import { verifyJWT } from '../utils';

// const pump = util.promisify(pipeline);

export const uploadActu = async (req: Request, res: Response) => {
  const STATIC_DIR = `../../static/actues`;
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
  const [fields, files] = await form.parse(req);
  let title;
  let content;
  let fName;
  console.log(fields);
  for (const field in fields) {
    if (field === 'title') {
      title = fields[field].toString();
    } else if (field === 'content') {
      content = fields[field].toString();
    } else {
      continue;
    }
  }
  console.log(title, content);
  const file = files?.file?.[0];
  if (typeof title !== 'string' || typeof content !== 'string') {
    res.status(404).json({ message: 'bad data type provided' });
    return;
  }

  const dPath = path.resolve(__dirname, STATIC_DIR);

  if (!fs.existsSync(dPath)) await fsP.mkdir(dPath);

  // if ((!title && !content) || !content) {
  //   return res.code(500).send(JSON.stringify({ message: 'bad request' }));
  // }

  if (file) {
    const ext = path.extname(file.originalFilename);
    const date = new Date();
    const r = randomInt(date.getTime()).toString();
    fName = `${date.getTime().toString() + r}${ext}`;
    console.log(fName);
    const xPath = path.resolve(__dirname, STATIC_DIR);
    const uploadPath = path.join(xPath, fName);
    try {
      fs.renameSync(file.filepath, uploadPath);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "file have 'nt be saved properly" });
      return;
    }
  }

  const fileXServicePath =
    process.env.NODE_ENV !== 'production'
      ? 'https://ghostify.site/staticFile/' + tokenGenerator(`actues/${fName}`)
      : 'http://localhost:3085/staticFile/' + tokenGenerator(`actues/${fName}`);

  const newComment = await prismaClient.comment.create({
    data: {
      promoted: false,
      meta: title,
      content: content,
      file:
        typeof fName === 'undefined' ? null : fileXServicePath,
      isAnActu: true,
      userId: req.session.Auth.id || null,
      author: req.session.Auth.username || req.session.Auth.fullname,
    },
  });
  const resData = await prismaClient.comment.update({
    where: {
      id: newComment.id,
    },
    data: {
      url: `/actu?ref=${tokenGenerator(String(newComment.id))}`,
    },
  });

  res.send(JSON.stringify({ link: resData.url }));
  return;
};

export const comment = async (req: Request, res: Response) => {
  const { ref, root } = req.query as QueryXData<{
    ref: unknown;
    root: unknown;
  }>;

  if (root && ref && typeof ref === 'string') {
    const actu = await prismaClient.comment.findUnique({
      where: {
        id: Number(verifyJWT(ref)),
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
        root: true,
      };
      res.render('components/actu', { data: clientActu });
    }
    res.status(404).send('access denied');
  }

  if (ref && typeof ref === 'string') {
    const actu = await prismaClient.comment.findUnique({
      where: {
        id: Number(verifyJWT(ref)),
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
      res.render('components/actu', { data: clientActu });
    }
    res.status(404).send('not available');
  }
};
