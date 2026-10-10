import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow: hidden !important; height: 100%; }
.prov-root {
  height: 100vh; overflow-y: auto; background: #080613; color: #EDE9F8;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.prov-nav {
  display: flex; align-items: center; gap: 12px; padding: 20px 40px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: sticky; top: 0; background: #080613; z-index: 10;
}
.prov-nav-back {
  font-size: 14px; font-weight: 600; color: #6B60A0;
  cursor: pointer; border: none; background: none; transition: color .15s;
}
.prov-nav-back:hover { color: #EDE9F8; }

.prov-content { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }

.prov-hero {
  background: #100C26; border: 1px solid rgba(108,61,224,0.12);
  border-radius: 24px; padding: 40px; margin-bottom: 24px;
  display: flex; align-items: flex-start; gap: 28px; flex-wrap: wrap;
}
.prov-avatar {
  width: 88px; height: 88px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #6C3DE0, #F59E0B);
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; font-weight: 800; color: #fff;
  border: 3px solid rgba(108,61,224,0.3); overflow: hidden;
}
.prov-avatar img { width: 100%; height: 100%; object-fit: cover; }
.prov-info { flex: 1; }
.prov-name { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 6px; letter-spacing: -0.4px; }
.prov-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 700;
}
.badge-available { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #10B981; }
.badge-today { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.25); color: #F59E0B; }
.badge-unavailable { background: rgba(107,96,160,0.12); border: 1px solid rgba(107,96,160,0.2); color: #6B60A0; }
.badge-verified { background: rgba(108,61,224,0.12); border: 1px solid rgba(108,61,224,0.25); color: #A78BFA; }
.prov-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.prov-rating-num { font-size: 18px; font-weight: 800; color: #F59E0B; }
.prov-rating-count { font-size: 13px; color: #6B60A0; }
.prov-radius { font-size: 13px; color: #6B60A0; }

.prov-cta {
  padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 700;
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6); color: #fff;
  border: none; cursor: pointer; transition: opacity .2s; white-space: nowrap; align-self: flex-start;
}
.prov-cta:hover { opacity: .85; }
.prov-cta:disabled { opacity: .4; cursor: default; }

.prov-card {
  background: #100C26; border: 1px solid rgba(108,61,224,0.1);
  border-radius: 20px; padding: 28px; margin-bottom: 20px;
}
.prov-card-title { font-size: 13px; font-weight: 700; color: #6B60A0; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 16px; }
.prov-bio { font-size: 15px; color: #C4BDE0; line-height: 1.7; }

.prov-photos { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
.prov-photo { width: 160px; height: 120px; border-radius: 12px; object-fit: cover; flex-shrink: 0; background: rgba(108,61,224,0.08); }

.prov-service {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
}
.prov-service:last-child { border-bottom: none; }
.prov-service-name { font-size: 15px; font-weight: 600; color: #EDE9F8; }
.prov-service-desc { font-size: 13px; color: #6B60A0; margin-top: 2px; }
.prov-service-price { font-size: 14px; font-weight: 700; color: #A78BFA; white-space: nowrap; margin-left: 16px; }

.prov-review { background: rgba(108,61,224,0.05); border-radius: 12px; padding: 16px; margin-bottom: 10px; }
.prov-review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.prov-review-stars { color: #F59E0B; font-size: 14px; }
.prov-review-date { font-size: 12px; color: #4B4470; }
.prov-review-comment { font-size: 14px; color: #C4BDE0; line-height: 1.6; }

.prov-loading { display: flex; align-items: center; justify-content: center; height: 100vh; color: #6B60A0; font-size: 15px; }
.prov-not-found { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; }
.prov-not-found h2 { font-size: 20px; font-weight: 700; color: #EDE9F8; }
.prov-not-found p { font-size: 14px; color: #6B60A0; }

@media (max-width: 600px) {
  .prov-content { padding: 24px 16px 80px; }
  .prov-hero { padding: 24px; }
  .prov-nav { padding: 16px 20px; }
}
`;

const STATUS_LABEL: Record<string, string> = {
  available_now: "Disponível agora",
  available_today: "Disponível hoje",
  unavailable: "Indisponível",
};

export default function ProviderProfileWeb() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase
      .rpc("get_provider_by_id", { p_id: id })
      .single()
      .then(({ data }) => {
        setProvider(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="prov-root"><div className="prov-loading">Carregando...</div></div>;
  }

  if (!provider) {
    return (
      <div className="prov-root">
        <div className="prov-not-found">
          <h2>Prestador não encontrado</h2>
          <p>O perfil que você procura não existe ou foi removido.</p>
          <button className="prov-cta" onClick={() => (window.location.href = "/")}>← Voltar</button>
        </div>
      </div>
    );
  }

  const status = provider.availability_status as string;
  const statusClass =
    status === "available_now" ? "badge-available" :
    status === "available_today" ? "badge-today" : "badge-unavailable";

  return (
    <div className="prov-root">
      <nav className="prov-nav">
        <button className="prov-nav-back" onClick={() => (window.location.href = "/")}>
          ← Praça Virtual
        </button>
      </nav>

      <div className="prov-content">
        {/* Hero */}
        <div className="prov-hero">
          <div className="prov-avatar">
            {provider.avatar_url
              ? <img src={provider.avatar_url} alt={provider.name} />
              : provider.name?.charAt(0).toUpperCase()}
          </div>
          <div className="prov-info">
            <div className="prov-name">{provider.name}</div>
            <div className="prov-badges">
              <span className={`badge ${statusClass}`}>
                {status === "available_now" ? "● " : status === "available_today" ? "◑ " : "○ "}
                {STATUS_LABEL[status] ?? status}
              </span>
              {provider.verified && <span className="badge badge-verified">✓ Verificado</span>}
            </div>
            {provider.avg_rating > 0 && (
              <div className="prov-rating">
                <span className="prov-rating-num">★ {Number(provider.avg_rating).toFixed(1)}</span>
                <span className="prov-rating-count">({provider.total_reviews} avaliações)</span>
              </div>
            )}
            <div className="prov-radius">📍 Atende num raio de {provider.service_radius_km} km</div>
          </div>
          <button
            className="prov-cta"
            disabled={status === "unavailable"}
            onClick={() => alert("Funcionalidade de solicitação em breve!")}
          >
            {status === "unavailable" ? "Indisponível" : "Solicitar serviço"}
          </button>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div className="prov-card">
            <div className="prov-card-title">Sobre</div>
            <p className="prov-bio">{provider.bio}</p>
          </div>
        )}

        {/* Portfólio */}
        {provider.portfolio_photos?.length > 0 && (
          <div className="prov-card">
            <div className="prov-card-title">Trabalhos realizados</div>
            <div className="prov-photos">
              {provider.portfolio_photos.map((url: string, i: number) => (
                <img key={i} src={url} alt={`Trabalho ${i + 1}`} className="prov-photo" />
              ))}
            </div>
          </div>
        )}

        {/* Serviços */}
        {provider.services?.length > 0 && (
          <div className="prov-card">
            <div className="prov-card-title">Serviços oferecidos</div>
            {provider.services.map((s: any) => (
              <div key={s.id} className="prov-service">
                <div>
                  <div className="prov-service-name">{s.tag_name}</div>
                  {s.custom_description && <div className="prov-service-desc">{s.custom_description}</div>}
                </div>
                {s.price_range_min && (
                  <div className="prov-service-price">
                    R$ {Number(s.price_range_min).toLocaleString("pt-BR")}
                    {s.price_range_max && ` – ${Number(s.price_range_max).toLocaleString("pt-BR")}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Avaliações */}
        {provider.reviews?.length > 0 && (
          <div className="prov-card">
            <div className="prov-card-title">Avaliações recentes</div>
            {provider.reviews.map((r: any) => (
              <div key={r.id} className="prov-review">
                <div className="prov-review-header">
                  <span className="prov-review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="prov-review-date">{new Date(r.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                {r.comment && <p className="prov-review-comment">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
