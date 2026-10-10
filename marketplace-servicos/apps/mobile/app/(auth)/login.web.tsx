import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";

// Web-specific login screen com visual profissional
export default function LoginScreenWeb() {
  const { signInWithGoogle, loading } = useAuth();
  const [pressed, setPressed] = useState(false);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      Alert.alert("Erro ao entrar", error.message);
    }
  };

  useEffect(() => {
    // Inject animations CSS
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Inter', system-ui, sans-serif;
        background: #0A0612;
        min-height: 100vh;
        overflow: hidden;
      }

      .login-root {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #0A0612;
        z-index: 999;
      }

      /* ── Orbs de fundo ── */
      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
      }
      .orb-1 {
        width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(108,61,224,0.5) 0%, transparent 70%);
        top: -200px; left: -150px;
        animation: float1 8s ease-in-out infinite;
      }
      .orb-2 {
        width: 400px; height: 400px;
        background: radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%);
        bottom: -100px; right: -100px;
        animation: float2 10s ease-in-out infinite;
      }
      .orb-3 {
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(245,184,65,0.2) 0%, transparent 70%);
        top: 50%; right: 20%;
        animation: float3 12s ease-in-out infinite;
      }

      @keyframes float1 {
        0%, 100% { transform: translate(0,0) scale(1); }
        33%       { transform: translate(30px,20px) scale(1.05); }
        66%       { transform: translate(-20px,10px) scale(0.97); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0,0); }
        50%       { transform: translate(-40px,-30px); }
      }
      @keyframes float3 {
        0%, 100% { transform: translate(0,0) scale(1); }
        50%       { transform: translate(20px,-40px) scale(1.1); }
      }

      /* ── Grid de pontos ── */
      .dot-grid {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
        background-size: 32px 32px;
        pointer-events: none;
      }

      /* ── Card principal ── */
      .card-wrap {
        position: relative;
        z-index: 10;
        display: flex;
        gap: 64px;
        align-items: center;
        max-width: 1000px;
        width: 100%;
        padding: 0 32px;
      }

      /* ── Side: mockup de phone ── */
      .phone-mockup {
        flex-shrink: 0;
        width: 240px;
        height: 480px;
        background: linear-gradient(160deg, #1a1030 0%, #0e0820 100%);
        border-radius: 36px;
        border: 1.5px solid rgba(255,255,255,0.1);
        box-shadow:
          0 0 0 6px rgba(255,255,255,0.04),
          0 40px 80px rgba(0,0,0,0.6),
          0 0 60px rgba(108,61,224,0.25),
          inset 0 1px 0 rgba(255,255,255,0.12);
        transform: perspective(800px) rotateY(-8deg) rotateX(3deg);
        transition: transform 0.5s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 28px 20px 24px;
        gap: 12px;
        animation: cardFloat 6s ease-in-out infinite;
      }

      @keyframes cardFloat {
        0%, 100% { transform: perspective(800px) rotateY(-8deg) rotateX(3deg) translateY(0); }
        50%       { transform: perspective(800px) rotateY(-8deg) rotateX(3deg) translateY(-10px); }
      }

      .phone-notch {
        width: 60px; height: 6px;
        background: rgba(255,255,255,0.15);
        border-radius: 3px;
        margin-bottom: 4px;
      }

      .phone-map {
        width: 100%;
        height: 160px;
        border-radius: 16px;
        background: linear-gradient(135deg, #1a2744 0%, #0f1a30 100%);
        position: relative;
        overflow: hidden;
      }
      .phone-map::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 18px,
          rgba(255,255,255,0.03) 18px, rgba(255,255,255,0.03) 19px
        ),
        repeating-linear-gradient(
          90deg, transparent, transparent 18px,
          rgba(255,255,255,0.03) 18px, rgba(255,255,255,0.03) 19px
        );
      }

      .phone-pin {
        position: absolute;
        width: 14px; height: 14px;
        border-radius: 50%;
        border: 2px solid #fff;
        animation: ping 2s ease-in-out infinite;
      }
      .phone-pin-1 { background: #10B981; top: 45px; left: 55px; animation-delay: 0s; }
      .phone-pin-2 { background: #6C3DE0; top: 80px; left: 130px; animation-delay: 0.5s; }
      .phone-pin-3 { background: #F59E0B; top: 100px; left: 60px; animation-delay: 1s; }

      @keyframes ping {
        0%, 100% { box-shadow: 0 0 0 0 currentColor; }
        50%       { box-shadow: 0 0 0 6px transparent; }
      }

      .phone-card {
        width: 100%;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: transform 0.3s;
      }
      .phone-avatar {
        width: 36px; height: 36px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }
      .phone-card-text { flex: 1; min-width: 0; }
      .phone-card-name {
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .phone-card-sub { font-size: 10px; color: rgba(255,255,255,0.5); }
      .phone-stars { font-size: 10px; color: #F59E0B; letter-spacing: -1px; }

      .avail-badge {
        font-size: 8px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 20px;
        background: rgba(16,185,129,0.2);
        color: #10B981;
        white-space: nowrap;
      }

      /* ── Conteúdo direito ── */
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .badge-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(108,61,224,0.15);
        border: 1px solid rgba(108,61,224,0.3);
        border-radius: 24px;
        padding: 6px 14px;
        width: fit-content;
      }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6C3DE0; animation: pulse 2s infinite; }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.6; transform: scale(0.8); }
      }
      .badge-text { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.05em; }

      h1 {
        font-size: clamp(32px, 4vw, 52px);
        font-weight: 900;
        color: #fff;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }
      h1 .accent {
        background: linear-gradient(90deg, #A78BFA, #6C3DE0, #F59E0B);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        font-size: 17px;
        color: rgba(255,255,255,0.55);
        line-height: 1.65;
        max-width: 42ch;
      }

      .stats-row {
        display: flex;
        gap: 28px;
      }
      .stat { display: flex; flex-direction: column; gap: 2px; }
      .stat-num { font-size: 24px; font-weight: 800; color: #fff; }
      .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); }

      /* ── Botão Google 3D ── */
      .google-btn-wrap {
        position: relative;
        width: fit-content;
      }
      .google-btn {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 28px;
        background: #fff;
        border: none;
        border-radius: 16px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #111;
        transition: transform 0.15s, box-shadow 0.15s;
        box-shadow:
          0 2px 0 #ccc,
          0 4px 0 #bbb,
          0 8px 24px rgba(0,0,0,0.4),
          0 0 0 1px rgba(255,255,255,0.1);
        transform: translateY(0);
      }
      .google-btn:hover {
        transform: translateY(-2px);
        box-shadow:
          0 4px 0 #ccc,
          0 6px 0 #bbb,
          0 12px 32px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.1);
      }
      .google-btn:active, .google-btn.pressed {
        transform: translateY(2px);
        box-shadow:
          0 0 0 #ccc,
          0 1px 0 #bbb,
          0 4px 12px rgba(0,0,0,0.3);
      }
      .g-icon {
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 900;
        color: #fff;
        flex-shrink: 0;
      }
      .google-btn-shine {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 45%;
        background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
        border-radius: 16px 16px 0 0;
        pointer-events: none;
      }

      .terms {
        font-size: 12px;
        color: rgba(255,255,255,0.3);
        line-height: 1.6;
      }
      .terms a { color: rgba(255,255,255,0.5); text-decoration: underline; }

      /* Spinner */
      .spinner {
        width: 20px; height: 20px;
        border: 2px solid rgba(108,61,224,0.3);
        border-top-color: #6C3DE0;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* Entrada */
      .card-wrap { animation: fadeUp 0.7s ease both; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Responsivo */
      @media (max-width: 700px) {
        .phone-mockup { display: none; }
        .card-wrap { justify-content: center; }
        h1 { font-size: 36px; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div className="login-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dot-grid" />

      <div className="card-wrap">
        {/* Mockup de celular */}
        <div className="phone-mockup">
          <div className="phone-notch" />
          <div className="phone-map">
            <div className="phone-pin phone-pin-1" />
            <div className="phone-pin phone-pin-2" />
            <div className="phone-pin phone-pin-3" />
          </div>

          {[
            { emoji: "⚡", name: "Carlos Silva", sub: "Eletricista", stars: "★★★★★", color: "#6C3DE0" },
            { emoji: "🔧", name: "Maria Oliveira", sub: "Encanadora", stars: "★★★★½", color: "#10B981" },
            { emoji: "🎨", name: "João Mendes", sub: "Pintor", stars: "★★★★☆", color: "#F59E0B" },
          ].map((p, i) => (
            <div key={i} className="phone-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="phone-avatar" style={{ background: p.color }}>{p.emoji}</div>
              <div className="phone-card-text">
                <div className="phone-card-name">{p.name}</div>
                <div className="phone-card-sub">{p.sub}</div>
                <div className="phone-stars">{p.stars}</div>
              </div>
              <div className="avail-badge">Disponível</div>
            </div>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="content">
          <div className="badge-row">
            <div className="badge-dot" />
            <span className="badge-text">São Paulo · Prestadores verificados</span>
          </div>

          <div>
            <h1>
              Serviços locais,<br />
              <span className="accent">quando você precisar</span>
            </h1>
          </div>

          <p className="subtitle">
            Encontre eletricistas, encanadores, pintores e muito mais perto de você.
            Avaliações reais, resposta em minutos.
          </p>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Prestadores</span>
            </div>
            <div className="stat">
              <span className="stat-num">4.8★</span>
              <span className="stat-label">Média geral</span>
            </div>
            <div className="stat">
              <span className="stat-num">15min</span>
              <span className="stat-label">Resp. média</span>
            </div>
          </div>

          <div>
            <div className="google-btn-wrap">
              <button
                className={`google-btn${pressed ? " pressed" : ""}`}
                onClick={handleGoogleSignIn}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => setPressed(false)}
                disabled={loading}
              >
                <div className="google-btn-shine" />
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <div className="g-icon">G</div>
                    <span>Entrar com Google</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="terms">
            Ao entrar, você aceita os <a href="#">Termos de Uso</a> e a{" "}
            <a href="#">Política de Privacidade</a> (LGPD)
          </p>
        </div>
      </div>
    </div>
  );
}
