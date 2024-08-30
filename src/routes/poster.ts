import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryXData, Section } from '../@types';
import { decrypt, encrypt } from '../utils';
import { prismaClient } from '../config/db';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { randomInt } from 'crypto';

const pump = util.promisify(pipeline);

export const poster = async (req: FastifyRequest, res: FastifyReply) => {
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );

    return res.view('/src/views/poster.ejs', { id: 1 });
  } catch (e) {
    console.log(e);
    return res.redirect('/signin?service=blog');
  }
};

export const requestComponent = (req: FastifyRequest, res: FastifyReply) => {
  const { section } = req.query as QueryXData<{ section: number }>;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view('/src/views/components/section.ejs', {
      idIncr: Number(section) + 1,
      id: Number(section),
    });
  } catch (e) {
    console.log(e);
    return res.redirect('/signin?service=blog');
  }
};

export const requestListComponent = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { section } = req.query as QueryXData;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view('/src/views/components/list.ejs', { id: Number(section) });
  } catch (e) {
    console.error(e);
    return res.redirect('/signin?service=blog');
  }
};

interface Requester<T = unknown> {
  sections: {
    title: string;
    content: string;
    index: number;
  }[];
  files: { position: number; sectionId: number }[] & Record<string, undefined>;
  list: {
    position: number;
    sectionId: number;
    els: T[];
  }[];
}

export const requestView = async (req: FastifyRequest, res: FastifyReply) => {
  const parts = req.parts();
  let data: Requester<{ el: string; position: number }>;
  let fName;

  for await (const part of parts) {
    const dangerousExtension = [
      '.js',
      '.jsx',
      '.cmd',
      'py',
      '',
      '.bash',
      '.sh',
      '.shx',
    ];
    if (dangerousExtension.includes(path.extname(part.filename))) return res.code(403);
    const fields = part.fields as Record<string, { value?: string }>;
    console.log(fields);
    for (const field in fields) {
      if (field === 'sections') {
        data.sections = JSON.parse(fields[field].value);
      } else if (field === 'files') {
        data.files = JSON.parse(fields[field].value);
      } else if (field === 'list') {
        data.list = JSON.parse(fields[field].value);
      } else {
        continue;
      }
    }

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

    
    data.files.sort((a, b) => a.position - b.position);

    return res.send(JSON.stringify({ response: true }));
  }
};

export const loadPost = async (req: FastifyRequest, res: FastifyReply) => {
  const { postId } = req.query as QueryXData<{ postId: string }>;
  if (!postId) {
    res.status(404).send('this is not a post');
  }
  const post = await prismaClient.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  const allSections = await prismaClient.postSection.findMany({
    where: {
      parent: post,
      postId: post.id,
    },
  }) as Section[]
  const allFile = await prismaClient.postFile.findMany({
    where: {
      postId: post.id,
    },
  });
  const data = {
    sections: allSections,
    files: allFile,
    lists: [] as unknown[],
  };
  allSections.forEach((section) => {
    const d = JSON.parse(section.meta);
    if (d) {
      data.lists.push(d);
    }
  });
};
