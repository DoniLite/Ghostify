import { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import path from 'node:path';
import fs from 'node:fs';

export const terms = async (req: Request, res: Response) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'terms',
    },
  });
  if (!asset) {
    res.status(404).send(JSON.stringify({ message: 'No asset found' }));
  }
  res.render('page', {
    content: asset.content,
    title: asset.title,
    description: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
    data: {},
  });
};

export const license = async (req: Request, res: Response) => {
  const licenseFile = fs.readFileSync(path.join(__dirname, '../../LICENSE'));
  res.setHeader('Content-Type', 'text/plain').send(licenseFile);
};

export const about = async (req: Request, res: Response) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'about',
    },
  });
  if (!asset) {
    res.status(404).send(JSON.stringify({ message: 'No asset found' }));
  }
  res.render('page', {
    content: asset.content,
    title: asset.title,
    description: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
    data: {},
  });
};

export const policy = async (req: Request, res: Response) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'policy',
    },
  });
  if (!asset) {
    res.status(404).send(JSON.stringify({ message: 'No asset found' }));
  }
  res.render('page', {
    content: asset.content,
    title: asset.title,
    description: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
    data: {},
  });
};

export const conditions = async (req: Request, res: Response) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'conditions',
    },
  });
  if (!asset) {
    res.status(404).send(JSON.stringify({ message: 'No asset found' }));
  }
  res.render('page', {
    content: asset.content,
    title: asset.title,
    description: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
    data: {},
  });
};

export const FAQ = async (req: Request, res: Response) => {
  const asset = await prismaClient.assets.findUnique({
    where: {
      type: 'Page',
      uid: 'FAQ',
    },
  });
  if (!asset) {
    res.status(404).send(JSON.stringify({ message: 'No asset found' }));
  }
  res.render('page', {
    content: asset.content,
    title: asset.title,
    description: asset.title,
    service: undefined,
    theme: req.session.Theme,
    auth: false,
    data: {},
  });
};
