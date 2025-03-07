// @ts-types="@types/express"
import { RequestHandler } from 'express';
import { ee } from '../server.ts';

export const webhooks: RequestHandler = (req, res) => {
  ee.emit('data', JSON.stringify(req.query));
  res.status(200).send('event dispactched');
};
