import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendTeamInviteEmail } from '@/lib/email/emailjs';

type InviteRequestBody = {
  teamId?: string;
  email?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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
      supabase,
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
        supabase: authenticatedSupabase,
      };
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { supabase, userId, email: userEmail } = authUser;

    const body = (await request.json()) as InviteRequestBody;
    const teamId = body.teamId?.trim();
    const invitedEmail = body.email?.trim().toLowerCase();

    if (!teamId || !invitedEmail || !isValidEmail(invitedEmail)) {
      return NextResponse.json({ error: 'Dados inválidos para convite' }, { status: 400 });
    }

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, owner_id')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
    }

    if (team.owner_id !== userId) {
      return NextResponse.json(
        { error: 'Apenas o dono do time pode convidar membros' },
        { status: 403 }
      );
    }

    const { data: existingInvite } = await supabase
      .from('team_invites')
      .select('id')
      .eq('team_id', teamId)
      .eq('email', invitedEmail)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Já existe um convite pendente para este e-mail' },
        { status: 409 }
      );
    }

    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .maybeSingle();

    const inviterName =
      inviterProfile?.full_name || inviterProfile?.email || userEmail || 'Membro do time';

    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .insert({
        team_id: teamId,
        email: invitedEmail,
        invited_by: userId,
      })
      .select('id')
      .single();

    if (inviteError || !invite) {
      console.error('Erro ao criar convite:', inviteError);
      return NextResponse.json({ error: 'Erro ao criar convite' }, { status: 500 });
    }

    const requestOrigin = new URL(request.url).origin;
    const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
    const siteUrl =
      process.env.NODE_ENV === 'development' ? requestOrigin : configuredSiteUrl || requestOrigin;
    const inviteLink = `${siteUrl}/teams/invite/${invite.id}`;

    try {
      await sendTeamInviteEmail({
        toEmail: invitedEmail,
        teamName: team.name,
        inviterName,
        inviteLink,
      });
    } catch (emailError: any) {
      console.error('Erro ao enviar e-mail de convite:', emailError);

      await supabase.from('team_invites').delete().eq('id', invite.id);

      return NextResponse.json(
        {
          error:
            emailError?.message ||
            'Não foi possível enviar o e-mail de convite. Verifique a configuração do serviço.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Convite enviado com sucesso',
      inviteId: invite.id,
      inviteLink,
    });
  } catch (error) {
    console.error('Erro no POST /api/teams/invite:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
