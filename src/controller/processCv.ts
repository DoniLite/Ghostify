import {IncomingForm} from 'formidable'
import { Request, Response } from "express";
import path from 'node:path';
import { renaming } from '../utils';


export const processCV = async (req: Request, res: Response) => {
    const STATIC_DIR = '../../static/cv';
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
}