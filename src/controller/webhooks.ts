import { RequestHandler } from 'express';
import {ee} from '../server'

export const webhooks: RequestHandler = async (req, res) => {

  ee.emit('data', JSON.stringify(req.query));
  res.status(200).send('event dispactched');
};
