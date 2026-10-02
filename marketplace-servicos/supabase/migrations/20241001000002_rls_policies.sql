-- ============================================================
-- Row Level Security — Marketplace de Serviços
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services   ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_schedules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews             ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS
-- ============================================================
-- Leitura: usuário vê o próprio perfil; prestadores verificados são públicos
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.user_id = users.id AND pp.verified = true
    )
  );

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin acessa tudo
CREATE POLICY "users_admin_all"
  ON users FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ============================================================
-- CONSENT_LOGS
-- ============================================================
CREATE POLICY "consent_select_own"
  ON consent_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "consent_insert_own"
  ON consent_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- PROVIDER_PROFILES
-- ============================================================
-- Qualquer usuário autenticado pode ver perfis de prestadores não deletados
CREATE POLICY "provider_profiles_select_public"
  ON provider_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = provider_profiles.user_id AND u.deleted_at IS NULL
    )
  );

CREATE POLICY "provider_profiles_insert_own"
  ON provider_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "provider_profiles_update_own"
  ON provider_profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- PROVIDER_SERVICES
-- ============================================================
CREATE POLICY "provider_services_select_public"
  ON provider_services FOR SELECT
  USING (true);

CREATE POLICY "provider_services_write_own"
  ON provider_services FOR ALL
  USING (
    provider_id IN (
      SELECT id FROM provider_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PROVIDER_SCHEDULES
-- ============================================================
CREATE POLICY "provider_schedules_select_public"
  ON provider_schedules FOR SELECT
  USING (true);

CREATE POLICY "provider_schedules_write_own"
  ON provider_schedules FOR ALL
  USING (
    provider_id IN (
      SELECT id FROM provider_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- CATEGORIES & TAGS (leitura pública)
-- ============================================================
CREATE POLICY "categories_select_all"
  ON categories FOR SELECT USING (true);

CREATE POLICY "tags_select_all"
  ON tags FOR SELECT USING (true);

CREATE POLICY "categories_admin_write"
  ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "tags_admin_write"
  ON tags FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- SERVICE_REQUESTS
-- ============================================================
-- Cliente vê suas próprias; prestadores veem as que foram matched com eles
CREATE POLICY "requests_select_participant"
  ON service_requests FOR SELECT
  USING (
    client_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM request_matches rm
      JOIN provider_profiles pp ON pp.id = rm.provider_id
      WHERE rm.request_id = service_requests.id
        AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "requests_insert_client"
  ON service_requests FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "requests_update_client"
  ON service_requests FOR UPDATE
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- ============================================================
-- REQUEST_MATCHES
-- ============================================================
CREATE POLICY "matches_select_participant"
  ON request_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = request_matches.request_id AND sr.client_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = request_matches.provider_id AND pp.user_id = auth.uid()
    )
  );

-- Prestador pode aceitar/recusar o próprio match
CREATE POLICY "matches_update_provider"
  ON request_matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM provider_profiles pp
      WHERE pp.id = request_matches.provider_id AND pp.user_id = auth.uid()
    )
  );

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE POLICY "messages_select_participant"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = messages.request_id
        AND (
          sr.client_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM request_matches rm
            JOIN provider_profiles pp ON pp.id = rm.provider_id
            WHERE rm.request_id = sr.id AND pp.user_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "messages_insert_participant"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = messages.request_id
        AND (
          sr.client_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM request_matches rm
            JOIN provider_profiles pp ON pp.id = rm.provider_id
            WHERE rm.request_id = sr.id AND pp.user_id = auth.uid()
              AND rm.status = 'accepted'
          )
        )
    )
  );

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT USING (true);

-- Só pode avaliar quem participou do serviço (cliente avaliando prestador)
CREATE POLICY "reviews_insert_client"
  ON reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = reviews.request_id
        AND sr.client_id = auth.uid()
        AND sr.status = 'completed'
    )
  );
