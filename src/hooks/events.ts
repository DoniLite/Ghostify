import {stats} from './statCounter'

export const onStat = async (url: any) => {
    await stats(url);
}