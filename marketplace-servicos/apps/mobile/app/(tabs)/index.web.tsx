import { useEffect, useState, useRef } from "react";
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow: hidden !important; height: 100%; }

:root {
  --bg: #06040F;
  --surface: #0E0A1E;
  --surface2: #160F2A;
  --border: rgba(108,61,224,0.15);
  --purple: #6C3DE0;
  --purple-light: #8B5CF6;
  --purple-glow: rgba(108,61,224,0.25);
  --gold: #F59E0B;
  --gold-light: #FCD34D;
  --green: #10B981;
  --text: #EDE9F8;
  --text-2: #9B8EC0;
  --text-3: #5A5180;
  --radius: 20px;
}

.platz-root {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}

/* ─── HEADER ─── */
.platz-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 300;
  height: 64px;
  background: rgba(6,4,15,0.85);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
}
.platz-logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 900; font-size: 19px; letter-spacing: -0.5px;
  color: #fff; text-decoration: none; cursor: pointer;
}
.platz-logo-mark {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #6C3DE0 0%, #8B5CF6 60%, #F59E0B 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; box-shadow: 0 4px 16px rgba(108,61,224,0.5);
}
.platz-logo-name { color: #fff; }
.platz-logo-name span { color: #A78BFA; }
.platz-nav { display: flex; align-items: center; gap: 4px; }
.platz-nav-link {
  padding: 7px 14px; border-radius: 8px;
  font-size: 13px; font-weight: 600; color: var(--text-2);
  cursor: pointer; border: none; background: none; font-family: inherit;
  transition: color .2s, background .2s;
}
.platz-nav-link:hover { color: #fff; background: rgba(108,61,224,0.12); }
.platz-nav-cta {
  background: linear-gradient(135deg, var(--purple), var(--purple-light));
  color: #fff; padding: 8px 18px; border-radius: 10px;
  font-weight: 700; font-size: 13px; cursor: pointer; border: none;
  font-family: inherit; transition: opacity .2s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(108,61,224,0.4);
}
.platz-nav-cta:hover { opacity: .88; box-shadow: 0 6px 20px rgba(108,61,224,0.55); }
.platz-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--purple), var(--gold));
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 13px; color: #fff;
  cursor: pointer; border: 2px solid rgba(108,61,224,0.35);
  transition: border-color .2s;
}
.platz-avatar:hover { border-color: var(--purple); }

/* ─── HERO ─── */
.platz-hero {
  padding: 140px 48px 80px;
  position: relative; overflow: hidden; text-align: center;
}
.platz-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 55% at 50% -5%, rgba(108,61,224,0.32) 0%, transparent 65%),
    radial-gradient(ellipse 40% 30% at 80% 80%, rgba(245,158,11,0.07) 0%, transparent 60%);
}
.platz-hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(108,61,224,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,61,224,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
}
.platz-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(108,61,224,0.12); border: 1px solid rgba(108,61,224,0.28);
  border-radius: 100px; padding: 7px 16px;
  font-size: 12px; font-weight: 700; color: #A78BFA;
  letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 32px;
  position: relative;
}
.platz-hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: pulse-live 2s infinite;
}
@keyframes pulse-live {
  0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 8px var(--green); }
  50% { opacity:.7; transform:scale(1.3); box-shadow:0 0 14px var(--green); }
}
.platz-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(42px, 5.5vw, 72px);
  font-weight: 700; line-height: 1.08; letter-spacing: -1.5px;
  color: #fff; margin-bottom: 22px; position: relative;
}
.platz-hero h1 em {
  font-style: italic;
  background: linear-gradient(90deg, #C4B5FD 0%, var(--gold) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.platz-hero-sub {
  font-size: 18px; color: var(--text-2); max-width: 560px;
  margin: 0 auto 44px; line-height: 1.65; position: relative;
}
.platz-search-wrap {
  max-width: 620px; margin: 0 auto 52px;
  display: flex; gap: 0;
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(108,61,224,0.3);
  border-radius: 18px; padding: 6px;
  backdrop-filter: blur(16px);
  transition: border-color .25s, box-shadow .25s;
  position: relative;
}
.platz-search-wrap:focus-within {
  border-color: rgba(108,61,224,0.7);
  box-shadow: 0 0 0 4px rgba(108,61,224,0.1);
}
.platz-search-input {
  flex: 1; background: none; border: none; outline: none;
  padding: 13px 18px; font-size: 15px; color: #fff; font-family: inherit;
}
.platz-search-input::placeholder { color: #4A4170; }
.platz-search-btn {
  background: linear-gradient(135deg, var(--purple), var(--purple-light));
  border: none; border-radius: 13px; padding: 13px 28px;
  color: #fff; font-weight: 700; font-size: 14px; cursor: pointer;
  transition: opacity .2s; white-space: nowrap; font-family: inherit;
  box-shadow: 0 4px 14px rgba(108,61,224,0.4);
}
.platz-search-btn:hover { opacity: .85; }
.platz-hero-trust {
  display: flex; align-items: center; justify-content: center;
  gap: 28px; flex-wrap: wrap; position: relative;
}
.platz-hero-trust-item {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 600; color: var(--text-2);
}
.platz-hero-trust-item strong { color: #fff; }
.platz-trust-divider { width: 1px; height: 16px; background: var(--border); }

/* ─── PILLARS ─── */
.platz-pillars {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1px;
  background: var(--border);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.platz-pillar {
  background: var(--surface);
  padding: 32px 36px;
  display: flex; align-items: flex-start; gap: 18px;
  transition: background .2s;
}
.platz-pillar:hover { background: var(--surface2); }
.platz-pillar-icon {
  width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.platz-pillar-icon.purple { background: rgba(108,61,224,0.15); border: 1px solid rgba(108,61,224,0.2); }
.platz-pillar-icon.gold { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2); }
.platz-pillar-icon.green { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.2); }
.platz-pillar-text h3 { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 5px; }
.platz-pillar-text p { font-size: 13px; color: var(--text-2); line-height: 1.55; }

/* ─── STATS ─── */
.platz-stats {
  padding: 64px 48px;
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 2px; background: var(--border);
  border-bottom: 1px solid var(--border);
}
.platz-stat-box {
  background: var(--bg);
  padding: 36px 32px;
  text-align: center;
}
.platz-stat-box strong {
  display: block;
  font-size: 44px; font-weight: 900; letter-spacing: -2px;
  background: linear-gradient(135deg, #C4B5FD 0%, var(--gold) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-bottom: 6px;
}
.platz-stat-box span { font-size: 13px; color: var(--text-2); font-weight: 600; }

/* ─── FILTERS ─── */
.platz-filters-wrap {
  position: sticky; top: 64px; z-index: 200;
  background: rgba(6,4,15,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 14px 48px;
}
.platz-filters {
  display: flex; gap: 8px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none;
}
.platz-filters::-webkit-scrollbar { display: none; }
.platz-filter-chip {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 18px; border-radius: 100px;
  border: 1.5px solid rgba(108,61,224,0.18);
  background: transparent;
  color: var(--text-2); font-size: 13px; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  transition: all .2s; font-family: inherit;
}
.platz-filter-chip:hover { border-color: rgba(108,61,224,0.45); color: #C4B5FD; }
.platz-filter-chip.active {
  background: linear-gradient(135deg, var(--purple), var(--purple-light));
  border-color: transparent; color: #fff;
  box-shadow: 0 4px 14px rgba(108,61,224,0.35);
}

/* ─── SECTION ─── */
.platz-section { padding: 56px 0 0; }
.platz-section-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 28px; padding: 0 48px;
}
.platz-section-title {
  font-size: 26px; font-weight: 900; color: #fff; letter-spacing: -0.5px;
  line-height: 1.2;
}
.platz-section-subtitle {
  font-size: 14px; color: var(--text-2); margin-top: 4px; font-weight: 500;
}
.platz-section-count {
  font-size: 13px; color: var(--text-3); font-weight: 600;
  padding: 5px 12px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 20px;
}

/* ─── TOGGLE ─── */
.platz-toggle-wrap {
  padding: 0 48px 24px;
  display: flex; align-items: center; gap: 8px; justify-content: flex-end;
}
.platz-view-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 18px; border-radius: 20px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  color: var(--text-2); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .2s; font-family: inherit;
}
.platz-view-btn:hover { border-color: rgba(108,61,224,0.4); color: #C4B5FD; }
.platz-view-btn.active {
  background: linear-gradient(135deg, var(--purple), var(--purple-light));
  border-color: transparent; color: #fff;
  box-shadow: 0 4px 14px rgba(108,61,224,0.3);
}

/* ─── CAROUSEL ─── */
.platz-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  scrollbar-width: none; -ms-overflow-style: none;
  gap: 20px; padding: 4px 48px 24px;
}
.platz-carousel::-webkit-scrollbar { display: none; }
.platz-carousel .platz-card { flex: 0 0 300px; scroll-snap-align: start; }

/* ─── GRID ─── */
.platz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px; padding: 0 48px;
}

/* ─── PROVIDER CARD ─── */
.platz-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius); overflow: hidden;
  cursor: pointer; display: block; text-decoration: none; color: inherit;
  transition: transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s, border-color .28s;
  position: relative;
}
.platz-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 28px 60px rgba(108,61,224,0.22), 0 8px 20px rgba(0,0,0,0.4);
  border-color: rgba(108,61,224,0.4);
}
.platz-card-photo {
  position: relative; height: 190px; overflow: hidden;
  background: linear-gradient(135deg, #1A1035, #2D1B69);
}
.platz-card-photo img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .45s ease;
}
.platz-card:hover .platz-card-photo img { transform: scale(1.07); }
.platz-card-photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 35%, rgba(14,10,30,0.92) 100%);
}
.platz-card-badge {
  position: absolute; top: 12px; left: 12px;
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 100px;
  font-size: 11px; font-weight: 800; letter-spacing: 0.3px;
  backdrop-filter: blur(8px);
}
.platz-card-badge.now { background: rgba(16,185,129,0.88); color: #fff; }
.platz-card-badge.today { background: rgba(245,158,11,0.88); color: #fff; }
.platz-card-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; animation: pulse-live 1.8s infinite; }
.platz-card-verified {
  position: absolute; top: 12px; right: 12px;
  background: rgba(108,61,224,0.88); backdrop-filter: blur(8px);
  border-radius: 8px; padding: 4px 9px;
  font-size: 11px; font-weight: 800; color: #fff;
}
.platz-card-avatar-wrap { position: absolute; bottom: -24px; left: 16px; }
.platz-card-avatar {
  width: 54px; height: 54px; border-radius: 50%;
  border: 3px solid var(--surface);
  background: linear-gradient(135deg, var(--purple), var(--gold));
  display: flex; align-items: center; justify-content: center;
  font-size: 21px; font-weight: 900; color: #fff; overflow: hidden;
}
.platz-card-avatar img { width: 100%; height: 100%; object-fit: cover; }
.platz-card-body { padding: 34px 18px 18px; }
.platz-card-name {
  font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.platz-card-specialty {
  font-size: 12px; color: var(--text-2); font-weight: 500; margin-bottom: 14px;
}
.platz-card-meta {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
}
.platz-card-rating {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 800; color: var(--gold);
}
.platz-card-rating-count { color: var(--text-2); font-weight: 400; font-size: 11px; }
.platz-card-distance { font-size: 12px; color: var(--text-2); }
.platz-card-price {
  background: rgba(108,61,224,0.12); border: 1px solid rgba(108,61,224,0.22);
  border-radius: 8px; padding: 4px 10px;
  font-size: 11px; font-weight: 800; color: #A78BFA;
}
.platz-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
}
.platz-card-cta {
  font-size: 13px; font-weight: 800; color: var(--purple-light);
  display: flex; align-items: center; gap: 4px; transition: gap .2s;
}
.platz-card:hover .platz-card-cta { gap: 8px; }

/* ─── HOW IT WORKS ─── */
.platz-how {
  padding: 80px 48px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-top: 56px;
}
.platz-how-header { text-align: center; margin-bottom: 56px; }
.platz-how-header h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3vw, 40px); font-weight: 700;
  color: #fff; letter-spacing: -0.5px; margin-bottom: 12px;
}
.platz-how-header p { font-size: 16px; color: var(--text-2); }
.platz-how-steps {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 32px; max-width: 900px; margin: 0 auto;
}
.platz-how-step { text-align: center; position: relative; }
.platz-how-step:not(:last-child)::after {
  content: '→';
  position: absolute; top: 26px; right: -24px;
  font-size: 22px; color: var(--text-3);
}
.platz-how-step-num {
  width: 56px; height: 56px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(108,61,224,0.2), rgba(139,92,246,0.2));
  border: 1.5px solid rgba(108,61,224,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin: 0 auto 20px;
}
.platz-how-step h3 { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.platz-how-step p { font-size: 14px; color: var(--text-2); line-height: 1.6; }

/* ─── FOR PROVIDERS ─── */
.platz-providers-section {
  padding: 80px 48px;
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #0E0A1E 0%, #160F2A 100%);
  border-bottom: 1px solid var(--border);
}
.platz-providers-section::before {
  content: '';
  position: absolute; top: -60%; right: -10%;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(108,61,224,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.platz-providers-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 64px; align-items: center;
}
.platz-providers-left h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 3.5vw, 46px); font-weight: 700;
  color: #fff; letter-spacing: -0.8px; line-height: 1.15; margin-bottom: 16px;
}
.platz-providers-left h2 em {
  font-style: italic;
  background: linear-gradient(90deg, var(--gold-light), var(--gold));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.platz-providers-left p {
  font-size: 16px; color: var(--text-2); line-height: 1.65; margin-bottom: 32px;
}
.platz-providers-benefits { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
.platz-benefit {
  display: flex; align-items: flex-start; gap: 12px;
}
.platz-benefit-check {
  width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
  background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: var(--green); margin-top: 2px;
}
.platz-benefit-text { font-size: 14px; color: var(--text); font-weight: 500; line-height: 1.5; }
.platz-benefit-text strong { color: #fff; font-weight: 700; }
.platz-providers-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--gold) 0%, #D97706 100%);
  color: #000; padding: 14px 28px; border-radius: 14px;
  font-weight: 900; font-size: 15px; cursor: pointer; border: none;
  font-family: inherit; transition: opacity .2s, box-shadow .2s;
  box-shadow: 0 6px 20px rgba(245,158,11,0.4);
}
.platz-providers-cta:hover { opacity: .88; box-shadow: 0 8px 28px rgba(245,158,11,0.55); }
.platz-earnings-card {
  background: rgba(255,255,255,0.03);
  border: 1.5px solid rgba(108,61,224,0.2);
  border-radius: 24px; padding: 36px;
  backdrop-filter: blur(12px);
}
.platz-earnings-card h3 {
  font-size: 15px; font-weight: 700; color: var(--text-2); margin-bottom: 24px;
  text-transform: uppercase; letter-spacing: 1px;
}
.platz-earnings-number {
  font-size: 60px; font-weight: 900; letter-spacing: -3px;
  background: linear-gradient(90deg, var(--gold-light), var(--gold));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; line-height: 1; margin-bottom: 6px;
}
.platz-earnings-label { font-size: 14px; color: var(--text-2); margin-bottom: 28px; }
.platz-earnings-rows { display: flex; flex-direction: column; gap: 14px; }
.platz-earnings-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 12px;
  background: rgba(108,61,224,0.07); border: 1px solid rgba(108,61,224,0.12);
}
.platz-earnings-row span { font-size: 13px; color: var(--text-2); font-weight: 500; }
.platz-earnings-row strong { font-size: 14px; color: #fff; font-weight: 800; }

/* ─── LOADING / EMPTY ─── */
.platz-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 280px; gap: 16px; color: var(--text-2);
}
.platz-spinner {
  width: 42px; height: 42px; border-radius: 50%;
  border: 3px solid rgba(108,61,224,0.2);
  border-top-color: var(--purple);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.platz-empty {
  text-align: center; padding: 80px 20px;
  color: var(--text-2); font-size: 15px;
}
.platz-empty-icon { font-size: 48px; margin-bottom: 16px; }

/* ─── FOOTER ─── */
.platz-footer {
  margin-top: 80px; padding: 48px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}
.platz-footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 20px;
}
.platz-footer-brand { font-size: 14px; color: var(--text-3); font-weight: 600; }
.platz-footer-brand span { color: var(--purple-light); }
.platz-footer-tagline { font-size: 12px; color: var(--text-3); margin-top: 3px; }
.platz-footer-links { display: flex; gap: 28px; }
.platz-footer-link {
  font-size: 13px; color: var(--text-3); cursor: pointer;
  border: none; background: none; font-family: inherit;
  transition: color .2s;
}
.platz-footer-link:hover { color: var(--text-2); }
.platz-footer-copy { font-size: 12px; color: var(--text-3); }

/* ─── RESPONSIVE ─── */
@media (max-width: 900px) {
  .platz-header { padding: 0 20px; }
  .platz-hero { padding: 110px 20px 60px; }
  .platz-pillars { grid-template-columns: 1fr; }
  .platz-stats { grid-template-columns: repeat(2,1fr); padding: 0; }
  .platz-stat-box { padding: 28px 20px; }
  .platz-filters-wrap { padding: 12px 20px; }
  .platz-section-header { padding: 0 20px; }
  .platz-carousel { padding: 4px 20px 20px; gap: 14px; }
  .platz-carousel .platz-card { flex: 0 0 260px; }
  .platz-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); padding: 0 20px; gap: 14px; }
  .platz-toggle-wrap { padding: 0 20px 20px; }
  .platz-how { padding: 56px 20px; }
  .platz-how-steps { grid-template-columns: 1fr; gap: 28px; }
  .platz-how-step:not(:last-child)::after { display: none; }
  .platz-providers-section { padding: 56px 20px; }
  .platz-providers-inner { grid-template-columns: 1fr; gap: 40px; }
  .platz-footer { padding: 36px 20px; }
  .platz-footer-inner { flex-direction: column; align-items: flex-start; }
  .platz-nav-link { display: none; }
}
`;

export default function PracaVirtualWeb() {
  const { user, signOut } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [featured, setFeatured] = useState<any[]>([]);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch {} };
  }, []);

  useEffect(() => {
    setLoading(true);
    supabase.rpc("find_providers_nearby", {
      lat: SAO_PAULO.lat, lng: SAO_PAULO.lng,
      radius_km: 50, filter_category: selectedCategory, result_limit: 30,
    }).then(({ data }) => {
      setProviders(data ?? []);
      setLoading(false);
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (providers.length === 0) return;
    const shuffled = [...providers].sort(() => Math.random() - 0.5);
    setFeatured(shuffled.slice(0, 8));
  }, [providers]);

  useEffect(() => {
    if (viewMode !== "carousel" || loading) return;
    const el = featuredRef.current;
    if (!el) return;
    const STEP = 320;
    const timer = setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      el.scrollLeft >= max - 1
        ? el.scrollTo({ left: 0, behavior: "smooth" })
        : el.scrollBy({ left: STEP, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(timer);
  }, [viewMode, loading, featured.length]);

  const filtered = providers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.services?.[0]?.tag_name?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q)
    );
  });

  const gridProviders = [
    ...filtered.filter((p) => p.availability_status === "available_now"),
    ...filtered.filter((p) => p.availability_status !== "available_now"),
  ];

  const getPhoto = (p: any) => {
    const slug = p.services?.[0]?.tag_slug;
    return SERVICE_PHOTOS[slug] ?? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=75";
  };

  const handleCardClick = (id: string) => { window.location.href = `/provider/${id}`; };
  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() ?? "?";
  const userName = user?.user_metadata?.full_name ?? user?.email ?? "";
  const availableNow = providers.filter((p) => p.availability_status === "available_now").length;

  const renderCard = (p: any) => {
    const svc = p.services?.[0];
    const isNow = p.availability_status === "available_now";
    const isToday = p.availability_status === "available_today";
    return (
      <div key={p.provider_id} className="platz-card" onClick={() => handleCardClick(p.provider_id)}>
        <div className="platz-card-photo">
          <img src={getPhoto(p)} alt={svc?.tag_name ?? "Serviço"} loading="lazy" />
          <div className="platz-card-photo-overlay" />
          {isNow && (
            <div className="platz-card-badge now">
              <div className="platz-card-badge-dot" /> Disponível agora
            </div>
          )}
          {isToday && !isNow && (
            <div className="platz-card-badge today">
              <div className="platz-card-badge-dot" /> Disponível hoje
            </div>
          )}
          {p.verified && <div className="platz-card-verified">✓ Verificado</div>}
          <div className="platz-card-avatar-wrap">
            <div className="platz-card-avatar">
              {p.avatar_url ? <img src={p.avatar_url} alt={p.name} /> : getInitial(p.name)}
            </div>
          </div>
        </div>
        <div className="platz-card-body">
          <div className="platz-card-name">{p.name}</div>
          <div className="platz-card-specialty">{svc?.tag_name ?? "Prestador de serviços"}</div>
          <div className="platz-card-meta">
            <div className="platz-card-rating">
              ★ {p.avg_rating > 0 ? p.avg_rating.toFixed(1) : "Novo"}
              {p.total_reviews > 0 && <span className="platz-card-rating-count">({p.total_reviews})</span>}
            </div>
            <div className="platz-card-distance">📍 {Number(p.distance_km).toFixed(1)} km</div>
            {svc?.price_min != null && (
              <div className="platz-card-price">
                a partir de R$ {Number(svc.price_min).toLocaleString("pt-BR")}
              </div>
            )}
          </div>
          <div className="platz-card-footer">
            <div className="platz-card-cta">Ver perfil →</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="platz-root">

      {/* ── HEADER ── */}
      <header className="platz-header">
        <div className="platz-logo" onClick={() => window.location.href = "/"}>
          <div className="platz-logo-mark">🏠</div>
          <span className="platz-logo-name">Plat<span>z</span></span>
        </div>
        <nav className="platz-nav">
          <button className="platz-nav-link" onClick={() => window.location.href = "/register-provider"}>
            Para profissionais
          </button>
          <button className="platz-nav-link" onClick={() => window.location.href = "/(tabs)/search"}>
            Buscar
          </button>
          {user?.email === "jwedderhoff@gmail.com" && (
            <button className="platz-nav-link" onClick={() => window.location.href = "/admin"}>
              Admin
            </button>
          )}
          {!user ? (
            <button className="platz-nav-cta" onClick={() => window.location.href = "/register-provider"}>
              Cadastre-se grátis
            </button>
          ) : (
            <div className="platz-avatar" title={userName} onClick={signOut}>
              {getInitial(userName)}
            </div>
          )}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="platz-hero">
        <div className="platz-hero-bg" />
        <div className="platz-hero-grid" />
        <div className="platz-hero-badge">
          <div className="platz-hero-badge-dot" />
          São Paulo · {availableNow > 0 ? `${availableNow} profissionais disponíveis agora` : "Profissionais verificados"}
        </div>
        <h1>
          O profissional certo,<br />
          <em>na hora que você precisa</em>
        </h1>
        <p className="platz-hero-sub">
          Eletricistas, encanadores, pintores e mais — todos verificados,
          avaliados por clientes reais e prontos para atender.
        </p>
        <div className="platz-search-wrap">
          <input
            type="text"
            className="platz-search-input"
            placeholder="Qual serviço você precisa? Ex: elétrica, encanamento..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <button className="platz-search-btn">Buscar →</button>
        </div>
        <div className="platz-hero-trust">
          <div className="platz-hero-trust-item">
            <strong>🛡️</strong> Perfis verificados
          </div>
          <div className="platz-trust-divider" />
          <div className="platz-hero-trust-item">
            <strong>⭐ 4.8</strong> média geral
          </div>
          <div className="platz-trust-divider" />
          <div className="platz-hero-trust-item">
            <strong>⚡ 15min</strong> resposta média
          </div>
          <div className="platz-trust-divider" />
          <div className="platz-hero-trust-item">
            <strong>✓ Sem taxa</strong> para contratar
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <div className="platz-pillars">
        <div className="platz-pillar">
          <div className="platz-pillar-icon purple">🔒</div>
          <div className="platz-pillar-text">
            <h3>Profissionais verificados</h3>
            <p>Identidade, histórico e qualificações conferidos antes da aprovação na plataforma.</p>
          </div>
        </div>
        <div className="platz-pillar">
          <div className="platz-pillar-icon gold">⭐</div>
          <div className="platz-pillar-text">
            <h3>Avaliado por clientes reais</h3>
            <p>Notas e comentários de quem já contratou. Sem avaliações pagas ou incentivadas.</p>
          </div>
        </div>
        <div className="platz-pillar">
          <div className="platz-pillar-icon green">🛡️</div>
          <div className="platz-pillar-text">
            <h3>Sua segurança em primeiro</h3>
            <p>Histórico transparente, contato protegido e suporte disponível em toda contratação.</p>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="platz-stats">
        <div className="platz-stat-box">
          <strong>{providers.length > 0 ? `${providers.length}+` : "500+"}</strong>
          <span>Profissionais ativos</span>
        </div>
        <div className="platz-stat-box">
          <strong>4.8★</strong>
          <span>Avaliação média</span>
        </div>
        <div className="platz-stat-box">
          <strong>15min</strong>
          <span>Tempo de resposta</span>
        </div>
        <div className="platz-stat-box">
          <strong>100%</strong>
          <span>Gratuito para contratar</span>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="platz-filters-wrap">
        <div className="platz-filters">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={String(f.id)}
              className={`platz-filter-chip ${selectedCategory === f.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(f.id)}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TOGGLE ── */}
      <div className="platz-toggle-wrap" style={{ paddingTop: 32 }}>
        <button
          className={`platz-view-btn ${viewMode === "carousel" ? "active" : ""}`}
          onClick={() => setViewMode("carousel")}
        >
          ☰ Destaques
        </button>
        <button
          className={`platz-view-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          ⊞ Ver todos
        </button>
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div className="platz-loading">
          <div className="platz-spinner" />
          <span>Buscando profissionais próximos…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="platz-empty">
          <div className="platz-empty-icon">🔍</div>
          Nenhum profissional encontrado para essa busca.
        </div>
      ) : viewMode === "carousel" ? (
        <section className="platz-section">
          <div className="platz-section-header">
            <div>
              <div className="platz-section-title">✦ Destaques para você</div>
              <div className="platz-section-subtitle">Selecionados com base na disponibilidade e avaliação</div>
            </div>
            <div className="platz-section-count">{featured.length} em destaque</div>
          </div>
          <div className="platz-carousel" ref={featuredRef}>
            {featured.map(renderCard)}
          </div>
        </section>
      ) : (
        <section className="platz-section">
          <div className="platz-section-header">
            <div>
              <div className="platz-section-title">Todos os profissionais</div>
              <div className="platz-section-subtitle">Disponíveis primeiro · ordenados por avaliação</div>
            </div>
            <div className="platz-section-count">{filtered.length} profissionais</div>
          </div>
          <div className="platz-grid">
            {gridProviders.map(renderCard)}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <div className="platz-how">
        <div className="platz-how-header">
          <h2>Como funciona</h2>
          <p>Contrate em 3 passos — sem taxa, sem complicação</p>
        </div>
        <div className="platz-how-steps">
          <div className="platz-how-step">
            <div className="platz-how-step-num">🔍</div>
            <h3>Descreva o que precisa</h3>
            <p>Busque pelo serviço ou use os filtros de categoria para encontrar o profissional certo.</p>
          </div>
          <div className="platz-how-step">
            <div className="platz-how-step-num">📋</div>
            <h3>Compare e escolha</h3>
            <p>Veja avaliações, preços e disponibilidade real. Você decide com quem trabalhar.</p>
          </div>
          <div className="platz-how-step">
            <div className="platz-how-step-num">✅</div>
            <h3>Contrate com segurança</h3>
            <p>Entre em contato direto, combine os detalhes e acompanhe o trabalho pela plataforma.</p>
          </div>
        </div>
      </div>

      {/* ── FOR PROVIDERS ── */}
      <div className="platz-providers-section">
        <div className="platz-providers-inner">
          <div className="platz-providers-left">
            <h2>
              Seu negócio cresce<br />
              <em>quando você está na Platz</em>
            </h2>
            <p>
              Conecte-se a clientes que já estão buscando o que você oferece.
              Sem mensalidades ocultas — você paga apenas quando fechar negócio.
            </p>
            <div className="platz-providers-benefits">
              <div className="platz-benefit">
                <div className="platz-benefit-check">✓</div>
                <div className="platz-benefit-text">
                  <strong>Cadastro 100% gratuito</strong> — crie seu perfil e comece a receber contatos hoje
                </div>
              </div>
              <div className="platz-benefit">
                <div className="platz-benefit-check">✓</div>
                <div className="platz-benefit-text">
                  <strong>Controle total da agenda</strong> — você define horários, áreas e serviços
                </div>
              </div>
              <div className="platz-benefit">
                <div className="platz-benefit-check">✓</div>
                <div className="platz-benefit-text">
                  <strong>Avaliações que geram credibilidade</strong> — construa reputação e cobre mais
                </div>
              </div>
              <div className="platz-benefit">
                <div className="platz-benefit-check">✓</div>
                <div className="platz-benefit-text">
                  <strong>Visibilidade local</strong> — apareça para quem está perto e precisa agora
                </div>
              </div>
            </div>
            <button
              className="platz-providers-cta"
              onClick={() => window.location.href = "/register-provider"}
            >
              🚀 Quero me cadastrar como profissional
            </button>
          </div>
          <div className="platz-earnings-card">
            <h3>Potencial de ganhos</h3>
            <div className="platz-earnings-number">R$8k</div>
            <div className="platz-earnings-label">média mensal de profissionais ativos *</div>
            <div className="platz-earnings-rows">
              <div className="platz-earnings-row">
                <span>⚡ Eletricista</span>
                <strong>R$ 4.000 – 9.000/mês</strong>
              </div>
              <div className="platz-earnings-row">
                <span>💧 Encanador</span>
                <strong>R$ 3.500 – 8.000/mês</strong>
              </div>
              <div className="platz-earnings-row">
                <span>🎨 Pintor</span>
                <strong>R$ 3.000 – 7.000/mês</strong>
              </div>
              <div className="platz-earnings-row">
                <span>🪵 Marceneiro</span>
                <strong>R$ 4.500 – 10.000/mês</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="platz-footer">
        <div className="platz-footer-inner">
          <div>
            <div className="platz-footer-brand">Plat<span>z</span> · São Paulo</div>
            <div className="platz-footer-tagline">Profissionais verificados, contratação segura.</div>
          </div>
          <div className="platz-footer-links">
            <button className="platz-footer-link" onClick={() => window.location.href = "/register-provider"}>
              Seja um profissional
            </button>
            <button className="platz-footer-link" onClick={() => window.location.href = "/(tabs)/search"}>
              Buscar serviços
            </button>
            {user && (
              <button className="platz-footer-link" onClick={signOut}>
                Sair
              </button>
            )}
          </div>
          <div className="platz-footer-copy">
            * Valores estimados com base em profissionais ativos na plataforma.
          </div>
        </div>
      </footer>

    </div>
  );
}
