# real-time-sync 🔄

A lightweight, type-safe WebSocket-based real-time data synchronization library for TypeScript.

## 🚀 Features

- **Effortless Real-Time Synchronization**
- **Strong TypeScript Type Safety**
- **Automatic Reconnection**
- **Flexible Conflict Resolution**
- **Minimal Dependencies**

## 📦 Installation

```bash
npm install real-time-sync
```

## 💡 Basic Usage

```typescript
import { RealTimeSync } from 'real-time-sync';

interface UserData {
  id: number;
  name: string;
}

const sync = new RealTimeSync<UserData>('ws://localhost:8080', {
  reconnectAttempts: 3,
  conflictResolution: 'client-wins'
});

sync.subscribe('users', (userData) => {
  console.log('Received user data:', userData);
});

sync.publish('users', { id: 1, name: 'John Doe' });

sync.onConnect = () => console.log('Connected to server');
sync.onDisconnect = () => console.log('Disconnected from server');
sync.onError = (error) => console.error('Connection error:', error);
```

## 🛠 Configuration Options

### Constructor Options

- `url`: WebSocket server URL
- `reconnectAttempts`: Maximum number of reconnection attempts (default: 5)
- `reconnectDelay`: Initial delay between reconnection attempts (default: 1000ms)
- `conflictResolution`: Data conflict resolution strategy

### Conflict Resolution Strategies

1. `'client-wins'`: Client data takes precedence
2. `'server-wins'`: Server data takes precedence
3. Custom merge function: Define your own resolution logic

```typescript
const sync = new RealTimeSync<UserData>(url, {
  conflictResolution: (clientData, serverData) => {
    // Custom merge logic
    return { ...serverData, ...clientData };
  }
});
```

## 🔌 API Methods

- `subscribe(stream: string, callback)`: Listen to a specific data stream
- `publish(stream: string, data)`: Send data to a stream
- `unsubscribe(stream: string)`: Stop listening to a stream
- `disconnect()`: Close the WebSocket connection

## 🔒 Lifecycle Hooks

- `onConnect`: Triggered when connection is established
- `onDisconnect`: Triggered when connection is lost
- `onError`: Triggered on connection errors

## 📋 Requirements

- TypeScript 4.x+
- Modern browsers with WebSocket support

## 🤝 Contributing

Contributions are welcome! Please submit pull requests or open issues on our GitHub repository.

## 📄 License

MIT License
