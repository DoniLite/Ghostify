// deno-lint-ignore-file ban-types no-explicit-any
import { WEBSOCKET_BASE_URL } from '../constants/services_url.ts';

export class CollaborationService {
  private ws: WebSocket | null = null;
  private documentId: string;
  private userId: string;
  private callbacks: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private WEBSOCKET_BASE_URL = WEBSOCKET_BASE_URL;

  constructor(documentId: string, userId: string) {
    this.documentId = documentId;
    this.userId = userId;
    this.connect();
  }

  private connect() {
    try {
      // Compatible websocket connection for Hono
      this.ws = new WebSocket(
        `${this.WEBSOCKET_BASE_URL}${this.documentId}?userId=${this.userId}`,
      );

      this.ws.onopen = () => {
        console.log('Connexion opened');
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // Don't processing self sended message
          if (message.userId !== this.userId) {
            this.emit(message.type, message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Closed WebSocket Connection');
        this.emit('disconnected', {});
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    } catch (error) {
      console.error('WebSocket Connection Error:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Connection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
        );
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type,
          data,
          userId: this.userId,
          timestamp: Date.now(),
        }),
      );
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnection on manual disconnect
      this.ws.close();
    }
  }
}
