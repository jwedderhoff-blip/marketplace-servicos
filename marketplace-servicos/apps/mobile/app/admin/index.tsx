import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

const ADMIN_EMAIL = "jwedderhoff@gmail.com";

const WEB_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.admin-root { display: flex; min-height: 100vh; background: #080613; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #EDE9F8; -webkit-font-smoothing: antialiased; }
.admin-sidebar {
  width: 240px; flex-shrink: 0; background: #100C26;
  border-right: 1px solid rgba(108,61,224,0.12);
  display: flex; flex-direction: column; padding: 24px 16px;
  position: sticky; top: 0; height: 100vh;
}
.admin-sidebar-logo { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.admin-sidebar-logo span { color: #A78BFA; }
.admin-sidebar-sub { font-size: 11px; color: #4B4470; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 1px; }
.admin-sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
.admin-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  font-size: 14px; font-weight: 600; color: #9B8EC0;
  cursor: pointer; transition: all .15s; border: none; background: none; text-align: left;
}
.admin-nav-item:hover { background: rgba(108,61,224,0.12); color: #EDE9F8; }
.admin-nav-item.active { background: rgba(108,61,224,0.2); color: #A78BFA; }
.admin-main { flex: 1; overflow-y: auto; }
.admin-topbar {
  position: sticky; top: 0; z-index: 10;
  background: rgba(8,6,19,0.9); backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 0 32px; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.admin-topbar h1 { font-size: 18px; font-weight: 700; color: #fff; }
.admin-topbar-right { display: flex; align-items: center; gap: 12px; }
.admin-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; }
.admin-content { padding: 32px; }
.admin-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
.admin-stat-card {
  background: #100C26; border: 1px solid rgba(108,61,224,0.12);
  border-radius: 16px; padding: 20px;
  transition: border-color .2s;
}
.admin-stat-card:hover { border-color: rgba(108,61,224,0.3); }
.admin-stat-icon { font-size: 24px; margin-bottom: 12px; }
.admin-stat-value { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -1px; }
.admin-stat-label { font-size: 12px; color: #6B60A0; margin-top: 4px; font-weight: 500; }
.admin-stat-change { font-size: 11px; margin-top: 8px; padding: 3px 8px; border-radius: 100px; display: inline-flex; align-items: center; gap: 4px; }
.admin-stat-change.up { background: rgba(16,185,129,0.1); color: #10B981; }
.admin-stat-change.neutral { background: rgba(107,96,160,0.1); color: #6B60A0; }
.admin-section-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; }
.admin-table-wrap {
  background: #100C26; border: 1px solid rgba(108,61,224,0.1);
  border-radius: 16px; overflow: hidden; margin-bottom: 32px;
}
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th {
  text-align: left; padding: 14px 16px;
  font-size: 11px; font-weight: 700; color: #4B4470;
  text-transform: uppercase; letter-spacing: 0.8px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(255,255,255,0.02);
}
.admin-table td { padding: 14px 16px; font-size: 13px; color: #9B8EC0; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: middle; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(108,61,224,0.04); color: #EDE9F8; }
.admin-avatar-mini { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#6C3DE0,#F59E0B); display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; margin-right: 8px; vertical-align: middle; }
.admin-status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
.admin-status.available { background: rgba(16,185,129,0.1); color: #10B981; }
.admin-status.today { background: rgba(245,158,11,0.1); color: #F59E0B; }
.admin-status.unavail { background: rgba(107,96,160,0.1); color: #6B60A0; }
.admin-verified { display: inline-flex; align-items: center; gap: 4px; color: #8B5CF6; font-size: 12px; font-weight: 700; }
.admin-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
.admin-btn-primary { background: rgba(108,61,224,0.2); color: #A78BFA; }
.admin-btn-primary:hover { background: rgba(108,61,224,0.35); }
.admin-btn-danger { background: rgba(239,68,68,0.1); color: #F87171; }
.admin-btn-danger:hover { background: rgba(239,68,68,0.2); }
.admin-access-denied { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; }
.admin-access-denied h2 { font-size: 24px; font-weight: 800; color: #fff; }
.admin-access-denied p { color: #6B60A0; }
.admin-loading { display: flex; align-items: center; justify-content: center; padding: 60px; }
.admin-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid rgba(108,61,224,0.2); border-top-color: #6C3DE0; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) {
  .admin-sidebar { display: none; }
  .admin-content { padding: 16px; }
  .admin-stats-grid { grid-template-columns: 1fr 1fr; }
}
`;

type Tab = "overview" | "providers" | "users";

export default function AdminScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [providers, setProviders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (Platform.OS === "web") {
      const style = document.createElement("style");
      style.textContent = WEB_CSS;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      supabase.from("provider_profiles").select(`*, users(name, email, avatar_url)`).order("created_at", { ascending: false }),
      supabase.from("users").select("*").order("created_at", { ascending: false }),
    ]).then(([{ data: pData }, { data: uData }]) => {
      setProviders(pData ?? []);
      setUsers(uData ?? []);
      setLoading(false);
    });
  }, [isAdmin]);

  const handleVerify = async (providerId: string, verified: boolean) => {
    await supabase.from("provider_profiles").update({ verified }).eq("id", providerId);
    setProviders((prev) => prev.map((p) => p.id === providerId ? { ...p, verified } : p));
  };

  if (Platform.OS !== "web") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.sub}>Disponível apenas na versão web.</Text>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-root">
        <div className="admin-access-denied">
          <span style={{ fontSize: 48 }}>🔒</span>
          <h2>Acesso restrito</h2>
          <p>Você não tem permissão para acessar esta área.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => window.location.href = "/"}>
            ← Voltar à Praça
          </button>
        </div>
      </div>
    );
  }

  const availableNow = providers.filter((p) => p.availability_status === "available_now").length;
  const verified = providers.filter((p) => p.verified).length;
  const pending = providers.filter((p) => !p.verified).length;

  const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
    { id: "overview", icon: "📊", label: "Visão Geral" },
    { id: "providers", icon: "🔧", label: "Prestadores" },
    { id: "users", icon: "👥", label: "Usuários" },
  ];

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Praça<span>Hub</span></div>
        <div className="admin-sidebar-sub">Painel Admin</div>
        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <button
              className="admin-nav-item"
              onClick={() => window.location.href = "/"}
            >
              ← Praça Virtual
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>
            {tab === "overview" && "Visão Geral"}
            {tab === "providers" && "Prestadores"}
            {tab === "users" && "Usuários"}
          </h1>
          <div className="admin-topbar-right">
            <div className="admin-badge-dot" />
            <span style={{ fontSize: 13, color: "#6B60A0" }}>Sistema online</span>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">🔧</div>
                      <div className="admin-stat-value">{providers.length}</div>
                      <div className="admin-stat-label">Total de prestadores</div>
                      <div className="admin-stat-change up">✓ {verified} verificados</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👥</div>
                      <div className="admin-stat-value">{users.length}</div>
                      <div className="admin-stat-label">Usuários cadastrados</div>
                      <div className="admin-stat-change neutral">Todos ativos</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">🟢</div>
                      <div className="admin-stat-value">{availableNow}</div>
                      <div className="admin-stat-label">Disponíveis agora</div>
                      <div className="admin-stat-change up">Ao vivo</div>
                    </div>
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">⏳</div>
                      <div className="admin-stat-value">{pending}</div>
                      <div className="admin-stat-label">Aguardando verificação</div>
                      <div className={`admin-stat-change ${pending > 0 ? "up" : "neutral"}`}>
                        {pending > 0 ? "Ação necessária" : "Em dia"}
                      </div>
                    </div>
                  </div>

                  <div className="admin-section-title">Últimos prestadores cadastrados</div>
                  <ProvidersTable providers={providers.slice(0, 5)} onVerify={handleVerify} />
                </>
              )}

              {tab === "providers" && (
                <>
                  <div className="admin-section-title">{providers.length} prestadores no sistema</div>
                  <ProvidersTable providers={providers} onVerify={handleVerify} />
                </>
              )}

              {tab === "users" && (
                <>
                  <div className="admin-section-title">{users.length} usuários registrados</div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Usuário</th>
                          <th>Email</th>
                          <th>Função</th>
                          <th>Cadastrado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <span className="admin-avatar-mini">
                                {u.name?.charAt(0) ?? "?"}
                              </span>
                              {u.name ?? "—"}
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`admin-status ${u.role === "provider" ? "available" : "neutral"}`}>
                                {u.role === "provider" ? "Prestador" : u.role === "admin" ? "Admin" : "Usuário"}
                              </span>
                            </td>
                            <td>{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ProvidersTable({ providers, onVerify }: { providers: any[]; onVerify: (id: string, v: boolean) => void }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Prestador</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Verificado</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id}>
              <td>
                <span className="admin-avatar-mini">
                  {p.users?.name?.charAt(0) ?? "?"}
                </span>
                {p.users?.name ?? "—"}
              </td>
              <td>
                <span className={`admin-status ${
                  p.availability_status === "available_now" ? "available" :
                  p.availability_status === "available_today" ? "today" : "unavail"
                }`}>
                  {p.availability_status === "available_now" ? "Agora" :
                   p.availability_status === "available_today" ? "Hoje" : "Inativo"}
                </span>
              </td>
              <td>
                {p.avg_rating > 0
                  ? <span style={{ color: "#F59E0B" }}>★ {Number(p.avg_rating).toFixed(1)}</span>
                  : <span style={{ color: "#4B4470" }}>Novo</span>
                }
              </td>
              <td>
                {p.verified
                  ? <span className="admin-verified">✓ Sim</span>
                  : <span style={{ color: "#4B4470", fontSize: 12 }}>Não</span>
                }
              </td>
              <td>
                {p.verified ? (
                  <button className="admin-btn admin-btn-danger" onClick={() => onVerify(p.id, false)}>
                    Revogar
                  </button>
                ) : (
                  <button className="admin-btn admin-btn-primary" onClick={() => onVerify(p.id, true)}>
                    ✓ Verificar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#080613", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#EDE9F8", marginBottom: 8 },
  sub: { fontSize: 14, color: "#6B60A0" },
});
