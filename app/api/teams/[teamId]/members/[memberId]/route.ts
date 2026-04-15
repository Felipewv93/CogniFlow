import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type RouteContext = {
  params: { teamId: string; memberId: string };
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

    const { teamId, memberId } = context.params;

    if (!teamId || !memberId) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

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
        { error: 'Apenas o dono do time pode remover membros' },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (deleteError) {
      return NextResponse.json({ error: 'Erro ao remover membro' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Membro removido' });
  } catch (error) {
    console.error('Erro no DELETE /api/teams/[teamId]/members/[memberId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
