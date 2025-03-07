// @ts-types="@types/express"
import { RequestHandler } from 'express';
import { BodyData } from '../@types/index.d.ts';

export const notifications: RequestHandler = (req, res) => {
  const data: BodyData = req.body;
  console.log(data);
  res.status(200);
};
