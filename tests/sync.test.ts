import { RealTimeSync } from '../src/client';
import { resolveConflict, calculateBackoff, deepClone, validateWebSocketUrl } from '../src/utils';

describe('RealTimeSync', () => {
  const mockUrl = 'ws://localhost:8080';

  it('should create a sync instance', () => {
    const sync = new RealTimeSync(mockUrl);
    expect(sync).toBeTruthy();
  });

  it('should support lifecycle hooks', () => {
    const sync = new RealTimeSync(mockUrl);

    sync.onConnect = jest.fn();
    sync.onDisconnect = jest.fn();
    sync.onError = jest.fn();
  });
});

describe('Utility Functions', () => {
  describe('resolveConflict', () => {
    it('should resolve client-wins strategy', () => {
      const client = { id: 1, name: 'Client' };
      const server = { id: 1, name: 'Server' };
      const result = resolveConflict(client, server, 'client-wins');
      expect(result).toEqual(client);
    });

    it('should support custom merge strategy', () => {
      const client = { id: 1, name: 'Client' };
      const server = { id: 1, name: 'Server' };
      const customStrategy = (c: { name: any; }, s: any) => ({ ...s, name: c.name });
      const result = resolveConflict(client, server, customStrategy);
      expect(result).toEqual({ id: 1, name: 'Client' });
    });
  });

  describe('calculateBackoff', () => {
    it('should calculate exponential backoff', () => {
      expect(calculateBackoff(0)).toBe(1000);
      expect(calculateBackoff(1)).toBe(2000);
      expect(calculateBackoff(2)).toBe(4000);
    });
  });

  describe('deepClone', () => {
    it('should create a deep copy of an object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('validateWebSocketUrl', () => {
    it('should validate WebSocket URLs', () => {
      expect(validateWebSocketUrl('ws://example.com')).toBe(true);
      expect(validateWebSocketUrl('wss://secure.example.com')).toBe(true);
      expect(validateWebSocketUrl('http://invalid.com')).toBe(false);
    });
  });
});
