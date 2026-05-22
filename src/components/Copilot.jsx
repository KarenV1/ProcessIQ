import React, { useState, useEffect, useRef } from "react";
import { Icon, AiBadge, AiThinking } from './primitives.jsx';
import { AI_SUGGESTED_PROMPTS, AI_INSIGHTS } from '../data.js';

// =========================================================
// ProcessIQ — Copiloto IA (panel lateral conversacional)
// =========================================================
const Copilot = ({ open, onClose, initialPrompt, role, onNavigate, onOpenInsight }) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hola María. Estoy listo para ayudarte a explorar la operación. Puedo analizar procesos, generar reportes y ejecutar acciones aprobadas por ti.",
      time: "ahora",
      suggestions: AI_SUGGESTED_PROMPTS.slice(0, 4),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (initialPrompt && open) {
      send(initialPrompt);
    }
    // eslint-disable-next-line
  }, [initialPrompt, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const send = (text) => {
    const userMsg = { role: "user", content: text, time: "ahora" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, generateReply(text)]);
    }, 1500 + Math.random() * 800);
  };

  if (!open) return null;

  return (
    <div className="detail-panel" onClick={onClose} style={{ background: "oklch(0 0 0 / 0.35)" }}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ width: "min(520px, 100vw)", background: "var(--bg-1)" }}>
        {/* header */}
        <div className="row gap-2" style={{ padding: "14px 18px", borderBottom: "1px solid var(--line-1)" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, var(--ai-soft), oklch(0.4 0.06 75 / 0.3))",
            border: "1px solid var(--ai-line)",
            color: "var(--ai)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="sparkle" size={15} />
          </div>
          <div className="col" style={{ gap: 1, flex: 1 }}>
            <div className="row gap-2">
              <span style={{ fontWeight: 600, color: "var(--fg-1)", fontSize: 14 }}>Copiloto operativo</span>
              <span className="chip chip-ai" style={{ height: 18, fontSize: 9.5, padding: "0 6px" }}>GPT-Ops 4</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--fg-4)" }}>
              <span className="dot" style={{ background: "var(--success)", marginRight: 5 }} />
              Conectado a 128 procesos · 6 fuentes
            </span>
          </div>
          <button className="btn btn-icon btn-ghost"><Icon name="history" size={13} /></button>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icon name="x" size={13} /></button>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="scroll-area" style={{ padding: "18px 18px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((m, i) => (
            <Message key={i} m={m} onSuggest={send} onNavigate={onNavigate} onOpenInsight={onOpenInsight} />
          ))}
          {thinking && (
            <div className="row gap-2" style={{ alignItems: "flex-start" }}>
              <AiAvatar />
              <div className="card card-pad" style={{ padding: "10px 14px", maxWidth: 360 }}>
                <AiThinking text="Analizando…" />
              </div>
            </div>
          )}
        </div>

        {/* input */}
        <div style={{ padding: 14, borderTop: "1px solid var(--line-1)" }}>
          <div className="row gap-2" style={{ flexWrap: "wrap", marginBottom: 10 }}>
            {AI_SUGGESTED_PROMPTS.slice(0, 3).map((s, i) => (
              <button key={i} className="chip" style={{ cursor: "pointer", borderColor: "var(--line-2)" }} onClick={() => send(s)}>
                <Icon name="sparkle" size={10} style={{ color: "var(--ai)" }} /> {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) send(input.trim()); }} style={{
            display: "flex", gap: 8, padding: 6, borderRadius: 10,
            border: "1px solid var(--line-2)", background: "var(--bg-2)",
          }}>
            <button type="button" className="btn btn-icon btn-ghost" style={{ width: 30, height: 30 }}><Icon name="plus" size={13} /></button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta o pide una acción al copiloto…"
              style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--fg-1)", fontSize: 13 }}
            />
            <button type="submit" className="btn" style={{ background: "var(--ai)", color: "oklch(0.18 0.03 70)", borderColor: "transparent", fontWeight: 600 }}>
              <Icon name="send" size={12} /> Enviar
            </button>
          </form>
          <div className="row gap-2" style={{ paddingTop: 8, fontSize: 11, color: "var(--fg-5)" }}>
            <Icon name="shield" size={11} />
            <span>Las respuestas citan procesos, métricas y políticas internas. Toda acción requiere tu aprobación.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AiAvatar = () => (
  <div style={{
    width: 26, height: 26, borderRadius: 8,
    background: "linear-gradient(135deg, var(--ai-soft), oklch(0.4 0.06 75 / 0.3))",
    border: "1px solid var(--ai-line)",
    color: "var(--ai)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <Icon name="sparkle" size={12} />
  </div>
);

const Message = ({ m, onSuggest, onNavigate, onOpenInsight }) => {
  if (m.role === "user") {
    return (
      <div className="row gap-2" style={{ alignItems: "flex-start", justifyContent: "flex-end" }}>
        <div style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--accent-line)",
          padding: "9px 13px", borderRadius: 11,
          maxWidth: 360, color: "var(--fg-1)", fontSize: 13, lineHeight: 1.5,
        }}>{m.content}</div>
        <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>MR</div>
      </div>
    );
  }
  return (
    <div className="row gap-2" style={{ alignItems: "flex-start" }}>
      <AiAvatar />
      <div className="col gap-2" style={{ maxWidth: 400 }}>
        <div className="card card-pad" style={{ padding: "12px 14px", background: "var(--bg-2)" }}>
          <div className="t-body" style={{ color: "var(--fg-1)", fontSize: 13, lineHeight: 1.6 }}>{m.content}</div>
          {m.citations && (
            <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 10 }}>
              {m.citations.map((c, i) => (
                <span key={i} className="chip" style={{ height: 22, fontSize: 11, cursor: "pointer" }}>
                  <Icon name={c.icon || "link"} size={10} /> {c.label}
                </span>
              ))}
            </div>
          )}
          {m.actions && (
            <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line-soft)" }}>
              {m.actions.map((a, i) => (
                <button key={i} className={a.primary ? "btn btn-sm btn-ai" : "btn btn-sm"} onClick={() => {
                  if (a.navigate) onNavigate(a.navigate);
                  if (a.openInsight) onOpenInsight(a.openInsight);
                }}>
                  <Icon name={a.icon || "arrow"} size={11} /> {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {m.suggestions && (
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {m.suggestions.map((s, i) => (
              <button key={i} className="chip" style={{ cursor: "pointer" }} onClick={() => onSuggest(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Very rough fake reply generator — picks from canned responses based on prompt content
function generateReply(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("cuello") || p.includes("bottleneck") || p.includes("costos")) {
    return {
      role: "ai",
      time: "ahora",
      content: "El cuello de botella más costoso este mes es **Autorización aseguradora** en el proceso de cirugía electiva. Promedia 28h de espera (SLA: 12h) y genera un impacto de $48K/mes en cirugías postergadas. Afecta principalmente a 3 aseguradoras.",
      citations: [
        { label: "P-002 · Programación cirugía electiva", icon: "processes" },
        { label: "Insight i-01", icon: "sparkle" },
      ],
      actions: [
        { label: "Ver insight", icon: "sparkle", primary: true, openInsight: AI_INSIGHTS[0] },
        { label: "Ir al proceso", icon: "arrow", navigate: "processes" },
      ],
    };
  }
  if (p.includes("comparar") || p.includes("urgencias") || p.includes("hospitalización")) {
    return {
      role: "ai",
      time: "ahora",
      content: "**Urgencias** opera con 84% de carga, SLA 92.1% y 4 incidencias abiertas. **Hospitalización** lleva 66% de carga, SLA 87.5%, 3 incidencias. Urgencias procesa 3.4x más volumen pero su ciclo es 47% menor. Hospitalización tiene un problema recurrente en el subproceso de Alta (P-004).",
      citations: [
        { label: "Área: Urgencias", icon: "heart" },
        { label: "Área: Hospitalización", icon: "hospital" },
        { label: "P-004 · Alta hospitalaria", icon: "processes" },
      ],
      actions: [
        { label: "Abrir analítica", icon: "analytics", navigate: "analytics" },
      ],
    };
  }
  if (p.includes("reporte") || p.includes("comité") || p.includes("generar reporte")) {
    return {
      role: "ai",
      time: "ahora",
      content: "Voy a generar un reporte ejecutivo con datos de la última semana. Incluirá KPIs, hallazgos clave, los 3 cuellos de botella prioritarios y un plan de acción con responsables sugeridos. Estimación: 8 páginas, lista en ~30 segundos.",
      actions: [
        { label: "Generar ahora", icon: "sparkle", primary: true, navigate: "reports" },
        { label: "Configurar plantilla", icon: "config" },
      ],
    };
  }
  if (p.includes("roi") || p.includes("automatización")) {
    return {
      role: "ai",
      time: "ahora",
      content: "Las 3 automatizaciones con mayor ROI proyectado son: **Validación CUPS pre-envío EPS** ($18K/mes), **Triage asistido por IA** ($22K/mes) y **Resumen clínico de egreso** ($12.8K/mes). Ahorro combinado: $52.8K/mes y 1.640h de trabajo manual evitado.",
      actions: [
        { label: "Ver automatizaciones", icon: "automations", navigate: "automations", primary: true },
      ],
    };
  }
  if (p.includes("incidencias") || p.includes("hoy") || p.includes("críticas")) {
    return {
      role: "ai",
      time: "ahora",
      content: "Hay **2 incidencias críticas** abiertas: caída de integración HL7 con laboratorio externo (hace 12 min) y pico de espera en triaje >45 min (reconocida). Recomiendo escalar la integración a soporte técnico y reasignar 2 enfermeros al triaje por las próximas 2 horas.",
      actions: [
        { label: "Asignar tareas", icon: "bolt", primary: true },
        { label: "Ver incidencias", icon: "alert" },
      ],
    };
  }
  // default
  return {
    role: "ai",
    time: "ahora",
    content: "Procesé tu consulta. Para darte una respuesta accionable necesito que escojas el ángulo de análisis. ¿Quieres profundizar en procesos específicos, en una vista temporal, o en oportunidades de automatización?",
    suggestions: [
      "Análisis temporal del mes",
      "Procesos con mayor riesgo",
      "Oportunidades de automatización",
    ],
  };
}

export { Copilot };
export default Copilot;
