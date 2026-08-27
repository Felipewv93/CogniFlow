import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/teams/route';

const mocks = vi.hoisted(() => {
  const auth = {
    getSession: vi.fn(),
  };

  const createRouteHandlerClient = vi.fn(() => ({ auth }));

  const createClient = vi.fn(() => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: null },
        error: null,
      })),
    },
  }));

  const supabaseAdmin = {
    from: vi.fn(),
    auth: {
      admin: {
        getUserById: vi.fn(),
      },
    },
  };

  return { auth, createRouteHandlerClient, createClient, supabaseAdmin };
});

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: mocks.createRouteHandlerClient,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: mocks.createClient,
}));

vi.mock('@/supabase/client', () => ({
  supabaseAdmin: mocks.supabaseAdmin,
}));

function buildRequest() {
  return new Request('http://localhost/api/teams', {
    method: 'GET',
    headers: {
      authorization: 'Bearer test-token',
    },
  });
}

function createQueryBuilder(resolver: (state: any) => any) {
  const state: any = { selectText: '', filters: {}, ordered: false };
  const builder: any = {
    select: vi.fn((text?: string) => {
      state.selectText = text || '';
      return builder;
    }),
    eq: vi.fn((field: string, value: any) => {
      state.filters[field] = value;
      return builder;
    }),
    in: vi.fn((field: string, value: any) => {
      state.filters[field] = value;
      return builder;
    }),
    is: vi.fn((field: string, value: any) => {
      state.filters[field] = value;
      return builder;
    }),
    maybeSingle: vi.fn(async () => resolver({ ...state, terminal: 'maybeSingle' })),
    single: vi.fn(async () => resolver({ ...state, terminal: 'single' })),
    order: vi.fn(() => {
      state.ordered = true;
      return builder;
    }),
    then: (resolve: (value: any) => void, reject: (reason?: any) => void) =>
      Promise.resolve(resolver({ ...state, terminal: 'then' })).then(resolve, reject),
  };

  return builder;
}

describe('GET /api/teams', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    mocks.auth.getSession.mockReset();
    mocks.supabaseAdmin.from.mockReset();
    mocks.supabaseAdmin.auth.admin.getUserById.mockReset();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    vi.clearAllMocks();
  });

  it('retorna 401 quando não há sessão', async () => {
    mocks.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const response = await GET(buildRequest());
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Não autenticado');
  });

  it('lista times com métricas para um usuário autenticado', async () => {
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
        return createQueryBuilder((state) => {
          if (state.filters.id === 'team-1' || state.filters.owner_id === 'user-1') {
            const team = {
              id: 'team-1',
              name: 'Time Alpha',
              description: 'Equipe principal',
              website: null,
              owner_id: 'user-1',
              created_at: '2026-01-01T00:00:00.000Z',
            };

            if (state.terminal === 'single' || state.terminal === 'maybeSingle') {
              return { data: team, error: null };
            }

            return { data: [team], error: null };
          }

          return { data: [], error: null };
        });
      }

      if (table === 'team_members') {
        return createQueryBuilder((state) => {
          if (state.selectText === 'team_id') {
            return { data: [], error: null };
          }

          if (state.selectText.includes('count')) {
            return { count: 0 };
          }

          if (state.selectText.includes('id, user_id, role, joined_at')) {
            return {
              data: [
                {
                  id: 'member-1',
                  user_id: 'user-2',
                  role: 'member',
                  joined_at: '2026-01-01T00:00:00.000Z',
                },
              ],
              error: null,
            };
          }

          if (state.selectText === 'id') {
            return { data: null, error: null };
          }

          return { data: null, error: null };
        });
      }

      if (table === 'profiles') {
        return createQueryBuilder((state) => {
          if (state.selectText.includes('id, email, full_name, name')) {
            return {
              data: [
                {
                  id: 'user-2',
                  email: 'member@example.com',
                  full_name: 'Membro Exemplo',
                  name: null,
                },
              ],
              error: null,
            };
          }

          return {
            data: {
              email: 'user@example.com',
              full_name: 'Usuário Principal',
              name: null,
            },
            error: null,
          };
        });
      }

      if (table === 'ideas') {
        return createQueryBuilder((state) => {
          if (!state.ordered) {
            return { count: 0 };
          }

          return {
            data: [
              {
                id: 'idea-1',
                title: 'Ideia do time',
                description: 'Descrição',
                category: 'Startup',
                created_at: '2026-01-01T00:00:00.000Z',
                user_id: 'user-2',
                is_favorite: false,
                content: 'Conteúdo',
                tags: [],
              },
            ],
            error: null,
          };
        });
      }

      if (table === 'team_invites') {
        return createQueryBuilder((state) => {
          if (state.selectText.includes('id, email, status, created_at')) {
            return {
              data: [
                {
                  id: 'invite-1',
                  email: 'member@example.com',
                  status: 'pending',
                  created_at: '2026-01-01T00:00:00.000Z',
                },
              ],
              error: null,
            };
          }

          return { data: [], error: null };
        });
      }

      return createQueryBuilder(() => ({ data: null, error: null }));
    });

    mocks.supabaseAdmin.auth.admin.getUserById.mockResolvedValue({
      data: { user: { email: 'user@example.com' } },
      error: null,
    });

    const response = await GET(buildRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.teams).toHaveLength(1);
    expect(payload.teams[0]).toMatchObject({
      id: 'team-1',
      name: 'Time Alpha',
      member_count: 1,

    });
  });
});
