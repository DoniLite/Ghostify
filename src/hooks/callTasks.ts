import { ee } from '../server';
import { prismaClient } from '../config/db';
import { Post } from 'index';
import cron from 'node-cron';

export const PosterTask = async () => {
  // let dom: HTMLAllCollection;
  // dom.length

  const date = new Date();
  const H = date.getHours();
  if ((H > 6 && H < 15) || (H > 22 && H < 6)) {
    ee.emit('evrymorningAndNyTask', "It's time to do the task");
    ee.emit('evrymorningAndNyTask', `Task begening... Collecting posts `);
    // const regex = new RegExp('\\');
    const taskRunner = await makeSomeThingWithPosts(postFilter);
    if (!taskRunner) {
      ee.emit(
        'evrymorningAndNyTask',
        'Error during running the task it will be schedule for later execution',
      );
      return cron.schedule('', PosterTask);
    }
    ee.emit('evrymorningAndNyTask', `last execution time: ${date.getHours()}`);
    date.setHours(date.getHours() + 6);
    ee.emit(
      'evrymorningAndNyTask',
      `next execution time: ${date.getHours()}`,
    );
    return cron.schedule('', PosterTask);
  }
  ee.emit(
    'evrymorningAndNyTask',
    "It's look like time it not properly scheduling for later execution",
  );
  ee.emit('evrymorningAndNyTask', `last verification time: ${date.getHours()}`);
  date.setHours(date.getHours() + 6);
  ee.emit('evrymorningAndNyTask', `next verification time: ${date.getHours()}`);
  return cron.schedule('', PosterTask);
};

// export const ActuTask = async() => {
//   let resFunc;
//   let utilsDate;
//   const actu = await prismaClient.comment.findMany()
//   const date = new Date();

// }

type MakeSomeThingCb<D, T = void> = (
  payload: D,
) => T | ((payload: D) => Promise<T>);

async function makeSomeThingWithPosts<T>(fn?: MakeSomeThingCb<Post[], T>) {
  try {
    const posts = await prismaClient.post.findMany({
      where: {
        safe: false,
        fromApi: true,
      },
    });
    await fn(posts);
    console.log(posts);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

interface FilteredPosts {
  safe: Post[] | undefined;
  unsafe: Post[] | undefined;
}
async function postFilter(posts: Post[]): Promise<FilteredPosts> {
  const filtered = {} as FilteredPosts;
  return filtered;
}
