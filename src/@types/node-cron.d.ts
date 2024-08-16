declare module "node-cron" {
  class ScheduledTask {
    now(now?: string): void;
    start(): void;
    stop(): void;
  }

  class BackgroundScheduledTask {}

  function validation(pattern: string): void;

  function storage(): {
    save: (task: any) => void;
    getTasks: () => any;
  };

  export type CronScheduleOptions = {
    scheduled?: boolean | undefined;
    timezone?: string | undefined;
  };

  function schedule(
    expression: string,
    func: Function,
    options?: CronScheduleOptions | undefined
  ): ScheduledTask;

  function createTask(
    expression: any,
    func: any,
    options: any
  ): BackgroundScheduledTask | ScheduledTask;

  function validate(expression: string): boolean;

  function getTasks(): ScheduledTask[];
}
