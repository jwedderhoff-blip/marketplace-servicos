import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const SERVICES = [
  { id: "b1000000-0000-0000-0000-000000000001", name: "Instalação Elétrica", category: "Elétrica", icon: "⚡" },
  { id: "b1000000-0000-0000-0000-000000000002", name: "Curto-Circuito", category: "Elétrica", icon: "⚡" },
  { id: "b1000000-0000-0000-0000-000000000003", name: "Encanamento", category: "Hidráulica", icon: "💧" },
  { id: "b1000000-0000-0000-0000-000000000004", name: "Desentupimento", category: "Hidráulica", icon: "💧" },
  { id: "b1000000-0000-0000-0000-000000000005", name: "Pintura de Sala", category: "Pintura", icon: "🎨" },
  { id: "b1000000-0000-0000-0000-000000000006", name: "Textura e Grafiato", category: "Pintura", icon: "🎨" },
  { id: "b1000000-0000-0000-0000-000000000007", name: "Armário Planejado", category: "Marcenaria", icon: "🪵" },
  { id: "b1000000-0000-0000-0000-000000000008", name: "Reforma de Móvel", category: "Marcenaria", icon: "🪵" },
  { id: "b1000000-0000-0000-0000-000000000009", name: "Ar-condicionado Split", category: "Climatização", icon: "❄️" },
  { id: "b1000000-0000-0000-0000-000000000010", name: "Refrigeração Doméstica", category: "Climatização", icon: "❄️" },
  { id: "b1000000-0000-0000-0000-000000000011", name: "Paisagismo", category: "Jardim", icon: "🌿" },
  { id: "b1000000-0000-0000-0000-000000000012", name: "Corte de Grama", category: "Jardim", icon: "🌿" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.reg-root {
  min-height: 100vh; background: #080613; color: #EDE9F8;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  display: flex; align-items: stretch;
}
.reg-left {
  width: 420px; flex-shrink: 0;
  background: linear-gradient(160deg, #1A0A3A 0%, #0E0820 100%);
  border-right: 1px solid rgba(108,61,224,0.15);
  padding: 48px 40px; display: flex; flex-direction: column;
  justify-content: space-between;
  background-image: radial-gradient(rgba(108,61,224,0.08) 1px, transparent 1px);
  background-size: 28px 28px;
}
.reg-left-logo { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 64px; }
.reg-left-logo span { color: #A78BFA; }
.reg-left-content h2 {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 36px; line-height: 1.15; color: #fff; margin-bottom: 20px;
}
.reg-left-content p { font-size: 15px; color: #6B60A0; line-height: 1.6; margin-bottom: 32px; }
.reg-perks { display: flex; flex-direction: column; gap: 16px; }
.reg-perk { display: flex; align-items: flex-start; gap: 12px; }
.reg-perk-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(108,61,224,0.2); border: 1px solid rgba(108,61,224,0.3);
  display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
}
.reg-perk-text strong { display: block; font-size: 14px; color: #EDE9F8; margin-bottom: 2px; }
.reg-perk-text span { font-size: 12px; color: #6B60A0; }
.reg-right { flex: 1; padding: 48px; overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-start; }
.reg-right-inner { max-width: 540px; width: 100%; margin: 0 auto; }

/* Stepper */
.reg-stepper { display: flex; align-items: center; gap: 0; margin-bottom: 40px; }
.reg-step { display: flex; align-items: center; gap: 8px; }
.reg-step-circle {
  width: 32px; height: 32px; border-radius: 50%; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid rgba(108,61,224,0.2); color: #4B4470; transition: all .3s;
}
.reg-step-circle.done { background: #10B981; border-color: #10B981; color: #fff; }
.reg-step-circle.active { background: rgba(108,61,224,0.2); border-color: #6C3DE0; color: #A78BFA; }
.reg-step-label { font-size: 12px; color: #4B4470; font-weight: 600; }
.reg-step-label.active { color: #A78BFA; }
.reg-step-line { flex: 1; height: 1px; background: rgba(108,61,224,0.15); margin: 0 8px; }

/* Form */
.reg-form-title { font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.reg-form-sub { font-size: 14px; color: #6B60A0; margin-bottom: 32px; }
.reg-field { margin-bottom: 20px; }
.reg-label { display: block; font-size: 12px; font-weight: 700; color: #9B8EC0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.reg-input, .reg-textarea {
  width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(108,61,224,0.2);
  border-radius: 12px; padding: 12px 16px; font-size: 15px; color: #EDE9F8;
  font-family: inherit; outline: none; transition: border-color .2s;
}
.reg-input:focus, .reg-textarea:focus { border-color: rgba(108,61,224,0.6); }
.reg-input::placeholder, .reg-textarea::placeholder { color: #4B4470; }
.reg-textarea { resize: vertical; min-height: 100px; }
.reg-select {
  width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(108,61,224,0.2);
  border-radius: 12px; padding: 12px 16px; font-size: 15px; color: #EDE9F8;
  font-family: inherit; outline: none; cursor: pointer;
}
.reg-select option { background: #1A1035; }

/* Service grid */
.reg-service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.reg-service-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 12px;
  border: 1px solid rgba(108,61,224,0.2); background: rgba(108,61,224,0.06);
  cursor: pointer; transition: all .15s; user-select: none;
  font-size: 13px; font-weight: 600; color: #9B8EC0;
}
.reg-service-chip:hover { border-color: rgba(108,61,224,0.4); }
.reg-service-chip.selected { background: rgba(108,61,224,0.2); border-color: #6C3DE0; color: #EDE9F8; }
.reg-service-price { display: flex; gap: 8px; margin-top: 8px; }
.reg-service-price input { flex: 1; }

/* Row */
.reg-row { display: flex; gap: 12px; }
.reg-row .reg-field { flex: 1; }

/* Buttons */
.reg-actions { display: flex; gap: 12px; margin-top: 32px; }
.reg-btn-back {
  padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: 700;
  border: 1px solid rgba(108,61,224,0.2); background: none; color: #9B8EC0;
  cursor: pointer; transition: all .15s;
}
.reg-btn-back:hover { border-color: rgba(108,61,224,0.5); color: #EDE9F8; }
.reg-btn-next {
  flex: 1; padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: 700;
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6); border: none; color: #fff;
  cursor: pointer; transition: opacity .2s;
}
.reg-btn-next:hover { opacity: .85; }
.reg-btn-next:disabled { opacity: .4; cursor: not-allowed; }

/* Success */
.reg-success { text-align: center; padding: 40px 0; }
.reg-success-icon { font-size: 64px; margin-bottom: 24px; }
.reg-success h2 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 12px; }
.reg-success p { color: #6B60A0; margin-bottom: 32px; line-height: 1.6; }
.reg-success-btn {
  display: inline-block; padding: 14px 32px; border-radius: 12px;
  background: linear-gradient(135deg, #6C3DE0, #8B5CF6); color: #fff;
  font-size: 15px; font-weight: 700; cursor: pointer; border: none;
  transition: opacity .2s;
}
.reg-error { color: #F87171; font-size: 13px; margin-top: 8px; }

@media (max-width: 900px) { .reg-left { display: none; } .reg-right { padding: 32px 20px; } }
`;

type Step = 1 | 2 | 3;

interface ServiceEntry { tagId: string; priceMin: string; priceMax: string; }

export default function RegisterProviderWeb() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Step 1: basic info
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [radius, setRadius] = useState("20");

  // Step 2: services
  const [selectedServices, setSelectedServices] = useState<ServiceEntry[]>([]);

  // Step 3: location
  const [city, setCity] = useState("São Paulo");
  const [neighborhood, setNeighborhood] = useState("");
  const [availability, setAvailability] = useState<string>("available_now");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const toggleService = (tagId: string) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.tagId === tagId);
      if (exists) return prev.filter((s) => s.tagId !== tagId);
      return [...prev, { tagId, priceMin: "", priceMax: "" }];
    });
  };

  const updatePrice = (tagId: string, field: "priceMin" | "priceMax", value: string) => {
    setSelectedServices((prev) =>
      prev.map((s) => s.tagId === tagId ? { ...s, [field]: value } : s)
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      // 1. update user role
      await supabase.from("users").update({ role: "provider" }).eq("id", user!.id);

      // 2. create provider profile
      const { data: profile, error: profileErr } = await supabase
        .from("provider_profiles")
        .insert({
          user_id: user!.id,
          bio,
          phone,
          service_radius_km: Number(radius),
          availability_status: availability,
          verified: false,
        })
        .select()
        .single();
      if (profileErr) throw profileErr;

      // 3. insert provider services
      if (selectedServices.length > 0) {
        await supabase.from("provider_services").insert(
          selectedServices.map((s) => ({
            provider_id: profile.id,
            tag_id: s.tagId,
            price_range_min: s.priceMin ? Number(s.priceMin) : null,
            price_range_max: s.priceMax ? Number(s.priceMax) : null,
          }))
        );
      }

      setDone(true);
    } catch (e: any) {
      setError(e.message ?? "Erro ao cadastrar. Tente novamente.");
    }
    setSubmitting(false);
  };

  const STEPS = ["Sobre você", "Seus serviços", "Localização"];

  return (
    <div className="reg-root">
      {/* Left panel */}
      <aside className="reg-left">
        <div className="reg-left-logo">Praça<span>Hub</span></div>
        <div className="reg-left-content">
          <h2>Transforme sua habilidade em renda</h2>
          <p>
            Conecte-se com clientes que precisam do seu serviço agora mesmo.
            Sem mensalidade, sem burocracia.
          </p>
          <div className="reg-perks">
            <div className="reg-perk">
              <div className="reg-perk-icon">📱</div>
              <div className="reg-perk-text">
                <strong>Receba chamados em tempo real</strong>
                <span>Notificações instantâneas quando alguém precisar de você</span>
              </div>
            </div>
            <div className="reg-perk">
              <div className="reg-perk-icon">⭐</div>
              <div className="reg-perk-text">
                <strong>Construa sua reputação</strong>
                <span>Avaliações verificadas que valorizam seu trabalho</span>
              </div>
            </div>
            <div className="reg-perk">
              <div className="reg-perk-icon">💰</div>
              <div className="reg-perk-text">
                <strong>Você define seus preços</strong>
                <span>Total autonomia sobre suas tarifas e disponibilidade</span>
              </div>
            </div>
            <div className="reg-perk">
              <div className="reg-perk-icon">🔒</div>
              <div className="reg-perk-text">
                <strong>Plataforma gratuita</strong>
                <span>Sem taxa de adesão, sem mensalidade</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#4B4470" }}>© 2025 PraçaHub</div>
      </aside>

      {/* Right panel */}
      <div className="reg-right">
        <div className="reg-right-inner">
          {done ? (
            <div className="reg-success">
              <div className="reg-success-icon">🎉</div>
              <h2>Cadastro realizado!</h2>
              <p>
                Seu perfil foi criado com sucesso. Nossa equipe revisará suas informações
                e você receberá a verificação em breve.
              </p>
              <button className="reg-success-btn" onClick={() => window.location.href = "/"}>
                Ver meu perfil na Praça →
              </button>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div className="reg-stepper">
                {STEPS.map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0, gap: 8 }}>
                    <div className="reg-step">
                      <div className={`reg-step-circle ${step > i + 1 ? "done" : step === i + 1 ? "active" : ""}`}>
                        {step > i + 1 ? "✓" : i + 1}
                      </div>
                      <span className={`reg-step-label ${step === i + 1 ? "active" : ""}`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className="reg-step-line" style={{ flex: 1 }} />}
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div className="reg-form-title">Apresente-se</div>
                  <div className="reg-form-sub">Essas informações aparecerão no seu perfil público.</div>
                  <div className="reg-field">
                    <label className="reg-label">Bio profissional</label>
                    <textarea
                      className="reg-textarea"
                      placeholder="Descreva sua experiência, especialidades e diferenciais..."
                      value={bio}
                      onChange={(e: any) => setBio(e.target.value)}
                    />
                  </div>
                  <div className="reg-row">
                    <div className="reg-field">
                      <label className="reg-label">Telefone (WhatsApp)</label>
                      <input
                        className="reg-input"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Raio de atendimento (km)</label>
                      <input
                        className="reg-input"
                        type="number"
                        placeholder="20"
                        value={radius}
                        onChange={(e: any) => setRadius(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="reg-actions">
                    <button className="reg-btn-back" onClick={() => window.location.href = "/"}>← Voltar</button>
                    <button
                      className="reg-btn-next"
                      disabled={!bio.trim()}
                      onClick={() => setStep(2)}
                    >
                      Próximo →
                    </button>
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div className="reg-form-title">Seus serviços</div>
                  <div className="reg-form-sub">Selecione os serviços que você oferece e informe sua faixa de preço.</div>
                  <div className="reg-service-grid">
                    {SERVICES.map((svc) => {
                      const entry = selectedServices.find((s) => s.tagId === svc.id);
                      const sel = !!entry;
                      return (
                        <div key={svc.id}>
                          <div
                            className={`reg-service-chip ${sel ? "selected" : ""}`}
                            onClick={() => toggleService(svc.id)}
                          >
                            {svc.icon} {svc.name}
                          </div>
                          {sel && (
                            <div className="reg-service-price">
                              <input
                                className="reg-input"
                                type="number"
                                placeholder="R$ mín"
                                value={entry.priceMin}
                                onChange={(e: any) => updatePrice(svc.id, "priceMin", e.target.value)}
                                style={{ fontSize: 12 }}
                              />
                              <input
                                className="reg-input"
                                type="number"
                                placeholder="R$ máx"
                                value={entry.priceMax}
                                onChange={(e: any) => updatePrice(svc.id, "priceMax", e.target.value)}
                                style={{ fontSize: 12 }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="reg-actions">
                    <button className="reg-btn-back" onClick={() => setStep(1)}>← Voltar</button>
                    <button
                      className="reg-btn-next"
                      disabled={selectedServices.length === 0}
                      onClick={() => setStep(3)}
                    >
                      Próximo →
                    </button>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <>
                  <div className="reg-form-title">Onde você atua</div>
                  <div className="reg-form-sub">Sua localização nos ajuda a conectar você com clientes próximos.</div>
                  <div className="reg-row">
                    <div className="reg-field">
                      <label className="reg-label">Cidade</label>
                      <input
                        className="reg-input"
                        placeholder="São Paulo"
                        value={city}
                        onChange={(e: any) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Bairro</label>
                      <input
                        className="reg-input"
                        placeholder="Ex: Pinheiros"
                        value={neighborhood}
                        onChange={(e: any) => setNeighborhood(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Disponibilidade inicial</label>
                    <select
                      className="reg-select"
                      value={availability}
                      onChange={(e: any) => setAvailability(e.target.value)}
                    >
                      <option value="available_now">Disponível agora</option>
                      <option value="available_today">Disponível hoje</option>
                      <option value="unavailable">Indisponível por enquanto</option>
                    </select>
                  </div>
                  {error && <div className="reg-error">{error}</div>}
                  <div className="reg-actions">
                    <button className="reg-btn-back" onClick={() => setStep(2)}>← Voltar</button>
                    <button
                      className="reg-btn-next"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Cadastrando..." : "Finalizar cadastro ✓"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
