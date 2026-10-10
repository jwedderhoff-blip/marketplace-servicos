import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const SAO_PAULO = { lat: -23.5505, lng: -46.6333 };

const SERVICE_PHOTOS: Record<string, string> = {
  "instalacao-eletrica": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=75",
  "curto-circuito": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=75",
  "encanamento": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75",
  "desentupimento": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=75",
  "pintura-sala": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=75",
  "textura-grafiato": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=75",
  "armario-planejado": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=75",
  "reforma-movel": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=75",
  "ar-condicionado-split": "https://images.unsplash.com/photo-1629771099740-9e93dfe6a6af?auto=format&fit=crop&w=600&q=75",
  "refrigeracao-domestica": "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=75",
  "paisagismo": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=75",
  "corte-grama": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=600&q=75",
};

const CATEGORY_FILTERS = [
  { id: null, label: "Todos", icon: "✦" },
  { id: "a1000000-0000-0000-0000-000000000013", label: "Elétrica", icon: "⚡" },
  { id: "a1000000-0000-0000-0000-000000000010", label: "Hidráulica", icon: "💧" },
  { id: "a1000000-0000-0000-0000-000000000014", label: "Pintura", icon: "🎨" },
  { id: "a1000000-0000-0000-0000-000000000016", label: "Marcenaria", icon: "🪵" },
  { id: "a1000000-0000-0000-0000-000000000015", label: "Climatização", icon: "❄️" },
  { id: "a1000000-0000-0000-0000-000000000012", label: "Jardim", icon: "🌿" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.praca-root {
  min-height: 100vh;
  background: #080613;
  color: #EDE9F8;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── HEADER ── */
.praca-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 68px;
  background: rgba(8,6,19,0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(108,61,224,0.12);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
}
.praca-logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 800; font-size: 18px; letter-spacing: -0.3px;
  color: #fff; text-decoration: none;
}
.praca-logo-icon {
  width: 32px; height: 32px; border-radius: 10px;
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.praca-logo span { color: #A78BFA; }
.praca-nav { display: flex; align-items: center; gap: 8px; }
.praca-nav a {
  padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;
  color: #9B8EC0; text-decoration: none; transition: all .2s;
  cursor: pointer; border: none; background: none;
}
.praca-nav a:hover { color: #fff; background: rgba(108,61,224,0.15); }
.praca-nav .btn-primary {
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6);
  color: #fff; padding: 8px 20px; border-radius: 8px;
  font-weight: 600; font-size: 14px; cursor: pointer; border: none;
  transition: opacity .2s;
}
.praca-nav .btn-primary:hover { opacity: .85; }
.praca-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; color: #fff;
  cursor: pointer; border: 2px solid rgba(108,61,224,0.4);
  transition: border-color .2s;
}
.praca-avatar:hover { border-color: #6C3DE0; }

/* ── HERO ── */
.praca-hero {
  padding: 148px 48px 80px;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,61,224,0.28) 0%, transparent 70%);
  text-align: center;
  position: relative; overflow: hidden;
}
.praca-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(108,61,224,0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
.praca-hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(108,61,224,0.15); border: 1px solid rgba(108,61,224,0.3);
  border-radius: 100px; padding: 6px 14px; font-size: 12px; font-weight: 600;
  color: #A78BFA; letter-spacing: 0.3px; margin-bottom: 28px;
}
.praca-hero-badge span { width: 6px; height: 6px; border-radius: 50%; background: #A78BFA; animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
.praca-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 600; line-height: 1.1; letter-spacing: -1px;
  color: #fff; margin-bottom: 20px;
}
.praca-hero h1 em {
  font-style: italic;
  background: linear-gradient(90deg, #A78BFA, #F59E0B);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.praca-hero p {
  font-size: 18px; color: #9B8EC0; max-width: 520px; margin: 0 auto 40px;
  line-height: 1.6;
}
.praca-search-wrap {
  max-width: 600px; margin: 0 auto 40px;
  display: flex; gap: 0;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(108,61,224,0.25);
  border-radius: 16px; padding: 6px;
  backdrop-filter: blur(12px);
  transition: border-color .2s;
}
.praca-search-wrap:focus-within { border-color: rgba(108,61,224,0.6); }
.praca-search-wrap input {
  flex: 1; background: none; border: none; outline: none;
  padding: 12px 16px; font-size: 15px; color: #fff;
  font-family: inherit;
}
.praca-search-wrap input::placeholder { color: #6B60A0; }
.praca-search-btn {
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6);
  border: none; border-radius: 10px; padding: 12px 24px;
  color: #fff; font-weight: 600; font-size: 14px; cursor: pointer;
  transition: opacity .2s; white-space: nowrap;
}
.praca-search-btn:hover { opacity: .85; }
.praca-hero-stats {
  display: flex; align-items: center; justify-content: center; gap: 32px;
  flex-wrap: wrap;
}
.praca-stat { display: flex; flex-direction: column; align-items: center; }
.praca-stat strong { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
.praca-stat span { font-size: 12px; color: #6B60A0; font-weight: 500; margin-top: 2px; }
.praca-stat-divider { width: 1px; height: 36px; background: rgba(108,61,224,0.2); }

/* ── FILTERS ── */
.praca-filters-wrap {
  position: sticky; top: 68px; z-index: 100;
  background: rgba(8,6,19,0.9); backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 16px 48px;
}
.praca-filters {
  display: flex; gap: 8px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none;
}
.praca-filters::-webkit-scrollbar { display: none; }
.praca-filter-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 100px;
  border: 1px solid rgba(108,61,224,0.2);
  background: rgba(108,61,224,0.06);
  color: #9B8EC0; font-size: 13px; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  transition: all .2s;
}
.praca-filter-chip:hover { border-color: rgba(108,61,224,0.5); color: #C4B5FD; }
.praca-filter-chip.active {
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6);
  border-color: transparent; color: #fff;
}

/* ── GRID SECTION ── */
.praca-section {
  padding: 48px 48px 0;
}
.praca-section-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
}
.praca-section-title { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.praca-section-count { font-size: 13px; color: #6B60A0; font-weight: 500; }
.praca-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ── PROVIDER CARD ── */
.praca-card {
  background: #100C26;
  border: 1px solid rgba(108,61,224,0.12);
  border-radius: 20px; overflow: hidden;
  cursor: pointer;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, border-color .25s;
  text-decoration: none; color: inherit; display: block;
}
.praca-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(108,61,224,0.2);
  border-color: rgba(108,61,224,0.35);
}
.praca-card-photo {
  position: relative; height: 180px; overflow: hidden;
  background: linear-gradient(135deg, #1A1035, #2D1B69);
}
.praca-card-photo img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .4s ease;
}
.praca-card:hover .praca-card-photo img { transform: scale(1.06); }
.praca-card-photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(16,12,38,0.9) 100%);
}
.praca-card-badge {
  position: absolute; top: 12px; left: 12px;
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 100px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.2px;
}
.praca-card-badge.now { background: rgba(16,185,129,0.9); color: #fff; }
.praca-card-badge.today { background: rgba(245,158,11,0.9); color: #fff; }
.praca-card-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.praca-card-verified {
  position: absolute; top: 12px; right: 12px;
  background: rgba(108,61,224,0.85); backdrop-filter: blur(8px);
  border-radius: 8px; padding: 4px 8px; font-size: 11px; font-weight: 700; color: #fff;
}
.praca-card-avatar-wrap {
  position: absolute; bottom: -22px; left: 16px;
}
.praca-card-avatar {
  width: 52px; height: 52px; border-radius: 50%;
  border: 3px solid #100C26;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
  overflow: hidden;
}
.praca-card-avatar img { width: 100%; height: 100%; object-fit: cover; }
.praca-card-body { padding: 32px 16px 16px; }
.praca-card-name {
  font-size: 15px; font-weight: 700; color: #EDE9F8; margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.praca-card-specialty { font-size: 12px; color: #6B60A0; font-weight: 500; margin-bottom: 12px; }
.praca-card-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.praca-card-rating {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 700; color: #F59E0B;
}
.praca-card-rating span { color: #9B8EC0; font-weight: 400; font-size: 11px; }
.praca-card-distance { font-size: 12px; color: #6B60A0; display: flex; align-items: center; gap: 3px; }
.praca-card-price {
  background: rgba(108,61,224,0.12); border: 1px solid rgba(108,61,224,0.2);
  border-radius: 8px; padding: 4px 10px;
  font-size: 11px; font-weight: 700; color: #A78BFA;
}
.praca-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
}
.praca-card-cta {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 700; color: #8B5CF6;
  transition: gap .2s;
}
.praca-card:hover .praca-card-cta { gap: 8px; }

/* ── LOADING ── */
.praca-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 300px; gap: 16px; color: #6B60A0;
}
.praca-spinner {
  width: 40px; height: 40px; border-radius: 50%;
  border: 3px solid rgba(108,61,224,0.2);
  border-top-color: #6C3DE0;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── EMPTY ── */
.praca-empty {
  text-align: center; padding: 80px 20px;
  color: #6B60A0; font-size: 15px;
}
.praca-empty-icon { font-size: 48px; margin-bottom: 16px; }

/* ── FOOTER ── */
.praca-footer {
  margin-top: 80px; padding: 40px 48px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.praca-footer-logo { font-size: 15px; font-weight: 700; color: #4B4470; }
.praca-footer-logo span { color: #6C3DE0; }
.praca-footer-links { display: flex; gap: 24px; }
.praca-footer-links a {
  font-size: 13px; color: #4B4470; text-decoration: none;
  transition: color .2s; cursor: pointer;
}
.praca-footer-links a:hover { color: #9B8EC0; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .praca-header { padding: 0 20px; }
  .praca-hero { padding: 120px 20px 60px; }
  .praca-stat-divider { display: none; }
  .praca-filters-wrap { padding: 12px 20px; }
  .praca-section { padding: 32px 20px 0; }
  .praca-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
  .praca-footer { padding: 32px 20px; flex-direction: column; }
  .praca-nav .praca-nav-link { display: none; }
}
`;

export default function PracaVirtualWeb() {
  const { user, signOut } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    setLoading(true);
    supabase.rpc("find_providers_nearby", {
      lat: SAO_PAULO.lat,
      lng: SAO_PAULO.lng,
      radius_km: 50,
      filter_category: selectedCategory,
      result_limit: 30,
    }).then(({ data }) => {
      setProviders(data ?? []);
      setLoading(false);
    });
  }, [selectedCategory]);

  const filtered = providers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.services?.[0]?.tag_name?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q)
    );
  });

  const getPhoto = (p: any) => {
    const slug = p.services?.[0]?.tag_slug;
    return SERVICE_PHOTOS[slug] ?? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=75";
  };

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() ?? "?";

  const handleCardClick = (providerId: string) => {
    window.location.href = `/provider/${providerId}`;
  };

  const availableNow = filtered.filter((p) => p.availability_status === "available_now");
  const others = filtered.filter((p) => p.availability_status !== "available_now");
  const sorted = [...availableNow, ...others];

  const userName = user?.user_metadata?.full_name ?? user?.email ?? "";

  return (
    <div className="praca-root">
      {/* HEADER */}
      <header className="praca-header">
        <a className="praca-logo" href="/">
          <div className="praca-logo-icon">🏪</div>
          Praça<span>Hub</span>
        </a>
        <nav className="praca-nav">
          <a className="praca-nav-link" onClick={() => window.location.href = "/register-provider"}>
            Seja prestador
          </a>
          {user?.email === "jwedderhoff@gmail.com" && (
            <a className="praca-nav-link" onClick={() => window.location.href = "/admin"}>
              Admin
            </a>
          )}
          <div
            className="praca-avatar"
            title={userName}
            onClick={signOut}
          >
            {getInitial(userName)}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="praca-hero">
        <div className="praca-hero-badge">
          <span></span> São Paulo · Prestadores verificados
        </div>
        <h1>
          Encontre o profissional<br />
          <em>certo pra você</em>
        </h1>
        <p>
          Eletricistas, encanadores, pintores e muito mais —<br />
          verificados, avaliados, com resposta em minutos.
        </p>
        <div className="praca-search-wrap">
          <input
            type="text"
            placeholder="Qual serviço você precisa hoje?"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <button className="praca-search-btn">Buscar</button>
        </div>
        <div className="praca-hero-stats">
          <div className="praca-stat">
            <strong>{providers.length > 0 ? `${providers.length}+` : "500+"}</strong>
            <span>Prestadores</span>
          </div>
          <div className="praca-stat-divider" />
          <div className="praca-stat">
            <strong>4.8★</strong>
            <span>Média geral</span>
          </div>
          <div className="praca-stat-divider" />
          <div className="praca-stat">
            <strong>15min</strong>
            <span>Resp. média</span>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="praca-filters-wrap">
        <div className="praca-filters">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={String(f.id)}
              className={`praca-filter-chip ${selectedCategory === f.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(f.id)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <section className="praca-section">
        <div className="praca-section-header">
          <h2 className="praca-section-title">
            {selectedCategory ? "Filtrado" : "Disponíveis agora"}
          </h2>
          <span className="praca-section-count">
            {loading ? "Carregando..." : `${sorted.length} prestadores`}
          </span>
        </div>

        {loading ? (
          <div className="praca-loading">
            <div className="praca-spinner" />
            <span>Buscando prestadores próximos…</span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="praca-empty">
            <div className="praca-empty-icon">🔍</div>
            Nenhum prestador encontrado para essa busca.
          </div>
        ) : (
          <div className="praca-grid">
            {sorted.map((p) => {
              const svc = p.services?.[0];
              const isNow = p.availability_status === "available_now";
              const isToday = p.availability_status === "available_today";
              return (
                <div
                  key={p.provider_id}
                  className="praca-card"
                  onClick={() => handleCardClick(p.provider_id)}
                >
                  {/* Photo */}
                  <div className="praca-card-photo">
                    <img src={getPhoto(p)} alt={svc?.tag_name ?? "Serviço"} loading="lazy" />
                    <div className="praca-card-photo-overlay" />
                    {isNow && (
                      <div className="praca-card-badge now">
                        <div className="praca-card-badge-dot" /> Disponível agora
                      </div>
                    )}
                    {isToday && !isNow && (
                      <div className="praca-card-badge today">
                        <div className="praca-card-badge-dot" /> Hoje
                      </div>
                    )}
                    {p.verified && <div className="praca-card-verified">✓ Verificado</div>}
                    <div className="praca-card-avatar-wrap">
                      <div className="praca-card-avatar">
                        {p.avatar_url
                          ? <img src={p.avatar_url} alt={p.name} />
                          : getInitial(p.name)
                        }
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="praca-card-body">
                    <div className="praca-card-name">{p.name}</div>
                    <div className="praca-card-specialty">{svc?.tag_name ?? "Prestador de serviços"}</div>
                    <div className="praca-card-meta">
                      <div className="praca-card-rating">
                        ★ {p.avg_rating > 0 ? p.avg_rating.toFixed(1) : "Novo"}
                        {p.total_reviews > 0 && <span>({p.total_reviews})</span>}
                      </div>
                      <div className="praca-card-distance">📍 {Number(p.distance_km).toFixed(1)} km</div>
                      {svc?.price_min != null && (
                        <div className="praca-card-price">
                          a partir de R$ {Number(svc.price_min).toLocaleString("pt-BR")}
                        </div>
                      )}
                    </div>
                    <div className="praca-card-footer">
                      <div className="praca-card-cta">Ver perfil →</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="praca-footer">
        <div className="praca-footer-logo">Praça<span>Hub</span> · São Paulo</div>
        <div className="praca-footer-links">
          <a onClick={() => window.location.href = "/register-provider"}>Seja um prestador</a>
          <a onClick={signOut}>Sair</a>
        </div>
      </footer>
    </div>
  );
}
