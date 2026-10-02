# ARCHITECTURE.md — Marketplace de Serviços

> Documento de referência para decisões técnicas, trade-offs e limitações do sistema.

---

## Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| App mobile | Expo (React Native) | Cross-platform, EAS Build, Expo Router para file-based routing |
| Banco de dados | Supabase PostgreSQL | Free tier generoso, PostGIS nativo, pgvector incluído |
| Auth | Supabase Auth + Google OAuth | Zero formulário de cadastro, token JWT gerenciado automaticamente |
| Storage | Supabase Storage | Mesmo vendor, RLS aplicável aos buckets |
| Realtime | Supabase Realtime (Postgres Changes) | WebSocket nativo sem servidor próprio |
| Backend | Supabase Edge Functions (Deno) | Serverless, sem custo de instância ociosa |
| NLP/Embedding | Xenova/all-MiniLM-L6-v2 (Transformers.js) | Open source, 384 dimensões, roda no Edge Function |
| Busca semântica | pgvector (extensão PostgreSQL) | Incluso no Supabase free, sem custo adicional |
| Busca geoespacial | PostGIS (ST_DWithin, ST_MakePoint) | Incluso no Supabase, industry standard |
| Painel admin | Next.js 14 (App Router) | SSR para dados sensíveis, deploy no Vercel |
| Deploy web | Vercel | Deploy automático via GitHub, free tier ilimitado |
| CI/CD | GitHub Actions | 2000 min/mês gratuitos, suficiente para MVP |
| Monorepo | Turborepo + npm workspaces | Cache de builds, scripts paralelos, zero configuração extra |

---

## Princípios arquiteturais

### Serverless-first
Não existe servidor Node.js próprio. Toda lógica de negócio reside em:
- **Supabase Edge Functions** (Deno) — funções de matching e geração de embeddings
- **Row Level Security (RLS)** do PostgreSQL — autorização granular no banco
- **Database functions (plpgsql)** — cálculos que precisam rodar próximos aos dados

Isso elimina custo de VPS/EC2 e reduz superfície de ataque.

### Free-tier ceiling
Limites gratuitos que determinarão a necessidade de upgrade:

| Recurso | Limite Free | Trigger de upgrade estimado |
|---|---|---|
| Supabase Storage | 1 GB | ~200 prestadores com 5 fotos (500KB cada) |
| Supabase DB | 500 MB | ~50.000 solicitações com histórico |
| Edge Functions | 500k invocações/mês | ~17k buscas/dia |
| Supabase Auth | 50k MAU | Escala real de produto |
| Vercel Bandwidth | 100 GB/mês | Irrelevante para MVP |
| EAS Build | 30 builds/mês | Irrelevante para dev solo |

### Sem APIs pagas de terceiros
- Mapas: coordenadas geográficas armazenadas como `geography(Point, 4326)` — distâncias calculadas no PostgreSQL com PostGIS. UI pode usar `react-native-maps` (OpenStreetMap tile) gratuitamente.
- NLP: `all-MiniLM-L6-v2` via Transformers.js — modelo de 22MB, roda no Edge Function sem custo.
- Push notifications: Expo Push Service — gratuito.

---

## Fluxo de dados: Praça Virtual

```
App inicia
  └─> useLocation() pede GPS
  └─> supabase.rpc('find_providers_nearby', { lat, lng, radius_km: 15 })
        └─> PostgreSQL: ST_DWithin + GIST index
        └─> Retorna até 30 prestadores ordenados por: disponibilidade → distância → avaliação
  └─> Renderiza seções: "Disponíveis agora", "Mais bem avaliados", "Novos"

Realtime (em paralelo):
  supabase.channel('praca-availability')
    .on('postgres_changes', UPDATE provider_profiles)
    └─> Atualiza apenas o card afetado no estado React (sem re-fetch)
```

---

## Fluxo de dados: Busca semântica

```
Usuário digita: "minha geladeira não está gelando"
  └─> Edge Function: match-providers
        1. Gera embedding do texto (all-MiniLM-L6-v2, 384 dims)
        2. find_providers_nearby → candidatos geoespaciais (raio 15km)
        3. match_providers_semantic → candidatos semânticos (cosine similarity > 0.5)
        4. Score composto:
             score = semântico×0.4 + proximidade×0.3 + avaliação×0.2 + disponibilidade×0.1
        5. Retorna top-N ordenados por score
  └─> Fallback: se Edge Function falhar → busca geoespacial pura no cliente
```

---

## Modelagem de embedding dos prestadores

Quando um `provider_profile` é criado/atualizado, a Edge Function `update-embedding` é disparada via **Database Webhook**:

```
bio + tag_names + tag_slugs (deduplicados)
  └─> all-MiniLM-L6-v2 → vector(384)
  └─> UPDATE provider_profiles SET embedding = [...]
```

O texto de embedding combina bio (semântica livre) + tags (termos técnicos) para maximizar recall.

---

## Segurança e LGPD

### Row Level Security
Todas as tabelas têm RLS habilitado. As políticas seguem o princípio de mínimo privilégio:
- Clientes só veem seus próprios dados
- Prestadores são visíveis para todos os autenticados
- Mensagens e solicitações são visíveis apenas para os dois participantes
- Admin tem acesso total via `role = 'admin'`

### LGPD
- **Consentimento**: registrado em `consent_logs` (versão, timestamp, IP)
- **Direito ao esquecimento**: função `anonymize_user(uuid)` — anonimiza dados pessoais sem quebrar integridade referencial
- **Dados mínimos**: apenas dados necessários são coletados (não pedimos CPF, endereço completo no cadastro)
- **Transparência**: Política de Privacidade linkada na tela de login antes do OAuth

---

## Estrutura do monorepo

```
marketplace-servicos/
├── apps/
│   ├── mobile/                 # Expo React Native
│   │   ├── app/                # Expo Router (file-based)
│   │   │   ├── (auth)/         # Telas de autenticação
│   │   │   ├── (tabs)/         # Navegação principal por abas
│   │   │   ├── provider/[id]   # Perfil do prestador
│   │   │   └── request/        # Fluxo de solicitação
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── hooks/              # useAuth, useLocation
│   │   ├── lib/                # supabase.ts, database.types.ts
│   │   └── constants/          # colors.ts
│   └── web/                    # Next.js 14 (admin)
│       └── app/                # App Router
├── packages/
│   ├── database/               # Tipos e helpers compartilhados
│   ├── ui/                     # Componentes compartilhados (futuro)
│   └── config/                 # Configs ESLint, TypeScript base
├── supabase/
│   ├── migrations/             # SQL versionado
│   │   ├── 000001_initial_schema.sql
│   │   ├── 000002_rls_policies.sql
│   │   ├── 000003_seed_categories.sql
│   │   └── 000004_semantic_search.sql
│   └── functions/
│       ├── match-providers/    # Engine de matching
│       └── update-embedding/   # Geração de embeddings
└── .github/
    └── workflows/
        ├── deploy.yml          # Push main → migrate + deploy
        └── pr-checks.yml       # PRs → lint + type check
```

---

## MVP vs. V2

### MVP (entregas deste sprint)
- [x] Praça Virtual (tela principal com realtime)
- [x] Busca por texto livre (semântica) e categoria
- [x] Perfil do prestador com galeria
- [x] Solicitação de serviço
- [x] Auth Google OAuth
- [ ] Chat básico (próxima sprint)
- [ ] Avaliação pós-serviço (próxima sprint)

### V2 (pós-validação de produto)
- Agendamento com calendário semanal
- Notificações push (Expo Push Service)
- Painel do prestador no mobile (aceitar/recusar pedidos)
- Analytics para prestadores (visualizações, conversão)
- Busca por CEP (sem GPS)
- Sistema de pagamento (integração futura — Pix via Mercado Pago)

---

## Configuração inicial necessária

### Supabase
1. Criar projeto em supabase.com (free)
2. Aplicar migrations: `supabase db push`
3. Configurar Google OAuth: Authentication → Providers → Google
4. Criar buckets Storage: `avatars`, `portfolios`, `reviews` (todos públicos)
5. Configurar Database Webhook: `provider_profiles` → INSERT/UPDATE → `update-embedding`

### GitHub Secrets necessários
```
SUPABASE_ACCESS_TOKEN       # Token da CLI Supabase
SUPABASE_PROJECT_ID         # ID do projeto (ex: xxxxxxxxxxxxxxxxxxxx)
VERCEL_TOKEN                # Token da API Vercel
VERCEL_ORG_ID               # ID da organização Vercel
VERCEL_PROJECT_ID           # ID do projeto Vercel (apps/web)
```

### Variáveis de ambiente
Copiar `.env.example` para `.env.local` e preencher com as credenciais do Supabase.
