import Queue from 'bull';
import { NotificationType } from '@prisma/client';

export const cvQueue = new Queue<{
  url: string;
  id: number;
  updating?: boolean;
  docId?: number;
}>('cv-processor', Deno.env.get('REDIS_HOST')!);

export const NotificationQueue = new Queue<{
  userId: number;
  type: NotificationType;
  payload: Record<string | number | symbol, unknown>;
}>('notifications', Deno.env.get('REDIS_HOST')!);