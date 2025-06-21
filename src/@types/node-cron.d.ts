declare module 'node-cron' {
  class ScheduledTask {
    now(now?: string): void
    start(): void
    stop(): void
  }

  function validation(pattern: string): void

  export interface CronScheduleOptions {
    scheduled?: boolean | undefined
    timezone?: string | undefined
  }

  function schedule(
    expression: string,
    func: Promise<unknown> | ((...args: []) => unknown),
    options?: CronScheduleOptions | undefined
  ): ScheduledTask

  function validate(expression: string): boolean

  function getTasks(): ScheduledTask[]
}
