import {IncomingForm} from 'formidable'
import { Request, Response } from "express";
import path from 'node:path';
import { renaming } from '../utils';
import { RawCV } from 'index';
import { prismaClient } from '../config/db';
import { tokenGenerator } from '../server';


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
    let result: false | string;
    const [fields, files] = await form.parse(req);

    const file = files?.file?.[0];
    if(file) {
        try {
            result = await renaming(file, path.resolve(__dirname, STATIC_DIR));
            if(result === false) {
                res.status(400).json({ message: 'Error while renaming CV file' });
                return;
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Error while processing CV file' });
            return;
        }
    }

    const fileXPath =
      process.env.NODE_ENV === 'production'
        ? `https://ghostify.site/staticFile/` + tokenGenerator(`cv/${result}`)
        : `http://localhost:3085/staticFile/` + tokenGenerator(`cv/${result}`);
    const data = JSON.parse(fields.jsonData[0]) as RawCV;
    if(req.session.Auth.authenticated && !req.session.Auth.isSuperUser) {
      const uid = tokenGenerator(date.getTime().toString())
        const newCV = await prismaClient.cV.create({data: {
            metaData: JSON.stringify(data),
            userId: req.session.Auth.id,
            img: file ? fileXPath : null,
            uid: uid,
            url: process.env.NODE_ENV === 'production' ? `https://ghostify.site/cv/${uid}` : `http://localhost:3085/cv/${uid}`,
        }});
        req.session.CVData = {
          ...data,
          img: fileXPath
        };
        res.status(200).json({success: true, link: newCV.url});
        return;
    }
    console.log(data);
}