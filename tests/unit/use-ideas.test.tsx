import { renderHook, waitFor, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdeas } from '@/lib/hooks/use-ideas';

const mocks = vi.hoisted(() => {
  const supabase = {
    from: vi.fn(),
  };

  const authState = {
    user: null as { id: string; email: string | null } | null,
  };

  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  return { supabase, authState, toast };
});

vi.mock('@/supabase/client', () => ({
  supabase: mocks.supabase,
}));

vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({ user: mocks.authState.user }),
}));

vi.mock('sonner', () => ({
  toast: mocks.toast,
}));

function createQueryBuilder(response: any) {
  const builder: any = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    is: vi.fn(() => builder),
    order: vi.fn(() => builder),
    single: vi.fn(async () => response),
    then: (resolve: (value: any) => void, reject: (reason?: any) => void) =>
      Promise.resolve(response).then(resolve, reject),
  };

  return builder;
}

describe('useIdeas', () => {
  beforeEach(() => {
    mocks.supabase.from.mockReset();
    mocks.toast.success.mockReset();
    mocks.toast.error.mockReset();
    mocks.authState.user = { id: 'user-1', email: 'user@example.com' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('busca ideias do dashboard quando há usuário autenticado', async () => {
    mocks.supabase.from.mockReturnValue(
      createQueryBuilder({
        data: [
          {
            id: 'idea-1',
            user_id: 'user-1',
            title: 'Ideia inicial',
            description: 'Resumo',
            category: 'Startup',
            tags: [],
            content: 'Conteúdo',
            is_favorite: false,
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-01T00:00:00.000Z',
          },
        ],
        error: null,
      })
    );

    const { result } = renderHook(() => useIdeas());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.ideas).toHaveLength(1);
    expect(mocks.supabase.from).toHaveBeenCalledWith('ideas');
  });

  it('cria ideia com user_id e atualiza a lista local', async () => {
    const createdIdea = {
      id: 'idea-2',
      user_id: 'user-1',
      title: 'Nova ideia',
      description: 'Descrição',
      category: 'Startup',
      tags: ['ia'],
      content: 'Conteúdo gerado',
      is_favorite: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    };

    mocks.supabase.from.mockImplementation(() =>
      createQueryBuilder({
        data: [],
        error: null,
      })
    );

    const { result } = renderHook(() => useIdeas());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mocks.supabase.from.mockReturnValueOnce(
      createQueryBuilder({
        data: createdIdea,
        error: null,
      })
    );

    await act(async () => {
      await result.current.createIdea({
        title: 'Nova ideia',
        description: 'Descrição',
        category: 'Startup',
        tags: ['ia'],
        content: 'Conteúdo gerado',
        is_favorite: false,
      });
    });

    expect(mocks.supabase.from).toHaveBeenCalledWith('ideas');
    expect(mocks.toast.success).toHaveBeenCalledWith('Ideia criada com sucesso!');
    expect(result.current.ideas[0]).toMatchObject({
      id: 'idea-2',
      title: 'Nova ideia',
      user_id: 'user-1',
    });
  });

  it('remove ideia da lista após exclusão', async () => {
    const initialIdea = {
      id: 'idea-3',
      user_id: 'user-1',
      title: 'Ideia para remover',
      description: 'Resumo',
      category: 'Startup',
      tags: [],
      content: 'Conteúdo',
      is_favorite: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    };

    mocks.supabase.from.mockImplementation(() =>
      createQueryBuilder({
        data: [initialIdea],
        error: null,
      })
    );

    const { result } = renderHook(() => useIdeas());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mocks.supabase.from.mockReturnValueOnce(
      createQueryBuilder({
        data: null,
        error: null,
      })
    );

    await act(async () => {
      await result.current.deleteIdea('idea-3');
    });

    expect(result.current.ideas).toHaveLength(0);
    expect(mocks.toast.success).toHaveBeenCalledWith('Ideia deletada!');
  });
});
