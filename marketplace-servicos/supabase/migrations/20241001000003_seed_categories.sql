-- ============================================================
-- Seed: Categorias e Tags iniciais
-- ============================================================

-- Categorias raiz
INSERT INTO categories (id, name, slug, parent_id, icon_url, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Serviços Residenciais', 'servicos-residenciais', NULL, NULL, 1);

-- Subcategorias nível 1
INSERT INTO categories (id, name, slug, parent_id, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000010', 'Cozinha',           'cozinha',            'a1000000-0000-0000-0000-000000000001', 1),
  ('a1000000-0000-0000-0000-000000000011', 'Banheiro',          'banheiro',           'a1000000-0000-0000-0000-000000000001', 2),
  ('a1000000-0000-0000-0000-000000000012', 'Área Externa',      'area-externa',       'a1000000-0000-0000-0000-000000000001', 3),
  ('a1000000-0000-0000-0000-000000000013', 'Elétrica Geral',    'eletrica-geral',     'a1000000-0000-0000-0000-000000000001', 4),
  ('a1000000-0000-0000-0000-000000000014', 'Pintura Interna',   'pintura-interna',    'a1000000-0000-0000-0000-000000000001', 5),
  ('a1000000-0000-0000-0000-000000000015', 'Climatização',      'climatizacao',       'a1000000-0000-0000-0000-000000000001', 6),
  ('a1000000-0000-0000-0000-000000000016', 'Reforma/Construção','reforma-construcao',  'a1000000-0000-0000-0000-000000000001', 7);

-- Subcategorias nível 2 — Cozinha
INSERT INTO categories (id, name, slug, parent_id, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000100', 'Eletrodomésticos',  'eletrodomesticos',  'a1000000-0000-0000-0000-000000000010', 1),
  ('a1000000-0000-0000-0000-000000000101', 'Hidráulica',        'hidraulica-coz',    'a1000000-0000-0000-0000-000000000010', 2),
  ('a1000000-0000-0000-0000-000000000102', 'Marcenaria',        'marcenaria-coz',    'a1000000-0000-0000-0000-000000000010', 3);

-- Subcategorias nível 2 — Banheiro
INSERT INTO categories (id, name, slug, parent_id, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000110', 'Hidráulica',        'hidraulica-ban',    'a1000000-0000-0000-0000-000000000011', 1),
  ('a1000000-0000-0000-0000-000000000111', 'Elétrica',          'eletrica-ban',      'a1000000-0000-0000-0000-000000000011', 2),
  ('a1000000-0000-0000-0000-000000000112', 'Revestimentos',     'revestimentos',     'a1000000-0000-0000-0000-000000000011', 3);

-- Subcategorias nível 2 — Área Externa
INSERT INTO categories (id, name, slug, parent_id, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000120', 'Jardinagem',        'jardinagem',        'a1000000-0000-0000-0000-000000000012', 1),
  ('a1000000-0000-0000-0000-000000000121', 'Pintura Externa',   'pintura-externa',   'a1000000-0000-0000-0000-000000000012', 2),
  ('a1000000-0000-0000-0000-000000000122', 'Limpeza Externa',   'limpeza-externa',   'a1000000-0000-0000-0000-000000000012', 3);

-- ============================================================
-- Tags
-- ============================================================
INSERT INTO tags (name, slug, category_id) VALUES
  -- Eletrodomésticos
  ('Geladeira',           'conserto-geladeira',        'a1000000-0000-0000-0000-000000000100'),
  ('Fogão',               'conserto-fogao',             'a1000000-0000-0000-0000-000000000100'),
  ('Micro-ondas',         'conserto-microondas',        'a1000000-0000-0000-0000-000000000100'),
  ('Lava-louças',         'conserto-lava-loucas',       'a1000000-0000-0000-0000-000000000100'),
  ('Máquina de Lavar',    'conserto-maquina-lavar',     'a1000000-0000-0000-0000-000000000100'),
  -- Hidráulica Cozinha
  ('Pia / Torneira',      'pia-torneira',                'a1000000-0000-0000-0000-000000000101'),
  ('Encanamento',         'encanamento',                 'a1000000-0000-0000-0000-000000000101'),
  ('Desentupimento',      'desentupimento',              'a1000000-0000-0000-0000-000000000101'),
  -- Marcenaria
  ('Armário Planejado',   'armario-planejado',           'a1000000-0000-0000-0000-000000000102'),
  ('Bancada',             'bancada',                     'a1000000-0000-0000-0000-000000000102'),
  ('Reforma de Móvel',    'reforma-movel',               'a1000000-0000-0000-0000-000000000102'),
  -- Hidráulica Banheiro
  ('Vaso Sanitário',      'vaso-sanitario',              'a1000000-0000-0000-0000-000000000110'),
  ('Chuveiro',            'chuveiro',                    'a1000000-0000-0000-0000-000000000110'),
  ('Box / Vidro',         'box-vidro',                   'a1000000-0000-0000-0000-000000000110'),
  ('Vazamento',           'vazamento',                   'a1000000-0000-0000-0000-000000000110'),
  -- Elétrica Banheiro
  ('Tomada',              'tomada',                      'a1000000-0000-0000-0000-000000000111'),
  ('Interruptor',         'interruptor',                 'a1000000-0000-0000-0000-000000000111'),
  ('Iluminação',          'iluminacao',                  'a1000000-0000-0000-0000-000000000111'),
  -- Revestimentos
  ('Azulejo',             'azulejo',                     'a1000000-0000-0000-0000-000000000112'),
  ('Piso',                'piso',                        'a1000000-0000-0000-0000-000000000112'),
  ('Pastilha',            'pastilha',                    'a1000000-0000-0000-0000-000000000112'),
  -- Jardinagem
  ('Corte de Grama',      'corte-grama',                 'a1000000-0000-0000-0000-000000000120'),
  ('Poda de Árvore',      'poda-arvore',                 'a1000000-0000-0000-0000-000000000120'),
  ('Paisagismo',          'paisagismo',                  'a1000000-0000-0000-0000-000000000120'),
  ('Irrigação',           'irrigacao',                   'a1000000-0000-0000-0000-000000000120'),
  -- Pintura Externa
  ('Pintura de Fachada',  'pintura-fachada',             'a1000000-0000-0000-0000-000000000121'),
  ('Pintura de Muro',     'pintura-muro',                'a1000000-0000-0000-0000-000000000121'),
  -- Limpeza Externa
  ('Caixa d''Água',       'limpeza-caixa-dagua',         'a1000000-0000-0000-0000-000000000122'),
  ('Calha e Telhado',     'limpeza-calha-telhado',       'a1000000-0000-0000-0000-000000000122'),
  -- Elétrica Geral
  ('Instalação Elétrica', 'instalacao-eletrica',         'a1000000-0000-0000-0000-000000000013'),
  ('Curto-circuito',      'curto-circuito',              'a1000000-0000-0000-0000-000000000013'),
  ('Padrão de Energia',   'padrao-energia',              'a1000000-0000-0000-0000-000000000013'),
  -- Pintura Interna
  ('Pintura de Quarto',   'pintura-quarto',              'a1000000-0000-0000-0000-000000000014'),
  ('Pintura de Sala',     'pintura-sala',                'a1000000-0000-0000-0000-000000000014'),
  ('Textura / Grafiato',  'textura-grafiato',            'a1000000-0000-0000-0000-000000000014'),
  -- Climatização
  ('Ar-condicionado Split','ar-condicionado-split',      'a1000000-0000-0000-0000-000000000015'),
  ('Ventilador de Teto',  'ventilador-teto',             'a1000000-0000-0000-0000-000000000015'),
  ('Exaustão',            'exaustao',                    'a1000000-0000-0000-0000-000000000015'),
  ('Refrigeração Doméstica','refrigeracao-domestica',    'a1000000-0000-0000-0000-000000000015'),
  -- Reforma e Construção
  ('Alvenaria',           'alvenaria',                   'a1000000-0000-0000-0000-000000000016'),
  ('Drywall',             'drywall',                     'a1000000-0000-0000-0000-000000000016'),
  ('Forro',               'forro',                       'a1000000-0000-0000-0000-000000000016'),
  ('Piso Laminado',       'piso-laminado',               'a1000000-0000-0000-0000-000000000016');

-- ============================================================
-- Seed: Storage buckets via Supabase dashboard (não via SQL)
-- Buckets necessários:
--   avatars     (public, max 2MB, image/*)
--   portfolios  (public, max 5MB, image/*)
--   reviews     (public, max 5MB, image/*)
-- ============================================================
