import React, { useState, useMemo } from "react";
import { Icon, KpiCard, Sparkline, LineChart, BarChart, Donut, AiBadge, StatusPill, RiskBar, AiThinking } from '../components/primitives.jsx';
import { KPI_DEFS, PRODUCTIVITY_SERIES, PROCESSES, AI_INSIGHTS, INCIDENTS, AREAS, ACTIVITY_FEED } from '../data.js';

// =========================================================
// ProcessIQ — Dashboard Ejecutivo
// =========================================================

const DashboardView = ({ role, onNavigate, onOpenInsight, onOpenProcess, onAskAi, onGenerateReport }) => {
  const [tf, setTf] = useState("monthly");
  const series = PRODUCTIVITY_SERIES[tf];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  }, []);

  const topInsight = AI_INSIGHTS[0];
  const filteredKpis = role.id === "manager" ? KPI_DEFS.filter((k) => k.id !== "automation") : KPI_DEFS;

  return (
    <div className="content fade-in col gap-5">
      {/* Greeting + headline */}
      <div className="row gap-4" style={{ alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div className="col gap-2" style={{ maxWidth: 720 }}>
          <div className="row gap-2">
            <span className="t-eyebrow" style={{ color: "var(--accent)" }}>Dashboard ejecutivo · {role.title}</span>
            <span className="status-pill">
              <span className="dot" style={{ background: "var(--success)" }} />
              Tiempo real
            </span>
          </div>
          <div className="t-display" style={{ fontSize: 30 }}>
            {greeting}, {role.name.split(" ")[1] || role.name}.
          </div>
          <div className="t-body" style={{ maxWidth: 620 }}>
            {role.id === "director" && "Operación estable con 3 oportunidades priorizadas por IA. El SLA del mes cierra arriba del objetivo."}
            {role.id === "manager" && "Urgencias y Hospitalización requieren atención hoy. Dos cuellos de botella con acciones sugeridas."}
            {role.id === "analyst" && "Cinco insights nuevos generados por IA esperando revisión. Tres con confianza superior al 90%."}
          </div>
        </div>

        <div className="row gap-2">
          <button className="btn">
            <Icon name="download" size={13} />
            Exportar vista
          </button>
          <button className="btn">
            <Icon name="pin" size={13} />
            Fijar dashboard
          </button>
          <button className="btn btn-ai" onClick={onGenerateReport}>
            <Icon name="sparkle" size={13} />
            Generar reporte con IA
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${filteredKpis.length}, minmax(0, 1fr))`, gap: 12,
      }}>
        {filteredKpis.map((k) => (
          <KpiCard key={k.id} kpi={k} onClick={() => onNavigate("analytics")} />
        ))}
      </div>

      {/* AI Insight banner */}
      <div className="card ai-frame fade-in" style={{
        background: "linear-gradient(135deg, oklch(0.25 0.03 75 / 0.7), var(--bg-1))",
        borderColor: "var(--ai-line)",
        padding: "18px 22px",
      }}>
        <div className="row gap-4" style={{ alignItems: "flex-start" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--ai-soft), var(--ai-soft))",
            color: "var(--ai)", display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid var(--ai-line)", flexShrink: 0,
          }}>
            <Icon name="sparkle" size={17} />
          </div>
          <div className="col gap-1" style={{ flex: 1 }}>
            <div className="row gap-2">
              <span className="t-eyebrow" style={{ color: "var(--ai)" }}>Insight prioritario</span>
              <span className="chip" style={{ height: 18, fontSize: 10, background: "transparent", borderColor: "var(--ai-line)", color: "var(--ai)" }}>
                confianza {Math.round(topInsight.confidence * 100)}%
              </span>
              <span className="chip" style={{ height: 18, fontSize: 10 }}>impacto {topInsight.impact}</span>
            </div>
            <div className="t-h1" style={{ marginTop: 2 }}>{topInsight.title}</div>
            <div className="t-body" style={{ maxWidth: 720 }}>{topInsight.detail}</div>
          </div>
          <div className="row gap-2" style={{ alignSelf: "center" }}>
            <button className="btn btn-sm" onClick={() => onOpenInsight(topInsight)}>Ver detalle</button>
            <button className="btn btn-sm btn-ai">
              <Icon name="bolt" size={11} /> Aplicar acción
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 16 }}>
        {/* Productividad chart */}
        <div className="card card-pad col gap-4">
          <div className="row gap-3" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">Productividad y eficiencia temporal</div>
              <div className="t-small">Evolución combinada de volumen, cumplimiento SLA y tiempo de ciclo.</div>
            </div>
            <div className="tabs">
              {["weekly", "monthly", "quarterly"].map((t) => (
                <button key={t} data-active={tf === t} onClick={() => setTf(t)}>
                  {t === "weekly" ? "Semanal" : t === "monthly" ? "Mensual" : "Trimestral"}
                </button>
              ))}
            </div>
          </div>

          <LineChart
            height={250}
            labels={series.labels}
            yFormat={(v) => Math.round(v)}
            series={[
              { name: "Volumen completado", data: series.throughput, color: "oklch(0.78 0.12 195)", fill: true },
              { name: "Cumplimiento SLA (%)", data: series.sla.map((s) => s * (series.throughput.reduce((a, b) => a + b, 0) / series.throughput.length / 100)), color: "oklch(0.82 0.13 75)", dashed: true },
            ]}
          />

          <div className="row gap-4" style={{ paddingTop: 4 }}>
            <Stat label="Mejor día" value="Jueves" sub="3.540 procesos" />
            <Stat label="Pico SLA" value="96.4%" sub="semana 4" />
            <Stat label="Reducción ciclo" value="-12%" sub="vs. mes previo" tone="success" />
            <div style={{ flex: 1 }} />
            <button className="btn btn-sm btn-ghost" onClick={() => onNavigate("analytics")}>
              Abrir analítica completa
              <Icon name="arrow" size={11} />
            </button>
          </div>
        </div>

        {/* IA Insights panel */}
        <div className="card col" style={{ overflow: "hidden" }}>
          <div className="row gap-2" style={{ padding: "16px 18px 12px", justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="row gap-2">
                <AiBadge label="IA · prioridades" />
              </div>
              <div className="t-h2" style={{ marginTop: 2 }}>Recomendaciones priorizadas</div>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => onNavigate("insights")}>
              Ver todo
              <Icon name="arrow" size={11} />
            </button>
          </div>
          <div className="col" style={{ flex: 1 }}>
            {AI_INSIGHTS.slice(0, 4).map((ins) => (
              <div key={ins.id} onClick={() => onOpenInsight(ins)} style={{
                padding: "12px 18px",
                borderTop: "1px solid var(--line-soft)",
                cursor: "pointer",
                transition: "background 0.12s",
              }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
                 onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <div className="row gap-2" style={{ marginBottom: 4 }}>
                  <span className={`priority-bar p-${ins.priority}`}>
                    <i style={{ width: ins.priority === "high" ? "100%" : ins.priority === "med" ? "60%" : "30%" }} />
                  </span>
                  <span style={{ fontSize: 10.5, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{ins.category}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: ins.priority === "high" ? "var(--danger)" : ins.priority === "med" ? "var(--warning)" : "var(--fg-3)" }}>
                    {ins.impact}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)", lineHeight: 1.4 }}>
                  {ins.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
        {/* Procesos críticos */}
        <div className="card card-pad col gap-3">
          <div className="row gap-3" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">Procesos críticos en monitoreo</div>
              <div className="t-small">Top procesos por riesgo operativo y SLA en peligro.</div>
            </div>
            <button className="btn btn-sm" onClick={() => onNavigate("processes")}>
              <Icon name="list" size={12} /> Ver 128 procesos
            </button>
          </div>
          <div style={{ marginInline: -8 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Proceso</th>
                  <th style={{ width: 110 }}>Área</th>
                  <th style={{ width: 80, textAlign: "right" }}>Ciclo</th>
                  <th style={{ width: 100, textAlign: "right" }}>SLA</th>
                  <th style={{ width: 140 }}>Riesgo IA</th>
                  <th style={{ width: 120 }}>Estado</th>
                  <th style={{ width: 32 }} />
                </tr>
              </thead>
              <tbody>
                {PROCESSES.filter((p) => p.status !== "ok").slice(0, 5).map((p) => (
                  <tr key={p.id} onClick={() => onOpenProcess(p)} style={{ cursor: "pointer" }}>
                    <td>
                      <div className="col gap-1">
                        <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{p.name}</span>
                        <span className="t-mono" style={{ color: "var(--fg-4)" }}>{p.id}</span>
                      </div>
                    </td>
                    <td>{p.area}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="t-num" style={{ color: "var(--fg-1)" }}>{p.avgCycle}</span>
                      <span style={{ color: "var(--fg-4)", fontSize: 11, marginLeft: 2 }}>h</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="t-num" style={{ color: p.slaActual >= 90 ? "var(--success)" : p.slaActual >= 75 ? "var(--warning)" : "var(--danger)", fontWeight: 500 }}>
                        {p.slaActual}%
                      </span>
                    </td>
                    <td><RiskBar value={p.risk} /></td>
                    <td>
                      <div className="row gap-2">
                        <StatusPill status={p.status} />
                        {p.aiFlag && <span className="chip chip-ai" style={{ height: 20, padding: "0 6px" }}><Icon name="sparkle" size={10} /></span>}
                      </div>
                    </td>
                    <td><Icon name="chevron" size={12} style={{ color: "var(--fg-5)" }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA donut + áreas */}
        <div className="card card-pad col gap-3">
          <div className="row gap-2" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">Estado por área</div>
              <div className="t-small">Carga operativa y cumplimiento por unidad.</div>
            </div>
            <button className="btn btn-sm btn-ghost"><Icon name="more" size={13} /></button>
          </div>
          <div className="row gap-4" style={{ paddingBlock: 4 }}>
            <Donut value={96.4} label="96.4%" sub="SLA global" color="oklch(0.78 0.13 165)" size={92} stroke={9} />
            <div className="col gap-2" style={{ flex: 1 }}>
              <div className="row gap-2" style={{ justifyContent: "space-between" }}>
                <span className="t-small">Procesos activos</span>
                <span className="t-num" style={{ fontWeight: 600 }}>128</span>
              </div>
              <div className="row gap-2" style={{ justifyContent: "space-between" }}>
                <span className="t-small">Bajo objetivo</span>
                <span className="t-num" style={{ fontWeight: 600, color: "var(--warning)" }}>14</span>
              </div>
              <div className="row gap-2" style={{ justifyContent: "space-between" }}>
                <span className="t-small">Críticos</span>
                <span className="t-num" style={{ fontWeight: 600, color: "var(--danger)" }}>4</span>
              </div>
              <div className="row gap-2" style={{ justifyContent: "space-between" }}>
                <span className="t-small">Automatizables</span>
                <span className="t-num" style={{ fontWeight: 600, color: "var(--ai)" }}>26</span>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="col gap-2">
            {AREAS.slice(0, 6).map((a) => {
              const tone = a.color === "danger" ? "var(--danger)" : a.color === "warning" ? "var(--warning)" : "var(--success)";
              return (
                <div key={a.id} className="row gap-3" style={{ alignItems: "center" }}>
                  <span style={{ width: 90, fontSize: 12, color: "var(--fg-2)" }}>{a.name}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--bg-3)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${a.load}%`, height: "100%", background: tone, borderRadius: 999 }} />
                  </div>
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--fg-3)", minWidth: 32, textAlign: "right" }}>
                    {a.sla}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Third row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)", gap: 16 }}>
        {/* Incidencias */}
        <div className="card card-pad col gap-3">
          <div className="row gap-2" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">Incidencias operativas</div>
              <div className="t-small">Eventos abiertos en últimas 24 h.</div>
            </div>
            <span className="chip chip-danger" style={{ height: 22 }}>
              <span className="dot" style={{ background: "currentColor" }} /> 2 críticas
            </span>
          </div>
          <div className="col gap-1">
            {INCIDENTS.map((inc) => {
              const sev = inc.severity === "high" ? "var(--danger)" : inc.severity === "med" ? "var(--warning)" : "var(--info)";
              return (
                <div key={inc.id} className="row gap-3" style={{ padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: sev, marginTop: 6, flexShrink: 0 }} />
                  <div className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, color: "var(--fg-1)", fontWeight: 500, lineHeight: 1.35 }}>{inc.title}</span>
                    <span style={{ fontSize: 11, color: "var(--fg-4)" }}>
                      {inc.id} · {inc.area} · {inc.time}
                    </span>
                  </div>
                  <StatusPill status={inc.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Automatización ROI */}
        <div className="card card-pad col gap-3">
          <div className="row gap-2" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">ROI Automatización</div>
              <div className="t-small">Acumulado vs proyectado · 2026.</div>
            </div>
            <AiBadge label="IA" />
          </div>
          <div className="row gap-3" style={{ alignItems: "baseline" }}>
            <span className="t-num" style={{ fontSize: 26, fontWeight: 600, color: "var(--fg-1)" }}>$284K</span>
            <span style={{ fontSize: 11, color: "var(--fg-4)" }}>de $480K proyectado</span>
          </div>
          <div style={{ flex: 1 }}>
            <BarChart
              height={150}
              labels={["Ene", "Feb", "Mar", "Abr", "May"]}
              data={[18, 32, 48, 62, 72]}
              color="oklch(0.78 0.13 75)"
              format={(v) => `$${Math.round(v)}K`}
            />
          </div>
          <div className="divider" />
          <div className="row gap-3" style={{ justifyContent: "space-between" }}>
            <Stat label="Activas" value="9" sub="automatizaciones" />
            <Stat label="Tiempo ahorrado" value="1.840h" sub="este mes" />
            <Stat label="Satisfacción" value="93%" sub="usuarios" tone="success" />
          </div>
        </div>

        {/* Activity */}
        <div className="card card-pad col gap-3">
          <div className="row gap-2" style={{ justifyContent: "space-between" }}>
            <div className="col gap-1">
              <div className="t-h2">Actividad reciente</div>
              <div className="t-small">Eventos del copiloto y del equipo.</div>
            </div>
            <button className="btn btn-sm btn-ghost"><Icon name="history" size={12} /></button>
          </div>
          <div className="col">
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} className="row gap-3" style={{ padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 7,
                  background: a.kind === "ai" ? "var(--ai-soft)" : "var(--bg-2)",
                  color: a.kind === "ai" ? "var(--ai)" : "var(--fg-3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: a.kind === "ai" ? "1px solid var(--ai-line)" : "1px solid var(--line-1)",
                  flexShrink: 0,
                }}>
                  <Icon name={a.kind === "ai" ? "sparkle" : "user"} size={11} />
                </div>
                <div className="col" style={{ flex: 1, gap: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600 }}>{a.who}</span> {a.what}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{a.when}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, tone }) => (
  <div className="col gap-1">
    <span style={{ fontSize: 10.5, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{label}</span>
    <span className="t-num" style={{ fontSize: 16, fontWeight: 600, color: tone === "success" ? "var(--success)" : "var(--fg-1)" }}>{value}</span>
    {sub && <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{sub}</span>}
  </div>
);

export { DashboardView };
export default DashboardView;
