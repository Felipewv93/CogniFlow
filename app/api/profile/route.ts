import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET: Buscar dados do perfil
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Usar getSession ao invés de getUser para melhor compatibilidade
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      console.error('Erro de autenticação:', authError || 'Sessão não encontrada');
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = session.user;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Erro ao buscar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        full_name: profile.full_name || profile.name,
        email: profile.email,
        bio: profile.bio,
        company: profile.company,
        role: profile.role,
        avatar_url: profile.avatar_url,
        theme: profile.theme || 'dark',
        notification_preferences: profile.notification_preferences || {
          email: true,
          push: true,
          ideias: true,
          templates: false,
          times: true,
          marketing: false,
        },
        created_at: profile.created_at,
      },
    });
  } catch (error) {
    console.error('Erro no GET /api/profile:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar dados do perfil
export async function PUT(request: Request) {
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
    const {
      full_name,
      bio,
      company,
      role,
      avatar_url,
      theme,
      notification_preferences,
    } = body;

    // Preparar dados para atualização (apenas campos permitidos)
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (bio !== undefined) updateData.bio = bio;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (theme !== undefined) updateData.theme = theme;
    if (notification_preferences !== undefined)
      updateData.notification_preferences = notification_preferences;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      profile: data,
    });
  } catch (error) {
    console.error('Erro no PUT /api/profile:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
