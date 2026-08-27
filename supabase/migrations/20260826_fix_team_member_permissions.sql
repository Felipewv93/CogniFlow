-- Corrige o acesso usado pelas políticas RLS de ideias e times.
-- A função consulta team_members com SECURITY DEFINER para evitar recursão.
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO service_role;
