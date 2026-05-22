import React, { useState } from "react";
import { Icon, AiBadge } from './primitives.jsx';

// =========================================================
// ProcessIQ — Insight detail panel
// =========================================================
const InsightDetailPanel = ({ insight, onClose, onAction, onNavigate }) => {
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);

  if (!insight) return null;

  const apply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setDone(true);
    }, 1600);
  };

  const priorityColor = insight.priority === "high" ? "var(--danger)" : insight.priority === "med" ? "var(--warning)" : "var(--info)";

  return (
    <div className="detail-panel" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line-1)" }} className="row gap-2">
          <div className="col gap-1" style={{ flex: 1 }}>
            <div className="row gap-2">
              <AiBadge label="Insight IA" />
              <span className="chip" style={{ height: 20, fontSize: 10.5, color: priorityColor, borderColor: priorityColor, background: "transparent" }}>
                <span className="dot" />
                Prioridad {insight.priority === "high" ? "Alta" : insight.priority === "med" ? "Media" : "Baja"}
              </span>
              <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{insight.category}</span>
              <span className="t-mono" style={{ color: "var(--fg-4)", fontSize: 11 }}>{insight.id.toUpperCase()}</span>
            </div>
            <div className="t-h1" style={{ marginTop: 8, fontSize: 19, lineHeight: 1.35 }}>{insight.title}</div>
          </div>
          <button className="btn btn-icon" onClick={onClose}><Icon name="x" size={13} /></button>
        </div>

        <div className="scroll-area" style={{ padding: "20px 24px" }}>
          <div className="col gap-5">
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <Stat label="Impacto" value={insight.impact} tone="success" />
              <Stat label="Confianza" value={`${Math.round(insight.confidence * 100)}%`} />
              <Stat label="Proceso" value={insight.related} link onClick={() => onNavigate("processes")} />
              <Stat label="Tiempo a valor" value={insight.eta} />
            </div>

            {/* Reasoning */}
            <div className="card card-pad ai-frame" style={{ background: "var(--bg-2)", borderColor: "var(--ai-line)" }}>
              <div className="row gap-2" style={{ marginBottom: 8 }}>
                <AiBadge label="Razonamiento de la IA" />
              </div>
              <div className="t-body" style={{ color: "var(--fg-1)", fontSize: 13.5, lineHeight: 1.65 }}>
                {insight.detail}
              </div>
              <div className="divider" style={{ margin: "14px 0" }} />
              <div className="col gap-2">
                <span className="t-eyebrow">Evidencia consultada</span>
                {[
                  { label: "Histórico 90 días del proceso " + insight.related, icon: "processes" },
                  { label: "Tabla de incidencias correlacionadas", icon: "alert" },
                  { label: "Política institucional · SLA aseguradoras", icon: "book" },
                  { label: "Benchmark inter-sede Q1 2026", icon: "git" },
                ].map((e, i) => (
                  <div key={i} className="row gap-2" style={{ fontSize: 12, color: "var(--fg-2)" }}>
                    <Icon name={e.icon} size={12} style={{ color: "var(--fg-4)" }} />
                    <span>{e.label}</span>
                    <Icon name="arrowUpRight" size={11} style={{ color: "var(--fg-5)", marginLeft: "auto" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-causes */}
            <div className="col gap-2">
              <span className="t-eyebrow">Causas detectadas</span>
              <div className="col gap-2">
                {[
                  { label: "Aseguradoras priorizan martes/miércoles", weight: 38 },
                  { label: "Documentación incompleta al iniciar trámite", weight: 28 },
                  { label: "Re-envíos por errores de codificación", weight: 18 },
                  { label: "Variabilidad estacional", weight: 16 },
                ].map((c, i) => (
                  <div key={i} className="row gap-3" style={{ alignItems: "center" }}>
                    <span style={{ flex: 1, fontSize: 12.5, color: "var(--fg-1)" }}>{c.label}</span>
                    <div style={{ width: 140, height: 6, background: "var(--bg-3)", borderRadius: 999 }}>
                      <div style={{ width: `${c.weight}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
                    </div>
                    <span className="t-num" style={{ fontSize: 12, color: "var(--fg-3)", minWidth: 32, textAlign: "right" }}>{c.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended actions */}
            <div className="col gap-2">
              <span className="t-eyebrow">Acciones recomendadas por la IA</span>
              <div className="col gap-2">
                {insight.actions.map((a, i) => (
                  <div key={i} className="card card-pad row gap-3" style={{ padding: 14, alignItems: "center" }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: i === 0 ? "var(--ai-soft)" : "var(--bg-2)",
                      color: i === 0 ? "var(--ai)" : "var(--fg-3)",
                      border: `1px solid ${i === 0 ? "var(--ai-line)" : "var(--line-1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon name={i === 0 ? "bolt" : i === 1 ? "user" : "reports"} size={12} />
                    </span>
                    <div className="col" style={{ flex: 1, gap: 1 }}>
                      <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{a}</span>
                      {i === 0 && <span style={{ fontSize: 11, color: "var(--ai)" }}>El copiloto puede ejecutarla tras tu aprobación</span>}
                    </div>
                    {i === 0 && !done && (
                      <button className="btn btn-sm btn-ai" disabled={applying} onClick={apply}>
                        {applying ? "Aplicando…" : "Aplicar"}
                      </button>
                    )}
                    {i === 0 && done && (
                      <span className="chip chip-success" style={{ height: 22 }}>
                        <Icon name="check" size={11} /> Aplicada
                      </span>
                    )}
                    {i !== 0 && <button className="btn btn-sm btn-ghost">Iniciar</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="row gap-2">
              <button className="btn btn-sm btn-ghost"><Icon name="check" size={11} /> Es útil</button>
              <button className="btn btn-sm btn-ghost"><Icon name="x" size={11} /> No es relevante</button>
              <div className="spacer" />
              <button className="btn btn-sm"><Icon name="link" size={11} /> Copiar enlace</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone, link, onClick }) => (
  <div className="card card-pad col gap-1" style={{ padding: 12, background: "var(--bg-2)", borderColor: "var(--line-soft)" }}>
    <span style={{ fontSize: 10, color: "var(--fg-4)", letterSpacing: "0.04em", fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
    <span
      className="t-num"
      onClick={onClick}
      style={{
        fontSize: 15, fontWeight: 600,
        color: tone === "success" ? "var(--success)" : "var(--fg-1)",
        cursor: link ? "pointer" : "default",
        textDecoration: link ? "underline" : "none",
        textDecorationColor: "var(--line-2)",
        textUnderlineOffset: 3,
      }}
    >{value}</span>
  </div>
);

export { InsightDetailPanel };
export default InsightDetailPanel;
