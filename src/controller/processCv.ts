// @ts-types="@types/formidable"
import { IncomingForm } from 'formidable';
// @ts-types="@types/express"
import { Request, Response } from 'express';
import path from 'node:path';
import { renaming } from '../utils.ts';
import { QueryXData, RawCV } from '../@types/index.d.ts';
import { prismaClient } from '../config/db.ts';
import { cvQueue, tokenGenerator } from '../server.ts';
import { randomInt } from 'node:crypto';

export const cv = (req: Request, res: Response) => {
  res.render('components/cvForm', { service: undefined });
};

export const processCV = async (req: Request, res: Response) => {
  const STATIC_DIR = '../../static/cv';
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
  const { uid } = req.query as QueryXData<{ uid: string }>;
  let result: false | string;
  const [fields, files] = await form.parse(req);

  console.log('formidable files: ', files);

  const file = files?.userProfileFile?.[0];
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
  console.log('file : ' + file);
  console.log(result);
  const cvType = fields.selectedCVType ? fields.selectedCVType[0] : undefined;
  const fileXPath = process.env.NODE_ENV === 'production'
    ? `https://ghostify.site/staticFile/` + tokenGenerator(`cv/${result}`)
    : `http://localhost:3085/staticFile/` + tokenGenerator(`cv/${result}`);
  const data = JSON.parse(fields.jsonData[0]) as RawCV;
  req.session.CVData = {
    ...data,
    img: fileXPath,
    cvType,
  };
  if (uid) {
    let docId: number;
    let updating: boolean = false;
    try {
      const cvUpdating = await prismaClient.cV.update({
        where: {
          uid,
        },
        data: {
          metaData: JSON.stringify(data),
          img: fileXPath,
        },
      });
      const cvDoc = await prismaClient.document.findFirst({
        where: {
          downloadLink: cvUpdating.pdf,
        },
      });
      if (cvDoc) {
        docId = cvDoc.id;
        updating = true;
      }
      console.log('user updated successfully:', cvUpdating.metaData);
      const cvJob = await cvQueue.add(
        { url: cvUpdating.url, id: cvUpdating.id, docId, updating },
        {
          attempts: 5,
        },
      );
      req.session.JobsIDs = {
        ...req.session.JobsIDs,
        cvJob: cvJob.id,
      };
      res
        .status(200)
        .json({ success: true, redirect: `${cvUpdating.url}?mode=view` });
      return;
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Error during update', data: data });
      return;
    }
  }
  if (req.session.Auth.authenticated && !req.session.Auth.isSuperUser) {
    const checkIfUserHavePoints = await prismaClient.user.findUnique({
      where: {
        id: req.session.Auth.id,
      },
      select: {
        cvCredits: true,
      },
    });
    if (checkIfUserHavePoints.cvCredits < 100) {
      res.status(403).json({
        message: 'Not enough credits for CV creation',
        redirect: process.env.NODE_ENV === 'production'
          ? 'https://ghostify.site/billing/'
          : 'http://localhost:3085/billing/',
      });
      return;
    }
    const uid = tokenGenerator((date.getTime() + randomInt(1000)).toString());
    const newCV = await prismaClient.cV.create({
      data: {
        metaData: JSON.stringify(data),
        userId: req.session.Auth.id,
        img: file ? fileXPath : null,
        uid: uid,
        url: process.env.NODE_ENV === 'production'
          ? `https://ghostify.site/cv/${uid}`
          : `http://localhost:3085/cv/${uid}`,
      },
    });
    if (newCV) {
      const updateUserPoints = await prismaClient.user.update({
        where: {
          id: req.session.Auth.id,
        },
        data: {
          cvCredits: {
            decrement: 100,
          },
        },
      });
      console.log('user rest points:', updateUserPoints.cvCredits);
    }
    const cvJob = await cvQueue.add(
      { url: newCV.url, id: newCV.id },
      {
        attempts: 5,
      },
    );
    req.session.JobsIDs = {
      ...req.session.JobsIDs,
      cvJob: cvJob.id,
    };
    res.status(200).json({ success: true, redirect: `${newCV.url}?mode=view` });
    return;
  }
  req.session.RedirectUrl = '/cv/processApi';
  res.json({
    success: false,
    redirect: process.env.NODE_ENV === 'production'
      ? 'https://ghostify.site/signin?service=poster'
      : 'http://localhost:3085/signin?service=poster',
  });
};
