import { FastifyReply, FastifyRequest } from 'fastify';
import {
  DocDataUnion,
  DocumentStorage,
  List,
  PostFile,
  QueryXData,
  Section,
} from '../@types';
import { decrypt, encrypt, Service, unify } from '../utils';
import { prismaClient } from '../config/db';
// import util from 'util';
// import fs from 'fs';
// import path from 'path';
// import { pipeline } from 'stream';
// import { randomInt } from 'crypto';
// import { IncomingForm, File as FormidableFile } from 'formidable';

// const pump = util.promisify(pipeline);

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
      req.session.Auth = {
        authenticated: false,
      };
      return res.redirect('/signin?service=blog');
    }
    if (!req.session.Auth) return res.redirect('/signin?service=blog');
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

    return res.view('/src/views/poster.ejs', {
      id: 1,
      index: 0,
      service: service,
      auth: true,
      writterMode: true,
    });
  } catch (e) {
    console.log(e);
    return res.redirect('/signin?service=blog');
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
  console.log(req, res);
  // console.log('Starting docSaver');
  // const form = new IncomingForm({
  //   uploadDir: path.resolve(__dirname, '../../src/public/uploads/posts'),
  //   keepExtensions: true,
  //   multiples: true, // Permet de gérer plusieurs fichiers
  // });
  // let json: boolean | undefined;
  // let i = 0;
  // Crée un post vide au début
  // const post = req.session.Auth.isSuperUser
  //   ? await prismaClient.post.create({
  //       data: {
  //         title: '',
  //         description: '',
  //         visibility: 'Private',
  //         safe: false,
  //       },
  //     })
  //   : await prismaClient.post.create({
  //       data: {
  //         title: '',
  //         description: '',
  //         visibility: 'Private',
  //         safe: false,
  //         userId: req.session.Auth.id,
  //       },
  //     });
  // form.parse(req.raw, async (err, fields, files) => {
  //   if (err) {
  //     console.error('Error parsing form:', err);
  //     return res.code(400).send('Error parsing form');
  //   }
  //   console.log('Fields:', fields);
  //   console.log('Files:', files);
  //   try {
  //     req.session.Storage = JSON.parse(
  //       fields.data as string
  //     ) as DocumentStorage;
  //     json = Boolean(fields.json);
  //   } catch (parseError) {
  //     console.error('Error parsing fields data:', parseError);
  //     return res.code(400).send('Invalid form data');
  //   }
  //   const dangerousExtension = [
  //     '.js',
  //     '.jsx',
  //     '.cmd',
  //     '.py',
  //     '.bash',
  //     '.sh',
  //     '.shx',
  //   ];
  // Traiter les fichiers multiples
  //   const fileArray: FormidableFile[] = Array.isArray(files.file)
  //     ? files.file
  //     : [files.file];
  //   for (const file of fileArray) {
  //     const ext = path.extname(file.originalFilename!);
  // Vérifier les extensions dangereuses
  //     if (dangerousExtension.includes(ext)) {
  //       console.log('Inappropriate file detected');
  //       return res.code(403).send('You want to send inappropriate content');
  //     }
  // Générer un nom de fichier unique
  //     const date = new Date();
  //     const r = randomInt(date.getTime()).toString();
  //     const fName = `${date.getTime().toString() + r}${ext}`;
  //     const uploadPath = path.join(form.uploadDir, fName);
  // Déplacer le fichier téléchargé
  //     fs.rename(file.filepath, uploadPath, async (renameErr) => {
  //       if (renameErr) {
  //         console.error('Error moving file:', renameErr);
  //         return res.code(500).send('File upload error');
  //       }
  //       console.log('File uploaded:', fName);
  // Sauvegarder le fichier dans la base de données
  //       await prismaClient.postFile.create({
  //         data: {
  //           filePath: `/static/uploads/posts/${fName}`,
  //           index: Number(req.session.Storage.image[i].index),
  //           sectionId: Number(req.session.Storage.image[i].section),
  //           postId: post.id,
  //         },
  //       });
  //       i++;
  //     });
  //   }
  // Traiter les sections après les fichiers
  //   for (let id = 0; id < req.session.Storage.section.length; id++) {
  //     const sec = req.session.Storage.section[id];
  //     const newSection = await prismaClient.postSection.create({
  //       data: {
  //         title: sec.title,
  //         content: sec.content,
  //         indedx: sec.index,
  //         postId: post.id,
  //         meta: JSON.stringify(req.session.Storage.list[`${id + 1}`]),
  //       },
  //     });
  //     console.log('Section created:', newSection);
  //   }
  // Mise à jour du post avec les données du formulaire
  //   await prismaClient.post.update({
  //     where: { id: post.id },
  //     data: {
  //       title: req.session.Storage.title,
  //       description: req.session.Storage.desc_or_meta,
  //     },
  //   });
  // Répondre avec JSON ou redirection en fonction de la demande
  //   if (json === true) {
  //     return res.send(JSON.stringify({ success: true, article: post.id }));
  //   }
  //   return res.redirect(`/poster/view?post=${post.id}`);
  // });
};

export const docView = async (req: FastifyRequest, res: FastifyReply) => {
  const { post } = req.query as QueryXData;
  if (!post) return res.code(404).send('no post specified');

  const article = await prismaClient.post.findUnique({
    where: {
      id: Number(post),
    },
  });

  if (article.inMemory) {
    let docString = `
    # ${article.title} \n\n\n
    `;
    const postFiles = await prismaClient.postFile.findMany({
      where: {
        postId: article.id,
      },
    });
    const postSections = await prismaClient.postSection.findMany({
      where: {
        postId: article.id,
      },
    });
    postFiles.sort((a, b) => a.index - b.index);
    postSections.sort((a, b) => a.indedx - b.indedx);
    postSections.forEach(async (section) => {
      docString += `
      ## ${section.title}

      ${section.content} \n\n\n
      `;
      const list: [
        {
          index: number;
          items: {
            item: string;
            index: number;
            section: number;
          }[];
        }
      ] = typeof section.meta === 'string' ? JSON.parse(section.meta) : [];
      const docAssetsData = [
        ...list,
        ...postFiles.filter((file) => file.sectionId === section.indedx),
      ] as DocDataUnion[];
      docAssetsData
        .sort((a, b) => a.index - b.index)
        .forEach((el) => {
          let element;
          if (Object.keys(el).includes('items')) {
            element = el as List;
            element.items
              .sort((a, b) => a.index - b.index)
              .forEach((el) => {
                docString += `
            - ${el.item} \n\n\n
            `;
              });
          }
          element = el as PostFile;
          docString += `
          ![image](${element.filePath}) \n\n\n
          `;
        });
    });
    const unifyingText = await unify(docString);
    const updatedContent = await prismaClient.post.update({
      where: {
        id: article.id,
      },
      data: {
        parsedContent: unifyingText,
      },
    });
    return res.view('/src/views/page.ejs', {
      content: updatedContent.parsedContent,
      title: updatedContent.title,
      service: Service.blog,
      theme: req.session.Theme,
      auth:
        typeof req.session.Auth !== 'undefined' &&
        req.session.Auth.authenticated
          ? req.session.Auth.authenticated
          : false,
    });
  }

  return res.view('/src/views/page.ejs', {
    content: article.parsedContent,
    title: article.title,
    service: Service.blog,
    theme: req.session.Theme,
    auth:
      typeof req.session.Auth !== 'undefined' && req.session.Auth.authenticated
        ? req.session.Auth.authenticated
        : false,
  });
};

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
