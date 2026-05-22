# ProcessIQ

Plataforma de inteligencia operativa impulsada por IA para monitoreo y optimización de procesos en el sector salud.

## Stack

- **React 18** + **Vite 5**
- Sin dependencias UI externas — todo el sistema de diseño es propio (CSS vars + JSX components)
- Tipografía: Inter + JetBrains Mono (via Google Fonts)

## Empezar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview   # opcional, sirve la carpeta dist localmente
```

El bundle queda en `dist/`.

## Desplegar

### Vercel
1. Push del repo a GitHub.
2. En Vercel: *Add New Project* → importa el repo.
3. Framework preset: **Vite** (autodetectado).
4. Build command: `npm run build` · Output: `dist`.

### Railway
1. Crea un servicio desde el repo.
2. Railway detecta Node. Variables/comandos:
   - Build command: `npm run build`
   - Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

### Netlify / Cloudflare Pages
- Build: `npm run build`
- Publish dir: `dist`

## Estructura

```
src/
  main.jsx              entry
  App.jsx               root component + routing/state
  styles.css            design tokens + primitives
  data.js               mock data (sector salud)
  components/
    primitives.jsx      Icon, Sparkline, LineChart, BarChart, Donut, KpiCard, etc.
    Shell.jsx           Sidebar + Topbar + Command palette + Role switcher
    Copilot.jsx         Panel conversacional del copiloto IA
    InsightDetail.jsx   Panel deslizable con detalle del insight
    TweaksPanel.jsx     Panel flotante de configuración (tema, densidad, acento)
  views/
    Dashboard.jsx
    Insights.jsx
    Analytics.jsx
    Processes.jsx
    Automations.jsx
    Reports.jsx
```

## Personas soportadas

- Directora de Operaciones (KPIs estratégicos)
- Gerente de Área (operativo)
- Analista de Procesos (drilldowns + IA)

Cambia desde el botón inferior del sidebar.

## Atajos

- `⌘K` / `Ctrl+K` — Command palette + preguntas a la IA
- `Esc` — Cerrar paneles
