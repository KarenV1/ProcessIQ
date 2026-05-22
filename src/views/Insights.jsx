import React, { useState, useMemo } from "react";
import { Icon, AiBadge, StatusPill, AiThinking } from '../components/primitives.jsx';
import { AI_INSIGHTS } from '../data.js';

// =========================================================
// ProcessIQ — IA Insights view
// =========================================================
const InsightsView = ({ onOpenInsight, onOpenProcess, role }) => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("priority");
  const [generating, setGenerating] = useState(false);

  const filtered = useMemo(() => {
    let list = [...AI_INSIGHTS];
    if (filter !== "all") list = list.filter((i) => i.priority === filter);
    if (sort === "priority") {
      const order = { high: 0, med: 1, low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sort === "confidence") {
      list.sort((a, b) => b.confidence - a.confidence);
    }
    return list;
  }, [filter, sort]);

  const summary = {
    total: AI_INSIGHTS.length,
    high: AI_INSIGHTS.filter((i) => i.priority === "high").length,
    impact: "$97K/mes",
    actionable: AI_INSIGHTS.filter((i) => i.actions.length).length,
  };

  return (
    <div className="content fade-in col gap-5">
      <div className="row gap-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="col gap-2" style={{ maxWidth: 720 }}>
          <span className="t-eyebrow" style={{ color: "var(--ai)" }}>IA Insights · {role.title}</span>
          <div className="t-display" style={{ fontSize: 28 }}>Recomendaciones generadas por el copiloto operativo</div>
          <div className="t-body">
            ProcessIQ analiza continuamente los procesos críticos, detecta anomalías, proyecta riesgos y propone acciones priorizadas por impacto financiero y operativo.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn">
            <Icon name="filter" size={13} /> Configurar reglas
          </button>
          <button className="btn btn-ai" onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 2400); }}>
            <Icon name="refresh" size={13} /> Re-analizar ahora
          </button>
        </div>
      </div>

      {generating && (
        <div className="card card-pad ai-frame fade-in" style={{ borderColor: "var(--ai-line)" }}>
          <AiThinking text="Analizando 128 procesos, 8 áreas y 6 fuentes de datos…" />
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <SkeletonRow w="80%" />
            <SkeletonRow w="64%" />
            <SkeletonRow w="72%" />
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <MiniStat icon="sparkle" tone="ai" label="Insights activos" value={summary.total} sub="actualizado hace 4 min" />
        <MiniStat icon="alert" tone="danger" label="Alta prioridad" value={summary.high} sub="impacto inmediato" />
        <MiniStat icon="bolt" tone="success" label="Impacto total" value={summary.impact} sub="proyectado mensual" />
        <MiniStat icon="check" tone="accent" label="Accionables" value={summary.actionable} sub="con plan sugerido" />
      </div>

      {/* Filters */}
      <div className="row gap-3" style={{ justifyContent: "space-between" }}>
        <div className="tabs">
          {[
            { id: "all", label: "Todas" },
            { id: "high", label: "Alta" },
            { id: "med", label: "Media" },
            { id: "low", label: "Baja" },
          ].map((t) => (
            <button key={t.id} data-active={filter === t.id} onClick={() => setFilter(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="row gap-2">
          <span className="t-small">Ordenar por</span>
          <div className="tabs">
            {[
              { id: "priority", label: "Prioridad" },
              { id: "confidence", label: "Confianza" },
            ].map((t) => (
              <button key={t.id} data-active={sort === t.id} onClick={() => setSort(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Insights list */}
      <div className="col gap-3">
        {filtered.map((ins) => (
          <InsightCard key={ins.id} ins={ins} onOpen={() => onOpenInsight(ins)} onOpenProcess={onOpenProcess} />
        ))}
      </div>
    </div>
  );
};

const InsightCard = ({ ins, onOpen, onOpenProcess }) => {
  const priorityColor = ins.priority === "high" ? "var(--danger)" : ins.priority === "med" ? "var(--warning)" : "var(--info)";
  return (
    <div className="card fade-in" style={{ padding: 0, overflow: "hidden" }}>
      <div className="row" style={{ alignItems: "stretch" }}>
        <div style={{ width: 4, background: priorityColor, flexShrink: 0 }} />
        <div className="col" style={{ flex: 1, padding: "18px 22px" }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <span className="chip" style={{ height: 20, color: priorityColor, borderColor: priorityColor, background: "transparent", fontSize: 10.5 }}>
              <span className="dot" style={{ background: priorityColor }} />
              Prioridad {ins.priority === "high" ? "Alta" : ins.priority === "med" ? "Media" : "Baja"}
            </span>
            <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{ins.category}</span>
            <span className="chip chip-ai" style={{ height: 20, fontSize: 10.5 }}>
              <Icon name="sparkle" size={10} /> confianza {Math.round(ins.confidence * 100)}%
            </span>
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--fg-4)" }}>{ins.id.toUpperCase()}</span>
          </div>
          <div className="row gap-2" style={{ alignItems: "baseline", marginBottom: 6 }}>
            <span className="t-h1" style={{ fontSize: 17 }}>{ins.title}</span>
          </div>
          <div className="t-body" style={{ maxWidth: 820 }}>{ins.detail}</div>

          <div className="row gap-4" style={{ marginTop: 14, alignItems: "center" }}>
            <Pair label="Impacto" value={ins.impact} tone="success" />
            <Pair label="Proceso" value={ins.related} link onClick={() => onOpenProcess(ins.related)} />
            <Pair label="Tiempo a valor" value={ins.eta} />
            <div className="row gap-2" style={{ marginLeft: "auto" }}>
              <button className="btn btn-sm" onClick={onOpen}>Ver detalle</button>
              <button className="btn btn-sm btn-ghost"><Icon name="bell" size={11} /> Crear alerta</button>
              <button className="btn btn-sm btn-ai">
                <Icon name="bolt" size={11} /> {ins.actions[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pair = ({ label, value, tone, link, onClick }) => (
  <div className="col gap-1">
    <span style={{ fontSize: 10.5, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{label}</span>
    <span
      onClick={onClick}
      className="t-num"
      style={{
        fontSize: 13.5, fontWeight: 600,
        color: tone === "success" ? "var(--success)" : "var(--fg-1)",
        cursor: link ? "pointer" : "default",
        textDecoration: link ? "underline" : "none",
        textDecorationColor: "var(--line-2)",
        textUnderlineOffset: 3,
      }}
    >
      {value}
    </span>
  </div>
);

const MiniStat = ({ icon, label, value, sub, tone }) => {
  const toneColor = {
    ai: "var(--ai)", danger: "var(--danger)", success: "var(--success)", accent: "var(--accent)",
  }[tone];
  return (
    <div className="card card-pad col gap-2" style={{ padding: "14px 16px" }}>
      <div className="row gap-2">
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          background: `color-mix(in oklch, ${toneColor} 18%, transparent)`,
          color: toneColor,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={12} />
        </span>
        <span style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.02em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      </div>
      <div className="row gap-2" style={{ alignItems: "baseline" }}>
        <span className="t-num" style={{ fontSize: 22, fontWeight: 600 }}>{value}</span>
      </div>
      <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{sub}</span>
    </div>
  );
};

const SkeletonRow = ({ w = "100%" }) => (
  <div className="ai-shimmer" style={{ height: 12, width: w, borderRadius: 4 }} />
);

export { InsightsView };
export default InsightsView;
