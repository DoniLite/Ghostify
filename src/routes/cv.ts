import { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import { cvQueue, tokenGenerator } from '../server';
import { randomInt } from 'node:crypto';
import { QueryXData, RawCV } from 'index';
import { format } from 'date-fns';
import { cvClass } from '../utils';

export const cvProcessAPI = async (req: Request, res: Response) => {
  const date = new Date();
  if (!req.session.Auth.authenticated) {
    res.status(403).send("You're not authenticated");
    return;
  }

  if (!req.session.CVData) {
    res.status(404).send('No CV found');
    return;
  }
  const uid = tokenGenerator((date.getTime() + randomInt(1000)).toString());
  const newCV = await prismaClient.cV.create({
    data: {
      userId: req.session.Auth.isSuperUser ? null : req.session.Auth.id,
      metaData: JSON.stringify(req.session.CVData),
      img: req.session.CVData.img,
      uid,
      url:
        process.env.NODE_ENV === 'production'
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
    }
  );
  req.session.JobsIDs = {
    ...req.session.JobsIDs,
    cvJob: cvJob.id,
  };
  res.redirect(`${newCV.url}?mode=view`);
};

export const getCV = async (req: Request, res: Response) => {
  const { cv } = req.params;
  const { mode, api } = req.query as QueryXData<{ mode: string; api: string }>;
  // req.app.emit('downloader');
  try {
    const cvData = await prismaClient.cV.findUnique({
      where: {
        uid: cv,
      },
    });
    console.log('cvData: ', cvData);
    const cvType = cvData.type ? Number(cvData.type) : 1;
    const cvMode = cvData.mode ? Number(cvData.mode) : 1;
    const cvTheme =
      cvClass[`v${cvType as 1 | 2 | 3}`][`mode${cvMode as 1 | 2 | 3 | 4 | 5}`];
    const data = JSON.parse(cvData.metaData) as RawCV;
    const cvDate = new Date(data.birthday);
    const cvObject: {
      img?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      location?: string;
      birthday?: string;
      profile?: string;
      skills?: string[];
      formations?: { title: string; description: string; date: string }[];
      experience?: {
        title: string;
        contents: { description: string; duration: string }[];
      }[];
      interest?: string[];
      languages?: {
        title: string;
        css: 'w-[30%]' | 'w-[60%]' | 'w-full';
        level: string;
      }[];
      css?: unknown;
    } = {};
    cvObject.img = cvData.img;
    cvObject.fullName = data.name;
    cvObject.email = data.email;
    cvObject.phoneNumber = data.phone;
    cvObject.location = data.address;
    cvObject.birthday =
      api && api === 'true'
        ? format(cvDate, 'yyyy-MM-dd')
        : format(cvDate, 'dd /MM/yyyy');
    cvObject.profile = data.profile;
    cvObject.skills = data.skills;
    cvObject.formations = data.formations.map((formation) => ({
      title: formation.formation,
      description: formation.certificate,
      date: formation.certificationDate,
    }));
    cvObject.experience = data.experiences.map((experience) => ({
      title: experience.experience,
      contents: experience.details.map((detail) => ({
        description: detail.task,
        duration: detail.taskDate,
      })),
    }));
    cvObject.interest = data.interest;
    cvObject.languages = data.languages.map((language) => ({
      title: language.lang,
      css:
        language.level === 'basique'
          ? 'w-[30%]'
          : language.level === 'intermédiaire'
          ? 'w-[60%]'
          : 'w-full',
      level: language.level,
    }));
    if (api && api === 'true') {
      res.status(200).json(cvObject);
      return;
    }
    res.render(`components/cv${cvType}.ejs`, {
      ...cvObject,
      service: 'cvMaker',
      mode,
      uid: cvData.uid,
      cvTheme,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
};

export const checkCVStatus = async (req: Request, res: Response) => {
  const { uid } = req.query as QueryXData<{ uid: string }>;
  if (req.session.JobsIDs) {
    const jobId = req.session.JobsIDs.cvJob;
    const cvJob = await cvQueue.getJob(jobId);
    const status = await cvJob.getState();
    if (status === 'completed') {
      const cvData = await prismaClient.cV.findUnique({
        where: {
          id: cvJob.data.id,
        },
        select: {
          screenshot: true,
          pdf: true,
        },
      });
      res
        .status(200)
        .json({ success: true, img: cvData.screenshot, doc: cvData.pdf });
      return;
    }
    if (status === 'failed') {
      await cvJob.retry();
      res.json({
        success: false,
        message: "we have any problem getting your files let' try again",
      });
      return;
    }

    if (status === 'active' || status === 'waiting') {
      res.json({
        success: false,
        message:
          'your CV is being processed, you will get notified once it is ready',
      });
      return;
    }
    res.json({
      success: false,
      message: 'your data are processing please wait',
    });
    return;
  }
  try {
    const tryingToGetResource = await prismaClient.cV.findUnique({
      where: {
        uid: uid,
      },
      select: {
        screenshot: true,
        pdf: true,
      },
    });
    console.log(uid);
    console.log(tryingToGetResource);
    if (tryingToGetResource.pdf && tryingToGetResource.screenshot) {
      res.status(200).json({
        success: true,
        doc: tryingToGetResource.pdf,
        img: tryingToGetResource.screenshot,
      });
      return;
    }
    res.json({ success: false, error: true });
  } catch (e) {
    console.error(e);
    res.json({ success: false, error: true });
  }
};

export const getCVTheme = async (req: Request, res: Response) => {
  const { uid } = req.params;
  const { set, data } = req.query as QueryXData<{ set: string; data: string }>;
  try {
    const theme = await prismaClient.cV.findUnique({
      where: {
        uid,
      },
    });
    if (set && data && set === 'true') {
      let docId: number;
      let updating: boolean = false;
      const [type, mode] = data.split(';');
      const updatingTheme = await prismaClient.cV.update({
        where: {
          uid,
        },
        data: {
          type: type,
          mode: mode,
        },
      });
      const doc = await prismaClient.document.findFirst({
        where: {
          downloadLink: updatingTheme.pdf,
        },
      });
      if (doc) {
        docId = doc.id;
        updating = true;
      }
      const newCVJob = await cvQueue.add({
        url: updatingTheme.url,
        id: updatingTheme.id,
        docId,
        updating,
      });
      req.session.JobsIDs = {
        ...req.session.JobsIDs,
        cvJob: newCVJob.id,
      };
      console.log(
        'theme updated successfully : ',
        updatingTheme.type,
        updatingTheme.mode
      );
      res.status(200).json({ success: true });
      return;
    }
    res.status(200).json({
      type: theme.type || 1,
      mode: theme.mode || 1,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false });
  }
};
