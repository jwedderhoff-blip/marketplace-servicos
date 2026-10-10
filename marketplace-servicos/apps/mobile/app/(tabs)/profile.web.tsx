import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow: hidden !important; height: 100%; }
.profile-root {
  height: 100vh; overflow-y: auto; background: #080613; color: #EDE9F8;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* Back header */
.profile-nav {
  display: flex; align-items: center; gap: 12px; padding: 20px 40px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.profile-nav-back {
  display: flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 600; color: #6B60A0;
  cursor: pointer; border: none; background: none; transition: color .15s;
}
.profile-nav-back:hover { color: #EDE9F8; }
.profile-nav-title { font-size: 16px; font-weight: 700; color: #fff; }

.profile-content { max-width: 760px; margin: 0 auto; padding: 40px 24px; }

/* Hero card */
.profile-hero {
  background: #100C26; border: 1px solid rgba(108,61,224,0.12);
  border-radius: 24px; padding: 40px; margin-bottom: 24px;
  position: relative; overflow: hidden;
}
.profile-hero::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(90deg, rgba(108,61,224,0.3), rgba(139,92,246,0.2), rgba(245,158,11,0.15));
}
.profile-hero-inner { position: relative; display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
.profile-avatar {
  width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 800; color: #fff;
  border: 3px solid #100C26; margin-top: 16px; overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-info { flex: 1; padding-top: 20px; }
.profile-name { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 4px; letter-spacing: -0.3px; }
.profile-email { font-size: 14px; color: #6B60A0; margin-bottom: 16px; }
.profile-role-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 700;
}
.profile-role-badge.user { background: rgba(108,61,224,0.15); border: 1px solid rgba(108,61,224,0.25); color: #A78BFA; }
.profile-role-badge.provider { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #10B981; }
.profile-actions-top { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; flex-shrink: 0; padding-top: 20px; }
.profile-btn {
  padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700;
  cursor: pointer; border: none; transition: all .15s; white-space: nowrap;
}
.profile-btn-primary { background: linear-gradient(135deg, #6C3DE0, #8B5CF6); color: #fff; }
.profile-btn-primary:hover { opacity: .85; }
.profile-btn-outline { background: none; border: 1px solid rgba(108,61,224,0.25); color: #9B8EC0; }
.profile-btn-outline:hover { border-color: rgba(108,61,224,0.5); color: #EDE9F8; }
.profile-btn-danger { background: none; border: 1px solid rgba(239,68,68,0.2); color: #F87171; }
.profile-btn-danger:hover { background: rgba(239,68,68,0.08); }

/* Section cards */
.profile-card {
  background: #100C26; border: 1px solid rgba(108,61,224,0.1);
  border-radius: 20px; padding: 24px; margin-bottom: 16px;
}
.profile-card-title { font-size: 14px; font-weight: 700; color: #6B60A0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
.profile-stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.profile-stat { text-align: center; padding: 16px; border-radius: 12px; background: rgba(108,61,224,0.06); }
.profile-stat-num { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
.profile-stat-desc { font-size: 11px; color: #4B4470; margin-top: 4px; }

/* Provider section */
.profile-provider-card {
  background: linear-gradient(135deg, rgba(108,61,224,0.12), rgba(139,92,246,0.06));
  border: 1px solid rgba(108,61,224,0.2);
  border-radius: 20px; padding: 28px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
}
.profile-provider-text h3 { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.profile-provider-text p { font-size: 14px; color: #6B60A0; line-height: 1.5; }
.profile-provider-cta {
  padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 700;
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6); color: #fff;
  border: none; cursor: pointer; transition: opacity .2s; white-space: nowrap;
}
.profile-provider-cta:hover { opacity: .85; }

/* Settings items */
.profile-setting {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
}
.profile-setting:last-child { border-bottom: none; }
.profile-setting-left { display: flex; align-items: center; gap: 12px; }
.profile-setting-icon { font-size: 18px; width: 28px; }
.profile-setting-text strong { display: block; font-size: 14px; color: #EDE9F8; margin-bottom: 2px; }
.profile-setting-text span { font-size: 12px; color: #4B4470; }
.profile-toggle {
  width: 40px; height: 22px; border-radius: 11px; position: relative;
  background: rgba(108,61,224,0.3); border: none; cursor: pointer; transition: background .2s;
}
.profile-toggle.on { background: #6C3DE0; }
.profile-toggle::after {
  content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%;
  background: #fff; top: 3px; left: 3px; transition: transform .2s;
}
.profile-toggle.on::after { transform: translateX(18px); }

@media (max-width: 600px) {
  .profile-content { padding: 24px 16px; }
  .profile-hero { padding: 24px; }
  .profile-stat-row { grid-template-columns: 1fr 1fr; }
  .profile-actions-top { flex-direction: row; align-items: center; }
  .profile-nav { padding: 16px 20px; }
}
`;

export default function ProfileWeb() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      supabase.from("users").select("*").eq("id", user.id).single(),
      supabase.from("provider_profiles").select("*, provider_services(*, tags(*))").eq("user_id", user.id).maybeSingle(),
    ]).then(([{ data: u }, { data: p }]) => {
      setProfile(u);
      setProviderProfile(p);
      setLoading(false);
    });
  }, [user?.id]);

  if (!user) return null;

  const name = profile?.name ?? user.user_metadata?.full_name ?? user.email ?? "";
  const email = user.email ?? "";
  const initial = name.charAt(0).toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url ?? profile?.avatar_url;
  const isProvider = profile?.role === "provider" || !!providerProfile;

  return (
    <div className="profile-root">
      <nav className="profile-nav">
        <button className="profile-nav-back" onClick={() => window.location.href = "/"}>
          ← Platz
        </button>
        <span style={{ color: "#2D2550" }}>|</span>
        <span className="profile-nav-title">Meu perfil</span>
      </nav>

      <div className="profile-content">
        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-hero-inner">
            <div className="profile-avatar">
              {avatarUrl ? <img src={avatarUrl} alt={name} /> : initial}
            </div>
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-email">{email}</div>
              <span className={`profile-role-badge ${isProvider ? "provider" : "user"}`}>
                {isProvider ? "✓ Prestador" : "👤 Usuário"}
              </span>
            </div>
            <div className="profile-actions-top">
              {isProvider && (
                <button className="profile-btn profile-btn-outline" onClick={() => window.location.href = `/provider/${providerProfile?.id}`}>
                  Ver perfil público
                </button>
              )}
              <button className="profile-btn profile-btn-danger" onClick={signOut}>
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {isProvider && providerProfile && (
          <div className="profile-card">
            <div className="profile-card-title">Meu desempenho</div>
            <div className="profile-stat-row">
              <div className="profile-stat">
                <div className="profile-stat-num">
                  {providerProfile.avg_rating > 0 ? providerProfile.avg_rating.toFixed(1) : "—"}
                </div>
                <div className="profile-stat-desc">Avaliação média</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{providerProfile.total_reviews ?? 0}</div>
                <div className="profile-stat-desc">Avaliações recebidas</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{providerProfile.provider_services?.length ?? 0}</div>
                <div className="profile-stat-desc">Serviços oferecidos</div>
              </div>
            </div>
          </div>
        )}

        {/* Become provider CTA */}
        {!isProvider && (
          <div className="profile-provider-card">
            <div className="profile-provider-text">
              <h3>Seja um prestador de serviços</h3>
              <p>
                Cadastre seus serviços gratuitamente e comece a receber chamados
                de clientes próximos a você.
              </p>
            </div>
            <button
              className="profile-provider-cta"
              onClick={() => window.location.href = "/register-provider"}
            >
              Cadastrar-me como prestador →
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="profile-card">
          <div className="profile-card-title">Preferências</div>
          <div
            className="profile-setting"
          >
            <div className="profile-setting-left">
              <span className="profile-setting-icon">🔔</span>
              <div className="profile-setting-text">
                <strong>Notificações</strong>
                <span>Receber alertas de novos prestadores próximos</span>
              </div>
            </div>
            <button
              className={`profile-toggle ${notifications ? "on" : ""}`}
              onClick={() => setNotifications(!notifications)}
            />
          </div>
          <div className="profile-setting">
            <div className="profile-setting-left">
              <span className="profile-setting-icon">📍</span>
              <div className="profile-setting-text">
                <strong>Localização</strong>
                <span>São Paulo, SP · Buscando na sua área</span>
              </div>
            </div>
            <button className="profile-btn profile-btn-outline" style={{ fontSize: 11, padding: "6px 12px" }}>
              Alterar
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="profile-card">
          <div className="profile-card-title">Conta</div>
          <div className="profile-setting">
            <div className="profile-setting-left">
              <span className="profile-setting-icon">📧</span>
              <div className="profile-setting-text">
                <strong>Email</strong>
                <span>{email}</span>
              </div>
            </div>
          </div>
          <div className="profile-setting">
            <div className="profile-setting-left">
              <span className="profile-setting-icon">🔑</span>
              <div className="profile-setting-text">
                <strong>Autenticação</strong>
                <span>Google OAuth</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>✓ Ativa</span>
          </div>
          <div className="profile-setting">
            <div className="profile-setting-left">
              <span className="profile-setting-icon">🚪</span>
              <div className="profile-setting-text">
                <strong>Sair da conta</strong>
                <span>Encerrar sessão neste dispositivo</span>
              </div>
            </div>
            <button className="profile-btn profile-btn-danger" style={{ fontSize: 12 }} onClick={signOut}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
