// @ts-types="@types/express"
import { RequestHandler } from 'express';
import { BodyXData } from '../@types/index.d.ts';

export const store: RequestHandler = (req, res) => {
  const body = req.body as BodyXData;
  console.log(body);
  res.send(JSON.stringify({ message: 'Data stored successfully' }));
};
