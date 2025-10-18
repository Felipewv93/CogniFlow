import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST: Alterar senha do usuário
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = session.user;

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validações
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar senha atual tentando fazer login
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      );
    }

    // Atualizar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Senha atualizada com sucesso',
    });
  } catch (error) {
    console.error('Erro no POST /api/change-password:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
