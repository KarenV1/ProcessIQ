import React, { useState, useEffect } from "react";
import { Icon, AiBadge, StatusPill, AiThinking, Sparkline } from '../components/primitives.jsx';
import { AUTOMATIONS, REPORTS } from '../data.js';

// =========================================================
// ProcessIQ — Automatizaciones + Reportes
// =========================================================
// ---------------- Automatizaciones ----------------
const AutomationsView = ({ role }) => {
  const [tab, setTab] = useState("active");
  const [selected, setSelected] = useState(AUTOMATIONS[0].id);
  const list = AUTOMATIONS.filter((a) =>
    tab === "active" ? a.status === "active" : tab === "draft" ? a.status === "draft" : a.status === "paused"
  );
  const active = AUTOMATIONS.find((a) => a.id === selected) || AUTOMATIONS[0];

  const totalSavings = AUTOMATIONS.reduce((s, a) => s + a.savings, 0);
  const totalRuns = AUTOMATIONS.reduce((s, a) => s + a.runs, 0);

  return (
    <div className="content fade-in col gap-5">
      <div className="row gap-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="col gap-2">
          <span className="t-eyebrow" style={{ color: "var(--accent)" }}>Automatizaciones</span>
          <div className="t-display" style={{ fontSize: 28 }}>Workflows con IA + RPA</div>
          <div className="t-body" style={{ maxWidth: 680 }}>
            Catálogo de automatizaciones activas, en borrador o pausadas. Cada automatización conecta con un proceso del catálogo y reporta su ahorro real.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn"><Icon name="book" size={13} /> Plantillas</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} /> Nueva automatización</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <BigStat icon="bolt" tone="success" label="Ahorro acumulado" value={`$${(totalSavings / 1000).toFixed(0)}K`} sub="últimos 30 días" />
        <BigStat icon="activity" tone="accent" label="Ejecuciones" value={totalRuns.toLocaleString()} sub="exitosas: 99.1%" />
        <BigStat icon="clock" tone="ai" label="Tiempo ahorrado" value="1.840 h" sub="equivalente 11 FTE" />
        <BigStat icon="target" tone="accent" label="Procesos cubiertos" value="9 / 128" sub="potencial: 26" />
      </div>

      <div className="row gap-2" style={{ justifyContent: "space-between" }}>
        <div className="tabs">
          {[
            { id: "active", label: `Activas · ${AUTOMATIONS.filter((a) => a.status === "active").length}` },
            { id: "draft", label: `Borradores · ${AUTOMATIONS.filter((a) => a.status === "draft").length}` },
            { id: "paused", label: `Pausadas · ${AUTOMATIONS.filter((a) => a.status === "paused").length}` },
          ].map((t) => (
            <button key={t.id} data-active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <button className="btn btn-sm btn-ai"><Icon name="sparkle" size={11} /> Sugerir nuevas</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", gap: 16 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {list.length === 0 && (
            <div style={{ padding: 36, textAlign: "center", color: "var(--fg-4)" }}>
              <Icon name="inbox" size={20} style={{ marginBottom: 8 }} />
              <div className="t-h3" style={{ marginBottom: 4 }}>Sin automatizaciones</div>
              <div className="t-small">Crea una nueva o explora plantillas.</div>
            </div>
          )}
          {list.map((a) => (
            <div key={a.id} className="list-row" data-selected={a.id === selected} onClick={() => setSelected(a.id)} style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: "var(--bg-2)",
                border: "1px solid var(--line-1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: a.status === "active" ? "var(--success)" : a.status === "paused" ? "var(--warning)" : "var(--fg-4)",
              }}>
                <Icon name={a.type.includes("LLM") ? "sparkle" : a.type.includes("ML") ? "compass" : "workflow"} size={14} />
              </span>
              <div className="col gap-1" style={{ minWidth: 0 }}>
                <div className="row gap-2">
                  <span style={{ fontWeight: 500, color: "var(--fg-1)", fontSize: 13 }}>{a.name}</span>
                  <span className="t-mono" style={{ color: "var(--fg-4)", fontSize: 11 }}>{a.id}</span>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--fg-4)" }}>
                  {a.process} · {a.type} · {a.lastRun}
                </span>
              </div>
              <div className="col" style={{ gap: 2, alignItems: "flex-end" }}>
                <span className="t-num" style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>
                  {a.savings > 0 ? `$${(a.savings / 1000).toFixed(1)}K` : "—"}
                </span>
                <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{a.runs.toLocaleString()} runs</span>
              </div>
            </div>
          ))}
        </div>

        <AutomationDetail a={active} />
      </div>
    </div>
  );
};

const AutomationDetail = ({ a }) => {
  if (!a) return null;
  return (
    <div className="card card-pad col gap-4">
      <div className="row gap-2" style={{ justifyContent: "space-between" }}>
        <div className="col gap-1">
          <div className="row gap-2">
            <StatusPill status={a.status} />
            <span className="chip" style={{ height: 22, fontSize: 11 }}>{a.type}</span>
          </div>
          <div className="t-h1" style={{ marginTop: 6 }}>{a.name}</div>
          <div className="t-small">{a.process} · {a.id}</div>
        </div>
        <div className="row gap-2">
          {a.status === "active" ? (
            <button className="btn"><Icon name="pause" size={12} /> Pausar</button>
          ) : a.status === "paused" ? (
            <button className="btn btn-primary"><Icon name="play" size={12} /> Reactivar</button>
          ) : (
            <button className="btn btn-primary"><Icon name="bolt" size={12} /> Publicar</button>
          )}
          <button className="btn btn-icon"><Icon name="more" size={13} /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <Mini2 label="Ahorro este mes" value={a.savings ? `$${(a.savings / 1000).toFixed(1)}K` : "—"} tone="success" />
        <Mini2 label="Ejecuciones" value={a.runs.toLocaleString()} />
        <Mini2 label="Satisfacción" value={a.satisfaction ? `${a.satisfaction}%` : "—"} />
      </div>

      <div className="col gap-2">
        <div className="t-h3">Diagrama del workflow</div>
        <div className="row gap-2" style={{ flexWrap: "wrap", padding: "8px 0" }}>
          {[
            { n: "Trigger", d: a.trigger, kind: "trigger", icon: "bolt" },
            { n: "Validar entrada", d: "12 reglas activas", kind: "rule", icon: "check" },
            { n: "Proceso IA", d: a.type, kind: "ai", icon: "sparkle" },
            { n: "Persistir + Notificar", d: "HL7 + Slack", kind: "out", icon: "send" },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="card" style={{
                padding: "10px 12px", minWidth: 160,
                background: s.kind === "ai" ? "var(--ai-soft)" : "var(--bg-2)",
                borderColor: s.kind === "ai" ? "var(--ai-line)" : "var(--line-1)",
                flex: 1,
              }}>
                <div className="row gap-2" style={{ marginBottom: 4 }}>
                  <Icon name={s.icon} size={12} style={{ color: s.kind === "ai" ? "var(--ai)" : "var(--accent)" }} />
                  <span style={{ fontSize: 11, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{i + 1}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{s.n}</div>
                <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 2 }}>{s.d}</div>
              </div>
              {i < 3 && <Icon name="arrow" size={14} style={{ color: "var(--fg-5)", flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="col gap-2">
        <div className="row gap-2" style={{ justifyContent: "space-between" }}>
          <div className="t-h3">Historial de ejecuciones · últimas 14 días</div>
          <button className="btn btn-sm btn-ghost"><Icon name="history" size={11} /> Ver log</button>
        </div>
        <div style={{ padding: "8px 0" }}>
          <Sparkline data={[12, 18, 22, 19, 28, 32, 36, 30, 38, 42, 44, 48, 46, 52]} color="var(--accent)" width={520} height={48} />
        </div>
      </div>
    </div>
  );
};

const Mini2 = ({ label, value, tone }) => {
  const c = tone === "success" ? "var(--success)" : "var(--fg-1)";
  return (
    <div className="card card-pad col gap-1" style={{ padding: 12, background: "var(--bg-2)", borderColor: "var(--line-soft)" }}>
      <span style={{ fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.04em", fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
      <span className="t-num" style={{ fontSize: 17, fontWeight: 600, color: c }}>{value}</span>
    </div>
  );
};

const BigStat = ({ icon, label, value, sub, tone }) => {
  const c = { ai: "var(--ai)", success: "var(--success)", accent: "var(--accent)", danger: "var(--danger)" }[tone];
  return (
    <div className="card card-pad col gap-2" style={{ padding: 16 }}>
      <div className="row gap-2">
        <span style={{
          width: 24, height: 24, borderRadius: 7,
          background: `color-mix(in oklch, ${c} 18%, transparent)`,
          color: c, display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}><Icon name={icon} size={12} /></span>
        <span style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.02em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      </div>
      <span className="t-num" style={{ fontSize: 22, fontWeight: 600 }}>{value}</span>
      <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{sub}</span>
    </div>
  );
};

// ---------------- Reportes ----------------
const ReportsView = ({ role, autoStart }) => {
  const [selected, setSelected] = useState(REPORTS[0].id);
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const active = draft || REPORTS.find((r) => r.id === selected) || REPORTS[0];

  const runGeneration = () => {
    setGenerating(true);
    setProgress(0);
    setDraft(null);
    setLogs([]);
    const phases = [
      { p: 12, t: "Recopilando KPIs del período…" },
      { p: 28, t: "Analizando 128 procesos y 8 áreas…" },
      { p: 46, t: "Correlacionando insights con incidencias…" },
      { p: 68, t: "Identificando 3 cuellos de botella sistémicos…" },
      { p: 84, t: "Componiendo narrativa ejecutiva…" },
      { p: 100, t: "Reporte listo." },
    ];
    let idx = 0;
    const tick = () => {
      if (idx >= phases.length) {
        setGenerating(false);
        setDraft({
          id: "R-DRAFT", title: "Reporte ejecutivo · ProcessIQ",
          period: "Semana en curso", author: "ProcessIQ · GPT-Ops 4",
          status: "ready", pages: 8, audience: "Comité directivo",
          summary: "Generado en tiempo real con datos del último período. El cumplimiento de SLA cierra en 96.4% y se identificaron 3 oportunidades de automatización con impacto combinado de $97K mensuales.",
          sections: ["Resumen ejecutivo", "KPIs del período", "Insights y anomalías", "Cuellos de botella", "Plan de acción", "Anexo metodológico"],
          isDraft: true,
        });
        return;
      }
      setProgress(phases[idx].p);
      setLogs((l) => [...l, phases[idx].t]);
      idx++;
      setTimeout(tick, 600);
    };
    tick();
  };

  useEffect(() => {
    if (autoStart) runGeneration();
    // eslint-disable-next-line
  }, [autoStart]);

  return (
    <div className="content fade-in col gap-5">
      <div className="row gap-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="col gap-2">
          <span className="t-eyebrow" style={{ color: "var(--accent)" }}>Reportes generados con IA</span>
          <div className="t-display" style={{ fontSize: 28 }}>Narrativas ejecutivas a un clic</div>
          <div className="t-body" style={{ maxWidth: 680 }}>
            ProcessIQ compone reportes basados en evidencia: datos, insights, citaciones a procesos y recomendaciones accionables. Listos para comité, gerencia o auditoría.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn"><Icon name="folder" size={13} /> Plantillas</button>
          <button className="btn btn-ai" onClick={runGeneration}>
            <Icon name="sparkle" size={13} /> Generar nuevo
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)", gap: 16 }}>
        {/* Sidebar of reports */}
        <div className="col gap-3">
          <div className="card card-pad col gap-3" style={{ padding: 14 }}>
            <div className="row gap-2" style={{ justifyContent: "space-between" }}>
              <div className="t-h3">Reportes</div>
              <button className="btn btn-sm btn-ghost"><Icon name="filter" size={11} /></button>
            </div>
            <div className="col" style={{ gap: 4 }}>
              {(draft ? [draft, ...REPORTS] : REPORTS).map((r) => (
                <button key={r.id} onClick={() => { setSelected(r.id); if (r.id !== "R-DRAFT") setDraft(null); }} style={{
                  all: "unset", cursor: "pointer", padding: "10px 12px", borderRadius: 8,
                  background: r.id === active.id ? "var(--accent-soft)" : "transparent",
                  border: `1px solid ${r.id === active.id ? "var(--accent-line)" : "transparent"}`,
                }}>
                  <div className="row gap-2" style={{ marginBottom: 2 }}>
                    {r.isDraft && <span className="chip chip-ai" style={{ height: 16, fontSize: 9.5, padding: "0 6px" }}>Borrador IA</span>}
                    <span style={{ fontSize: 10.5, color: "var(--fg-4)" }}>{r.period}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-1)", lineHeight: 1.35 }}>{r.title}</div>
                  <div style={{ fontSize: 10.5, color: "var(--fg-4)", marginTop: 2 }}>{r.pages} pgs · {r.audience}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="card card-pad col gap-2" style={{ padding: 14 }}>
            <div className="t-h3">Plantillas sugeridas</div>
            {[
              { name: "Comité directivo semanal", icon: "reports" },
              { name: "Auditoría facturación", icon: "shield" },
              { name: "Cumplimiento HABEAS", icon: "book" },
              { name: "Benchmark inter-sede", icon: "git" },
            ].map((t, i) => (
              <div key={i} className="menu-item">
                <Icon name={t.icon} size={13} />
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Report viewer */}
        <div className="card col" style={{ overflow: "hidden", minHeight: 720 }}>
          {generating && (
            <div className="col gap-4" style={{ padding: 36, alignItems: "center", justifyContent: "center", flex: 1 }}>
              <AiThinking text="ProcessIQ está componiendo tu reporte" />
              <div style={{ width: "min(520px, 100%)" }}>
                <div className="progress-track" style={{ height: 4 }}>
                  <div className="progress-bar" style={{ width: `${progress}%`, background: "var(--ai)" }} />
                </div>
              </div>
              <div className="col gap-1" style={{ width: "min(520px, 100%)" }}>
                {logs.map((l, i) => (
                  <div key={i} className="row gap-2" style={{ fontSize: 12, color: "var(--fg-3)" }}>
                    <Icon name="check" size={11} style={{ color: i === logs.length - 1 ? "var(--ai)" : "var(--success)" }} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!generating && active && <ReportViewer r={active} />}
        </div>
      </div>
    </div>
  );
};

const ReportViewer = ({ r }) => (
  <>
    <div className="row gap-2" style={{ padding: "16px 24px", borderBottom: "1px solid var(--line-1)", justifyContent: "space-between" }}>
      <div className="col gap-1">
        <div className="row gap-2">
          {r.isDraft && <span className="chip chip-ai" style={{ height: 18, fontSize: 10 }}><Icon name="sparkle" size={9} /> Borrador IA</span>}
          <span style={{ fontSize: 11, color: "var(--fg-4)" }}>{r.id} · {r.period}</span>
        </div>
        <div className="t-h1">{r.title}</div>
        <div className="t-small">por {r.author} · {r.audience}</div>
      </div>
      <div className="row gap-2">
        <button className="btn"><Icon name="download" size={13} /> PDF</button>
        <button className="btn"><Icon name="send" size={13} /> Compartir</button>
        <button className="btn btn-primary"><Icon name="check" size={13} /> Aprobar</button>
      </div>
    </div>
    <div className="scroll-area" style={{ padding: "24px 28px" }}>
      <div className="col gap-5" style={{ maxWidth: 720 }}>
        <div className="card card-pad ai-frame" style={{ background: "var(--bg-2)", borderColor: "var(--ai-line)" }}>
          <div className="row gap-2" style={{ marginBottom: 8 }}>
            <AiBadge label="Resumen ejecutivo · generado por IA" />
          </div>
          <div className="t-body" style={{ color: "var(--fg-1)", fontSize: 14, lineHeight: 1.7 }}>{r.summary}</div>
        </div>

        <div className="col gap-3">
          <span className="t-eyebrow">Hallazgos clave</span>
          <ul style={{ paddingLeft: 18, color: "var(--fg-2)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
            <li>El cumplimiento global de SLA mejoró <strong style={{ color: "var(--success)" }}>+3.1 pts</strong>, alcanzando el 96.4%.</li>
            <li>Se identificaron <strong>3 cuellos de botella sistémicos</strong>: autorización aseguradora, glosas EPS y alta hospitalaria.</li>
            <li>Las automatizaciones activas generaron <strong style={{ color: "var(--success)" }}>$53.300 de ahorro</strong> en el período.</li>
            <li>Incidencias críticas crecieron de 12 a 14, concentradas en Laboratorio y Administrativa.</li>
          </ul>
        </div>

        <div className="col gap-3">
          <span className="t-eyebrow">Acciones recomendadas</span>
          <div className="col gap-2">
            {[
              { title: "Aprobar automatización de validación CUPS", impact: "$18K/mes", priority: "Alta" },
              { title: "Reasignar turnos en Laboratorio para próximo FDS", impact: "Riesgo evitable", priority: "Media" },
              { title: "Replicar nuevo modelo de triaje en sede sur", impact: "+4.2 pts SLA", priority: "Media" },
            ].map((a, i) => (
              <div key={i} className="card card-pad row gap-3" style={{ padding: 14, alignItems: "center" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 999,
                  background: a.priority === "Alta" ? "var(--danger-soft)" : "var(--warning-soft)",
                  color: a.priority === "Alta" ? "var(--danger)" : "var(--warning)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 11,
                }}>{i + 1}</span>
                <div className="col" style={{ flex: 1, gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>{a.title}</span>
                  <span style={{ fontSize: 11.5, color: "var(--fg-4)" }}>Impacto estimado: {a.impact}</span>
                </div>
                <button className="btn btn-sm">Asignar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="col gap-2">
          <span className="t-eyebrow">Secciones del reporte</span>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {r.sections.map((s, i) => (
              <span key={i} className="chip" style={{ height: 26, fontSize: 11.5 }}>
                <span style={{ color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export { AutomationsView, ReportsView };
