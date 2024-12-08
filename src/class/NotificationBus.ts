import { ee } from '../server';
import { prismaClient } from '../config/db';
import { EventEmitter } from 'stream';
import { Notifications, NotificationType } from '@prisma/client/default';
import { DoneCallback, Job, ProcessCallbackFunction } from 'bull';

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
  #eventType: typeof NotificationType
  #crud: typeof prismaClient.notifications;
  #callBack: (job: Job) => Promise<unknown>;

  constructor() {
    this.eventBus = ee;
    this.#crud = prismaClient.notifications;
    this.#eventType = NotificationType;
  }

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
    this.#callBack(job).then(
        (v) => {
            const d = v as { evenType: string, payload: {} };
            this.eventBus.emit('')
        }
    );
  }

  addCallBack<T>(func: Function): { call: ProcessCallbackFunction<T> } {
    this.#callBack = func as (job: Job) => Promise<unknown>;
    return {
      call: this.#doSomethingWithAndFire,
    };
  }
}
