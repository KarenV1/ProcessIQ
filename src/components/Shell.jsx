import React, { useState, useEffect, useRef } from "react";
import { Icon, AiBadge } from './primitives.jsx';
import { ROLES } from '../data.js';

// =========================================================
// ProcessIQ — App shell (sidebar + topbar)
// =========================================================

const NAV_PRIMARY = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "insights", label: "IA Insights", icon: "insights", badge: "5", badgeKind: "ai" },
  { id: "analytics", label: "Analítica", icon: "analytics" },
  { id: "processes", label: "Procesos", icon: "processes", badge: "128" },
  { id: "automations", label: "Automatizaciones", icon: "automations", badge: "12" },
  { id: "reports", label: "Reportes", icon: "reports" },
];

const NAV_SECONDARY = [
  { id: "config", label: "Configuración", icon: "config" },
];

const Sidebar = ({ active, onNavigate, role, onRoleClick, onAskAi }) => {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ padding: "16px 16px 10px" }}>
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <BrandMark />
          <div className="col" style={{ gap: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>ProcessIQ</span>
            <span style={{ fontSize: 11, color: "var(--fg-4)", letterSpacing: "0.01em" }}>Healthcare Ops</span>
          </div>
        </div>
      </div>

      {/* Org switcher */}
      <div style={{ padding: "0 12px 10px" }}>
        <button className="row gap-2" style={{
          all: "unset", cursor: "pointer", display: "flex",
          alignItems: "center", padding: "8px 10px", borderRadius: 8,
          background: "var(--bg-2)", border: "1px solid var(--line-1)",
          width: "100%",
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, oklch(0.55 0.13 25), oklch(0.45 0.13 15))",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 10, fontWeight: 700,
          }}>N</span>
          <span className="col" style={{ flex: 1, gap: 1 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-1)" }}>Red Salud Norte</span>
            <span style={{ fontSize: 10.5, color: "var(--fg-4)" }}>4 sedes · 1.240 empleados</span>
          </span>
          <Icon name="chevron" size={12} style={{ color: "var(--fg-4)" }} />
        </button>
      </div>

      {/* Search shortcut */}
      <div style={{ padding: "0 12px 12px" }}>
        <button onClick={onAskAi} className="row gap-2" style={{
          all: "unset", cursor: "pointer", display: "flex",
          alignItems: "center", padding: "7px 10px", borderRadius: 8,
          border: "1px solid var(--line-1)", background: "transparent", width: "100%",
        }}>
          <Icon name="sparkle" size={13} style={{ color: "var(--ai)" }} />
          <span style={{ fontSize: 12.5, color: "var(--fg-3)", flex: 1, textAlign: "left" }}>
            Pregunta a la IA…
          </span>
          <span className="kbd">⌘K</span>
        </button>
      </div>

      <nav className="col" style={{ padding: "0 10px", gap: 1, flex: 1, overflowY: "auto", minHeight: 0 }}>
        <div className="t-eyebrow" style={{ padding: "8px 10px 6px", fontSize: 10, color: "var(--fg-5)" }}>
          Workspace
        </div>
        {NAV_PRIMARY.map((n) => (
          <div
            key={n.id}
            className="nav-item"
            data-active={active === n.id}
            onClick={() => onNavigate(n.id)}
            role="button"
          >
            <Icon name={n.icon} size={15} className="nav-icon" />
            <span>{n.label}</span>
            {n.badge && (
              <span className={`badge ${n.badgeKind === "ai" ? "badge-ai" : ""}`}>{n.badge}</span>
            )}
          </div>
        ))}

        <div className="t-eyebrow" style={{ padding: "16px 10px 6px", fontSize: 10, color: "var(--fg-5)" }}>
          Vistas guardadas
        </div>
        {[
          { id: "v1", label: "Cuellos de botella semanal", icon: "pin" },
          { id: "v2", label: "Urgencias en vivo", icon: "heart" },
          { id: "v3", label: "Glosas EPS abril", icon: "tag" },
        ].map((v) => (
          <div key={v.id} className="nav-item" style={{ color: "var(--fg-3)" }}>
            <Icon name={v.icon} size={14} className="nav-icon" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.label}</span>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {NAV_SECONDARY.map((n) => (
          <div key={n.id} className="nav-item" data-active={active === n.id} onClick={() => onNavigate(n.id)}>
            <Icon name={n.icon} size={15} className="nav-icon" />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      {/* Role footer */}
      <div style={{ padding: 12, borderTop: "1px solid var(--line-1)" }}>
        <button onClick={onRoleClick} className="role-card" style={{ all: "unset", cursor: "pointer", display: "flex", width: "100%", alignItems: "center", padding: "10px 12px", border: "1px solid var(--line-1)", borderRadius: 10, background: "var(--bg-2)", gap: 10 }}>
          <div className="avatar avatar-accent">{role.initials}</div>
          <div className="col" style={{ gap: 1, flex: 1, overflow: "hidden" }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {role.name}
            </span>
            <span style={{ fontSize: 10.5, color: "var(--fg-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {role.title}
            </span>
          </div>
          <Icon name="swap" size={13} style={{ color: "var(--fg-4)" }} />
        </button>
      </div>
    </aside>
  );
};

const BrandMark = ({ size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: 8, position: "relative",
    background: "linear-gradient(135deg, oklch(0.32 0.06 200), oklch(0.22 0.04 200))",
    border: "1px solid var(--line-2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 0 1px oklch(1 0 0 / 0.04) inset",
  }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 20 20" fill="none">
      {/* Stylized "Q" pulse */}
      <circle cx="10" cy="10" r="6.5" stroke="var(--accent)" strokeWidth="1.6"/>
      <path d="M13.5 13.5L16 16" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2.4" fill="var(--accent)" fillOpacity="0.65"/>
    </svg>
  </div>
);

const Topbar = ({ crumb, onCommand, onAskAi, onTheme, theme, onRefresh, lastSync, filters, onFilter, alerts = 3 }) => {
  return (
    <header className="topbar">
      <div className="row gap-3" style={{ flex: 1, minWidth: 0 }}>
        <div className="crumb">
          {crumb.map((c, i) => (
            <React.Fragment key={i}>
              <span style={{ color: i === crumb.length - 1 ? "var(--fg-1)" : "var(--fg-3)" }}>{c}</span>
              {i < crumb.length - 1 && <Icon name="chevron" size={10} style={{ color: "var(--fg-5)" }} />}
            </React.Fragment>
          ))}
        </div>
        <span style={{ width: 1, height: 18, background: "var(--line-1)" }} />
        <div className="row gap-2">
          <FilterChip label="Período" value={filters.period} options={filters.periodOptions} onChange={(v) => onFilter("period", v)} />
          <FilterChip label="Área" value={filters.area} options={filters.areaOptions} onChange={(v) => onFilter("area", v)} />
          <FilterChip label="Sede" value={filters.site} options={filters.siteOptions} onChange={(v) => onFilter("site", v)} />
        </div>
      </div>

      <div className="row gap-2">
        <button onClick={onCommand} className="field" style={{ minWidth: 240, height: 32 }}>
          <Icon name="search" size={13} style={{ color: "var(--fg-4)" }} />
          <span style={{ flex: 1, textAlign: "left", color: "var(--fg-4)", fontSize: 12.5 }}>
            Buscar procesos, KPIs, reportes…
          </span>
          <span className="kbd">⌘K</span>
        </button>

        <button className="btn btn-icon" title="Sincronizar" onClick={onRefresh}>
          <Icon name="refresh" size={14} />
        </button>
        <button className="btn btn-icon" title="Cambiar tema" onClick={onTheme}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
        </button>
        <button className="btn btn-icon" style={{ position: "relative" }} title="Alertas">
          <Icon name="bell" size={14} />
          {alerts > 0 && (
            <span style={{
              position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: 999,
              background: "var(--danger)", border: "1.5px solid var(--bg-0)",
            }} />
          )}
        </button>
        <button onClick={onAskAi} className="btn btn-ai">
          <Icon name="sparkle" size={13} />
          Copiloto
        </button>
      </div>
    </header>
  );
};

const FilterChip = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((x) => !x)} className="row gap-2" style={{
        all: "unset", cursor: "pointer",
        display: "inline-flex", alignItems: "center",
        height: 28, padding: "0 10px", borderRadius: 8,
        background: "var(--bg-2)", border: "1px solid var(--line-1)",
        fontSize: 12, color: "var(--fg-2)",
      }}>
        <span style={{ color: "var(--fg-4)" }}>{label}:</span>
        <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{value}</span>
        <Icon name="chevronDown" size={11} style={{ color: "var(--fg-4)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 180,
          background: "var(--bg-1)", border: "1px solid var(--line-2)",
          borderRadius: 10, boxShadow: "var(--shadow-pop)", padding: 4, zIndex: 30,
        }} className="fade-in">
          {options.map((opt) => (
            <div key={opt} className="menu-item" onClick={() => { onChange(opt); setOpen(false); }}>
              {opt === value && <Icon name="check" size={12} style={{ color: "var(--accent)" }} />}
              <span style={{ marginLeft: opt === value ? 0 : 22 }}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Command palette
const CommandPalette = ({ open, onClose, onNavigate, onAskAi }) => {
  const [q, setQ] = useState("");
  const items = [
    { id: "nav-dashboard", label: "Ir a Dashboard ejecutivo", icon: "dashboard", action: () => onNavigate("dashboard") },
    { id: "nav-insights", label: "Ir a IA Insights", icon: "insights", action: () => onNavigate("insights") },
    { id: "nav-analytics", label: "Ir a Analítica", icon: "analytics", action: () => onNavigate("analytics") },
    { id: "nav-processes", label: "Ir a Procesos", icon: "processes", action: () => onNavigate("processes") },
    { id: "nav-automations", label: "Ir a Automatizaciones", icon: "automations", action: () => onNavigate("automations") },
    { id: "nav-reports", label: "Ir a Reportes", icon: "reports", action: () => onNavigate("reports") },
    { id: "ai-bottleneck", label: "Preguntar IA: ¿cuál es el cuello de botella más costoso?", icon: "sparkle", isAi: true, action: () => { onAskAi("¿Cuál es el cuello de botella más costoso este mes?"); } },
    { id: "ai-report", label: "Preguntar IA: generar reporte semanal", icon: "sparkle", isAi: true, action: () => { onAskAi("Genera el reporte semanal de dirección operativa"); } },
    { id: "ai-compare", label: "Preguntar IA: comparar Urgencias vs Hospitalización", icon: "sparkle", isAi: true, action: () => { onAskAi("Compara la productividad de Urgencias vs. Hospitalización"); } },
  ];
  const filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) : items;
  useEffect(() => { if (open) setQ(""); }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "oklch(0 0 0 / 0.35)",
      backdropFilter: "blur(2px)", zIndex: 100,
      display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 96,
    }} className="fade-in">
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "min(620px, 92vw)", background: "var(--bg-1)",
        border: "1px solid var(--line-2)", borderRadius: 12,
        boxShadow: "var(--shadow-pop)", overflow: "hidden",
      }}>
        <div className="row gap-2" style={{ padding: "12px 14px", borderBottom: "1px solid var(--line-1)" }}>
          <Icon name="search" size={14} style={{ color: "var(--fg-4)" }} />
          <input
            autoFocus
            placeholder="Buscar o preguntar a la IA…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--fg-1)", fontSize: 14 }}
          />
          <span className="kbd">esc</span>
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto", padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--fg-4)", fontSize: 13 }}>Sin resultados</div>
          )}
          {filtered.map((i) => (
            <div key={i.id} className="menu-item" style={{ height: 36, padding: "0 10px" }}
              onClick={() => { i.action(); onClose(); }}>
              <Icon name={i.icon} size={14} style={{ color: i.isAi ? "var(--ai)" : "var(--fg-3)" }} />
              <span style={{ flex: 1 }}>{i.label}</span>
              {i.isAi && <AiBadge label="AI" />}
              <Icon name="arrow" size={12} style={{ color: "var(--fg-5)" }} />
            </div>
          ))}
        </div>
        <div className="row gap-3" style={{ padding: "10px 14px", borderTop: "1px solid var(--line-1)", color: "var(--fg-4)", fontSize: 11 }}>
          <span><span className="kbd">↑↓</span> navegar</span>
          <span><span className="kbd">⏎</span> abrir</span>
          <span><span className="kbd">⌘</span><span className="kbd" style={{ marginLeft: 2 }}>K</span> palette</span>
          <span style={{ marginLeft: "auto" }} className="row gap-2">
            <Icon name="sparkle" size={10} style={{ color: "var(--ai)" }} /> potenciado con GPT-Ops 4
          </span>
        </div>
      </div>
    </div>
  );
};

// Role switcher modal
const RoleSwitcher = ({ open, onClose, current, onPick }) => {
  if (!open) return null;
  const roles = Object.values(ROLES);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "oklch(0 0 0 / 0.4)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
    }} className="fade-in">
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "min(540px, 92vw)", background: "var(--bg-1)",
        border: "1px solid var(--line-2)", borderRadius: 14,
        boxShadow: "var(--shadow-pop)", overflow: "hidden",
      }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line-1)" }}>
          <div className="t-h1">Cambiar perspectiva</div>
          <div className="t-small" style={{ marginTop: 4 }}>
            Cada rol carga dashboards y permisos adaptados. Útil para demos y reuniones.
          </div>
        </div>
        <div className="col" style={{ padding: 12, gap: 6 }}>
          {roles.map((r) => (
            <div key={r.id} onClick={() => { onPick(r.id); onClose(); }} style={{
              display: "flex", gap: 12, padding: 12, borderRadius: 10,
              background: r.id === current ? "var(--accent-soft)" : "var(--bg-2)",
              border: `1px solid ${r.id === current ? "var(--accent-line)" : "var(--line-1)"}`,
              cursor: "pointer", transition: "background 0.15s",
            }}>
              <div className="avatar avatar-accent" style={{ width: 36, height: 36, fontSize: 13 }}>{r.initials}</div>
              <div className="col" style={{ flex: 1, gap: 2 }}>
                <div className="row gap-2">
                  <span style={{ fontWeight: 600, color: "var(--fg-1)", fontSize: 14 }}>{r.name}</span>
                  {r.id === current && <span className="chip chip-accent" style={{ height: 18, fontSize: 10 }}>activo</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{r.title} · {r.org}</div>
                <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 2 }}>
                  Acceso a: {r.permissions.length} módulos
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Sidebar, Topbar, CommandPalette, RoleSwitcher, BrandMark };
