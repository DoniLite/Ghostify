// @ts-types="@types/express"
import { Request, Response } from 'express';
import { Locale } from 'free-translate/dist/types/locales';
import { QueryXData } from '../@types/index.d.ts';
import { useTranslator } from '../utils.ts';

export const translator = async (req: Request, res: Response) => {
  const { to, text, from } = req.query as QueryXData<{
    to: Locale;
    from?: Locale;
    text: string;
  }>;

  if (!to || !text) {
    res.status(400).json({ message: 'Missing data' });
    return;
  }

  const data =
    typeof from !== 'undefined'
      ? await useTranslator(text, { to, from })
      : await useTranslator(text, { to });
  res.status(200).json({ data });
};
