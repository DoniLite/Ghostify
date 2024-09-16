import { FastifyReply, FastifyRequest } from 'fastify';
import { DocumentStorage, QueryXData, Section } from '../@types';
import { decrypt, encrypt, Service } from '../utils';
import { prismaClient } from '../config/db';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { randomInt } from 'crypto';

const pump = util.promisify(pipeline);

export const poster = async (req: FastifyRequest, res: FastifyReply) => {
  const { service } = req.query as QueryXData<{ service: Service }>;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];

  try {
    if (
      typeof lastTime === 'string' &&
      Date.now() >
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      req.session.Auth.authenticated = false;
      return res.code(200).redirect('/signin?service=blog');
    }
    if (!req.session.Auth.authenticated)
      return res.code(200).redirect('/signin?service=blog');
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      cookieExpriration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.setCookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });

    return res.code(200).view('/src/views/poster.ejs', {
      id: 1,
      index: 0,
      service: service,
      auth: true,
      writterMode: true,
    });
  } catch (e) {
    console.log(e);
    return res.code(200).redirect('/signin?service=blog');
  }
};

export const requestComponent = (req: FastifyRequest, res: FastifyReply) => {
  const { section, index } = req.query as QueryXData<{
    section: string;
    index: string;
  }>;
  try {
    return res.view('/src/views/components/section.ejs', {
      idIncr: Number(section) + 1,
      id: Number(section),
      index: Number(index) + 1,
    });
  } catch (e) {
    console.log(e);
    return res.code(400).send('error happened');
  }
};

export const requestListComponent = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { section, index } = req.query as QueryXData;
  try {
    return res.view('/src/views/components/list.ejs', {
      id: Number(section),
      index: Number(index) + 1,
    });
  } catch (e) {
    console.error(e);
    return res.code(400).send('something went wrong');
  }
};

export const docSaver = async (req: FastifyRequest, res: FastifyReply) => {
  const parts = req.parts();
  let i = 0;
  let fName;
  let json: boolean | undefined;
  try {
    const post = await prismaClient.post.create({
      data: {
        title: '',
        description: '',
        visibility: 'Private',
        safe: false,
        userId:
          typeof req.session.Auth.isSuperUser !== 'undefined' &&
          req.session.Auth.isSuperUser
            ? -1
            : req.session.Auth.id,
      },
    });

    for await (const part of parts) {
      const dangerousExtension = [
        '.js',
        '.jsx',
        '.cmd',
        '.py',
        '.bash',
        '.sh',
        '.shx',
      ];
      if (dangerousExtension.includes(path.extname(part.filename)))
        return res.code(403);
      console.log(part.fields);
      const fields = part.fields as unknown as {
        data: DocumentStorage;
        json: boolean;
      };
      req.session.Storage = fields.data;
      json = fields.json;
      if (part.file) {
        const ext = path.extname(part.filename);
        const date = new Date();
        const r = randomInt(date.getTime()).toString();
        fName = `${date.getTime().toString() + r}${ext}`;
        console.log(fName);
        const xPath = path.resolve(__dirname, '../../src/public/uploads/posts');
        const uploadPath = path.join(xPath, fName);
        await pump(part.file, fs.createWriteStream(uploadPath));
        const file = await prismaClient.postFile.create({
          data: {
            filePath: `/static/uploada/posts/${fName}`,
            index: req.session.Storage.image[i].index,
            sectionId: req.session.Storage.image[i].section,
            postId: Number(post.id),
          },
        });
        console.log(file);
        i++;
      }
    }

    req.session.Storage.section.forEach(async (sec, id) => {
      const newSection = await prismaClient.postSection.create({
        data: {
          title: sec.title,
          content: sec.content,
          indedx: sec.index,
          postId: post.id,
          meta: JSON.stringify(req.session.Storage.list[`${id + 1}`]),
        },
      });
      console.log(newSection);
    });
    await prismaClient.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: req.session.Storage.title,
        description: req.session.Storage.desc_or_meta,
      },
    });
    if (typeof json === 'boolean' && json === true)
      return res.code(200).send(JSON.stringify({ success: true }));
    return res.code(200).redirect('');
  } catch (err) {
    console.log(err);
    return res.code(400).send('error');
  }
};

// export const docView = async (req: FastifyRequest, res: FastifyReply) => {
//   const { post } = req.query as QueryXData;
//   if (!post) return res.code(404).send('no post specified');

//   const article = await prismaClient.post.findUnique({
//     where: {
//       id: Number(post),
//     },
//   });

//   if (article.inMemory) {
//     let docString = `
//     # ${article.title} \n\n\n
//     `;
//     const postFiles = await prismaClient.postFile.findMany({
//       where: {
//         postId: article.id,
//       },
//     });
//     const postSections = await prismaClient.postSection.findMany({
//       where: {
//         postId: article.id,
//       },
//     });
//     postFiles.sort((a, b) => a.index - b.index);
//     postSections.sort((a, b) => a.indedx - b.indedx);
//     postSections.forEach(async (section) => {
//       docString += `
//       ## ${section.title}

//       ${section.content} \n\n\n
//       `;
//       const list: [
//         {
//           index: number;
//           items: {
//             item: string;
//             index: number;
//             section: number;
//           }[];
//         }
//       ] = typeof section.meta === 'string' ? JSON.parse(section.meta) : [];
//       [...list, ...postFiles].sort((a, b) => a.index - b.index).forEach(el => {
//         if(el.items)
//       });
//     });
//   }

//   return res.view('/src/views/page.ejs', {
//     content: article.parsedContent,
//     title: article.title,
//     service: Service.blog,
//     theme: req.session.Theme,
//     auth:
//       typeof req.session.Auth !== 'undefined' && req.session.Auth.authenticated
//         ? req.session.Auth.authenticated
//         : false,
//   });
// };

export const storage = (req: FastifyRequest, res: FastifyReply) => {
  try {
    req.session.Storage = req.body as DocumentStorage;
    return res.code(200).send(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    res.code(400).send(JSON.stringify({ success: false }));
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
  const allSections = (await prismaClient.postSection.findMany({
    where: {
      parent: post,
      postId: post.id,
    },
  })) as Section[];
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
