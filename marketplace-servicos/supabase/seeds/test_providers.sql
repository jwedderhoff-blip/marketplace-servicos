-- ============================================================
-- Seed de dados de teste — prestadores próximos a São Paulo
-- ============================================================

-- 1. Usuários no auth.users (simulação — não tem senha real)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change_token_new, recovery_token)
VALUES
  ('b0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','carlos.elet@teste.br','',now(),'{"full_name":"Carlos Eduardo Silva"}'::jsonb,now(),now(),'','',''),
  ('b0000001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria.encanadora@teste.br','',now(),'{"full_name":"Maria Oliveira Santos"}'::jsonb,now(),now(),'','',''),
  ('b0000001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','joao.pintor@teste.br','',now(),'{"full_name":"João Paulo Mendes"}'::jsonb,now(),now(),'','',''),
  ('b0000001-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ana.marceneira@teste.br','',now(),'{"full_name":"Ana Beatriz Costa"}'::jsonb,now(),now(),'','',''),
  ('b0000001-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','roberto.ac@teste.br','',now(),'{"full_name":"Roberto Alves Ferreira"}'::jsonb,now(),now(),'','',''),
  ('b0000001-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','fernanda.jardineira@teste.br','',now(),'{"full_name":"Fernanda Lima Souza"}'::jsonb,now(),now(),'','','')
ON CONFLICT (id) DO NOTHING;

-- 2. Perfis públicos
INSERT INTO users (id, name, email, role, city, state) VALUES
  ('b0000001-0000-0000-0000-000000000001','Carlos Eduardo Silva','carlos.elet@teste.br','provider','São Paulo','SP'),
  ('b0000001-0000-0000-0000-000000000002','Maria Oliveira Santos','maria.encanadora@teste.br','provider','São Paulo','SP'),
  ('b0000001-0000-0000-0000-000000000003','João Paulo Mendes','joao.pintor@teste.br','provider','São Paulo','SP'),
  ('b0000001-0000-0000-0000-000000000004','Ana Beatriz Costa','ana.marceneira@teste.br','provider','São Paulo','SP'),
  ('b0000001-0000-0000-0000-000000000005','Roberto Alves Ferreira','roberto.ac@teste.br','provider','São Paulo','SP'),
  ('b0000001-0000-0000-0000-000000000006','Fernanda Lima Souza','fernanda.jardineira@teste.br','provider','São Paulo','SP')
ON CONFLICT (id) DO NOTHING;

-- 3. Perfis de prestadores (coordenadas em São Paulo, até 5km do centro)
INSERT INTO provider_profiles (id, user_id, bio, avg_rating, total_reviews,
  location_point, address_text, service_radius_km, availability_status, verified)
VALUES
  ('c0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001',
   'Eletricista com 12 anos de experiência. Instalações residenciais e comerciais, quadro de distribuição, tomadas e iluminação.',
   4.9, 47, ST_MakePoint(-46.636,-23.548)::geography, 'Pinheiros, São Paulo – SP', 20, 'available_now', true),

  ('c0000001-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000002',
   'Encanadora especializada em vazamentos, desentupimentos e instalação de louças sanitárias. Atendo emergências.',
   4.7, 31, ST_MakePoint(-46.620,-23.555)::geography, 'Vila Madalena, São Paulo – SP', 15, 'available_now', true),

  ('c0000001-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000003',
   'Pintor residencial e comercial. Trabalho com tintas premium, textura, grafiato e pintura epóxi em pisos.',
   4.6, 22, ST_MakePoint(-46.645,-23.542)::geography, 'Lapa, São Paulo – SP', 25, 'available_today', false),

  ('c0000001-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000004',
   'Marceneira especializada em móveis planejados, reformas e restauração de móveis antigos.',
   4.8, 18, ST_MakePoint(-46.648,-23.562)::geography, 'Perdizes, São Paulo – SP', 15, 'available_now', true),

  ('c0000001-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000005',
   'Técnico em refrigeração e ar-condicionado. Instalação, manutenção e limpeza de splits e janela. Higienização incluída.',
   4.5, 39, ST_MakePoint(-46.625,-23.535)::geography, 'Pompeia, São Paulo – SP', 20, 'available_today', true),

  ('c0000001-0000-0000-0000-000000000006','b0000001-0000-0000-0000-000000000006',
   'Paisagista e jardineira. Projetos de jardim, poda, irrigação automática e manutenção mensal.',
   4.9, 12, ST_MakePoint(-46.618,-23.568)::geography, 'Brooklin, São Paulo – SP', 10, 'available_now', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Serviços por prestador
-- Carlos: eletricista
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000001', id, 120, 350 FROM tags WHERE slug='instalacao-eletrica' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000001', id, 80, 200 FROM tags WHERE slug='curto-circuito' LIMIT 1;

-- Maria: encanadora
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000002', id, 150, 400 FROM tags WHERE slug='encanamento' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000002', id, 100, 250 FROM tags WHERE slug='desentupimento' LIMIT 1;

-- João: pintor
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000003', id, 200, 600 FROM tags WHERE slug='pintura-sala' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000003', id, 250, 700 FROM tags WHERE slug='textura-grafiato' LIMIT 1;

-- Ana: marceneira
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000004', id, 800, 3000 FROM tags WHERE slug='armario-planejado' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000004', id, 300, 900 FROM tags WHERE slug='reforma-movel' LIMIT 1;

-- Roberto: climatização
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000005', id, 180, 350 FROM tags WHERE slug='ar-condicionado-split' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000005', id, 120, 280 FROM tags WHERE slug='refrigeracao-domestica' LIMIT 1;

-- Fernanda: jardineira
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000006', id, 150, 500 FROM tags WHERE slug='paisagismo' LIMIT 1;

INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000001-0000-0000-0000-000000000006', id, 80, 180 FROM tags WHERE slug='corte-grama' LIMIT 1;
