
/**
 * Apply conflict resolution strategy
 * @param clientData Client-side data
 * @param serverData Server-side data
 * @param strategy Conflict resolution strategy
 */
export function resolveConflict<T>(
  clientData: T,
  serverData: T,
  strategy: 'client-wins' | 'server-wins' | ((c: T, s: T) => T)
): T {
  if (strategy === 'client-wins') {
    return clientData;
  }

  if (strategy === 'server-wins') {
    return serverData;
  }

  if (typeof strategy === 'function') {
    return strategy(clientData, serverData);
  }

  throw new Error('Invalid conflict resolution strategy');
}

/**
 * Exponential backoff calculation
 * @param attempt Current reconnection attempt
 * @param baseDelay Base delay between attempts
 */
export function calculateBackoff(
  attempt: number,
  baseDelay = 1000
): number {
  return baseDelay * Math.pow(2, attempt);
}

/**
 * Deep clone utility to create a complete copy of an object
 * @param obj Object to clone
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone) as T;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
}

/**
 * Validate WebSocket URL
 * @param url WebSocket URL to validate
 */
export function validateWebSocketUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['ws:', 'wss:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
