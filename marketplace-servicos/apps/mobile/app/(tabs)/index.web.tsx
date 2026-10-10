import { useEffect, useRef, useState } from "react";
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

html, body { overflow: hidden !important; height: 100%; }

/* ── ROOT: coluna flex, sem scroll vertical ── */
.praca-root {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #080613;
  color: #EDE9F8;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── HEADER ── */
.praca-header {
  flex-shrink: 0;
  height: 64px;
  background: rgba(8,6,19,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(108,61,224,0.14);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  z-index: 200;
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
.praca-nav { display: flex; align-items: center; gap: 8px; }
.praca-nav a {
  padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
  color: #9B8EC0; text-decoration: none; transition: all .2s;
  cursor: pointer; border: none; background: none;
}
.praca-nav a:hover { color: #fff; background: rgba(108,61,224,0.15); }
.praca-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; color: #fff;
  cursor: pointer; border: 2px solid rgba(108,61,224,0.4);
  transition: border-color .2s;
}
.praca-avatar:hover { border-color: #6C3DE0; }

/* ── HERO COMPACTO ── */
.praca-hero {
  flex-shrink: 0;
  padding: 20px 40px 16px;
  background: radial-gradient(ellipse 100% 300% at 50% -80%, rgba(108,61,224,0.22) 0%, transparent 60%);
  text-align: center;
  position: relative;
}
.praca-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(108,61,224,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
.praca-hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(108,61,224,0.15); border: 1px solid rgba(108,61,224,0.3);
  border-radius: 100px; padding: 4px 12px; font-size: 11px; font-weight: 600;
  color: #A78BFA; letter-spacing: 0.3px; margin-bottom: 10px;
}
.praca-hero-badge span { width: 5px; height: 5px; border-radius: 50%; background: #A78BFA; animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
.praca-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(22px, 2.8vw, 36px);
  font-weight: 600; line-height: 1.15; letter-spacing: -0.5px;
  color: #fff; margin-bottom: 12px;
}
.praca-hero h1 em {
  font-style: italic;
  background: linear-gradient(90deg, #A78BFA, #F59E0B);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.praca-search-wrap {
  max-width: 520px; margin: 0 auto;
  display: flex; gap: 0;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(108,61,224,0.25);
  border-radius: 14px; padding: 5px;
  backdrop-filter: blur(12px);
  transition: border-color .2s;
}
.praca-search-wrap:focus-within { border-color: rgba(108,61,224,0.6); }
.praca-search-wrap input {
  flex: 1; background: none; border: none; outline: none;
  padding: 9px 14px; font-size: 14px; color: #fff;
  font-family: inherit;
}
.praca-search-wrap input::placeholder { color: #6B60A0; }
.praca-search-btn {
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6);
  border: none; border-radius: 9px; padding: 9px 20px;
  color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
  transition: opacity .2s; white-space: nowrap;
}
.praca-search-btn:hover { opacity: .85; }

/* ── FILTERS ── */
.praca-filters-wrap {
  flex-shrink: 0;
  background: rgba(8,6,19,0.9); backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 10px 40px;
}
.praca-filters {
  display: flex; gap: 8px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none;
}
.praca-filters::-webkit-scrollbar { display: none; }
.praca-filter-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 16px; border-radius: 100px;
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

/* ── SECTION (ocupa o espaço restante) ── */
.praca-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 0 12px;
}
.praca-section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; margin-bottom: 14px; flex-shrink: 0;
}
.praca-section-title { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.2px; }
.praca-section-meta {
  display: flex; align-items: center; gap: 16px;
}
.praca-section-count { font-size: 12px; color: #6B60A0; font-weight: 500; }
.carousel-nav { display: flex; gap: 8px; }
.carousel-nav-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(108,61,224,0.15);
  border: 1px solid rgba(108,61,224,0.3);
  color: #A78BFA; font-size: 16px; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.carousel-nav-btn:hover:not(:disabled) { background: rgba(108,61,224,0.4); color: #fff; }
.carousel-nav-btn:disabled { opacity: 0.25; cursor: default; }

/* ── CARROSSEL ── */
.praca-carousel-outer {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
.praca-carousel-outer::before,
.praca-carousel-outer::after {
  content: '';
  position: absolute; top: 0; bottom: 0; width: 48px; z-index: 10; pointer-events: none;
}
.praca-carousel-outer::before { left: 0; background: linear-gradient(to right, #080613 10%, transparent); }
.praca-carousel-outer::after  { right: 0; background: linear-gradient(to left, #080613 10%, transparent); }
.praca-carousel {
  display: flex;
  gap: 18px;
  height: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 4px 48px 4px;
  align-items: stretch;
}
.praca-carousel::-webkit-scrollbar { display: none; }

/* ── PROVIDER CARD (carrossel: largura fixa) ── */
.praca-card {
  flex: 0 0 272px;
  scroll-snap-align: start;
  background: #100C26;
  border: 1px solid rgba(108,61,224,0.12);
  border-radius: 18px; overflow: hidden;
  cursor: pointer;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, border-color .25s;
  display: flex; flex-direction: column;
}
.praca-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(108,61,224,0.22);
  border-color: rgba(108,61,224,0.38);
}
.praca-card-photo {
  position: relative; flex-shrink: 0; height: 155px; overflow: hidden;
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
  position: absolute; top: 10px; left: 10px;
  display: flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 100px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.2px;
}
.praca-card-badge.now { background: rgba(16,185,129,0.9); color: #fff; }
.praca-card-badge.today { background: rgba(245,158,11,0.9); color: #fff; }
.praca-card-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.praca-card-verified {
  position: absolute; top: 10px; right: 10px;
  background: rgba(108,61,224,0.85); backdrop-filter: blur(8px);
  border-radius: 7px; padding: 3px 7px; font-size: 10px; font-weight: 700; color: #fff;
}
.praca-card-avatar-wrap { position: absolute; bottom: -20px; left: 14px; }
.praca-card-avatar {
  width: 46px; height: 46px; border-radius: 50%;
  border: 3px solid #100C26;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 800; color: #fff;
  overflow: hidden;
}
.praca-card-avatar img { width: 100%; height: 100%; object-fit: cover; }
.praca-card-body { padding: 28px 14px 14px; flex: 1; display: flex; flex-direction: column; }
.praca-card-name {
  font-size: 14px; font-weight: 700; color: #EDE9F8; margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.praca-card-specialty { font-size: 11px; color: #6B60A0; font-weight: 500; margin-bottom: 10px; }
.praca-card-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.praca-card-rating {
  display: flex; align-items: center; gap: 3px;
  font-size: 12px; font-weight: 700; color: #F59E0B;
}
.praca-card-rating span { color: #9B8EC0; font-weight: 400; font-size: 10px; }
.praca-card-distance { font-size: 11px; color: #6B60A0; display: flex; align-items: center; gap: 2px; }
.praca-card-price {
  background: rgba(108,61,224,0.12); border: 1px solid rgba(108,61,224,0.2);
  border-radius: 7px; padding: 3px 9px;
  font-size: 10px; font-weight: 700; color: #A78BFA;
}
.praca-card-footer {
  margin-top: auto;
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);
}
.praca-card-cta {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700; color: #8B5CF6;
  transition: gap .2s;
}
.praca-card:hover .praca-card-cta { gap: 8px; }

/* ── LOADING / EMPTY ── */
.praca-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex: 1; gap: 14px; color: #6B60A0;
}
.praca-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 3px solid rgba(108,61,224,0.2);
  border-top-color: #6C3DE0;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.praca-empty {
  text-align: center; padding: 60px 20px;
  color: #6B60A0; font-size: 14px; flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.praca-empty-icon { font-size: 40px; margin-bottom: 12px; }

/* ── FOOTER INLINE ── */
.praca-footer {
  flex-shrink: 0;
  padding: 10px 40px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.praca-footer-logo { font-size: 13px; font-weight: 700; color: #4B4470; }
.praca-footer-links { display: flex; gap: 20px; }
.praca-footer-links a {
  font-size: 12px; color: #4B4470; text-decoration: none;
  transition: color .2s; cursor: pointer;
}
.praca-footer-links a:hover { color: #9B8EC0; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .praca-header { padding: 0 16px; }
  .praca-hero { padding: 14px 16px 12px; }
  .praca-filters-wrap { padding: 8px 16px; }
  .praca-section-header { padding: 0 16px; }
  .praca-carousel { padding: 4px 16px; }
  .praca-footer { padding: 8px 16px; }
  .praca-nav .praca-nav-link { display: none; }
  .praca-card { flex: 0 0 240px; }
}
`;

export default function PracaVirtualWeb() {
  const { user, signOut } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNavState = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    const cardW = 272 + 18;
    const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardW));
    el.scrollBy({ left: dir === "next" ? cardW * visibleCards : -(cardW * visibleCards), behavior: "smooth" });
  };

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
          Platz
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
          <div className="praca-avatar" title={userName} onClick={signOut}>
            {getInitial(userName)}
          </div>
        </nav>
      </header>

      {/* HERO COMPACTO */}
      <section className="praca-hero">
        <div className="praca-hero-badge">
          <span></span> São Paulo · Prestadores verificados
        </div>
        <h1>
          Encontre o profissional <em>certo pra você</em>
        </h1>
        <div className="praca-search-wrap">
          <input
            type="text"
            placeholder="Qual serviço você precisa hoje?"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <button className="praca-search-btn">Buscar</button>
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

      {/* CARROSSEL */}
      <section className="praca-section">
        <div className="praca-section-header">
          <h2 className="praca-section-title">
            {selectedCategory ? "Filtrado" : "Destaques"}
          </h2>
          <div className="praca-section-meta">
            <span className="praca-section-count">
              {loading ? "Carregando..." : `${sorted.length} prestadores`}
            </span>
            <div className="carousel-nav">
              <button
                className="carousel-nav-btn"
                onClick={() => scroll("prev")}
                disabled={!canPrev}
                aria-label="Anterior"
              >‹</button>
              <button
                className="carousel-nav-btn"
                onClick={() => scroll("next")}
                disabled={!canNext}
                aria-label="Próximo"
              >›</button>
            </div>
          </div>
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
          <div className="praca-carousel-outer">
            <div
              className="praca-carousel"
              ref={carouselRef}
              onScroll={updateNavState}
            >
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
                            R$ {Number(svc.price_min).toLocaleString("pt-BR")}+
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
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="praca-footer">
        <div className="praca-footer-logo">Platz · São Paulo</div>
        <div className="praca-footer-links">
          <a onClick={() => window.location.href = "/register-provider"}>Seja um prestador</a>
          <a onClick={signOut}>Sair</a>
        </div>
      </footer>
    </div>
  );
}
