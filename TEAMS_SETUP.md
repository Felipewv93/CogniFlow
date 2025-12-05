# Sistema de Times - Instruções de Instalação

## Passo 1: Criar as Tabelas no Supabase

Acesse o painel do Supabase e execute o SQL abaixo no **SQL Editor**:

### 1. Tabela de Times

```sql
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Tabela de Membros

```sql
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

### 3. Tabela de Convites

```sql
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);
```

### 4. Adicionar campo team_id em ideas

```sql
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL;
```

### 5. Índices

```sql
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team ON public.team_invites(team_id);
CREATE INDEX IF NOT EXISTS idx_ideas_team ON public.ideas(team_id);
```

### 6. Trigger de updated_at

```sql
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION update_teams_updated_at();
```

### 7. RLS - Teams

```sql
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;
CREATE POLICY "Users can view teams they are members of"
ON public.teams FOR SELECT
USING (
  auth.uid() = owner_id OR
  EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.team_id = teams.id
    AND team_members.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
CREATE POLICY "Users can create teams"
ON public.teams FOR INSERT
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Team owners can update their teams" ON public.teams;
CREATE POLICY "Team owners can update their teams"
ON public.teams FOR UPDATE
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Team owners can delete their teams" ON public.teams;
CREATE POLICY "Team owners can delete their teams"
ON public.teams FOR DELETE
USING (auth.uid() = owner_id);
```

### 8. RLS - Team Members

```sql
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view members of their teams" ON public.team_members;
CREATE POLICY "Users can view members of their teams"
ON public.team_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_members.team_id
    AND tm.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Team owners and admins can add members" ON public.team_members;
CREATE POLICY "Team owners and admins can add members"
ON public.team_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_members.team_id
    AND teams.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Team owners can remove members" ON public.team_members;
CREATE POLICY "Team owners can remove members"
ON public.team_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_members.team_id
    AND teams.owner_id = auth.uid()
  )
);
```

### 9. RLS - Team Invites

```sql
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view invites for their teams" ON public.team_invites;
CREATE POLICY "Users can view invites for their teams"
ON public.team_invites FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_invites.team_id
    AND teams.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Team owners can create invites" ON public.team_invites;
CREATE POLICY "Team owners can create invites"
ON public.team_invites FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_invites.team_id
    AND teams.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Team owners can delete invites" ON public.team_invites;
CREATE POLICY "Team owners can delete invites"
ON public.team_invites FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE teams.id = team_invites.team_id
    AND teams.owner_id = auth.uid()
  )
);
```

### 10. Atualizar RLS de Ideas

```sql
DROP POLICY IF EXISTS "Users can view their own ideas or team ideas" ON public.ideas;
CREATE POLICY "Users can view their own ideas or team ideas"
ON public.ideas FOR SELECT
USING (
  auth.uid() = user_id OR
  (
    team_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = ideas.team_id
      AND team_members.user_id = auth.uid()
    )
  )
);
```

## Passo 2: Testar

1. Acesse `/teams` no navegador
2. Clique em "Criar Time"
3. Preencha os dados e crie seu primeiro time!

## Funcionalidades

- ✅ Criar times
- ✅ Convidar membros
- ✅ Compartilhar ideias
- ✅ Estatísticas do time
- ✅ Gerenciar membros
