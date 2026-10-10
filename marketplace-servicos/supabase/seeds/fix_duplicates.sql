-- ============================================================
-- Fix: remover provider_services duplicados e corrigir RPC
-- Rodar no Supabase Dashboard SQL Editor
-- ============================================================

-- 1. Remover serviços duplicados (mantém 1 por prestador+tag)
DELETE FROM provider_services
WHERE id NOT IN (
  SELECT MIN(id)
  FROM provider_services
  GROUP BY provider_id, tag_id
);

-- 2. Corrigir find_providers_nearby para não duplicar serviços
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
