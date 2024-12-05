import WebSocket from 'ws';

interface StreamSubscription {
  clients: Set<WebSocket>;
}

export class RealTimeSyncServer {
  private wss: WebSocket.Server;
  private streams: Map<string, StreamSubscription> = new Map();

  constructor(options: WebSocket.ServerOptions) {
    this.wss = new WebSocket.Server(options);
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (socket: WebSocket) => {
      socket.on('message', (message: string) => {
        const { type, stream, data } = JSON.parse(message);

        switch (type) {
          case 'subscribe':
            this.subscribeToStream(stream, socket);
            break;
          case 'publish':
            this.broadcastToStream(stream, data, socket);
            break;
          case 'unsubscribe':
            this.unsubscribeFromStream(stream, socket);
            break;
        }
      });

      socket.on('close', () => {
        this.removeSocketFromAllStreams(socket);
      });
    });
  }

private subscribeToStream(streamName: string, socket: WebSocket) {
  if (!this.streams.has(streamName)) {
    this.streams.set(streamName, { clients: new Set() });
  }

  this.streams.get(streamName)!.clients.add(socket);

  const stream = this.streams.get(streamName);
  stream?.clients.add(socket);
}

  private unsubscribeFromStream(streamName: string, socket: WebSocket) {
    const stream = this.streams.get(streamName);
    if (stream) {
      stream.clients.delete(socket);
      if (stream.clients.size === 0) {
        this.streams.delete(streamName);
      }
    }
  }

  private broadcastToStream(streamName: string, data: any, sender: WebSocket) {
    const stream = this.streams.get(streamName);
    if (stream) {
      stream.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ stream: streamName, data }));
        }
      });
    }
  }

  private removeSocketFromAllStreams(socket: WebSocket) {
    this.streams.forEach((stream, streamName) => {
      stream.clients.delete(socket);
      if (stream.clients.size === 0) {
        this.streams.delete(streamName);
      }
    });
  }

  close() {
    this.wss.close();
  }
}
