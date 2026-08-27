-- ============================================
-- SISTEMA DE TIMES - INSTALAÇÃO COMPLETA
-- Execute este SQL uma única vez no Supabase
-- ============================================

-- 1. CRIAR TABELAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Adicionar campo team_id na tabela ideas (se não existir)
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL;

-- 2. CRIAR ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team ON public.team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);
CREATE INDEX IF NOT EXISTS idx_ideas_team ON public.ideas(team_id);

-- 3. CRIAR TRIGGER PARA updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS teams_updated_at ON public.teams;
CREATE TRIGGER teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION update_teams_updated_at();

-- 4. CRIAR FUNÇÃO AUXILIAR PARA EVITAR RECURSÃO
-- ============================================

CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = team_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- A função é usada pelas políticas RLS durante consultas autenticadas.
-- Mantê-la inacessível para visitantes, mas disponível para authenticated.
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO service_role;

-- 5. HABILITAR RLS E REMOVER POLÍTICAS ANTIGAS
-- ============================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team owners can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Team owners can delete their teams" ON public.teams;
DROP POLICY IF EXISTS "team_select_policy" ON public.teams;
DROP POLICY IF EXISTS "team_insert_policy" ON public.teams;
DROP POLICY IF EXISTS "team_update_policy" ON public.teams;
DROP POLICY IF EXISTS "team_delete_policy" ON public.teams;

DROP POLICY IF EXISTS "Users can view members of their teams" ON public.team_members;
DROP POLICY IF EXISTS "Team owners and admins can add members" ON public.team_members;
DROP POLICY IF EXISTS "Team owners can remove members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete_policy" ON public.team_members;

DROP POLICY IF EXISTS "Users can view invites for their teams" ON public.team_invites;
DROP POLICY IF EXISTS "Team owners can create invites" ON public.team_invites;
DROP POLICY IF EXISTS "Team owners can delete invites" ON public.team_invites;

-- 6. CRIAR POLÍTICAS RLS (SEM RECURSÃO)
-- ============================================

-- TEAMS: Owner ou Membro podem ver
CREATE POLICY "team_select_policy"
ON public.teams FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR
  is_team_member(id, auth.uid())
);

-- Apenas owner pode criar
CREATE POLICY "team_insert_policy"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Apenas owner pode editar
CREATE POLICY "team_update_policy"
ON public.teams FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

-- Apenas owner pode deletar
CREATE POLICY "team_delete_policy"
ON public.teams FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- TEAM_MEMBERS: Membro ou Owner podem ver
CREATE POLICY "team_members_select_policy"
ON public.team_members FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND owner_id = auth.uid())
);

-- Apenas owner pode adicionar membros
CREATE POLICY "team_members_insert_policy"
ON public.team_members FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND owner_id = auth.uid())
);

-- Apenas owner pode remover membros
CREATE POLICY "team_members_delete_policy"
ON public.team_members FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND owner_id = auth.uid())
);

-- TEAM_INVITES: Apenas owner pode gerenciar
CREATE POLICY "team_invites_select_policy"
ON public.team_invites FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_invites.team_id AND owner_id = auth.uid())
);

CREATE POLICY "team_invites_insert_policy"
ON public.team_invites FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_invites.team_id AND owner_id = auth.uid())
);

CREATE POLICY "team_invites_delete_policy"
ON public.team_invites FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_invites.team_id AND owner_id = auth.uid())
);

-- 7. ATUALIZAR POLÍTICA DE IDEAS PARA INCLUIR TIMES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own ideas or team ideas" ON public.ideas;
CREATE POLICY "Users can view their own ideas or team ideas"
ON public.ideas FOR SELECT
USING (
  auth.uid() = user_id OR
  (
    team_id IS NOT NULL AND
    (
      EXISTS (SELECT 1 FROM public.teams WHERE id = ideas.team_id AND owner_id = auth.uid()) OR
      is_team_member(team_id, auth.uid())
    )
  )
);

-- ============================================
-- INSTALAÇÃO COMPLETA!
-- Agora acesse /teams no seu site
-- ============================================

-- Restringir execução pública/autenticada da função handle_new_user
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
