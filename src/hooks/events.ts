import { statsQueue } from '../server';

export const onStat = async (url: string) => {
    await statsQueue.add(url, {
        attempts: 5,
    });
}