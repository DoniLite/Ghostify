// import { client } from "../config/db";
import { RequestHandler } from 'express';
import { client } from '../config/db';
import { BodyXData, FetchFn } from 'index';

export const homeControler: RequestHandler = async (req, res) => {
  const { storageData } = req.body as BodyXData;

  const result = await apiRequester();

  if (result === false)
    res.status(400).send(JSON.stringify({ err: 'not fulfilled service' }));

  if (typeof storageData === 'string') {
    req.session.PersistedData = storageData;
    req.session.Services.Platform.API = true;
    req.session.Services.Platform.externals = true;
    res.send(JSON.stringify({ persisted: true }));
  }

  res.send(JSON.stringify({ req: true }));
};

const apiRequester = async (...prom: FetchFn[]) => {
  try {
    client
      .connect()
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    const res = await Promise.all([...prom]);
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};
