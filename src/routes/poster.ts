import { FastifyReply, FastifyRequest } from 'fastify';
import { BodyXData, QueryXData } from '../@types';
import { decrypt, encrypt, Service } from '../utils';
import { prismaClient } from '../config/db';

export const poster = async (req: FastifyRequest, res: FastifyReply) => {
  const {} = req.query as QueryXData;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );

    return res.view('/src/views/poster.ejs', { id: 1 });
  } catch (e) {
    return res.redirect('/signin?service=blog');
  }
};

export const requestComponent = (req: FastifyRequest, res: FastifyReply) => {
  const { section } = req.query as QueryXData<{ section: number }>;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view('/src/views/components/section.ejs', {
      idIncr: Number(section) + 1,
      id: Number(section),
    });
  } catch (e) {
    return res.redirect('/signin?service=blog');
  }
};

export const requestListComponent = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { section } = req.query as QueryXData;
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];
  try {
    if (
      lastTime !== req.session.Token ||
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.redirect('/signin?service=blog');
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      'connection_time',
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view('/src/views/components/list.ejs', { id: Number(section) });
  } catch (e) {
    return res.redirect('/signin?service=blog');
  }
};

export const requestView = async (req: FastifyRequest, res: FastifyReply) => {
  const {} = req.body as BodyXData;
};

export const posterHome = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId, service } = req.query as QueryXData<{ userId: string; service: Service }>;

  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      name: true,
      email: true,
      service: true,
      registration: true,
      credits: true,
    },
  });
  if (!user) {
    return res.redirect('/signin?service=blog');
  };
  if (service !== Service.api && service !== Service.blog) {
    return res.redirect('/signin?service=blog');
  }
   return res.view('/src/views/serviceHome.ejs', {service: service, data: {...user}});
};

export const loadPost = async (req: FastifyRequest, res: FastifyReply) => {
  const {postId} = req.query as QueryXData<{postId: string}>;
  if (!postId) {
    res.status(404).send('this is not a post');
  }
  const post = await prismaClient.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  const allSections = await prismaClient.postSection.findMany({
    where: {
      parent: post,
      postId: post.id,
    }
  });
  const allFile = await prismaClient.postFile.findMany({
    where: {
      postId: post.id,
    }
  });
  const data = {
    sections: allSections,
    files: allFile,
    lists: [] as never[],
  }
  allSections.forEach(section => {
    data.lists = section.meta ?? JSON.parse(section.meta);
  })
}
