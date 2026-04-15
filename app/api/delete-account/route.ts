import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

async function getAuthenticatedUser(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!sessionError && session?.user) {
    return {
      userId: session.user.id,
      email: session.user.email || null,
    };
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
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user },
      error: tokenError,
    } = await authenticatedSupabase.auth.getUser(token);

    if (!tokenError && user) {
      return {
        userId: user.id,
        email: user.email || null,
      };
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Configuração ausente: SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = authUser.userId;

    const { data: ownedTeams, error: teamsError } = await supabaseAdmin
      .from('teams')
      .select('id')
      .eq('owner_id', userId);

    if (teamsError) {
      return NextResponse.json({ error: 'Erro ao localizar times do usuário' }, { status: 500 });
    }

    const ownedTeamIds = (ownedTeams || []).map((team) => team.id);

    if (ownedTeamIds.length > 0) {
      const { error: teamIdeasError } = await supabaseAdmin
        .from('ideas')
        .delete()
        .in('team_id', ownedTeamIds);

      if (teamIdeasError) {
        return NextResponse.json({ error: 'Erro ao remover ideias dos times' }, { status: 500 });
      }
    }

    await supabaseAdmin.from('ideas').delete().eq('user_id', userId);
    await supabaseAdmin.from('templates').delete().eq('user_id', userId);
    await supabaseAdmin.from('ai_conversations').delete().eq('user_id', userId);
    await supabaseAdmin.from('export_configs').delete().eq('user_id', userId);

    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      return NextResponse.json({ error: 'Erro ao deletar conta' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro no POST /api/delete-account:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
