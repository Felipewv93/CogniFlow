import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type RouteContext = {
  params: { teamId: string };
};

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

export async function GET(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId } = context.params;

    if (!teamId) {
      return NextResponse.json({ error: 'ID do time inválido' }, { status: 400 });
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, name, description, website, owner_id, created_at, updated_at')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    const isOwner = team.owner_id === authUser.userId;

    const { data: memberAccess } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('user_id', authUser.userId)
      .maybeSingle();

    if (!isOwner && !memberAccess) {
      return NextResponse.json({ error: 'Acesso negado ao time' }, { status: 403 });
    }

    const { data: ownerProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name, name')
      .eq('id', team.owner_id)
      .maybeSingle();

    let ownerName = 'Proprietário';
    let ownerEmail = '';

    if (ownerProfile) {
      ownerEmail = ownerProfile.email || '';
      ownerName =
        ownerProfile.full_name ||
        ownerProfile.name ||
        ownerProfile.email?.split('@')[0] ||
        'Proprietário';
    } else {
      const { data: ownerAuth } = await supabaseAdmin.auth.admin.getUserById(team.owner_id);
      ownerEmail = ownerAuth.user?.email || '';
      ownerName = ownerAuth.user?.email?.split('@')[0] || 'Proprietário';
    }

    const { data: membersData, error: membersError } = await supabaseAdmin
      .from('team_members')
      .select('id, user_id, role, joined_at')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (membersError) {
      return NextResponse.json({ error: 'Erro ao carregar membros' }, { status: 500 });
    }

    const memberIds = membersData?.map((member) => member.user_id) || [];
    const memberProfiles =
      memberIds.length > 0
        ? await supabaseAdmin
            .from('profiles')
            .select('id, email, full_name, name')
            .in('id', memberIds)
        : { data: [] as any[] };

    const members = (membersData || []).map((member) => {
      const profile = memberProfiles.data?.find((profile) => profile.id === member.user_id);
      return {
        ...member,
        email: profile?.email || '',
        name: profile?.full_name || profile?.name || profile?.email?.split('@')[0] || '',
      };
    });

    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (ideasError) {
      return NextResponse.json({ error: 'Erro ao carregar ideias' }, { status: 500 });
    }

    const { data: userIdeas, error: userIdeasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .eq('user_id', authUser.userId)
      .is('team_id', null)
      .order('created_at', { ascending: false });

    if (userIdeasError) {
      return NextResponse.json({ error: 'Erro ao carregar suas ideias' }, { status: 500 });
    }

    const { data: pendingInvites, error: invitesError } = isOwner
      ? await supabaseAdmin
          .from('team_invites')
          .select('id, email, status, created_at')
          .eq('team_id', teamId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
      : { data: [] as any[], error: null };

    if (invitesError) {
      return NextResponse.json({ error: 'Erro ao carregar convites' }, { status: 500 });
    }

    type InviteSummary = {
      id: string;
      email: string;
      status: string;
      created_at: string;
    };

    const uniqueInvites = (pendingInvites || []).reduce<InviteSummary[]>((accumulator, invite) => {
      const normalizedEmail = invite.email.toLowerCase();

      if (
        !accumulator.some(
          (existingInvite: InviteSummary) => existingInvite.email.toLowerCase() === normalizedEmail
        )
      ) {
        accumulator.push(invite);
      }

      return accumulator;
    }, []);

    return NextResponse.json({
      team,
      owner: {
        id: team.owner_id,
        email: ownerEmail,
        name: ownerName,
      },
      isOwner,
      members,
      ideas: ideas || [],
      userIdeas: userIdeas || [],
      invites: uniqueInvites || [],
    });
  } catch (error) {
    console.error('Erro no GET /api/teams/[teamId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId } = context.params;

    if (!teamId) {
      return NextResponse.json({ error: 'ID do time inválido' }, { status: 400 });
    }

    const body = await request.json();
    const name = String(body?.name || '').trim();
    const description = String(body?.description || '').trim();
    const website = String(body?.website || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'O nome do time é obrigatório' }, { status: 400 });
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
      return NextResponse.json({ error: 'Apenas o dono do time pode editar' }, { status: 403 });
    }

    const { data: updatedTeam, error: updateError } = await supabaseAdmin
      .from('teams')
      .update({
        name,
        description: description || null,
        website: website || null,
      })
      .eq('id', teamId)
      .select('id, name, description, website, owner_id, created_at, updated_at')
      .single();

    if (updateError || !updatedTeam) {
      return NextResponse.json({ error: 'Erro ao atualizar time' }, { status: 500 });
    }

    return NextResponse.json({ team: updatedTeam });
  } catch (error) {
    console.error('Erro no PUT /api/teams/[teamId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { teamId } = context.params;

    if (!teamId) {
      return NextResponse.json({ error: 'ID do time inválido' }, { status: 400 });
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, owner_id, name')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    if (team.owner_id !== authUser.userId) {
      return NextResponse.json({ error: 'Apenas o dono do time pode deletar' }, { status: 403 });
    }

    const { error: deleteError } = await supabaseAdmin.from('teams').delete().eq('id', teamId);

    if (deleteError) {
      return NextResponse.json({ error: 'Erro ao deletar time' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Time deletado com sucesso' });
  } catch (error) {
    console.error('Erro no DELETE /api/teams/[teamId]:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
