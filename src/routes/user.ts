import { Request, Response } from "express";
import {IncomingForm} from "formidable";
import { renaming } from "../utils";
import path from 'node:path';
import { prismaClient } from "../config/db";


export const updateProfile =  async (req: Request, res: Response) => {
    const form = new IncomingForm({
    uploadDir: path.resolve(__dirname, '../../src/public/uploads/users'),
    keepExtensions: true,
    multiples: true, // Permet de gérer plusieurs fichiers
    allowEmptyFiles: true,
    minFileSize: 0,
    filter: function ({ mimetype }) {
      // keep only images
      return mimetype && mimetype.includes('image');
    },
  });

  const [ , files] = await form.parse(req);
  const file = files?.file?.[0];
  if(file) {
    try {
        const result = await renaming(file, path.resolve(__dirname, '../../src/public/uploads/users'));
        if(result === false) {
          res.status(400).json({ message: 'Error while renaming profile picture' });
          return;
        }
        const updatedUser = await prismaClient.user.update({
          where: {
            id: Number(req.session.Auth.id),
          },
          data: {
            file: `/static/uploads/users/${result}`,
          },
        });
        console.log(updatedUser);
        req.session.Auth.file = updatedUser.file; // Update the session file path to the new one
        res.status(200).json({ message: 'Profile picture updated successfully', file: updatedUser.file });
        return
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error while updating profile picture' });
      return;
    }
  }
  res.status(400).json({ message: 'Profile picture is missing' });
}