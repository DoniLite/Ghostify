import {
  DocDataUnion,
  DocumentStorage,
  List,
  PostFile,
  QueryXData,
  Section,
} from '../@types';
import {
  decrypt,
  DocumentMimeTypes,
  encrypt,
  Service,
  unify,
  renaming,
  purgeSingleFIle,
  verifySecurity,
  loadSecurityBearer,
} from '../utils';
import { prismaClient } from '../config/db';
// import util from 'util';
import fs from 'fs';
import path from 'path';
// import { pipeline } from 'stream';
import { randomInt } from 'node:crypto';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { Request, Response } from 'express';
import { tokenGenerator } from '../server';

// const pump = util.promisify(pipeline);

export const poster = async (req: Request, res: Response) => {
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
      res.redirect('/signin?service=blog');
      return;
    }
    if (!req.session.Auth || req.session.Auth.authenticated === false) {
      res.redirect('/signin?service=blog');
      return;
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      cookieExpriration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });

    res.render('poster', {
      id: 1,
      index: 0,
      service: service,
      auth: true,
      writterMode: true,
      data: req.session.Auth.isSuperUser
        ? { ...req.session.SuperUser }
        : { id: req.session.Auth.id },
    });
  } catch (e) {
    console.log(e);
    res.redirect('/signin?service=blog');
  }
};

export const updateDocView = async (req: Request, res: Response) => {
  const { post } = req.params;
  const postData = await prismaClient.post.findUnique({
    where: {
      uid: post,
    },
  });
  if (!postData) {
    res.status(404).redirect('/404');
    return;
  }

  res.render('poster', {
    id: 1,
    service: 'poster',
    auth: true,
    writterMode: true,
    data: req.session.Auth.isSuperUser
      ? { ...req.session.SuperUser }
      : { id: req.session.Auth.id },
  });
};

export const requestComponent = (req: Request, res: Response) => {
  const { section, index, title, content } = req.query as QueryXData<{
    section: string;
    index: string;
    title: string;
    content: string;
  }>;
  try {
    res.render('components/section', {
      idIncr: Number(section) + 1,
      id: Number(section),
      index: typeof index === 'string' ? Number(index) + 1 : null,
      title,
      content,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send('error happened');
  }
};

export const requestListComponent = async (req: Request, res: Response) => {
  const { section, index, data } = req.query as QueryXData<{
    section: string;
    index: string;
    data: string;
  }>;
  const decodedData = decodeURIComponent(data);
  const rawData = JSON.parse(decodedData);
  try {
    res.render('components/list', {
      id: Number(section),
      index: Number(index) + 1,
      data: rawData,
    });
  } catch (e) {
    console.error(e);
    res.status(400).send('something went wrong');
  }
};

export const docSaver = async (req: Request, res: Response) => {
  console.log('Starting docSaver');
  const STATIC_DIR = '../../static/posts';
  const date = new Date();
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
  let json: boolean | undefined;
  const uid = tokenGenerator((date.getTime() + randomInt(10000)).toString());
  // Crée un post vide au début
  const post = req.session.Auth.isSuperUser
    ? await prismaClient.post.create({
        data: {
          title: '',
          description: '',
          uid,
          visibility: 'Private',
          safe: false,
        },
      })
    : await prismaClient.post.create({
        data: {
          title: '',
          uid,
          description: '',
          visibility: 'Private',
          safe: false,
          userId: req.session.Auth.id,
        },
      });
  const [fields, files] = await form.parse(req);

  console.log('Fields:', fields);
  console.log('Files:', files);
  try {
    req.session.Storage = JSON.parse(fields.data.toString()) as DocumentStorage;
    json = Boolean(fields.json[0]);
    console.log(req.session.Storage, json);
  } catch (parseError) {
    console.error('Error parsing fields data:', parseError);
    res.status(400).send('Invalid form data');
    return;
  }
  const dangerousExtension = [
    '.js',
    '.jsx',
    '.cmd',
    '.py',
    '.bash',
    '.sh',
    '.shx',
  ];
  // Traiter les fichiers multiples
  const fileArray: FormidableFile[] = Array.isArray(files.file)
    ? files.file
    : [files.file];
  console.log(fileArray);
  if (fileArray.length > 0 && typeof fileArray[0] !== 'undefined') {
    for (let i = 0; i < fileArray.length; i++) {
      const ext = path.extname(fileArray[i].originalFilename);
      // Vérifier les extensions dangereuses
      if (dangerousExtension.includes(ext)) {
        console.log('Inappropriate file detected');
        purgeSingleFIle(fileArray[i].filepath);
        res.status(403).send('You want to send inappropriate content');
        return;
      }
      if (ext === '') continue;
      // Générer un nom de fichier unique
      const date = new Date();
      const r = randomInt(date.getTime()).toString();
      const fName = `${date.getTime().toString() + r}${ext}`;
      const uploadPath = path.join(path.resolve(__dirname, STATIC_DIR), fName);
      // Déplacer le fichier téléchargé
      fs.rename(fileArray[i].filepath, uploadPath, async (renameErr) => {
        if (renameErr) {
          console.error('Error moving file:', renameErr);
          res.status(500).send('File upload error');
          return;
        }
        console.log('File uploaded:', fName);
        const fileXPathService =
          process.env.NODE_ENV === 'production'
            ? `https://ghostify.site/staticFile/` +
              tokenGenerator(`posts/${fName}`)
            : `http://localhost:3085/staticFile/` +
              tokenGenerator(`posts/${fName}`);
        // Sauvegarder le fichier dans la base de données
        const nFile = await prismaClient.postFile.create({
          data: {
            filePath: fileXPathService,
            index: Number(req.session.Storage.image[i].index),
            sectionId: Number(req.session.Storage.image[i].section),
            postId: post.id,
          },
        });
        console.log('file post created:', nFile);
        console.log(i);
      });
    }
  }
  // Traiter les sections après les fichiers
  for (let id = 0; id < req.session.Storage.section.length; id++) {
    const sec = req.session.Storage.section[id];
    const newSection = await prismaClient.postSection.create({
      data: {
        title: sec.title,
        content: sec.content,
        index: sec.index,
        postId: post.id,
        meta: JSON.stringify(req.session.Storage.list[`${id + 1}`]),
      },
    });
    console.log('Section created:', newSection);
  }
  // Mise à jour du post avec les données du formulaire
  const up = await prismaClient.post.update({
    where: { id: post.id },
    data: {
      title: req.session.Storage.title,
      description: req.session.Storage.desc_or_meta,
      userId:
        req.session.Auth.id && typeof req.session.Auth.id === 'number'
          ? req.session.Auth.id
          : null,
    },
  });
  console.log('updated content final:', up);
  console.log(json);
  if (json === true) {
    res.send(JSON.stringify({ success: true, article: post.uid }));
    return;
  }
  res.redirect(`/poster/view?post=${post.uid}`);
};

export const docView = async (req: Request, res: Response) => {
  const { post, api } = req.query as QueryXData<{ post: string; api: string }>;
  if (!post) res.status(404).send('no post specified');

  const article = await prismaClient.post.findUnique({
    where: {
      uid: post,
    },
  });

  if (article.inMemory) {
    let docString = `# ${article.title} \n`;
    const postFiles = await prismaClient.postFile.findMany({
      where: {
        postId: article.id,
      },
    });
    console.log(postFiles);
    const postSections = await prismaClient.postSection.findMany({
      where: {
        postId: article.id,
      },
    });
    postFiles.sort((a, b) => a.index - b.index);
    postSections.sort((a, b) => a.index - b.index);
    postSections.forEach(async (section) => {
      docString += `## ${section.title} \n${section.content} \n`;
      const list: [
        {
          index: number;
          items: {
            item: string;
            description: string;
            index: number;
            section: number;
          }[];
        }
      ] = typeof section.meta === 'string' ? JSON.parse(section.meta) : [];
      const docAssetsData = [
        ...list,
        ...postFiles.filter((file) => file.sectionId === section.index),
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
                docString += `- ${el.item} \n${
                  typeof el.description !== 'undefined'
                    ? '\n' + el.description + '\n'
                    : ''
                }`;
              });
          } else {
            element = el as PostFile;
            docString += `![image](${element.filePath}) \n`;
          }
        });
    });
    console.log(docString);
    const unifyingText = await unify(docString);
    const updatedContent = await prismaClient.post.update({
      where: {
        id: article.id,
      },
      data: {
        parsedContent: unifyingText,
        content: docString,
      },
    });
    console.log(unifyingText);
    if (Boolean(api) === true) {
      res.send(
        JSON.stringify({
          ...updatedContent,
          visites: updatedContent.visites.toString(),
        })
      );
    }
    res.render('page', {
      id: updatedContent.id,
      content: updatedContent.parsedContent,
      title: updatedContent.title,
      service: Service.poster,
      theme: req.session.Theme,
      auth:
        typeof req.session.Auth !== 'undefined' &&
        req.session.Auth.authenticated
          ? req.session.Auth.authenticated
          : false,
      data: req.session.Auth.isSuperUser
        ? { ...req.session.SuperUser }
        : { id: req.session.Auth.id },
      description: updatedContent.description,
    });
    return;
  }

  res.render('page', {
    id: article.id,
    content: article.parsedContent,
    title: article.title,
    desc: article.description,
    service: Service.poster,
    theme: req.session.Theme,
    auth:
      typeof req.session.Auth !== 'undefined' && req.session.Auth.authenticated
        ? req.session.Auth.authenticated
        : false,
    data: req.session.Auth.isSuperUser
      ? { ...req.session.SuperUser }
      : { id: req.session.Auth.id },
  });
};

export const storage = (req: Request, res: Response) => {
  try {
    req.session.Storage = req.body as DocumentStorage;
    res.status(200).send(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    res.status(400).send(JSON.stringify({ success: false }));
  }
};

export const loadPost = async (req: Request, res: Response) => {
  const { uid } = req.params;
  if (!uid) {
    res.status(404).send('this is not a post');
    return;
  }
  const post = await prismaClient.post.findUnique({
    where: {
      uid,
    },
  });
  const allSections = await prismaClient.postSection.findMany({
    where: {
      postId: post.id,
    },
    select: {
      index: true,
      title: true,
      meta: true,
      header: true,
      content: true,
    },
  });
  const allFile = await prismaClient.postFile.findMany({
    where: {
      postId: post.id,
    },
    select: {
      description: true,
      postId: true,
      index: true,
      filePath: true,
      sectionId: true,
    },
  });
  const data = {
    sections: allSections,
    files: allFile,
    lists: {} as DocumentStorage['list'],
  };
  allSections.forEach((section) => {
    const d = JSON.parse(section.meta) as [
      {
        index: number;
        items: {
          item: string;
          description: string;
          index: number;
          section: number;
        }[];
      }
    ];
    if (d) {
      data.lists[section.index] = d;
    }
  });
  data.sections.sort((a, b) => a.index - b.index);
  data.files.sort((a, b) => a.index - b.index);
  res.status(200).json(data);
};

export const conversionView = async (req: Request, res: Response) => {
  res.render('documentInput', { service: 'poster' });
};

export const parserController = async (req: Request, res: Response) => {
  if (!req.session.Auth.authenticated) {
    if (req.headers['x-api-token']) {
      res.status(401).json({ message: 'authentication required' });
      return;
    }
    req.session.RedirectUrl = '/poster/parser';
    res.status(401).redirect('/signin/?service=poster');
    return;
  }
  const STATIC_DIR = path.resolve(path.join(__dirname, '../../static/test'));
  const mimeTypesArray = Object.values(DocumentMimeTypes);
  const form = new IncomingForm({
    uploadDir: path.resolve(__dirname, STATIC_DIR),
    keepExtensions: true,
    multiples: true, // Permet de gérer plusieurs fichiers
    allowEmptyFiles: true,
    minFileSize: 0,
    filter: function ({ mimetype }) {
      // keep only images
      return mimetype && mimeTypesArray.includes(mimetype as DocumentMimeTypes);
    },
  });

  const [fields, files] = await form.parse(req);
  let out: string;
  for (const field in fields) {
    if (field === 'outputFormat') {
      out = fields[field].toString();
    }
    continue;
  }
  const file = files?.file?.[0];
  const result = await renaming(file, STATIC_DIR);
  if (!result) {
    res.status(500).send('Something went wrong please try later');
    purgeSingleFIle(file.filepath);
    return;
  }

  const isSecure = await verifySecurity();

  if (!isSecure) {
    res.status(500).send('Something went wrong please try later');
    return;
  }

  const security = await loadSecurityBearer();
  const API_URL = '/api/v1/parser/';
  const API_PORT = process.env.NODE_ENV === 'production' ? 8080 : 8000;
  const apiRes = await fetch(
    `http://localhost:${API_PORT}:${API_URL}${result}/?out=${out}`,
    {
      headers: {
        Authorization: `Bearer ${security.hash}`,
      },
    }
  );
  if (!apiRes.ok) {
    res.status(500).send('Something went wrong please try later');
    return;
  }

  const json = (await apiRes.json()) as { success: boolean; path: string };
  const date = new Date();
  const fileName = (date.getTime() + randomInt(100000)).toString();
  const fileExt = json.path.split('.').pop();
  const fileXName = `${fileName}.${fileExt}`;
  const SAVE_PATH = path.resolve(
    path.join(__dirname, '../../static/downloads/doc')
  );
  const serviceXPath =
    process.env.NODE_ENV !== 'production'
      ? `https://ghostify.site/downloader/${tokenGenerator(
          'downloads/doc' + fileXName
        )}`
      : `http://localhost:3085/downloader/${tokenGenerator(
          'downloads/doc' + fileXName
        )}`;
  fs.renameSync(json.path, path.join(SAVE_PATH, fileXName));
  const newDoc = await prismaClient.document.create({
    data: {
      title: 'Doc_converted_' + date.toDateString(),
      uid: tokenGenerator((date.getTime() + randomInt(1000)).toString()),
      type: out,
      userId: req.session.Auth.id,
      downloadLink: serviceXPath,
    },
  });
  res.status(200).redirect(newDoc.downloadLink);
};
