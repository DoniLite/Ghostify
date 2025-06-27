import type { Notifications, NotificationType } from '@prisma/client';
import type { DoneCallback, Job } from 'bull';
import { EventEmitter } from 'node:stream';
import { prismaClient } from '../../config/db';
import { NotificationQueue } from '../../job';
import { logger } from '../../logger';
import { ee } from './eventBus';

export class NotificationBus {
	/**
	 * Event emitter used to notify the client from the accomplishment of any task
	 *
	 * ```ts
	 *  //this is used to fire an event
	 *  eventBus.emit()
	 * ```
	 */
	eventBus: EventEmitter;
	eventType: typeof NotificationType;
	#crud: typeof prismaClient.notifications;
	#callBack?: (job: Job) => Promise<unknown>;
	#queue: typeof NotificationQueue;

	/**
   * Construct a new NotificationBus instance:
   *
   * ```ts
   *    const notification = new NotificationBus();
   * ```
   *
   * This is used to set up all needed features to `crud` under notifications on the platform system
   *
   * For listening on the event from this class submit to the default `ee` (evenEmitter) on the `sever.ts` file
   *
   * ```ts
   *    ee.on('event', function (e) {
   *      console.log(e)
   *    })
   * ```
   *
   * This class can create notification for a specific ser with his `userId`
   * The notification can be add to a task queue using the `addCallBack` function
   * You must use a custom function that returns a data promise like this:
   * ```ts
   *   Promise<{
   *    evenType: NotificationType;
        payload: Record<string | number | symbol, unknown>;
        userId: number;
   *   }>
   * ```
   *
   * Then you can add a callBack that will fire a new notifications after it successfully complete:
   * ```ts
   *    notification.addCallBack<{
   *      yourJobType: string
   *    }>(yourCallBack);
   * 
   * 
   * ```
   *
   */
	constructor() {
		this.eventBus = ee;
		this.#crud = prismaClient.notifications;
		this.eventType = {
			Alert: 'Alert',
			Reply: 'Reply',
			like: 'like',
			Post: 'Post',
			Info: 'Info',
			Message: 'Message',
		};
		this.#queue = NotificationQueue;
	}

	/**
	 * @description
	 * Load all the notifications from the database for the given user
	 *
	 * @param user - the user id
	 * @returns The list of notifications
	 */
	async loadAllNotifications(user: string): Promise<Notifications[]> {
		return await this.#crud.findMany({
			where: {
				userId: user,
			},
			orderBy: {
				createdAt: 'desc',
				seen: 'desc',
			},
		});
	}

	#doSomethingWithAndFire<T>(job: Job<T>, done: DoneCallback): void {
		if (!this.#callBack) {
			throw new Error('callback is not set');
		}
		this.#callBack(job)
			.then((v) => {
				const d = v as {
					evenType: NotificationType;
					payload: Record<string | number | symbol, unknown>;
					userId: string;
				};
				this.#crud
					.create({
						data: {
							content: JSON.stringify(d.payload),
							type: d.evenType,
							userId: d.userId,
						},
					})
					.then((dt) => {
						this.eventBus.emit(dt.type, dt.content);
						done(null, dt);
					})
					.catch((e) => {
						logger.error(
							`error during the task ${job.id} with data: ${job.data}`,
							e,
						);
						done(e, null);
					});
			})
			.catch((e) => {
				logger.error(
					`error during the task ${job.id} with data: ${job.data}`,
					e,
				);
				done(e, null);
			});
	}

	async #callBackQueue() {
		await this.#queue.process(this.#doSomethingWithAndFire);
	}

	/**
	 * Set the callback function for the notification bus
	 *
	 * The callback function will be called with a Job object as argument
	 * and will be passed the notification payload and the notification type
	 * as argument.
	 *
	 * The callback function should return a Promise that resolve with the
	 * notification payload and the notification type.
	 *
	 * @param func - the callback function
	 * @returns an object with a call method that can be used to add a new job in the queue
	 */
	async addCallBack(
		// deno-lint-ignore ban-types
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		func: Function,
	): Promise<{ call: typeof NotificationQueue.add }> {
		this.#callBack = func as (job: Job) => Promise<unknown>;
		await this.#callBackQueue();
		return {
			call: this.#queue.add,
		};
	}

	/**
	 * @description
	 * Add a new notification for the given user
	 *
	 * @param type - the type of the notification
	 * @param payload - the payload of the notification
	 * @param userId - the user id
	 * @returns The newly created notification
	 */
	addNotification(
		type: NotificationType,
		payload: Record<string | number | symbol, unknown>,
		userId: string,
	): Promise<Notifications> {
		return this.#crud.create({
			data: {
				type: type,
				content: JSON.stringify(payload),
				userId,
			},
		});
	}

	async updateNotificationView(...notificationsId: string[]) {
		return await Promise.all(
			notificationsId.map(async (id) => {
				return await this.#crud.update({
					where: {
						id,
					},
					data: {
						seen: true,
					},
				});
			}),
		);
	}
}
