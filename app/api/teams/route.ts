import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type TeamSummary = {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  owner_id: string;
  created_at: string;
  member_count: number;
  idea_count: number;
  template_count: number;
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

export async function GET(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { data: ownedTeams, error: ownedError } = await supabaseAdmin
      .from('teams')
      .select('id, name, description, website, owner_id, created_at')
      .eq('owner_id', authUser.userId);

    if (ownedError) {
      return NextResponse.json({ error: 'Erro ao carregar times próprios' }, { status: 500 });
    }

    const { data: memberRows, error: memberError } = await supabaseAdmin
      .from('team_members')
      .select('team_id')
      .eq('user_id', authUser.userId);

    if (memberError) {
      return NextResponse.json({ error: 'Erro ao carregar times de membro' }, { status: 500 });
    }

    const memberTeamIds = (memberRows || []).map((row) => row.team_id);

    const { data: memberTeams, error: memberTeamsError } =
      memberTeamIds.length > 0
        ? await supabaseAdmin
            .from('teams')
            .select('id, name, description, website, owner_id, created_at')
            .in('id', memberTeamIds)
        : { data: [], error: null };

    if (memberTeamsError) {
      return NextResponse.json({ error: 'Erro ao carregar times de membro' }, { status: 500 });
    }

    const allTeamsById = new Map<string, (typeof ownedTeams)[number]>();

    [...(ownedTeams || []), ...(memberTeams || [])].forEach((team) => {
      allTeamsById.set(team.id, team);
    });

    const allTeams = Array.from(allTeamsById.values());

    const teamsWithStats: TeamSummary[] = await Promise.all(
      allTeams.map(async (team) => {
        const [{ count: memberCount }, { count: ideaCount }] = await Promise.all([
          supabaseAdmin
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id),
          supabaseAdmin
            .from('ideas')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id),
        ]);

        return {
          ...team,
          member_count: (memberCount || 0) + 1,
          idea_count: ideaCount || 0,
          template_count: 0,
        };
      })
    );

    return NextResponse.json({
      teams: teamsWithStats,
    });
  } catch (error) {
    console.error('Erro no GET /api/teams:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name || '').trim();
    const description = String(body?.description || '').trim();
    const website = String(body?.website || '').trim();

    if (!name) {
      return NextResponse.json({ error: 'Digite um nome para o time' }, { status: 400 });
    }

    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .insert({
        name,
        description: description || null,
        website: website || null,
        owner_id: authUser.userId,
      })
      .select('id, name, description, website, owner_id, created_at')
      .single();

    if (error || !team) {
      console.error('Erro ao criar time:', error);
      return NextResponse.json({ error: 'Erro ao criar time' }, { status: 500 });
    }

    return NextResponse.json({
      team: {
        ...team,
        member_count: 1,
        idea_count: 0,
        template_count: 0,
      },
    });
  } catch (error) {
    console.error('Erro no POST /api/teams:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
