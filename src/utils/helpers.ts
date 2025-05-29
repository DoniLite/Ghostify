import path from 'node:path';

import {
  // formatDistanceToNow,
  // formatDuration,
  intervalToDuration,
} from 'date-fns';
import { Translate, translate } from 'free-translate';
import { month } from '../@types/index.d.ts';

export const filterIncludesType = (k: string, obj: Record<string, unknown>) => {
  if (typeof obj['title'] === 'string') {
    return obj['title'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['description'] === 'string') {
    return obj['description'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['desc'] === 'string') {
    return obj['desc'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['content'] === 'string') {
    return obj['content'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  return false;
};

export const DATA_PATH = path.resolve(path.join(Deno.cwd(), './data'));
export const DATA_FILE = path.join(DATA_PATH, 'statistics.json');

/**
 * This function returns a boolean value indicating whether the month is over if `true` the month is not over
 * If `false` the month is over
 */
export function checkIfMonthIsNotOver(monthParam: month): boolean {
  const date = new Date();
  const thisMonth = getMonthWithDate(date.getMonth());
  return thisMonth === monthParam;
}

export function getWeekIndex(): number {
  const date = new Date();
  return Math.round(date.getDate() / 7);
}

export const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
] as const;

export const getMonthWithDate = (monthIndex: number) => {
  return months[monthIndex];
};

// Définir une interface pour les clés

export function tokenTimeExpirationChecker(t: number) {
  const now = new Date();
  return now.getTime() <= t;
}

export function getTimeElapsed(date: Date) {
  const duration = intervalToDuration({ start: date, end: new Date() });

  // sourcery skip: use-braces
  if (duration.months && duration.months >= 1) return `${duration.months}M`;
  if (duration.weeks && duration.weeks >= 1) return `${duration.weeks}W`;
  if (duration.days && duration.days >= 1) return `${duration.days}d`;
  if (duration.hours && duration.hours >= 1) return `${duration.hours}h`;
  if (duration.minutes && duration.minutes >= 1) return `${duration.minutes}m`;
  if (duration.seconds && duration.seconds >= 1) return `${duration.seconds}s`;

  return 'now';
}

export const useTranslator = async (
  text: string,
  options: Translate = { to: 'en' },
) => {
  return await translate(text, options);
};
