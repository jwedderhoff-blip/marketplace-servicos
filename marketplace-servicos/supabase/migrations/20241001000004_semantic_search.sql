-- ============================================================
-- Busca semântica via pgvector
-- ============================================================

CREATE OR REPLACE FUNCTION match_providers_semantic(
  query_embedding  vector(384),
  match_threshold  float DEFAULT 0.5,
  match_count      int   DEFAULT 10
)
RETURNS TABLE (
  provider_id uuid,
  similarity  float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    1 - (pp.embedding <=> query_embedding) AS similarity
  FROM provider_profiles pp
  JOIN users u ON u.id = pp.user_id
  WHERE
    pp.embedding IS NOT NULL
    AND pp.availability_status != 'unavailable'
    AND u.deleted_at IS NULL
    AND 1 - (pp.embedding <=> query_embedding) > match_threshold
  ORDER BY pp.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
