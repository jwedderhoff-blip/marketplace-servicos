import Link from "next/link";

export const metadata = {
  title: "Platz — Serviços locais, quando você precisar",
  description:
    "Encontre eletricistas, encanadores, pintores e muito mais perto de você. Avaliações reais, resposta em minutos.",
};

const APP_URL = "https://mobile-steel-three-51.vercel.app";

const CATEGORIES = [
  { emoji: "⚡", label: "Eletricista", slug: "eletricista" },
  { emoji: "🔧", label: "Encanador", slug: "encanador" },
  { emoji: "🎨", label: "Pintor", slug: "pintor" },
  { emoji: "🧹", label: "Faxina", slug: "faxina" },
  { emoji: "❄️", label: "Ar-condicionado", slug: "ar-condicionado" },
  { emoji: "🪚", label: "Marceneiro", slug: "marceneiro" },
  { emoji: "🏠", label: "Pedreiro", slug: "pedreiro" },
  { emoji: "🔒", label: "Chaveiro", slug: "chaveiro" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Descreva o que precisa",
    desc: "Digite em linguagem natural: 'minha geladeira não está gelando' ou 'preciso pintar a sala'. Nossa IA entende.",
    icon: "💬",
  },
  {
    step: "02",
    title: "Receba matches em segundos",
    desc: "Combinamos sua solicitação com prestadores verificados perto de você usando busca semântica + GPS.",
    icon: "🎯",
  },
  {
    step: "03",
    title: "Serviço feito, avaliação real",
    desc: "Combine diretamente com o prestador. Após o serviço, avalie para ajudar a comunidade.",
    icon: "✅",
  },
];

const TESTIMONIALS = [
  {
    name: "Ana Paula M.",
    role: "Cliente, São Paulo",
    text: "Em 10 minutos encontrei um eletricista excelente. Sem enrolação, preço justo e avaliações reais. Nunca mais vou procurar em outro lugar.",
    rating: 5,
    avatar: "A",
    color: "#6C3DE0",
  },
  {
    name: "Roberto F.",
    role: "Prestador — Encanamento",
    text: "Desde que entrei no Platz minha agenda está sempre cheia. Os clientes já chegam sabendo o que precisam e o pagamento é garantido.",
    rating: 5,
    avatar: "R",
    color: "#10B981",
  },
  {
    name: "Camila S.",
    role: "Cliente, São Paulo",
    text: "Pedi faxina completa às 8h da manhã e às 9h já tinha uma profissional confirmada. A rapidez e a qualidade foram impressionantes.",
    rating: 5,
    avatar: "C",
    color: "#F59E0B",
  },
];

const PROVIDER_BENEFITS = [
  { icon: "📅", title: "Agenda sempre cheia", desc: "Clientes chegam até você — sem prospectar, sem cold call." },
  { icon: "💰", title: "Pagamento garantido", desc: "Receba com segurança. Sem calote, sem negociação complicada." },
  { icon: "⭐", title: "Reputação que cresce", desc: "Avaliações acumuladas constroem sua credibilidade no longo prazo." },
  { icon: "📍", title: "Clientes perto de você", desc: "O GPS prioriza solicitações no seu raio de atendimento." },
];

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#0A0612",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }

        @keyframes float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes cardFloat {
          0%,100% { transform: perspective(900px) rotateY(-10deg) rotateX(4deg) translateY(0); }
          50%      { transform: perspective(900px) rotateY(-10deg) rotateX(4deg) translateY(-12px); }
        }
        @keyframes ping {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.85); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .hero-anim { animation: fadeUp 0.8s ease both; }
        .hero-anim-2 { animation: fadeUp 0.8s 0.1s ease both; }
        .hero-anim-3 { animation: fadeUp 0.8s 0.2s ease both; }
        .hero-anim-4 { animation: fadeUp 0.8s 0.3s ease both; }

        .phone-float { animation: cardFloat 7s ease-in-out infinite; }
        .badge-pulse { animation: pulse 2.5s ease-in-out infinite; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: #6C3DE0;
          color: #fff;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          box-shadow: 0 4px 24px rgba(108,61,224,0.4);
        }
        .btn-primary:hover {
          background: #7c4ff0;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(108,61,224,0.5);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.14);
          transform: translateY(-2px);
        }

        .card-hover {
          transition: transform 0.2s, border-color 0.2s;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(108,61,224,0.5) !important;
        }

        .cat-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cat-chip:hover {
          background: rgba(108,61,224,0.15);
          border-color: rgba(108,61,224,0.4);
          transform: translateY(-3px);
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #fff; }
        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover { color: rgba(255,255,255,0.7); }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .hero-layout { flex-direction: column !important; gap: 40px !important; }
          .hero-content { text-align: center; align-items: center; }
          .stats-row { justify-content: center; }
          .how-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: repeat(4,1fr) !important; }
          .provider-grid { grid-template-columns: repeat(2,1fr) !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { flex-direction: column !important; gap: 32px !important; }
          .nav-links { display: none; }
        }

        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: repeat(3,1fr) !important; }
          .provider-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          background: "rgba(10,6,18,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg,#6C3DE0,#A78BFA)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 16,
            }}
          >
            P
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em" }}>
            Platz
          </span>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Como funciona", "Categorias", "Para prestadores"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-").replace(/ã/g, "a").replace(/é/g, "e")}`}
              className="nav-link"
            >
              {l}
            </a>
          ))}
        </div>

        <a href={APP_URL} className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>
          Começar agora
        </a>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          padding: "80px 32px",
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        {/* Background orbs */}
        <div
          className="orb"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(circle,rgba(108,61,224,0.45) 0%,transparent 70%)",
            top: -200,
            left: -200,
            animation: "float 10s ease-in-out infinite",
          }}
        />
        <div
          className="orb"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle,rgba(245,158,11,0.15) 0%,transparent 70%)",
            bottom: 0,
            right: 100,
            animation: "float 14s 2s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        <div
          className="hero-layout"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 80,
            width: "100%",
          }}
        >
          {/* Content */}
          <div
            className="hero-content"
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}
          >
            <div className="hero-anim">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(108,61,224,0.15)",
                  border: "1px solid rgba(108,61,224,0.35)",
                  borderRadius: 24,
                  padding: "6px 16px",
                  width: "fit-content",
                }}
              >
                <span
                  className="badge-pulse"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#6C3DE0",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  São Paulo · Prestadores verificados
                </span>
              </div>
            </div>

            <h1
              className="hero-anim-2"
              style={{
                fontSize: "clamp(38px,5vw,64px)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Serviços locais,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#A78BFA,#6C3DE0,#F59E0B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                quando você precisar
              </span>
            </h1>

            <p
              className="hero-anim-3"
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                maxWidth: "44ch",
              }}
            >
              Encontre eletricistas, encanadores, pintores e muito mais perto de você.
              Avaliações reais, resposta em minutos.
            </p>

            <div
              className="hero-anim-3 stats-row"
              style={{ display: "flex", gap: 32 }}
            >
              {[
                { num: "500+", label: "Prestadores" },
                { num: "4.8★", label: "Média geral" },
                { num: "15min", label: "Resp. média" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 26, fontWeight: 800 }}>{s.num}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-anim-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href={APP_URL} className="btn-primary">
                <span>🚀</span> Começar grátis
              </a>
              <a href="#como-funciona" className="btn-secondary">
                Como funciona
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hide-mobile" style={{ flexShrink: 0 }}>
            <div
              className="phone-float"
              style={{
                width: 260,
                height: 520,
                background: "linear-gradient(160deg,#1a1030 0%,#0e0820 100%)",
                borderRadius: 40,
                border: "1.5px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "0 0 0 6px rgba(255,255,255,0.03),0 50px 100px rgba(0,0,0,0.7),0 0 80px rgba(108,61,224,0.3),inset 0 1px 0 rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "28px 20px 24px",
                gap: 12,
                transform: "perspective(900px) rotateY(-10deg) rotateX(4deg)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 6,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  marginBottom: 4,
                }}
              />
              {/* Mini map */}
              <div
                style={{
                  width: "100%",
                  height: 168,
                  borderRadius: 18,
                  background: "linear-gradient(135deg,#1a2744 0%,#0f1a30 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,0.03) 18px,rgba(255,255,255,0.03) 19px),repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(255,255,255,0.03) 18px,rgba(255,255,255,0.03) 19px)",
                  }}
                />
                {[
                  { bg: "#10B981", top: 48, left: 58 },
                  { bg: "#6C3DE0", top: 90, left: 140 },
                  { bg: "#F59E0B", top: 108, left: 64 },
                ].map((pin, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: pin.bg,
                      border: "2px solid #fff",
                      top: pin.top,
                      left: pin.left,
                      animation: `ping 2s ${i * 0.5}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>

              {[
                { emoji: "⚡", name: "Carlos Silva", sub: "Eletricista", stars: "★★★★★", color: "#6C3DE0" },
                { emoji: "🔧", name: "Maria Oliveira", sub: "Encanadora", stars: "★★★★½", color: "#10B981" },
                { emoji: "🎨", name: "João Mendes", sub: "Pintor", stars: "★★★★☆", color: "#F59E0B" },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 13,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: p.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{p.sub}</div>
                    <div style={{ fontSize: 10, color: "#F59E0B" }}>{p.stars}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      padding: "3px 7px",
                      borderRadius: 20,
                      background: "rgba(16,185,129,0.2)",
                      color: "#10B981",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Disponível
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section
        id="como-funciona"
        style={{
          padding: "100px 32px",
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#A78BFA", marginBottom: 12, textTransform: "uppercase" }}>
            Simples assim
          </p>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Como funciona
          </h2>
          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: "50ch", margin: "16px auto 0" }}>
            Da solicitação ao serviço feito em três passos — sem burocracia.
          </p>
        </div>

        <div
          className="how-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
        >
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                padding: "36px 28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 36 }}>{step.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(108,61,224,0.6)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {step.step}
                </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section
        id="categorias"
        style={{
          padding: "80px 32px",
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#A78BFA", marginBottom: 12, textTransform: "uppercase" }}>
            500+ prestadores
          </p>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Categorias de serviço
          </h2>
        </div>

        <div
          className="cat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 12 }}
        >
          {CATEGORIES.map((cat) => (
            <a key={cat.slug} href={APP_URL} className="cat-chip">
              <span style={{ fontSize: 28 }}>{cat.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", textAlign: "center" }}>
                {cat.label}
              </span>
            </a>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          +40 categorias disponíveis no app
        </p>
      </section>

      {/* ── PARA PRESTADORES ── */}
      <section
        id="para-prestadores"
        style={{
          padding: "100px 32px",
          background: "rgba(108,61,224,0.06)",
          borderTop: "1px solid rgba(108,61,224,0.15)",
          borderBottom: "1px solid rgba(108,61,224,0.15)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 64, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#A78BFA", marginBottom: 12, textTransform: "uppercase" }}>
                Para prestadores
              </p>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 }}>
                Cresça seu negócio{" "}
                <span style={{ color: "#A78BFA" }}>sem complicação</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 32, maxWidth: "42ch" }}>
                Cadastre-se, configure seu perfil com bio e especialidades — nossa IA cria seu embedding semântico e começa a te recomendar para quem precisa de você.
              </p>
              <a href={`${APP_URL}/register-provider`} className="btn-primary">
                Quero ser prestador
              </a>
            </div>

            <div
              className="provider-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, flex: 1, minWidth: 280 }}
            >
              {PROVIDER_BENEFITS.map((b, i) => (
                <div
                  key={i}
                  className="card-hover"
                  style={{
                    padding: "24px 20px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section style={{ padding: "100px 32px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#A78BFA", marginBottom: 12, textTransform: "uppercase" }}>
            Avaliações reais
          </p>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            O que dizem sobre o Platz
          </h2>
        </div>

        <div
          className="testimonials-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card-hover"
              style={{
                padding: "32px 28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ color: "#F59E0B", fontSize: 20, letterSpacing: 2 }}>
                {"★".repeat(t.rating)}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontStyle: "italic" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: t.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        style={{
          padding: "100px 32px",
          position: "relative",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background: "radial-gradient(circle,rgba(108,61,224,0.3) 0%,transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Pronto para resolver{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#A78BFA,#6C3DE0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              agora?
            </span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
            Mais de 500 prestadores verificados aguardam sua solicitação. Grátis para começar.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a href={APP_URL} className="btn-primary" style={{ padding: "16px 36px", fontSize: 16 }}>
              Buscar prestadores
            </a>
            <a href={`${APP_URL}/register-provider`} className="btn-secondary" style={{ padding: "16px 36px", fontSize: 16 }}>
              Ser prestador
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "48px 32px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <div
          className="footer-grid"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg,#6C3DE0,#A78BFA)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 13,
              }}
            >
              P
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>Platz</span>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Termos de Uso", "Política de Privacidade", "Suporte"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            © 2026 Platz. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
