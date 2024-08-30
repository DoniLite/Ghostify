// import { client } from "../config/db";
import { RouteHandlerMethod } from 'fastify';
import { client } from '../config/db';
import { BodyXData, FetchFn } from 'index';

export const homeControler: RouteHandlerMethod = async (req, res) => {
  const { storageData } = req.body as BodyXData;

  const result = await apiRequester();

  if (result === false)
    return res.code(400).send(
      JSON.stringify({ err: 'not fulfilled service',})
    );

  if (typeof storageData === 'string') {
    req.session.PersistedData = storageData;
    req.session.Services.Platform.API = true;
    req.session.Services.Platform.externals = true;
    return res.send(JSON.stringify({ persisted: true }));
  }

  return res.send(JSON.stringify({ req: true }));
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
