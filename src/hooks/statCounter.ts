import { FastifyRequest } from 'fastify';
import {
  checkIfMonthIsNotOver,
  getMonthWithDate,
  getWeekIndex,
  loadStatistics,
  saveStatistic,
} from '../utils';

export const stats = async (req: FastifyRequest) => {
  const url = req.raw.url;
  // const headers = req.raw.headers;
  const stats = await loadStatistics();
  const Uris = [...stats.urls.map(url => url.url)];
  const month = stats.monthly.month;
  const weekIndex = stats.weekly.index;
  const date = new Date();
  const thisMonth = getMonthWithDate(date.getMonth());
  const thisWeekIndex = getWeekIndex();
  if (!checkIfMonthIsNotOver(month)) {
    stats.monthly.month = thisMonth;
    stats.monthly.visitor = 1;
    stats.total_visitor += 1;
    stats.weekly.visitor = 1;
    stats.weekly.index = thisWeekIndex;
    if(!Uris.includes(url)) {
      stats.urls.push({
        url: url,
        visitor: 1,
      });
    }
    const index = stats.urls.findIndex(thisUrl => thisUrl.url === url)
    stats.urls[index].visitor ++;
    await saveStatistic(stats);
    return;
  }
  if (weekIndex !== thisWeekIndex) {
    stats.weekly.index = thisWeekIndex;
    stats.weekly.visitor = 1;
    stats.monthly.visitor += 1;
    stats.total_visitor += 1;
     if (!Uris.includes(url)) {
       stats.urls.push({
         url: url,
         visitor: 1,
       });
       req.session.Stats = stats;
     }
     const index = stats.urls.findIndex((thisUrl) => thisUrl.url === url);
     stats.urls[index].visitor++;
     await saveStatistic(stats);
     return;
  }
  stats.monthly.visitor += 1;
  stats.total_visitor += 1;
  stats.weekly.visitor += 1;
   if (!Uris.includes(url)) {
     stats.urls.push({
       url: url,
       visitor: 1,
     });
     req.session.Stats = stats;
   }
   const index = stats.urls.findIndex((thisUrl) => thisUrl.url === url);
   stats.urls[index].visitor++;
   await saveStatistic(stats);
};
