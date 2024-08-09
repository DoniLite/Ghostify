import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import fs from "node:fs";
import {
  checkIfMonthIsNotOver,
  getMonthWithDate,
  getWeekIndex,
  loadStatistics,
  saveStatistic,
} from "../utils";

export const stats = (
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const url = req.raw.url;
  const headers = req.raw.headers;
  console.log(headers);
  const stats = loadStatistics();
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
    if (!stats.urls.includes(url)) {
      const i = stats.urls.push(url);
      stats[`${i}`] = {
        visitor: 1,
        url: url,
      };
    } else {
      const i = stats.urls.findIndex((v) => v === url);
      console.log(i);
      stats[`${i + 1}`].visitor += 1;
    }
    saveStatistic(stats)
      .then(() => {
        done();
      })
      .catch((err) => console.log(err));
    return;
  }
  if (weekIndex !== thisWeekIndex) {
    stats.weekly.index = thisWeekIndex;
    stats.weekly.visitor = 1;
    stats.monthly.visitor += 1;
    stats.total_visitor += 1;
    if (!stats.urls.includes(url)) {
      const i = stats.urls.push(url);
      stats[`${i}`] = {
        visitor: 1,
        url: url,
      };
    } else {
      const i = stats.urls.findIndex((v) => v === url);
      console.log(i);
      stats[`${i + 1}`].visitor += 1;
    }
    saveStatistic(stats)
      .then(() => {
        done();
      })
      .catch((err) => console.log(err));
    return;
  }
  stats.monthly.visitor += 1;
  stats.total_visitor += 1;
  stats.weekly.visitor += 1;
  if (!stats.urls.includes(url)) {
    const i = stats.urls.push(url);
    stats[`${i}`] = {
      visitor: 1,
      url: url,
    };
  } else {
    const i = stats.urls.findIndex((v) => v === url);
    console.log(i);
    console.log(stats.urls);
    console.log(stats);
    stats[`${i + 1}`].visitor += 1;
  }
  saveStatistic(stats)
    .then(() => {
      done();
    })
    .catch((err) => console.log(err));
};
