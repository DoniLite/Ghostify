import { RequestHandler } from 'express';
import { BodyData } from '../@types/index';

export const notifications: RequestHandler = async (req, res) => {
  const data: BodyData = req.body;
  console.log(data);
  res.status(200);
};
