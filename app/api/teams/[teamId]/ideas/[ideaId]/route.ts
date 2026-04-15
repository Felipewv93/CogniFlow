import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type RouteContext = {
  params: { teamId: string; ideaId: string };
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

async function canAccessTeam(teamId: string, userId: string) {
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('id, owner_id')
    .eq('id', teamId)
    .single();

  if (teamError || !team) {
    return { allowed: false, status: 404, error: 'Time não encontrado' };
  }

  if (team.owner_id === userId) {
    return { allowed: true, isOwner: true };
  }

  const { data: memberAccess } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!memberAccess) {
    return { allowed: false, status: 403, error: 'Acesso negado ao time' };
  }

  return { allowed: true, isOwner: false };
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId, ideaId } = context.params;
    const access = await canAccessTeam(teamId, authUser.userId);

    if (!access.allowed) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body = await request.json();

    const { data: idea, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('id, user_id, team_id')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Ideia não encontrada' }, { status: 404 });
    }

    if (idea.user_id !== authUser.userId && !access.isOwner) {
      return NextResponse.json(
        { error: 'Apenas o autor ou o dono do time pode editar' },
        { status: 403 }
      );
    }

    const { team_id: _teamId, ...updateData } = body || {};

    const { data: updatedIdea, error: updateError } = await supabaseAdmin
      .from('ideas')
      .update(updateData)
      .eq('id', ideaId)
      .select('*')
      .single();

    if (updateError || !updatedIdea) {
      return NextResponse.json({ error: 'Erro ao atualizar ideia' }, { status: 500 });
    }

    return NextResponse.json({ idea: updatedIdea });
  } catch (error) {
    console.error('Erro no PUT /api/teams/[teamId]/ideas/[ideaId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId, ideaId } = context.params;
    const access = await canAccessTeam(teamId, authUser.userId);

    if (!access.allowed) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body = await request.json();
    const action = String(body?.action || '').toLowerCase();

    const { data: idea, error: ideaError } = await supabaseAdmin
      .from('ideas')
      .select('id, user_id, team_id')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Ideia não encontrada' }, { status: 404 });
    }

    if (idea.user_id !== authUser.userId && !access.isOwner) {
      return NextResponse.json(
        { error: 'Apenas o autor ou o dono do time pode alterar' },
        { status: 403 }
      );
    }

    const nextTeamId = action === 'share' ? teamId : null;

    const { data: updatedIdea, error: updateError } = await supabaseAdmin
      .from('ideas')
      .update({ team_id: nextTeamId })
      .eq('id', ideaId)
      .select('*')
      .single();

    if (updateError || !updatedIdea) {
      return NextResponse.json({ error: 'Erro ao alterar ideia' }, { status: 500 });
    }

    return NextResponse.json({ idea: updatedIdea });
  } catch (error) {
    console.error('Erro no PATCH /api/teams/[teamId]/ideas/[ideaId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
