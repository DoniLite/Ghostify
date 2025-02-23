import { statsQueue } from '../server.ts';

export const onStat = async (url: string) => {
  await statsQueue.add(url, {
    attempts: 5,
  });
};
