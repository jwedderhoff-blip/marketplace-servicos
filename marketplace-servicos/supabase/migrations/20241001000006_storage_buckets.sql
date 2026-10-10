-- ============================================================
-- Storage Buckets para avatares e portfólio
-- ============================================================

-- Bucket público para fotos de perfil (avatares)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket público para fotos de portfólio dos prestadores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS Policies — avatars
-- ============================================================

-- Qualquer pessoa pode ver avatares (bucket público)
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Usuário autenticado pode fazer upload na própria pasta (user_id/)
CREATE POLICY "Authenticated upload avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Usuário pode atualizar ou deletar apenas seus próprios arquivos
CREATE POLICY "Owner update avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner delete avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- RLS Policies — portfolio
-- ============================================================

CREATE POLICY "Public read portfolio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated upload portfolio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner update portfolio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner delete portfolio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
