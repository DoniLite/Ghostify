import { ee } from '../server';
import { prismaClient, redisStoreClient } from '../config/db';
import { EventEmitter } from 'stream';
import { Notifications, NotificationType } from '@prisma/client/default';
import { DoneCallback, Job, ProcessCallbackFunction } from 'bull';
import { logger } from '../logger';

export class NotificationBus {
  /**
   * Event emitter used to notify the client from the accomplishment of any task
   *
   * ```ts
   *  //this is used to fire an event
   *  eventBus.emit()
   * ```
   *
   */
  eventBus: EventEmitter;
  eventType: typeof NotificationType;
  #crud: typeof prismaClient.notifications;
  #callBack: (job: Job) => Promise<unknown>;
  #store: typeof redisStoreClient;

  /**
   * Construct a new NotificationBus instance
   *
   * This is used to set up the event bus, the prisma crud, the type of notifications
   * and the redis store
   */
  constructor() {
    this.eventBus = ee;
    this.#crud = prismaClient.notifications;
    this.eventType = NotificationType;
    this.#store = redisStoreClient;
  }

  /**
   * @description
   * Load all the notifications from the database for the given user
   *
   * @param user - the user id
   * @returns The list of notifications
   */
  async loadAllNotifications(user: number): Promise<Notifications[]> {
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
    this.#callBack(job)
      .then((v) => {
        const d = v as {
          evenType: NotificationType;
          payload: Record<string | number | symbol, unknown>;
        };
        this.eventBus.emit(d.evenType, d.payload);
        done(null, v);
      })
      .catch((e) => {
        logger.error(
          `error during the task ${job.id} with data: ${job.data}`,
          e
        );
        done(e, null);
      });
  }

  addCallBack<T>(func: Function): { call: ProcessCallbackFunction<T> } {
    this.#callBack = func as (job: Job) => Promise<unknown>;
    return {
      call: this.#doSomethingWithAndFire,
    };
  }

  addNotification(
    type: NotificationType,
    payload: Record<string | number | symbol, unknown>,
    userId: number
  ): Promise<Notifications> {
    return this.#crud.create({
      data: {
        type: type,
        content: JSON.stringify(payload),
        userId,
      },
    });
  }

  async scheduleNotification(
    type: NotificationType,
    payload: Record<string | number | symbol, unknown>,
    userId: number,
    date: Date
  ) {
    await this.#store.set(
      `${userId}_${type}`,
      JSON.stringify({ type, payload }),
      {
        EX: Math.floor(date.getTime() / 1000) - Math.floor(Date.now() / 1000),
      }
    );
  }
}
