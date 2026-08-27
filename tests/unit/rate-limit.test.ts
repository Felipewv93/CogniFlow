import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit, getRequestIp } from '@/lib/helpers/rate-limit';

describe('rate-limit helper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('permite requisições até o limite definido', () => {
    const key = 'generate-idea:127.0.0.1';

    expect(checkRateLimit(key, 2, 60_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(checkRateLimit(key, 2, 60_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(checkRateLimit(key, 2, 60_000)).toEqual({ allowed: false, retryAfterSeconds: 60 });
  });

  it('reinicia a janela após expirar', () => {
    const key = 'generate-idea:10.0.0.1';

    expect(checkRateLimit(key, 1, 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(checkRateLimit(key, 1, 1_000)).toEqual({ allowed: false, retryAfterSeconds: 1 });

    vi.setSystemTime(new Date('2026-01-01T00:00:01.001Z'));

    expect(checkRateLimit(key, 1, 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
  });

  it('extrai o IP correto dos headers', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.10, 10.0.0.5',
      'x-real-ip': '198.51.100.7',
    });

    expect(getRequestIp(headers)).toBe('203.0.113.10');
    expect(getRequestIp(new Headers({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
    expect(getRequestIp(new Headers())).toBe('unknown');
  });
});
