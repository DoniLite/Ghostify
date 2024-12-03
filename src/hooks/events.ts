import { statsQueue } from '../server';

export const onStat = async (url: string) => {
    console.log('new call for the event');
    await statsQueue.add(url, {
        attempts: 5,
    });
}