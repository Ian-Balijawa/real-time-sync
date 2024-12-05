import { SyncOptions, RealtimeSyncClient } from './types';

export class RealTimeSync<T> implements RealtimeSyncClient<T> {
  private socket!: WebSocket;
  private url: string;
  private options: SyncOptions<T>;
  private subscriptions: Map<string, (data: T) => void> = new Map();
  private reconnectAttempts = 0;

  constructor(url: string, options: SyncOptions<T> = {}) {
    this.url = url;
    this.options = {
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      conflictResolution: 'server-wins',
      ...options
    };

    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.onConnect?.();
    };

    this.socket.onmessage = (event) => {
      const { stream, data } = JSON.parse(event.data);
      const callback = this.subscriptions.get(stream);

      if (callback) {
        callback(data);
      }
    };

    this.socket.onclose = () => {
      this.onDisconnect?.();
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      this.onError?.(new Error(`WebSocket error: ${error}`));
      this.reconnect();
    };
  }

  private reconnect() {
    if (this.options.reconnectAttempts && this.reconnectAttempts < this.options.reconnectAttempts) {
      const delay = this.options.reconnectDelay && this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts);

      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    }
  }

  subscribe(stream: string, callback: (data: T) => void) {
    this.subscriptions.set(stream, callback);
    this.socket.send(JSON.stringify({ type: 'subscribe', stream }));
  }

  publish(stream: string, data: T) {
    this.socket.send(JSON.stringify({ type: 'publish', stream, data }));
  }

  unsubscribe(stream: string) {
    this.subscriptions.delete(stream);
    this.socket.send(JSON.stringify({ type: 'unsubscribe', stream }));
  }

  disconnect() {
    this.socket.close();
  }

  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}
