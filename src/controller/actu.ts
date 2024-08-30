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

  const newActu = await prismaClient.actu.create({
    data: {
      promoted: false,
      meta: title,
      content: content,
      ip: req.ip,
      file: `/static/uploads/actues/${fName}`,
    },
  });
  const resData = await prismaClient.actu.update({
    where: {
      id: newActu.id,
    },
    data: {
      rawLink: `/actu?ref=${newActu.id}`,
      url: `/actu?root=${newActu.ip}`,
    },
  });

  return res.send(JSON.stringify({link: resData.rawLink}));
};


export const actu = async (req: FastifyRequest, res: FastifyReply) => {
  const {ref, root} = req.query as QueryXData<{ref: unknown; root: unknown}>;

  if (root && typeof root === 'string') {
    const actu = await prismaClient.actu.findUnique({
      where: {
        id: Number(ref),
      },
    });
    if (actu) {
      const clientActu = {
        link: actu.rawLink,
        file: actu.file ?? actu.file,
        meta: actu.meta,
        content: actu.content,
        root: true,
      };
      if (actu.ip === req.ip) {
        return res.view('/src/views/components/actu.ejs', { data: clientActu });
      }
      return res.code(500);
    }
    return res.code(404);
  }

  if(ref && typeof ref === 'string') {
    const actu = await prismaClient.actu.findUnique({
      where: {
        id: Number(ref)
      }
    });
    if(actu) {
      const clientActu = {
        link: actu.rawLink,
        file: actu.file ?? actu.file,
        meta: actu.meta,
        content: actu.content,
      }
      if(actu.ip === req.ip) {
        return res.redirect(`/actu?root=${actu.ip}&ref=${actu.id}`);
      }
      return res.view('/src/views/components/actu.ejs', {data: clientActu});
    }
    return res.code(404);
  }
}