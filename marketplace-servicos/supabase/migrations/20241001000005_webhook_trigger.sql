-- ============================================================
-- Webhook trigger para update-embedding via pg_net
-- Chama a Edge Function sem header de auth (JWT verification
-- desativada no deploy com --no-verify-jwt)
-- ============================================================

CREATE OR REPLACE FUNCTION notify_update_embedding()
RETURNS TRIGGER AS $$
DECLARE
  _payload jsonb;
BEGIN
  _payload := jsonb_build_object(
    'type',   TG_OP,
    'table',  TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW)::jsonb
  );

  PERFORM net.http_post(
    url     := 'https://jvuglzgnxpbzjdtzomcz.supabase.co/functions/v1/update-embedding',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body    := _payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_embedding ON provider_profiles;
CREATE TRIGGER trg_update_embedding
  AFTER INSERT OR UPDATE ON provider_profiles
  FOR EACH ROW EXECUTE FUNCTION notify_update_embedding();
