import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/generate-idea/route';

const mocks = vi.hoisted(() => {
  return {
    checkRateLimit: vi.fn(),
    getRequestIp: vi.fn(),
  };
});

vi.mock('@/lib/helpers/rate-limit', () => ({
  checkRateLimit: (...args: any[]) => mocks.checkRateLimit(...args),
  getRequestIp: (...args: any[]) => mocks.getRequestIp(...args),
}));

function buildRequest(body: Record<string, any>) {
  return new Request('http://localhost/api/generate-idea', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.5',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/generate-idea', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mocks.checkRateLimit.mockReturnValue({ allowed: true, retryAfterSeconds: 0 });
    mocks.getRequestIp.mockReturnValue('203.0.113.5');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('retorna ideias em modo demo para um prompt válido', async () => {
    const promise = POST(
      buildRequest({
        prompt: 'App de produtividade para estudantes',
        category: 'Tecnologia',
        tone: 'Inspirador',
      }) as any
    );

    await vi.advanceTimersByTimeAsync(1500);
    const response = await promise;
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ideas).toHaveLength(3);
    expect(payload.ideas[0].title).toContain('App de produtividade para estudantes');
  });

  it('retorna erro quando o prompt está ausente', async () => {
    const response = await POST(buildRequest({ prompt: '' }) as any);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Prompt é obrigatório');
  });

  it('retorna 429 quando excede o rate limit', async () => {
    mocks.checkRateLimit.mockReturnValueOnce({ allowed: false, retryAfterSeconds: 12 });

    const response = await POST(
      buildRequest({ prompt: 'Ideia para SaaS', category: 'Produto', tone: 'Técnico' }) as any
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('12');
    expect(payload.error).toBe('Muitas requisições. Tente novamente em instantes.');
  });
});
