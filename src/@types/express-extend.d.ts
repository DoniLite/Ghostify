// ts-types="@types/express"
import 'express';

declare global {
  namespace Express {
    interface Response {
      locals: Record<string | number, unknown>;
    }

    interface Application {
      ws(path: string, func: (socket: WebSocket) => unknown): unknown;
    }
  }
}
