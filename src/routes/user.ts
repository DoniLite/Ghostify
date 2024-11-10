import { Request, Response } from 'express';
import { IncomingForm } from 'formidable';
import { renaming } from '../utils';
import path from 'node:path';
import { prismaClient } from '../config/db';
import { BodyXData } from 'index';
import { tokenGenerator } from '../server';

export const updateProfile = async (req: Request, res: Response) => {
  const STATIC_DIR = '../../static/users';
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

  const [, files] = await form.parse(req);
  const file = files?.file?.[0];
  if (file) {
    try {
      const result = await renaming(
        file,
        path.resolve(__dirname, STATIC_DIR)
      );
      if (result === false) {
        res
          .status(400)
          .json({ message: 'Error while renaming profile picture' });
        return;
      }
      const fileXPathService =
        process.env.NODE_ENV === 'production'
          ? 'https://ghostify.site/staticFile/' +
            tokenGenerator(`users/${result}`)
          : 'http://localhost:3085/staticFile/' +
            tokenGenerator(`users/${result}`);
      const updatedUser = await prismaClient.user.update({
        where: {
          id: Number(req.session.Auth.id),
        },
        data: {
          file: fileXPathService,
        },
      });
      console.log(updatedUser);
      req.session.Auth.file = updatedUser.file; // Update the session file path to the new one
      res.status(200).json({
        message: 'Profile picture updated successfully',
        file: updatedUser.file,
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error while updating profile picture' });
      return;
    }
  }
  res.status(400).json({ message: 'Profile picture is missing' });
};

export const checkIfUserExist = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (user) {
    res.status(200).json({ message: 'User already exists', exist: true });
    return;
  }

  res.status(200).json({ message: 'User does not exist', exist: false });
};

export const updateUserName = async (req: Request, res: Response) => {
  const { id, username, bio, link } = req.body as BodyXData<{
    id: string;
    username: string | undefined;
    bio: string | undefined;
    link: string | undefined;
  }>;

  const lastInfo = await prismaClient.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  try {
    if (username) {
      const updatedUser = await prismaClient.user.update({
        where: {
          id: Number(id),
        },
        data: {
          username: username,
          bio: bio ? bio : lastInfo.bio,
          link: link ? link : lastInfo.link,
        },
      });
      req.session.Auth.username = updatedUser.username;
      console.log(req.session.Auth);
      console.log('new user:', updatedUser);
      res.status(200).json({ success: true });
      return;
    }
    const updatedUser = await prismaClient.user.update({
      where: {
        id: Number(id),
      },
      data: {
        bio: bio ? bio : lastInfo.bio,
        link: link ? link : lastInfo.link,
      },
    });
    res
      .status(200)
      .json({
        success: true,
        data: { bio: updatedUser.bio, link: updatedUser.link },
      });
    return;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Error while updating username' });
    return;
  }
};
