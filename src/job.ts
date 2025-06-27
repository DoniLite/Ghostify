import type { NotificationType } from '@prisma/client';
import Queue from 'bull';

export const resumeQueue = new Queue<{
	url: string;
	id: number;
	updating?: boolean;
	docId?: number;
}>('cv-processor', Bun.env.REDIS_HOST!);

export const NotificationQueue = new Queue<{
	userId: number;
	type: NotificationType;
	payload: Record<string | number | symbol, unknown>;
}>('notifications', Bun.env.REDIS_HOST!);
