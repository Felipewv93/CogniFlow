import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/layout/navbar';
import { IdeaForm } from '@/components/dashboard/idea-form';

const mocks = vi.hoisted(() => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  };

  const supabase = {
    from: vi.fn(),
  };

  const authState = {
    user: null as { id: string; email: string | null } | null,
    signOut: vi.fn(),
  };

  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  return { router, supabase, authState, toast };
});

vi.mock('next/navigation', () => ({
  useRouter: () => mocks.router,
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { priority, ...rest } = props;
    return React.createElement('img', rest);
  },
}));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mocks.supabase,
}));

vi.mock('@/supabase/client', () => ({
  supabase: mocks.supabase,
}));

vi.mock('@/lib/auth-context', () => ({
  useAuth: () => ({ user: mocks.authState.user, signOut: mocks.authState.signOut }),
}));

vi.mock('sonner', () => ({
  toast: mocks.toast,
}));

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => React.createElement('button', { type: 'button' }, 'Theme'),
}));

function createProfileBuilder(profile: any) {
  const builder: any = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(async () => ({ data: profile, error: null })),
    then: (resolve: (value: any) => void, reject: (reason?: any) => void) =>
      Promise.resolve({ data: profile, error: null }).then(resolve, reject),
  };

  return builder;
}

describe('Navbar', () => {
  beforeEach(() => {
    mocks.router.push.mockReset();
    mocks.authState.signOut.mockReset();
    mocks.toast.success.mockReset();
    mocks.toast.error.mockReset();
    mocks.supabase.from.mockReset();
    mocks.authState.user = { id: 'user-1', email: 'ana@example.com' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('mostra o nome do perfil e faz logout', async () => {
    mocks.supabase.from.mockReturnValue(
      createProfileBuilder({
        full_name: 'Ana Silva',
      })
    );

    const user = userEvent.setup();
    render(<Navbar />);

    await waitFor(() => expect(screen.getByRole('button', { name: /Ana Silva/ })).toBeVisible());

    await user.click(screen.getByRole('button', { name: /Ana Silva/ }));
    await user.click(screen.getAllByRole('button', { name: 'Sair' })[0]);

    expect(mocks.authState.signOut).toHaveBeenCalledTimes(1);
    expect(mocks.router.push).toHaveBeenCalledWith('/');
    expect(mocks.toast.success).toHaveBeenCalledWith('Logout realizado!');
  });
});

describe('IdeaForm', () => {
  beforeEach(() => {
    mocks.router.push.mockReset();
    mocks.authState.signOut.mockReset();
    mocks.toast.success.mockReset();
    mocks.toast.error.mockReset();
    mocks.supabase.from.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('envia os dados da ideia com tags normalizadas', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<IdeaForm onSubmit={onSubmit} onCancel={onCancel} />);

    await user.type(screen.getByPlaceholderText('Ex: App de Produtividade com IA'), 'App de IA');
    await user.selectOptions(screen.getByRole('combobox'), 'Conteúdo');
    await user.type(screen.getByPlaceholderText('Resumo em uma linha'), 'Resumo curto');
    await user.type(screen.getByPlaceholderText('Descreva sua ideia em detalhes...'), 'Descrição completa');
    await user.type(
      screen.getByPlaceholderText('react, typescript, saas (separadas por vírgula)'),
      '  ia, saas, produto  '
    );

    await user.click(screen.getByRole('button', { name: 'Criar Ideia' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'App de IA',
        category: 'Conteúdo',
        description: 'Resumo curto',
        content: 'Descrição completa',
        tags: ['ia', 'saas', 'produto'],
        is_favorite: false,
      })
    );
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
