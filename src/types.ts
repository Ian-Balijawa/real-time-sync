export type ConflictResolutionStrategy<T> =
  | 'client-wins'
  | 'server-wins'
  | ((clientData: T, serverData: T) => T);

export interface SyncOptions<T> {
  reconnectAttempts?: number;
  reconnectDelay?: number;
  conflictResolution?: ConflictResolutionStrategy<T>;
}

export interface LifecycleHooks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface RealtimeSyncClient<T> extends LifecycleHooks {
  subscribe: (stream: string, callback: (data: T) => void) => void;
  publish: (stream: string, data: T) => void;
  unsubscribe: (stream: string) => void;
  disconnect: () => void;
}
