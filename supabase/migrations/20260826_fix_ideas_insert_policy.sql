-- Garante que usuários autenticados possam criar somente as próprias ideias.
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can insert own ideas" ON public.ideas;

CREATE POLICY "Users can insert their own ideas"
ON public.ideas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

GRANT INSERT ON TABLE public.ideas TO authenticated;
