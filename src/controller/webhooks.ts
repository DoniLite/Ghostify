import { RequestHandler } from 'express';

export const webhooks: RequestHandler = async (req, res) => {
  req.socket.emit('data', JSON.stringify(req.query));
  res.status(200).send('event dispactched');
};
