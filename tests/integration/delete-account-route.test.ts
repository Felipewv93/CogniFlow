import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/delete-account/route';

const mocks = vi.hoisted(() => {
  const auth = {
    getSession: vi.fn(),
  };

  const createRouteHandlerClient = vi.fn(() => ({ auth }));

  const supabaseAdmin = {
    from: vi.fn(),
    auth: {
      admin: {
        deleteUser: vi.fn(),
      },
    },
  };

  return { auth, createRouteHandlerClient, supabaseAdmin };
});

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: mocks.createRouteHandlerClient,
}));

vi.mock('@/supabase/client', () => ({
  supabaseAdmin: mocks.supabaseAdmin,
}));

function createQueryBuilder(response: any) {
  const builder: any = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    then: (resolve: (value: any) => void, reject: (reason?: any) => void) =>
      Promise.resolve(response).then(resolve, reject),
  };

  return builder;
}

function buildRequest() {
  return new Request('http://localhost/api/delete-account', {
    method: 'POST',
    headers: {
      authorization: 'Bearer test-token',
    },
  });
}

describe('POST /api/delete-account', () => {
  beforeEach(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    mocks.auth.getSession.mockReset();
    mocks.supabaseAdmin.from.mockReset();
    mocks.supabaseAdmin.auth.admin.deleteUser.mockReset();
  });

  afterEach(() => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    vi.clearAllMocks();
  });

  it('retorna 401 quando o usuário não está autenticado', async () => {
    mocks.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const response = await POST(buildRequest());
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Não autenticado');
  });

  it('remove a conta e os recursos associados com sucesso', async () => {
    mocks.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            email: 'user@example.com',
          },
        },
      },
      error: null,
    });

    mocks.supabaseAdmin.from.mockImplementation((table: string) => {
      if (table === 'teams') {
        return createQueryBuilder({
          data: [{ id: 'team-1' }],
          error: null,
        });
      }

      return createQueryBuilder({
        data: null,
        error: null,
      });
    });

    mocks.supabaseAdmin.auth.admin.deleteUser.mockResolvedValue({ error: null });

    const response = await POST(buildRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toBe('Conta deletada com sucesso');
    expect(mocks.supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith('user-1');
  });
});
