import React, { useState } from "react";
import { Icon, LineChart, BarChart, Donut, Sparkline, AiBadge, AiThinking } from '../components/primitives.jsx';
import { AREAS, PROCESSES, PRODUCTIVITY_SERIES } from '../data.js';

// =========================================================
// ProcessIQ — Analítica
// =========================================================
const AnalyticsView = ({ role, onAskAi }) => {
  const [metric, setMetric] = useState("cycle");
  const [breakdown, setBreakdown] = useState("area");
  const [drilldown, setDrilldown] = useState(null);
  const [narrating, setNarrating] = useState(false);
  const [narrative, setNarrative] = useState(null);

  const generateNarrative = () => {
    setNarrating(true);
    setNarrative(null);
    setTimeout(() => {
      setNarrating(false);
      setNarrative({
        summary: "Cumplimiento SLA mejoró 3.1 pts en el mes con reducción del 12% en tiempo de ciclo. La mejora se concentra en Urgencias y Consulta externa, mientras Quirófano y Administrativa siguen por debajo del objetivo.",
        drivers: [
          { label: "Rediseño de triaje en Urgencias", impact: "+4.2 pts SLA" },
          { label: "Automatización 'Validación CUPS'", impact: "-18% glosas" },
          { label: "Pico de demanda jueves/viernes", impact: "+8% throughput" },
        ],
        risks: [
          "Autorización aseguradora sigue siendo el principal cuello de botella sistémico.",
          "Hospitalización proyecta sobrecarga en próximas dos semanas según patrón estacional.",
        ],
      });
    }, 1800);
  };

  const series = PRODUCTIVITY_SERIES.quarterly;

  return (
    <div className="content fade-in col gap-5">
      <div className="row gap-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="col gap-2">
          <span className="t-eyebrow" style={{ color: "var(--accent)" }}>Analítica · drilldowns multidimensionales</span>
          <div className="t-display" style={{ fontSize: 28 }}>Exploración de operación</div>
          <div className="t-body" style={{ maxWidth: 680 }}>
            Visualiza tendencias, distribuciones y cohortes. Profundiza hasta el caso individual con la trazabilidad completa del proceso.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn"><Icon name="download" size={13} />Exportar CSV</button>
          <button className="btn btn-ai" onClick={generateNarrative}>
            <Icon name="sparkle" size={13} /> Explícame esta vista
          </button>
        </div>
      </div>

      {/* breadcrumb + selectors */}
      <div className="row gap-3" style={{ flexWrap: "wrap" }}>
        <div className="row gap-2">
          <span className="bread-chip">
            <Icon name="layers" size={11} /> Todo · Red Salud Norte
          </span>
          {drilldown && (
            <>
              <Icon name="chevron" size={10} style={{ color: "var(--fg-5)" }} />
              <span className="bread-chip" style={{ background: "var(--accent-soft)", borderColor: "var(--accent-line)", color: "var(--accent)" }}>
                Área: {drilldown}
                <Icon name="x" size={10} onClick={() => setDrilldown(null)} style={{ cursor: "pointer" }} />
              </span>
            </>
          )}
        </div>
        <div className="spacer" />
        <div className="row gap-2">
          <span className="t-small">Métrica</span>
          <div className="tabs">
            {[
              { id: "cycle", label: "Tiempo ciclo" },
              { id: "sla", label: "SLA" },
              { id: "volume", label: "Volumen" },
              { id: "incidents", label: "Incidencias" },
            ].map((t) => (
              <button key={t.id} data-active={metric === t.id} onClick={() => setMetric(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="row gap-2">
          <span className="t-small">Dimensión</span>
          <div className="tabs">
            {[
              { id: "area", label: "Área" },
              { id: "process", label: "Proceso" },
              { id: "owner", label: "Responsable" },
            ].map((t) => (
              <button key={t.id} data-active={breakdown === t.id} onClick={() => setBreakdown(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Narrative */}
      {(narrating || narrative) && (
        <div className="card card-pad ai-frame fade-in" style={{ borderColor: "var(--ai-line)" }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <AiBadge label="Narrativa generada por IA" />
            <button className="btn btn-sm btn-ghost" style={{ marginLeft: "auto" }} onClick={() => setNarrative(null)}>
              <Icon name="x" size={11} />
            </button>
          </div>
          {narrating && <AiThinking text="Componiendo análisis multivariable…" />}
          {narrative && (
            <div className="col gap-3" style={{ maxWidth: 920 }}>
              <div className="t-body" style={{ color: "var(--fg-1)", fontSize: 14, lineHeight: 1.6 }}>{narrative.summary}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div className="col gap-2">
                  <span className="t-eyebrow" style={{ color: "var(--success)" }}>Drivers positivos</span>
                  {narrative.drivers.map((d, i) => (
                    <div key={i} className="row gap-2" style={{ alignItems: "flex-start" }}>
                      <Icon name="trendUp" size={13} style={{ color: "var(--success)", marginTop: 2, flexShrink: 0 }} />
                      <div className="col" style={{ gap: 1 }}>
                        <span style={{ fontSize: 12.5, color: "var(--fg-1)" }}>{d.label}</span>
                        <span style={{ fontSize: 11, color: "var(--success)" }}>{d.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col gap-2">
                  <span className="t-eyebrow" style={{ color: "var(--warning)" }}>Riesgos identificados</span>
                  {narrative.risks.map((r, i) => (
                    <div key={i} className="row gap-2" style={{ alignItems: "flex-start" }}>
                      <Icon name="alert" size={13} style={{ color: "var(--warning)", marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row gap-2" style={{ paddingTop: 4 }}>
                <button className="btn btn-sm btn-ai"><Icon name="reports" size={11} /> Convertir en reporte</button>
                <button className="btn btn-sm"><Icon name="link" size={11} /> Copiar enlace</button>
                <button className="btn btn-sm btn-ghost">Calificar análisis</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main chart */}
      <div className="card card-pad col gap-3">
        <div className="row gap-2" style={{ justifyContent: "space-between" }}>
          <div className="col gap-1">
            <div className="t-h2">{labelForMetric(metric)} por {breakdown === "area" ? "área" : breakdown === "process" ? "proceso" : "responsable"}</div>
            <div className="t-small">Datos del último trimestre · {drilldown ? `Filtrado por ${drilldown}` : "Vista agregada"}</div>
          </div>
          <div className="row gap-2">
            <button className="btn btn-sm btn-ghost"><Icon name="expand" size={12} /></button>
            <button className="btn btn-sm btn-ghost"><Icon name="more" size={12} /></button>
          </div>
        </div>
        <LineChart
          height={280}
          labels={series.labels}
          yFormat={(v) => metric === "sla" ? `${Math.round(v)}%` : metric === "cycle" ? `${v.toFixed(1)}h` : Math.round(v)}
          series={[
            { name: "Real", data: metric === "sla" ? series.sla : metric === "cycle" ? series.cycle : series.throughput, color: "oklch(0.78 0.12 195)", fill: true },
            { name: "Objetivo", data: metric === "sla" ? series.sla.map(() => 95) : metric === "cycle" ? series.cycle.map(() => 3.5) : series.throughput.map((v) => v * 0.92), color: "oklch(0.82 0.13 75)", dashed: true },
          ]}
        />
      </div>

      {/* Breakdown grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
        <div className="card card-pad col gap-3">
          <div className="row gap-2" style={{ justifyContent: "space-between" }}>
            <div className="t-h2">Distribución por área</div>
            <span className="t-small">Click para drilldown</span>
          </div>
          <div className="col" style={{ gap: 4 }}>
            {AREAS.map((a) => {
              const tone = a.color === "danger" ? "var(--danger)" : a.color === "warning" ? "var(--warning)" : "var(--success)";
              return (
                <button key={a.id} onClick={() => setDrilldown(a.name)} className="row gap-3" style={{
                  all: "unset", cursor: "pointer", display: "flex",
                  alignItems: "center", padding: "10px 12px", borderRadius: 8,
                  transition: "background 0.12s",
                  background: drilldown === a.name ? "var(--accent-soft)" : "transparent",
                }} onMouseEnter={(e) => e.currentTarget.style.background = drilldown === a.name ? "var(--accent-soft)" : "var(--bg-2)"}
                   onMouseLeave={(e) => e.currentTarget.style.background = drilldown === a.name ? "var(--accent-soft)" : "transparent"}>
                  <span style={{ width: 112, fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{a.name}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--bg-3)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${a.load}%`, height: "100%", background: tone, borderRadius: 999 }} />
                  </div>
                  <span className="t-num" style={{ fontSize: 12, color: "var(--fg-2)", minWidth: 50, textAlign: "right" }}>{a.load}%</span>
                  <span className="t-num" style={{ fontSize: 12, color: "var(--fg-3)", minWidth: 48, textAlign: "right" }}>SLA {a.sla}%</span>
                  <span className="chip" style={{
                    height: 20, fontSize: 10.5, minWidth: 40, justifyContent: "center",
                    color: a.incidents > 2 ? "var(--danger)" : a.incidents > 0 ? "var(--warning)" : "var(--fg-4)",
                  }}>
                    {a.incidents} INC
                  </span>
                  <Icon name="chevron" size={11} style={{ color: "var(--fg-5)" }} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="col gap-4">
          <div className="card card-pad col gap-3">
            <div className="t-h2">Cumplimiento SLA</div>
            <div className="row gap-4" style={{ alignItems: "center" }}>
              <Donut value={96.4} label="96.4%" sub="del 95% objetivo" color="oklch(0.78 0.13 165)" size={104} stroke={9} />
              <div className="col gap-2" style={{ flex: 1 }}>
                <div className="col gap-1">
                  <span className="t-small">Procesos en SLA</span>
                  <div className="row gap-2"><span className="t-num" style={{ fontSize: 18, fontWeight: 600 }}>4.640</span><span style={{ fontSize: 11, color: "var(--success)" }}>+312</span></div>
                </div>
                <div className="col gap-1">
                  <span className="t-small">Fuera de SLA</span>
                  <div className="row gap-2"><span className="t-num" style={{ fontSize: 18, fontWeight: 600, color: "var(--warning)" }}>172</span><span style={{ fontSize: 11, color: "var(--success)" }}>-44</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-pad col gap-3">
            <div className="t-h2">Cohort: tiempo de resolución</div>
            <div className="col gap-2">
              {[
                { label: "< 1h", pct: 42 },
                { label: "1-4h", pct: 31 },
                { label: "4-12h", pct: 18 },
                { label: "12-24h", pct: 6 },
                { label: "> 24h", pct: 3 },
              ].map((c) => (
                <div key={c.label} className="row gap-3">
                  <span style={{ width: 56, fontSize: 12, color: "var(--fg-3)" }}>{c.label}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--bg-3)", borderRadius: 999 }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
                  </div>
                  <span className="t-num" style={{ fontSize: 12, minWidth: 32, textAlign: "right", color: "var(--fg-2)" }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top processes by metric */}
      <div className="card card-pad col gap-3">
        <div className="row gap-2" style={{ justifyContent: "space-between" }}>
          <div className="t-h2">Top procesos · {labelForMetric(metric)}</div>
          <button className="btn btn-sm btn-ghost">Ver todos<Icon name="arrow" size={11} /></button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 32 }}>#</th>
              <th>Proceso</th>
              <th style={{ width: 130 }}>Área</th>
              <th style={{ width: 80 }}>Volumen</th>
              <th style={{ width: 100 }}>Tendencia</th>
              <th style={{ width: 110, textAlign: "right" }}>Valor</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {[...PROCESSES].sort((a, b) => metric === "sla" ? a.slaActual - b.slaActual : b.avgCycle - a.avgCycle).slice(0, 6).map((p, i) => (
              <tr key={p.id}>
                <td style={{ color: "var(--fg-4)" }}>{String(i + 1).padStart(2, "0")}</td>
                <td>
                  <div className="col gap-1">
                    <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{p.name}</span>
                    <span className="t-mono" style={{ color: "var(--fg-4)" }}>{p.id}</span>
                  </div>
                </td>
                <td>{p.area}</td>
                <td><span className="t-num">{p.volume.toLocaleString()}</span></td>
                <td><Sparkline data={p.trend} color={metric === "sla" ? (p.slaActual < 80 ? "var(--danger)" : "var(--success)") : "var(--accent)"} width={80} height={22} /></td>
                <td style={{ textAlign: "right" }}>
                  <span className="t-num" style={{ fontWeight: 600 }}>
                    {metric === "sla" ? `${p.slaActual}%` : metric === "cycle" ? `${p.avgCycle}h` : metric === "volume" ? p.volume : Math.round(p.risk / 10)}
                  </span>
                </td>
                <td><Icon name="chevron" size={11} style={{ color: "var(--fg-5)" }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function labelForMetric(m) {
  return { cycle: "Tiempo de ciclo", sla: "Cumplimiento SLA", volume: "Volumen", incidents: "Incidencias" }[m] || m;
}

export { AnalyticsView };
export default AnalyticsView;
