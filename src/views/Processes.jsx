import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon, AiBadge, StatusPill, RiskBar, Sparkline } from '../components/primitives.jsx';
import { PROCESSES, AREAS } from '../data.js';

// =========================================================
// ProcessIQ — Procesos (lista + detalle)
// =========================================================
const ProcessesView = ({ role, onOpenProcess, focusProcessId }) => {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [layout, setLayout] = useState("list");
  const [selected, setSelected] = useState(focusProcessId || PROCESSES[1].id);

  const filtered = useMemo(() => {
    return PROCESSES.filter((p) => {
      if (query && !`${p.name} ${p.id} ${p.owner}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (area !== "Todas" && p.area !== area) return false;
      if (status !== "Todos") {
        if (status === "Saludables" && p.status !== "ok") return false;
        if (status === "En riesgo" && !["risk", "warn"].includes(p.status)) return false;
        if (status === "Críticos" && p.status !== "critical") return false;
      }
      return true;
    });
  }, [query, area, status]);

  const active = PROCESSES.find((p) => p.id === selected) || PROCESSES[0];

  return (
    <div className="content fade-in col gap-4">
      {/* Header */}
      <div className="row gap-3" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className="col gap-2">
          <span className="t-eyebrow" style={{ color: "var(--accent)" }}>Procesos · catálogo operativo</span>
          <div className="t-display" style={{ fontSize: 28 }}>128 procesos activos</div>
          <div className="t-body">8 áreas · 4 críticos · 26 con oportunidad de automatización</div>
        </div>
        <div className="row gap-2">
          <button className="btn"><Icon name="plus" size={13} />Nuevo proceso</button>
          <button className="btn"><Icon name="map" size={13} />Vista de mapa</button>
        </div>
      </div>

      {/* Filters */}
      <div className="row gap-3" style={{ flexWrap: "wrap" }}>
        <div className="field" style={{ minWidth: 280, flex: 1, maxWidth: 380 }}>
          <Icon name="search" size={13} style={{ color: "var(--fg-4)" }} />
          <input placeholder="Buscar por nombre, ID o responsable…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <Icon name="x" size={12} style={{ color: "var(--fg-4)", cursor: "pointer" }} onClick={() => setQuery("")} />}
        </div>
        <Select label="Área" value={area} options={["Todas", ...AREAS.map((a) => a.name)]} onChange={setArea} />
        <Select label="Estado" value={status} options={["Todos", "Saludables", "En riesgo", "Críticos"]} onChange={setStatus} />
        <Select label="Ordenar" value="Riesgo IA ↓" options={["Riesgo IA ↓", "SLA ↑", "Ciclo ↓", "Volumen ↓"]} onChange={() => {}} />
        <div className="spacer" />
        <div className="tabs">
          <button data-active={layout === "list"} onClick={() => setLayout("list")}><Icon name="list" size={12} /></button>
          <button data-active={layout === "grid"} onClick={() => setLayout("grid")}><Icon name="grid" size={12} /></button>
          <button data-active={layout === "split"} onClick={() => setLayout("split")}><Icon name="layers" size={12} /></button>
        </div>
      </div>

      {/* Body */}
      {layout === "split" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)", gap: 16 }}>
          <ProcessList processes={filtered} selected={selected} onSelect={setSelected} compact />
          <ProcessDetail p={active} onOpen={onOpenProcess} />
        </div>
      )}
      {layout === "list" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <ProcessTable processes={filtered} onOpen={(p) => { setSelected(p.id); onOpenProcess(p); }} />
        </div>
      )}
      {layout === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map((p) => (
            <ProcessCard key={p.id} p={p} onClick={() => onOpenProcess(p)} />
          ))}
        </div>
      )}
    </div>
  );
};

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((x) => !x)} className="row gap-2" style={{
        all: "unset", cursor: "pointer", height: 32, padding: "0 11px", borderRadius: 9,
        border: "1px solid var(--line-1)", background: "var(--bg-1)",
        display: "inline-flex", alignItems: "center", fontSize: 12.5,
      }}>
        <span style={{ color: "var(--fg-4)" }}>{label}:</span>
        <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{value}</span>
        <Icon name="chevronDown" size={11} style={{ color: "var(--fg-4)", marginLeft: 4 }} />
      </button>
      {open && (
        <div className="fade-in" style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 180,
          background: "var(--bg-1)", border: "1px solid var(--line-2)",
          borderRadius: 10, boxShadow: "var(--shadow-pop)", padding: 4, zIndex: 30,
        }}>
          {options.map((o) => (
            <div key={o} className="menu-item" onClick={() => { onChange(o); setOpen(false); }}>
              {o === value && <Icon name="check" size={12} style={{ color: "var(--accent)" }} />}
              <span style={{ marginLeft: o === value ? 0 : 22 }}>{o}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProcessTable = ({ processes, onOpen }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Proceso</th>
        <th style={{ width: 130 }}>Área</th>
        <th style={{ width: 140 }}>Responsable</th>
        <th style={{ width: 80, textAlign: "right" }}>Volumen</th>
        <th style={{ width: 80, textAlign: "right" }}>Ciclo</th>
        <th style={{ width: 90, textAlign: "right" }}>SLA</th>
        <th style={{ width: 140 }}>Riesgo IA</th>
        <th style={{ width: 100 }}>Tendencia</th>
        <th style={{ width: 110 }}>Estado</th>
        <th style={{ width: 32 }} />
      </tr>
    </thead>
    <tbody>
      {processes.map((p) => (
        <tr key={p.id} onClick={() => onOpen(p)} style={{ cursor: "pointer" }}>
          <td>
            <div className="row gap-2" style={{ minWidth: 0 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999,
                background: p.status === "ok" ? "var(--success)" : p.status === "critical" ? "var(--danger)" : "var(--warning)",
                flexShrink: 0,
              }} />
              <div className="col gap-1" style={{ minWidth: 0 }}>
                <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{p.name}</span>
                <span className="t-mono" style={{ color: "var(--fg-4)" }}>{p.id} · cuello: {p.bottleneck}</span>
              </div>
              {p.aiFlag && <span className="chip chip-ai" style={{ height: 18, fontSize: 10, marginLeft: 6 }}><Icon name="sparkle" size={9} /> {p.aiFlag.label}</span>}
            </div>
          </td>
          <td>{p.area}</td>
          <td>{p.owner}</td>
          <td style={{ textAlign: "right" }}><span className="t-num">{p.volume.toLocaleString()}</span></td>
          <td style={{ textAlign: "right" }}><span className="t-num">{p.avgCycle}h</span></td>
          <td style={{ textAlign: "right" }}>
            <span className="t-num" style={{ fontWeight: 600, color: p.slaActual >= 90 ? "var(--success)" : p.slaActual >= 75 ? "var(--warning)" : "var(--danger)" }}>
              {p.slaActual}%
            </span>
          </td>
          <td><RiskBar value={p.risk} /></td>
          <td><Sparkline data={p.trend} color={p.status === "ok" ? "var(--success)" : "var(--warning)"} width={70} height={20} fill={false} /></td>
          <td><StatusPill status={p.status} /></td>
          <td><Icon name="chevron" size={11} style={{ color: "var(--fg-5)" }} /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ProcessList = ({ processes, selected, onSelect, compact }) => (
  <div className="card" style={{ padding: 0, maxHeight: 720, overflowY: "auto" }}>
    {processes.map((p) => (
      <div key={p.id} className="list-row" data-selected={p.id === selected} onClick={() => onSelect(p.id)} style={{
        gridTemplateColumns: "auto 1fr auto",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: 999,
          background: p.status === "ok" ? "var(--success)" : p.status === "critical" ? "var(--danger)" : "var(--warning)",
        }} />
        <div className="col" style={{ gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-1)" }}>{p.name}</span>
          <span style={{ fontSize: 11, color: "var(--fg-4)" }}>
            {p.area} · {p.id} · {p.owner}
          </span>
        </div>
        <div className="col" style={{ gap: 2, alignItems: "flex-end" }}>
          <span className="t-num" style={{ fontSize: 12, fontWeight: 600, color: p.slaActual >= 90 ? "var(--success)" : p.slaActual >= 75 ? "var(--warning)" : "var(--danger)" }}>
            {p.slaActual}%
          </span>
          <span style={{ fontSize: 10.5, color: "var(--fg-4)" }}>{p.avgCycle}h ciclo</span>
        </div>
      </div>
    ))}
  </div>
);

const ProcessCard = ({ p, onClick }) => (
  <div onClick={onClick} className="card card-pad" style={{ cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}>
    <div className="row gap-2" style={{ justifyContent: "space-between", marginBottom: 8 }}>
      <StatusPill status={p.status} />
      {p.aiFlag && <span className="chip chip-ai" style={{ height: 20, fontSize: 10.5 }}><Icon name="sparkle" size={10} /> {p.aiFlag.label}</span>}
    </div>
    <div className="t-h2" style={{ marginBottom: 4 }}>{p.name}</div>
    <div className="t-small" style={{ marginBottom: 14 }}>{p.area} · {p.owner}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Mini label="SLA" value={`${p.slaActual}%`} tone={p.slaActual >= 90 ? "success" : p.slaActual >= 75 ? "warning" : "danger"} />
      <Mini label="Ciclo" value={`${p.avgCycle}h`} />
      <Mini label="Volumen" value={p.volume.toLocaleString()} />
      <Mini label="Riesgo" value={p.risk} tone={p.risk >= 70 ? "danger" : p.risk >= 40 ? "warning" : "success"} />
    </div>
    <div style={{ marginTop: 12 }}>
      <Sparkline data={p.trend} color="var(--accent)" width={240} height={28} />
    </div>
  </div>
);

const Mini = ({ label, value, tone }) => {
  const c = tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : tone === "danger" ? "var(--danger)" : "var(--fg-1)";
  return (
    <div className="col gap-1">
      <span style={{ fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.04em", fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
      <span className="t-num" style={{ fontSize: 16, fontWeight: 600, color: c }}>{value}</span>
    </div>
  );
};

const ProcessDetail = ({ p, onOpen }) => {
  const steps = [
    { name: "Registro", duration: "0.2h", health: "ok", load: 30 },
    { name: "Validación inicial", duration: "0.4h", health: "ok", load: 42 },
    { name: p.bottleneck || "Aprobación", duration: "28h", health: "critical", load: 95, isBottleneck: true },
    { name: "Ejecución", duration: "1.8h", health: "ok", load: 55 },
    { name: "Cierre", duration: "0.5h", health: "warn", load: 70 },
  ];
  return (
    <div className="card card-pad col gap-4" style={{ maxHeight: 760, overflowY: "auto" }}>
      <div className="row gap-2" style={{ justifyContent: "space-between" }}>
        <div className="col gap-1">
          <div className="row gap-2">
            <StatusPill status={p.status} />
            <span className="t-mono" style={{ color: "var(--fg-4)", fontSize: 11 }}>{p.id}</span>
          </div>
          <div className="t-h1" style={{ marginTop: 4 }}>{p.name}</div>
          <div className="t-small">{p.area} · responsable: {p.owner}</div>
        </div>
        <button className="btn btn-sm" onClick={() => onOpen(p)}><Icon name="expand" size={12} /> Abrir</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <Mini label="Volumen mes" value={p.volume.toLocaleString()} />
        <Mini label="Ciclo prom." value={`${p.avgCycle}h`} />
        <Mini label="SLA" value={`${p.slaActual}%`} tone={p.slaActual >= 90 ? "success" : p.slaActual >= 75 ? "warning" : "danger"} />
        <Mini label="Riesgo" value={p.risk} tone={p.risk >= 70 ? "danger" : p.risk >= 40 ? "warning" : "success"} />
      </div>

      <div className="card ai-frame" style={{ padding: 14, background: "var(--bg-2)", borderColor: "var(--ai-line)" }}>
        <div className="row gap-2" style={{ marginBottom: 6 }}>
          <AiBadge label="Análisis IA" />
        </div>
        <div className="t-body" style={{ color: "var(--fg-1)" }}>
          La etapa <strong style={{ color: "var(--danger)" }}>{p.bottleneck}</strong> concentra el {Math.round(72)}% del tiempo total del proceso, principalmente por dependencias externas.
          Recomendamos automatizar la validación previa, lo que reduciría el ciclo en aproximadamente <strong style={{ color: "var(--success)" }}>38%</strong>.
        </div>
        <div className="row gap-2" style={{ marginTop: 10 }}>
          <button className="btn btn-sm btn-ai"><Icon name="bolt" size={11} /> Crear automatización</button>
          <button className="btn btn-sm"><Icon name="reports" size={11} /> Documentar</button>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="col gap-2">
        <div className="t-h3">Flujo del proceso</div>
        <div className="row gap-1" style={{ alignItems: "stretch", overflowX: "auto" }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="col" style={{
                flex: 1, minWidth: 110,
                padding: 12, borderRadius: 10,
                background: s.isBottleneck ? "var(--danger-soft)" : "var(--bg-2)",
                border: `1px solid ${s.isBottleneck ? "var(--danger)" : "var(--line-1)"}`,
                position: "relative", gap: 6,
              }}>
                {s.isBottleneck && (
                  <span className="chip chip-danger" style={{ position: "absolute", top: -10, left: 8, height: 18, fontSize: 10 }}>
                    <Icon name="alert" size={9} /> Cuello
                  </span>
                )}
                <span className="t-eyebrow" style={{ fontSize: 9.5 }}>Paso {i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{s.name}</span>
                <span className="t-num" style={{ fontSize: 14, fontWeight: 500, color: s.isBottleneck ? "var(--danger)" : "var(--fg-2)" }}>{s.duration}</span>
                <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 999, marginTop: 4 }}>
                  <div style={{
                    width: `${s.load}%`, height: "100%",
                    background: s.isBottleneck ? "var(--danger)" : s.health === "warn" ? "var(--warning)" : "var(--success)",
                    borderRadius: 999,
                  }} />
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="col" style={{ justifyContent: "center", padding: "0 2px", color: "var(--fg-5)" }}>
                  <Icon name="chevron" size={12} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// Detail panel (slide-in) — for opening from any view
const ProcessDetailPanel = ({ process, onClose }) => {
  if (!process) return null;
  return (
    <div className="detail-panel" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--line-1)" }} className="row gap-2">
          <div className="col gap-1" style={{ flex: 1 }}>
            <span className="t-mono" style={{ color: "var(--fg-4)", fontSize: 11 }}>{process.id}</span>
            <div className="row gap-2">
              <span className="t-h1" style={{ fontSize: 18 }}>{process.name}</span>
              <StatusPill status={process.status} />
            </div>
            <span className="t-small">{process.area} · {process.owner}</span>
          </div>
          <button className="btn btn-icon" onClick={onClose}><Icon name="x" size={13} /></button>
        </div>
        <div className="scroll-area" style={{ padding: "20px 22px" }}>
          <ProcessDetail p={process} onOpen={() => {}} />
        </div>
      </div>
    </div>
  );
};

export { ProcessesView, ProcessDetailPanel };
export default ProcessesView;
