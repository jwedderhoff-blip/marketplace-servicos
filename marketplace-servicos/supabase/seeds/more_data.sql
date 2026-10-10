-- ============================================================
-- Seed — mais prestadores, clientes e avaliações
-- ============================================================

-- ── 1. CLIENTES (auth.users) ──────────────────────────────
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change_token_new, recovery_token)
VALUES
  ('d0000001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'lucas.cliente@teste.br','',now(),'{"full_name":"Lucas Mendonça"}'::jsonb,now(),now(),'','',''),
  ('d0000001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'patricia.cliente@teste.br','',now(),'{"full_name":"Patrícia Barbosa"}'::jsonb,now(),now(),'','',''),
  ('d0000001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'thiago.cliente@teste.br','',now(),'{"full_name":"Thiago Rocha"}'::jsonb,now(),now(),'','',''),
  ('d0000001-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'camila.cliente@teste.br','',now(),'{"full_name":"Camila Fonseca"}'::jsonb,now(),now(),'','','')
ON CONFLICT (id) DO NOTHING;

-- ── 2. MAIS PRESTADORES (auth.users) ─────────────────────
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change_token_new, recovery_token)
VALUES
  ('b0000002-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'paulo.elet2@teste.br','',now(),'{"full_name":"Paulo Henrique Neves"}'::jsonb,now(),now(),'','',''),
  ('b0000002-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'lucia.pintura@teste.br','',now(),'{"full_name":"Lúcia Tavares"}'::jsonb,now(),now(),'','',''),
  ('b0000002-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'marcos.encan@teste.br','',now(),'{"full_name":"Marcos Vinícius Lima"}'::jsonb,now(),now(),'','',''),
  ('b0000002-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'julia.jardim@teste.br','',now(),'{"full_name":"Júlia Carvalho"}'::jsonb,now(),now(),'','',''),
  ('b0000002-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'diego.marc@teste.br','',now(),'{"full_name":"Diego Santana"}'::jsonb,now(),now(),'','',''),
  ('b0000002-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'bruna.clim@teste.br','',now(),'{"full_name":"Bruna Andrade"}'::jsonb,now(),now(),'','','')
ON CONFLICT (id) DO NOTHING;

-- ── 3. PERFIS PÚBLICOS — CLIENTES ────────────────────────
INSERT INTO users (id, name, email, role, city, state) VALUES
  ('d0000001-0000-0000-0000-000000000001','Lucas Mendonça','lucas.cliente@teste.br','client','São Paulo','SP'),
  ('d0000001-0000-0000-0000-000000000002','Patrícia Barbosa','patricia.cliente@teste.br','client','São Paulo','SP'),
  ('d0000001-0000-0000-0000-000000000003','Thiago Rocha','thiago.cliente@teste.br','client','São Paulo','SP'),
  ('d0000001-0000-0000-0000-000000000004','Camila Fonseca','camila.cliente@teste.br','client','São Paulo','SP')
ON CONFLICT (id) DO NOTHING;

-- ── 4. PERFIS PÚBLICOS — NOVOS PRESTADORES ───────────────
INSERT INTO users (id, name, email, role, city, state) VALUES
  ('b0000002-0000-0000-0000-000000000001','Paulo Henrique Neves','paulo.elet2@teste.br','provider','São Paulo','SP'),
  ('b0000002-0000-0000-0000-000000000002','Lúcia Tavares','lucia.pintura@teste.br','provider','São Paulo','SP'),
  ('b0000002-0000-0000-0000-000000000003','Marcos Vinícius Lima','marcos.encan@teste.br','provider','São Paulo','SP'),
  ('b0000002-0000-0000-0000-000000000004','Júlia Carvalho','julia.jardim@teste.br','provider','São Paulo','SP'),
  ('b0000002-0000-0000-0000-000000000005','Diego Santana','diego.marc@teste.br','provider','São Paulo','SP'),
  ('b0000002-0000-0000-0000-000000000006','Bruna Andrade','bruna.clim@teste.br','provider','São Paulo','SP')
ON CONFLICT (id) DO NOTHING;

-- ── 5. PERFIS DE PRESTADORES ─────────────────────────────
-- Diferentes bairros para aparecer em variedade
INSERT INTO provider_profiles (id, user_id, bio, avg_rating, total_reviews,
  location_point, address_text, service_radius_km, availability_status, verified)
VALUES
  ('c0000002-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000001',
   'Eletricista formado pelo SENAI com 8 anos de experiência. Atendo residências, comércios e condomínios. CREA registrado.',
   4.7, 34, ST_MakePoint(-46.655,-23.553)::geography, 'Cerqueira César, São Paulo – SP', 25, 'available_now', true),

  ('c0000002-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000002',
   'Pintora profissional com 15 anos de experiência. Especialista em acabamentos finos, stencil decorativo e pintura de fachadas.',
   5.0, 8, ST_MakePoint(-46.642,-23.571)::geography, 'Vila Mariana, São Paulo – SP', 20, 'available_now', true),

  ('c0000002-0000-0000-0000-000000000003','b0000002-0000-0000-0000-000000000003',
   'Encanador hidráulico com certificação. Projetos completos de encanamento, reparos emergenciais e instalação de aquecedores.',
   4.6, 55, ST_MakePoint(-46.608,-23.541)::geography, 'Moema, São Paulo – SP', 30, 'available_today', true),

  ('c0000002-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000004',
   'Paisagista com formação em agronomia. Projetos de jardins verticais, hortas urbanas e manutenção de áreas verdes.',
   4.8, 21, ST_MakePoint(-46.673,-23.545)::geography, 'Alto de Pinheiros, São Paulo – SP', 15, 'available_now', false),

  ('c0000002-0000-0000-0000-000000000005','b0000002-0000-0000-0000-000000000005',
   'Marceneiro com oficina própria. Armários planejados, cozinhas sob medida, restauração de antiguidades e móveis em geral.',
   4.9, 27, ST_MakePoint(-46.630,-23.561)::geography, 'Itaim Bibi, São Paulo – SP', 20, 'available_now', true),

  ('c0000002-0000-0000-0000-000000000006','b0000002-0000-0000-0000-000000000006',
   'Técnica em climatização certificada. Instalação e manutenção preventiva de ar-condicionado multi-split e VRF.',
   4.4, 62, ST_MakePoint(-46.598,-23.558)::geography, 'Saúde, São Paulo – SP', 25, 'available_today', true)
ON CONFLICT (id) DO NOTHING;

-- ── 6. SERVIÇOS DOS NOVOS PRESTADORES ────────────────────
-- Paulo: eletricista
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000001', id, 150, 400 FROM tags WHERE slug='instalacao-eletrica' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000001', id, 90, 220 FROM tags WHERE slug='curto-circuito' LIMIT 1
ON CONFLICT DO NOTHING;

-- Lúcia: pintora
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000002', id, 300, 800 FROM tags WHERE slug='pintura-sala' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000002', id, 400, 1200 FROM tags WHERE slug='textura-grafiato' LIMIT 1
ON CONFLICT DO NOTHING;

-- Marcos: encanador
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000003', id, 180, 500 FROM tags WHERE slug='encanamento' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000003', id, 120, 300 FROM tags WHERE slug='desentupimento' LIMIT 1
ON CONFLICT DO NOTHING;

-- Júlia: jardineira
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000004', id, 200, 800 FROM tags WHERE slug='paisagismo' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000004', id, 100, 220 FROM tags WHERE slug='corte-grama' LIMIT 1
ON CONFLICT DO NOTHING;

-- Diego: marceneiro
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000005', id, 1200, 4500 FROM tags WHERE slug='armario-planejado' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000005', id, 400, 1200 FROM tags WHERE slug='reforma-movel' LIMIT 1
ON CONFLICT DO NOTHING;

-- Bruna: climatização
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000006', id, 200, 450 FROM tags WHERE slug='ar-condicionado-split' LIMIT 1
ON CONFLICT DO NOTHING;
INSERT INTO provider_services (provider_id, tag_id, price_range_min, price_range_max)
SELECT 'c0000002-0000-0000-0000-000000000006', id, 150, 320 FROM tags WHERE slug='refrigeracao-domestica' LIMIT 1
ON CONFLICT DO NOTHING;

-- ── 7. AVALIAÇÕES
-- reviews: reviewer_id = cliente (users.id), reviewee_id = prestador (users.id)
-- request_id é nullable — omitimos para avaliações de seed
INSERT INTO reviews (id, reviewer_id, reviewee_id, rating, comment, created_at) VALUES
  -- Carlos (eletricista): reviewee = b0000001-...-001 (user do Carlos)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000001',
   5,'Serviço impecável! Resolveu o problema do disjuntor em menos de 1 hora.',now()-interval '3 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000001',
   5,'Pontual e organizado. Fez a instalação de 8 tomadas sem deixar rastro de sujeira.',now()-interval '7 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000001',
   4,'Ótimo profissional, só demorou um pouco mais do que o combinado.',now()-interval '14 days'),

  -- Maria (encanadora)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000002',
   5,'Resolveu o vazamento que eu tinha há meses sem conseguir achar a causa.',now()-interval '2 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000002',
   5,'Trocou toda a tubulação do banheiro em um dia. Muito eficiente.',now()-interval '10 days'),

  -- Ana (marceneira)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000004',
   5,'Meu armário ficou lindo! A Ana tem um cuidado com os detalhes impressionante.',now()-interval '5 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000003','b0000001-0000-0000-0000-000000000004',
   5,'Reformou minha mesa de escritório e parece nova. Melhor marceneira de SP!',now()-interval '20 days'),

  -- Fernanda (jardineira)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000006',
   5,'Transformou minha área externa completamente. Projeto de paisagismo maravilhoso!',now()-interval '4 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000006',
   5,'Faz a manutenção do meu jardim toda semana. Sempre pontual e caprichosa.',now()-interval '8 days'),

  -- Paulo (novo eletricista)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000001',
   5,'Instalou o painel solar da minha casa com perfeição.',now()-interval '1 day'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000003','b0000002-0000-0000-0000-000000000001',
   4,'Bom serviço e preço justo. Recomendo!',now()-interval '6 days'),

  -- Diego (marceneiro)
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000005',
   5,'O armário da cozinha ficou idêntico ao projeto. Acabamento perfeito!',now()-interval '3 days'),
  (gen_random_uuid(),'d0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000005',
   5,'Restaurou um guarda-roupa antigo da minha avó. Ficou como novo!',now()-interval '9 days')
ON CONFLICT DO NOTHING;

-- ── 8. ATUALIZAR avg_rating e total_reviews ──────────────
-- (os valores já estão no INSERT do provider_profiles, mas isso garante consistência)
UPDATE provider_profiles SET
  avg_rating = 4.7, total_reviews = 3
WHERE id = 'c0000001-0000-0000-0000-000000000001';

UPDATE provider_profiles SET
  avg_rating = 4.8, total_reviews = 2
WHERE id = 'c0000001-0000-0000-0000-000000000002';

UPDATE provider_profiles SET
  avg_rating = 4.9, total_reviews = 2
WHERE id = 'c0000001-0000-0000-0000-000000000004';

UPDATE provider_profiles SET
  avg_rating = 5.0, total_reviews = 2
WHERE id = 'c0000001-0000-0000-0000-000000000006';

UPDATE provider_profiles SET
  avg_rating = 4.8, total_reviews = 2
WHERE id = 'c0000002-0000-0000-0000-000000000001';

UPDATE provider_profiles SET
  avg_rating = 5.0, total_reviews = 1
WHERE id = 'c0000002-0000-0000-0000-000000000002';

UPDATE provider_profiles SET
  avg_rating = 4.9, total_reviews = 2
WHERE id = 'c0000002-0000-0000-0000-000000000005';
