-- ============================================================
-- Marketplace de ServiÃ§os â€” Schema inicial
-- ============================================================

-- ExtensÃµes necessÃ¡rias
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- ENUM types
-- ============================================================
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE availability_status AS ENUM ('available_now', 'available_today', 'unavailable');
CREATE TYPE request_status AS ENUM (
  'pending', 'matched', 'negotiating', 'in_progress', 'completed', 'cancelled'
);
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text UNIQUE NOT NULL,
  avatar_url  text,
  phone       text,
  role        user_role NOT NULL DEFAULT 'client',
  city        text,
  state       text,
  deleted_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- CONSENTIMENTO LGPD
-- ============================================================
CREATE TABLE consent_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  version     text NOT NULL,         -- ex: "1.0", "1.1"
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address  inet,
  user_agent  text
);

-- ============================================================
-- PERFIL DO PRESTADOR
-- ============================================================
CREATE TABLE provider_profiles (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio                  text,
  avg_rating           numeric(2,1) NOT NULL DEFAULT 0,
  total_reviews        int NOT NULL DEFAULT 0,
  location_point       geography(Point, 4326),
  address_text         text,
  service_radius_km    int NOT NULL DEFAULT 20,
  availability_status  availability_status NOT NULL DEFAULT 'unavailable',
  response_time_avg_h  numeric(4,1),
  verified             bool NOT NULL DEFAULT false,
  portfolio_photos     text[] NOT NULL DEFAULT '{}',
  embedding            vector(384),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_provider_profiles_location
  ON provider_profiles USING GIST (location_point);

CREATE INDEX idx_provider_profiles_embedding
  ON provider_profiles USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_provider_profiles_availability
  ON provider_profiles (availability_status)
  WHERE availability_status != 'unavailable';

-- ============================================================
-- CATEGORIAS (Ã¡rvore hierÃ¡rquica)
-- ============================================================
CREATE TABLE categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  parent_id     uuid REFERENCES categories(id),
  icon_url      text,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_parent ON categories (parent_id);
CREATE INDEX idx_categories_slug ON categories (slug);

-- ============================================================
-- TAGS DE SERVIÃ‡O
-- ============================================================
CREATE TABLE tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_category ON tags (category_id);
CREATE INDEX idx_tags_slug ON tags (slug);

-- ============================================================
-- SERVIÃ‡OS OFERECIDOS
-- ============================================================
CREATE TABLE provider_services (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id        uuid REFERENCES provider_profiles(id) ON DELETE CASCADE,
  tag_id             uuid REFERENCES tags(id),
  custom_description text,
  price_range_min    numeric(10,2),
  price_range_max    numeric(10,2),
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_provider_services_provider ON provider_services (provider_id);
CREATE INDEX idx_provider_services_tag ON provider_services (tag_id);

-- ============================================================
-- AGENDA SEMANAL DO PRESTADOR
-- ============================================================
CREATE TABLE provider_schedules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES provider_profiles(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  time NOT NULL,
  end_time    time NOT NULL,
  UNIQUE (provider_id, day_of_week)
);

-- ============================================================
-- SOLICITAÃ‡Ã•ES DE SERVIÃ‡O
-- ============================================================
CREATE TABLE service_requests (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id            uuid REFERENCES users(id),
  raw_input            text,
  matched_category_id  uuid REFERENCES categories(id),
  matched_tags         uuid[] NOT NULL DEFAULT '{}',
  status               request_status NOT NULL DEFAULT 'pending',
  location_point       geography(Point, 4326),
  address_text         text,
  scheduled_for        timestamptz,
  description          text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_requests_client ON service_requests (client_id);
CREATE INDEX idx_service_requests_status ON service_requests (status);
CREATE INDEX idx_service_requests_location
  ON service_requests USING GIST (location_point);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE request_matches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES provider_profiles(id),
  match_score numeric(5,2) NOT NULL DEFAULT 0,
  status      match_status NOT NULL DEFAULT 'pending',
  notified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, provider_id)
);

CREATE INDEX idx_request_matches_request ON request_matches (request_id);
CREATE INDEX idx_request_matches_provider ON request_matches (provider_id);

-- ============================================================
-- MENSAGENS (CHAT)
-- ============================================================
CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
  sender_id  uuid REFERENCES users(id),
  content    text NOT NULL,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_request ON messages (request_id, created_at);

-- ============================================================
-- AVALIAÃ‡Ã•ES
-- ============================================================
CREATE TABLE reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  uuid REFERENCES service_requests(id) UNIQUE,
  reviewer_id uuid REFERENCES users(id),
  reviewee_id uuid REFERENCES users(id),
  rating      int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  photos      text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_reviewee ON reviews (reviewee_id);

-- ============================================================
-- FUNÃ‡ÃƒO: atualizar avg_rating automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE provider_profiles
  SET
    avg_rating    = (
      SELECT AVG(rating)::numeric(2,1)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*)::int
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    updated_at = now()
  WHERE user_id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_provider_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ============================================================
-- FUNÃ‡ÃƒO: soft delete (LGPD â€” direito ao esquecimento)
-- ============================================================
CREATE OR REPLACE FUNCTION anonymize_user(p_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE users SET
    name       = 'UsuÃ¡rio removido',
    email      = 'removed_' || p_user_id || '@deleted.invalid',
    avatar_url = NULL,
    phone      = NULL,
    city       = NULL,
    state      = NULL,
    deleted_at = now(),
    updated_at = now()
  WHERE id = p_user_id;

  UPDATE provider_profiles SET
    bio              = NULL,
    portfolio_photos = '{}',
    location_point   = NULL,
    address_text     = NULL,
    embedding        = NULL,
    updated_at       = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNÃ‡ÃƒO: busca geoespacial de prestadores
-- ============================================================
CREATE OR REPLACE FUNCTION find_providers_nearby(
  lat              double precision,
  lng              double precision,
  radius_km        int DEFAULT 15,
  filter_status    availability_status DEFAULT NULL,
  filter_category  uuid DEFAULT NULL,
  result_limit     int DEFAULT 20
)
RETURNS TABLE (
  provider_id         uuid,
  user_id             uuid,
  name                text,
  avatar_url          text,
  bio                 text,
  avg_rating          numeric,
  total_reviews       int,
  availability_status availability_status,
  distance_km         double precision,
  portfolio_photos    text[],
  services            jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    u.id,
    u.name,
    u.avatar_url,
    pp.bio,
    pp.avg_rating,
    pp.total_reviews,
    pp.availability_status,
    ROUND(
      (ST_Distance(pp.location_point, ST_MakePoint(lng, lat)::geography) / 1000)::numeric, 1
    )::double precision,
    pp.portfolio_photos,
    COALESCE(
      (
        SELECT jsonb_agg(svc ORDER BY svc->>'tag_name')
        FROM (
          SELECT DISTINCT jsonb_build_object(
            'tag_id', t2.id,
            'tag_name', t2.name,
            'tag_slug', t2.slug,
            'price_min', ps2.price_range_min,
            'price_max', ps2.price_range_max
          ) AS svc
          FROM provider_services ps2
          JOIN tags t2 ON t2.id = ps2.tag_id
          WHERE ps2.provider_id = pp.id
        ) sub
      ),
      '[]'::jsonb
    )
  FROM provider_profiles pp
  JOIN users u ON u.id = pp.user_id
  LEFT JOIN provider_services ps ON ps.provider_id = pp.id
  LEFT JOIN tags t ON t.id = ps.tag_id
  LEFT JOIN categories c ON c.id = t.category_id
  WHERE
    pp.availability_status != 'unavailable'
    AND u.deleted_at IS NULL
    AND ST_DWithin(
      pp.location_point,
      ST_MakePoint(lng, lat)::geography,
      radius_km * 1000
    )
    AND (filter_status IS NULL OR pp.availability_status = filter_status)
    AND (filter_category IS NULL OR c.id = filter_category OR c.parent_id = filter_category)
  GROUP BY pp.id, u.id, u.name, u.avatar_url
  ORDER BY pp.availability_status ASC, distance_km ASC, pp.avg_rating DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION find_providers_nearby(double precision, double precision, int, availability_status, uuid, int) TO anon, authenticated;
