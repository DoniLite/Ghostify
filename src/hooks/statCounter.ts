import { FastifyReply, FastifyRequest } from 'fastify';
import {
  checkIfMonthIsNotOver,
  getMonthWithDate,
  getWeekIndex,
  loadStatistics,
} from '../utils';

export const stats = async (req: FastifyRequest, res: FastifyReply) => {
  const url = req.raw.url;
  const headers = req.raw.headers;
  const stats = await loadStatistics();
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
    let aborter;
    stats.urls.forEach((oneUrl) => {
      if (oneUrl.url === url) {
        oneUrl.visitor++;
        aborter = true;
      } else {
        aborter = false;
      }
    });
    if (aborter === false) {
      stats.urls.push({
        url: url,
        visitor: 1,
      });
    }
    req.session.Stats = stats;
    return;
  }
  if (weekIndex !== thisWeekIndex) {
    stats.weekly.index = thisWeekIndex;
    stats.weekly.visitor = 1;
    stats.monthly.visitor += 1;
    stats.total_visitor += 1;
    let aborter;
    stats.urls.forEach((oneUrl) => {
      if (oneUrl.url === url) {
        oneUrl.visitor++;
        aborter = true;
      } else {
        aborter = false;
      }
    });
   if (aborter === false) {
     stats.urls.push({
       url: url,
       visitor: 1,
     });
   }
    req.session.Stats = stats;
    return;
  }
  stats.monthly.visitor += 1;
  stats.total_visitor += 1;
  stats.weekly.visitor += 1;
  let aborter;
  stats.urls.forEach((oneUrl) => {
    if (oneUrl.url === url) {
      oneUrl.visitor++;
      aborter = true;
    } else {
      aborter = false;
    }
  });
  if (aborter === false) {
    stats.urls.push({
      url: url,
      visitor: 1,
    });
  }
  req.session.Stats = stats;
};
