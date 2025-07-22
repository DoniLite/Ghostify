/** biome-ignore-all lint/style/noNonNullAssertion: Redis host will never be undefined because it's injected in the env vars on the server startup */
import type { NotificationType } from '@prisma/client';
import Queue from 'bull';

export const resumeQueue = new Queue<{
	url: string;
	id: string;
	updating?: boolean;
	docId?: string;
}>('cv-processor', Bun.env.REDIS_HOST!);

export const NotificationQueue = new Queue<{
	userId: string;
	type: NotificationType;
	payload: Record<string | number | symbol, unknown>;
}>('notifications', Bun.env.REDIS_HOST!);
