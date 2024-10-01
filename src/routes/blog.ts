import { RequestHandler } from 'express';

export const article: RequestHandler = async (req, res) => {
  res.render('article', { pagination: 1, activeIndex: 3 });
};
