import React, { useState, useEffect, useMemo } from "react";

import { Sidebar, Topbar, CommandPalette, RoleSwitcher } from "./components/Shell.jsx";
import { Copilot } from "./components/Copilot.jsx";
import { InsightDetailPanel } from "./components/InsightDetail.jsx";
import { ProcessDetailPanel } from "./views/Processes.jsx";
import { Icon } from "./components/primitives.jsx";

import { DashboardView } from "./views/Dashboard.jsx";
import { InsightsView } from "./views/Insights.jsx";
import { AnalyticsView } from "./views/Analytics.jsx";
import { ProcessesView } from "./views/Processes.jsx";
import { AutomationsView, ReportsView } from "./views/AutomationsAndReports.jsx";

import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakSelect,
  TweakToggle,
} from "./components/TweaksPanel.jsx";

import { ROLES, PROCESSES } from "./data.js";

const DEFAULT_TWEAKS = {
  theme: "dark",
  density: "compact",
  accent: "teal",
  layout: "executive",
  showAiHighlights: true,
};

const ACCENT_PALETTES = {
  teal: {
    "--accent": "oklch(0.78 0.12 195)",
    "--accent-soft": "oklch(0.78 0.12 195 / 0.14)",
    "--accent-line": "oklch(0.78 0.12 195 / 0.35)",
    "--accent-fg": "oklch(0.15 0.02 195)",
  },
  indigo: {
    "--accent": "oklch(0.74 0.13 260)",
    "--accent-soft": "oklch(0.74 0.13 260 / 0.14)",
    "--accent-line": "oklch(0.74 0.13 260 / 0.35)",
    "--accent-fg": "oklch(0.99 0.005 260)",
  },
  emerald: {
    "--accent": "oklch(0.78 0.14 165)",
    "--accent-soft": "oklch(0.78 0.14 165 / 0.14)",
    "--accent-line": "oklch(0.78 0.14 165 / 0.35)",
    "--accent-fg": "oklch(0.16 0.02 165)",
  },
  amber: {
    "--accent": "oklch(0.82 0.14 75)",
    "--accent-soft": "oklch(0.82 0.14 75 / 0.14)",
    "--accent-line": "oklch(0.82 0.14 75 / 0.35)",
    "--accent-fg": "oklch(0.18 0.03 75)",
  },
};

export default function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULT_TWEAKS);

  const [view, setView] = useState("dashboard");
  const [roleId, setRoleId] = useState("director");
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotPrompt, setCopilotPrompt] = useState(null);
  const [insightOpen, setInsightOpen] = useState(null);
  const [processOpen, setProcessOpen] = useState(null);
  const [reportAutoStart, setReportAutoStart] = useState(false);
  const [filters, setFilters] = useState({
    period: "Últimos 30 días",
    area: "Todas",
    site: "Todas las sedes",
  });
  const role = ROLES[roleId];

  // Apply theme + accent
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.density = tweaks.density;
    const palette = ACCENT_PALETTES[tweaks.accent] || ACCENT_PALETTES.teal;
    Object.entries(palette).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v)
    );
  }, [tweaks.theme, tweaks.density, tweaks.accent]);

  // Hotkey ⌘K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setInsightOpen(null);
        setProcessOpen(null);
        setCopilotOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navigate = (v) => {
    setView(v);
    setCommandOpen(false);
    setReportAutoStart(false);
  };

  const askAi = (prompt) => {
    setCopilotPrompt(prompt || null);
    setCopilotOpen(true);
  };

  const openInsight = (ins) => setInsightOpen(ins);
  const openProcess = (p) => {
    if (typeof p === "string") {
      const found = PROCESSES.find((x) => x.id === p);
      if (found) setProcessOpen(found);
    } else {
      setProcessOpen(p);
    }
  };

  const generateReport = () => {
    setView("reports");
    setReportAutoStart(true);
  };

  const crumb = useMemo(() => {
    const labels = {
      dashboard: "Dashboard ejecutivo",
      insights: "IA Insights",
      analytics: "Analítica",
      processes: "Procesos",
      automations: "Automatizaciones",
      reports: "Reportes",
      config: "Configuración",
    };
    return ["ProcessIQ", role.title, labels[view]];
  }, [view, role]);

  return (
    <div className="app" data-layout={tweaks.layout}>
      <Sidebar
        active={view}
        onNavigate={navigate}
        role={role}
        onRoleClick={() => setRoleSwitcherOpen(true)}
        onAskAi={() => setCommandOpen(true)}
      />

      <div className="main">
        <Topbar
          crumb={crumb}
          theme={tweaks.theme}
          onTheme={() =>
            setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")
          }
          onCommand={() => setCommandOpen(true)}
          onAskAi={() => askAi()}
          onRefresh={() => {}}
          filters={{
            ...filters,
            periodOptions: [
              "Últimos 7 días",
              "Últimos 30 días",
              "Trimestre",
              "Año a la fecha",
              "Personalizado",
            ],
            areaOptions: [
              "Todas",
              "Urgencias",
              "Quirófano",
              "Hospitalización",
              "Consulta externa",
              "Farmacia",
              "Laboratorio",
              "Administrativa",
            ],
            siteOptions: [
              "Todas las sedes",
              "Sede Centro",
              "Sede Norte",
              "Sede Sur",
              "Sede Aeropuerto",
            ],
          }}
          onFilter={(k, v) => setFilters({ ...filters, [k]: v })}
        />

        <div className="scroll-area">
          {view === "dashboard" && (
            <DashboardView
              role={role}
              onNavigate={navigate}
              onOpenInsight={openInsight}
              onOpenProcess={openProcess}
              onAskAi={askAi}
              onGenerateReport={generateReport}
            />
          )}
          {view === "insights" && (
            <InsightsView
              role={role}
              onOpenInsight={openInsight}
              onOpenProcess={openProcess}
            />
          )}
          {view === "analytics" && <AnalyticsView role={role} onAskAi={askAi} />}
          {view === "processes" && (
            <ProcessesView role={role} onOpenProcess={openProcess} focusProcessId={null} />
          )}
          {view === "automations" && <AutomationsView role={role} />}
          {view === "reports" && (
            <ReportsView role={role} autoStart={reportAutoStart} />
          )}
          {view === "config" && <ConfigView role={role} />}
        </div>
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={navigate}
        onAskAi={askAi}
      />
      <RoleSwitcher
        open={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
        current={roleId}
        onPick={setRoleId}
      />
      <InsightDetailPanel
        insight={insightOpen}
        onClose={() => setInsightOpen(null)}
        onAction={() => {}}
        onNavigate={navigate}
      />
      <ProcessDetailPanel
        process={processOpen}
        onClose={() => setProcessOpen(null)}
      />
      <Copilot
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        initialPrompt={copilotPrompt}
        role={role}
        onNavigate={(v) => {
          navigate(v);
          setCopilotOpen(false);
        }}
        onOpenInsight={(i) => {
          openInsight(i);
          setCopilotOpen(false);
        }}
      />

      {!copilotOpen && !commandOpen && (
        <button
          onClick={() => askAi()}
          className="ai-fab"
          style={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background:
              "linear-gradient(180deg, oklch(0.88 0.13 75 / 0.16), oklch(0.55 0.13 65 / 0.12))",
            border: "1px solid var(--ai-line)",
            borderRadius: 999,
            boxShadow: "var(--shadow-pop)",
            backdropFilter: "blur(6px)",
            color: "var(--fg-1)",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "var(--ai)",
              color: "oklch(0.18 0.03 75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="sparkle" size={12} />
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>
            Pregunta al copiloto
          </span>
          <span className="kbd" style={{ borderColor: "var(--ai-line)" }}>
            ⌘K
          </span>
        </button>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Tema">
          <TweakRadio
            label="Apariencia"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "dark", label: "Oscuro" },
              { value: "light", label: "Claro" },
            ]}
          />
          <TweakRadio
            label="Densidad"
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Compacto" },
              { value: "comfortable", label: "Cómodo" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Variaciones">
          <TweakSelect
            label="Color de acento"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[
              { value: "teal", label: "Teal (default)" },
              { value: "indigo", label: "Indigo" },
              { value: "emerald", label: "Esmeralda" },
              { value: "amber", label: "Ámbar" },
            ]}
          />
          <TweakRadio
            label="Variante de layout"
            value={tweaks.layout}
            onChange={(v) => setTweak("layout", v)}
            options={[
              { value: "executive", label: "Ejecutivo" },
              { value: "operative", label: "Operativo" },
            ]}
          />
          <TweakToggle
            label="Resaltar contenido IA"
            value={tweaks.showAiHighlights}
            onChange={(v) => setTweak("showAiHighlights", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const ConfigView = () => (
  <div className="content fade-in col gap-5">
    <div className="col gap-2">
      <span className="t-eyebrow" style={{ color: "var(--accent)" }}>
        Configuración
      </span>
      <div className="t-display" style={{ fontSize: 28 }}>
        Workspace · Red Salud Norte
      </div>
      <div className="t-body">
        Gestiona conexiones, equipos, políticas de IA y permisos.
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {[
        { icon: "link", title: "Integraciones", sub: "12 fuentes conectadas", count: "12 activas" },
        { icon: "user", title: "Equipos y permisos", sub: "48 miembros", count: "3 roles" },
        { icon: "sparkle", title: "Políticas del copiloto", sub: "Acciones, citaciones, RBAC", count: "Activa" },
        { icon: "shield", title: "Cumplimiento", sub: "HABEAS · ISO 27001", count: "Auditado" },
        { icon: "bell", title: "Alertas y notificaciones", sub: "24 reglas activas", count: "24" },
        { icon: "config", title: "Branding", sub: "Logo, colores, idiomas", count: "ES · EN" },
      ].map((c, i) => (
        <div key={i} className="card card-pad col gap-2">
          <div className="row gap-2">
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "var(--accent-soft)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={c.icon} size={14} />
            </span>
            <span className="chip" style={{ height: 20, fontSize: 10.5, marginLeft: "auto" }}>
              {c.count}
            </span>
          </div>
          <div className="t-h2">{c.title}</div>
          <div className="t-small">{c.sub}</div>
        </div>
      ))}
    </div>
  </div>
);
