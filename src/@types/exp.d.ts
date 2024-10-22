
declare namespace Express {
     export interface Application {
      ws(
        route: string,
        callback: (ws: WebSocket, req: express.Request) => void
      ): void;
    }
}