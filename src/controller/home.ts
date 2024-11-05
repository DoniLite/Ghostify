// import { client } from "../config/db";
import { RequestHandler } from 'express';
import { BodyXData, FetchFn } from 'index';

export const homeController: RequestHandler = async (req, res) => {
  const { storageData } = req.body as BodyXData;

  const result = await apiRequester();

  if (result === false) {
    res.status(400).send(JSON.stringify({ err: 'not fulfilled service' }));
    return;
  }

  if (typeof storageData === 'string') {
    req.session.Services.Platform.API = true;
    req.session.Services.Platform.externals = true;
    res.send(JSON.stringify({ persisted: true }));
    return;
  }
  const finalResult = result.map(async (res) =>
    res instanceof Response ? await res.json() : res
  );
  const cookieExpiration = new Date();
  cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
  const finalObj = JSON.stringify(finalResult);
  res.cookie('ghostify_home_session', finalObj, { expires: cookieExpiration });
  res.send(JSON.stringify({ req: true }));
  return;
};

const apiRequester = async (...prom: FetchFn[]) => {
  try {
    const res = await Promise.all([...prom]);
    return res;
  } catch (err) {
    console.error(err);
    return false;
  }
};
