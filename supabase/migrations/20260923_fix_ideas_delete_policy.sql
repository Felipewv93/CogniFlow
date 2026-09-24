-- Permite que usuários excluam somente as próprias ideias.
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can delete their own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON public.ideas;

CREATE POLICY "Users can delete their own ideas"
ON public.ideas
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

GRANT DELETE ON TABLE public.ideas TO authenticated;
