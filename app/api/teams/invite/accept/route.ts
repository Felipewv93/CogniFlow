import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/supabase/client';

type AcceptInviteRequestBody = {
  inviteId?: string;
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
    const url = new URL(request.url);
    const inviteId = url.searchParams.get('inviteId')?.trim();

    if (!inviteId) {
      return NextResponse.json({ error: 'ID do convite inválido' }, { status: 400 });
    }

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('team_invites')
      .select('id, team_id, email, status, expires_at')
      .eq('id', inviteId)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 });
    }

    if (invite.status !== 'pending') {
      return NextResponse.json({ error: 'Este convite não está mais pendente' }, { status: 409 });
    }

    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      await supabaseAdmin.from('team_invites').update({ status: 'expired' }).eq('id', inviteId);
      return NextResponse.json({ error: 'Este convite expirou' }, { status: 410 });
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, name')
      .eq('id', invite.team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      invite: {
        id: invite.id,
        email: invite.email,
        teamId: invite.team_id,
        teamName: team.name,
      },
    });
  } catch (error) {
    console.error('Erro no GET /api/teams/invite/accept:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
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
    const userEmail = (authUser.email || '').toLowerCase();

    const body = (await request.json()) as AcceptInviteRequestBody;
    const inviteId = body.inviteId?.trim();

    if (!inviteId) {
      return NextResponse.json({ error: 'ID do convite inválido' }, { status: 400 });
    }

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('team_invites')
      .select('id, team_id, email, status, expires_at')
      .eq('id', inviteId)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 });
    }

    if (invite.status !== 'pending') {
      return NextResponse.json({ error: 'Este convite não está mais pendente' }, { status: 409 });
    }

    if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
      await supabaseAdmin.from('team_invites').update({ status: 'expired' }).eq('id', inviteId);
      return NextResponse.json({ error: 'Este convite expirou' }, { status: 410 });
    }

    if (!userEmail || invite.email.toLowerCase() !== userEmail) {
      return NextResponse.json(
        { error: 'Este convite foi enviado para outro e-mail' },
        { status: 403 }
      );
    }

    const { data: existingMember } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', invite.team_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingMember) {
      const { error: memberError } = await supabaseAdmin.from('team_members').insert({
        team_id: invite.team_id,
        user_id: userId,
        role: 'member',
      });

      if (memberError) {
        console.error('Erro ao adicionar membro no time:', memberError);
        return NextResponse.json({ error: 'Erro ao adicionar membro no time' }, { status: 500 });
      }
    }

    const { error: updateInviteError } = await supabaseAdmin
      .from('team_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    if (updateInviteError) {
      console.error('Erro ao atualizar status do convite:', updateInviteError);
      return NextResponse.json({ error: 'Erro ao concluir convite' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Convite aceito com sucesso',
      teamId: invite.team_id,
    });
  } catch (error) {
    console.error('Erro no POST /api/teams/invite/accept:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
