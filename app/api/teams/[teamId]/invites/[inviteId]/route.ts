import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type RouteContext = {
  params: { teamId: string; inviteId: string };
};

async function getAuthenticatedUser(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!sessionError && session?.user) {
    return { userId: session.user.id, email: session.user.email || null };
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: tokenError,
    } = await authenticatedSupabase.auth.getUser(token);

    if (!tokenError && user) {
      return { userId: user.id, email: user.email || null };
    }
  }

  return null;
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId, inviteId } = context.params;

    if (!teamId || !inviteId) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Verificar se o usuário é o dono do time
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, owner_id')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    if (team.owner_id !== authUser.userId) {
      return NextResponse.json(
        { error: 'Apenas o dono do time pode deletar convites' },
        { status: 403 }
      );
    }

    // Deletar o convite
    const { error: deleteError } = await supabaseAdmin
      .from('team_invites')
      .delete()
      .eq('id', inviteId)
      .eq('team_id', teamId);

    if (deleteError) {
      console.error('Erro ao deletar convite:', deleteError);
      return NextResponse.json({ error: 'Erro ao deletar convite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar DELETE invite:', error);
    return NextResponse.json({ error: 'Erro ao processar requisição' }, { status: 500 });
  }
}
