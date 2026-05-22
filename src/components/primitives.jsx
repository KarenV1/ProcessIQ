import React, { useState, useEffect, useRef } from "react";

// =========================================================
// ProcessIQ — shared UI primitives
// =========================================================
// ---------- Icons (custom-drawn line icons, 16px grid) ----------
const Icon = ({ name, size = 16, stroke = 1.5, style }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    processes: <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7"/></>,
    analytics: <><path d="M3 21h18"/><path d="M6 17V11"/><path d="M11 17V6"/><path d="M16 17v-4"/><path d="M21 17V8"/></>,
    automations: <><path d="M12 4v2"/><path d="M12 18v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><circle cx="12" cy="12" r="4"/></>,
    reports: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></>,
    insights: <><path d="M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4-2.5 5-.5.5-1 1-1 2v.5h-5V16c0-1-.5-1.5-1-2-1-1-2.5-2.5-2.5-5a6 6 0 0 1 6-6z"/><path d="M10 19h4"/></>,
    config: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.31.83.5 1.35.5H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    chevron: <path d="M9 6l6 6-6 6"/>,
    chevronDown: <path d="M6 9l6 6 6-6"/>,
    chevronUp: <path d="M6 15l6-6 6 6"/>,
    arrow: <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    arrowUpRight: <><path d="M7 17L17 7"/><path d="M8 7h9v9"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    x: <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>,
    check: <path d="M20 6L9 17l-5-5"/>,
    spark: <><path d="M12 2v6"/><path d="M12 16v6"/><path d="M5.2 5.2l4.2 4.2"/><path d="M14.6 14.6l4.2 4.2"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="M5.2 18.8l4.2-4.2"/><path d="M14.6 9.4l4.2-4.2"/></>,
    sparkle: <><path d="M12 3l1.8 4.6L18 9l-4.2 1.6L12 15l-1.8-4.4L6 9l4.2-1.4z"/><path d="M19 14l.9 2.3 2.1.7-2.1.7L19 20l-.9-2.3-2.1-.7 2.1-.7z"/></>,
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    alert: <><path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
    play: <path d="M5 3l14 9-14 9V3z"/>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    flag: <><path d="M4 22V4"/><path d="M4 4h14l-3 5 3 5H4"/></>,
    bot: <><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M3 14h18M8 20h8"/></>,
    send: <><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".75"/><circle cx="3.5" cy="12" r=".75"/><circle cx="3.5" cy="18" r=".75"/></>,
    refresh: <><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    map: <><path d="M1 6v16l7-3 8 3 7-3V3l-7 3-8-3L1 6z"/><path d="M8 3v15M16 6v15"/></>,
    workflow: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v6M18 9v3a3 3 0 0 1-3 3"/></>,
    tag: <><path d="M20.59 13.41L13.42 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></>,
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></>,
    trendUp: <><path d="M22 7l-9 9-4-4-7 7"/><path d="M16 7h6v6"/></>,
    trendDown: <><path d="M22 17l-9-9-4 4-7-7"/><path d="M16 17h6v-6"/></>,
    minus: <path d="M5 12h14"/>,
    dot: <circle cx="12" cy="12" r="3"/>,
    more: <><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></>,
    moreH: <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
    expand: <><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></>,
    flask: <><path d="M9 3h6v4l4.5 12a2 2 0 0 1-1.9 2.7H6.4a2 2 0 0 1-1.9-2.7L9 7z"/><path d="M9 13h6"/></>,
    hospital: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 7v10M7 12h10"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    folder: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
    layers: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    command: <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    swap: <><path d="M7 16V4M3 8l4-4 4 4"/><path d="M17 8v12M21 16l-4 4-4-4"/></>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    "user-circle": <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3.2"/><path d="M5.6 18.2A6 6 0 0 1 11 15h2a6 6 0 0 1 5.4 3.2"/></>,
    "compass": <><circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    "git": <><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 12h6M18 14v2a2 2 0 0 1-2 2h-2"/></>,
  };
  return <svg {...props}>{paths[name] || paths.dot}</svg>;
};

// ---------- Sparkline ----------
const Sparkline = ({ data = [], width = 80, height = 24, color = "var(--accent)", fill = true, stroke = 1.4 }) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((d, i) => [i * stepX, height - ((d - min) / range) * (height - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${path} L${width},${height} L0,${height} Z`;
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`g-${Math.random().toString(36).slice(2, 7)}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.30" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={color} fillOpacity="0.13" />
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ---------- Bars (small) ----------
const Bars = ({ data, width = 80, height = 24, color = "var(--accent)" }) => {
  if (!data?.length) return null;
  const max = Math.max(...data) || 1;
  const bw = width / data.length - 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((d, i) => {
        const h = Math.max(2, (d / max) * (height - 2));
        return <rect key={i} x={i * (bw + 2)} y={height - h} width={bw} height={h} rx="1" fill={color} fillOpacity={0.9} />;
      })}
    </svg>
  );
};

// ---------- Multi-line chart with axis ----------
const LineChart = ({
  labels = [],
  series = [], // [{name, data, color, dashed}]
  height = 240,
  showLegend = true,
  showGrid = true,
  yFormat = (v) => v,
}) => {
  const containerRef = useRef(null);
  const [w, setW] = useState(800);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.floor(e.contentRect.width));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const padL = 40, padR = 14, padT = 14, padB = 26;
  const innerW = Math.max(40, w - padL - padR);
  const innerH = height - padT - padB;

  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues) * 1.1 || 1;

  const xFor = (i) => padL + (i / Math.max(1, labels.length - 1)) * innerW;
  const yFor = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;

  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => min + ((max - min) * i) / ticks);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg width={w} height={height} className="chart-area">
        {showGrid &&
          tickVals.map((t, i) => (
            <g key={i}>
              <line
                x1={padL}
                x2={w - padR}
                y1={yFor(t)}
                y2={yFor(t)}
                stroke="var(--line-soft)"
                strokeDasharray={i === 0 ? "" : "2 4"}
              />
              <text x={padL - 8} y={yFor(t) + 3} fill="var(--fg-4)" fontSize="10.5" textAnchor="end" fontFamily="var(--font-sans)">
                {yFormat(t)}
              </text>
            </g>
          ))}
        {labels.map((l, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={height - 8}
            fill="var(--fg-4)"
            fontSize="10.5"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
          >
            {l}
          </text>
        ))}
        {series.map((s, idx) => {
          const d = s.data.map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(v)}`).join(" ");
          const area = `${d} L${xFor(s.data.length - 1)},${yFor(min)} L${xFor(0)},${yFor(min)} Z`;
          const gid = `area-${idx}-${Math.random().toString(36).slice(2, 6)}`;
          return (
            <g key={idx}>
              <defs>
                <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={s.fill ? 0.22 : 0} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              {s.fill && <path d={area} fill={`url(#${gid})`} />}
              <path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? "4 4" : ""}
              />
              {s.data.map((v, i) => (
                <circle key={i} cx={xFor(i)} cy={yFor(v)} r="2.5" fill={s.color} />
              ))}
            </g>
          );
        })}
      </svg>
      {showLegend && (
        <div className="row gap-3" style={{ flexWrap: "wrap", paddingLeft: 8 }}>
          {series.map((s) => (
            <span key={s.name} className="row gap-2" style={{ fontSize: 12, color: "var(--fg-3)" }}>
              <span
                style={{
                  width: 10,
                  height: 2,
                  background: s.color,
                  borderRadius: 2,
                  display: "inline-block",
                  marginRight: 0,
                }}
              />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Bar chart (horizontal/vertical) ----------
const BarChart = ({ labels = [], data = [], color = "var(--accent)", height = 200, format = (v) => v }) => {
  const containerRef = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.floor(e.contentRect.width));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  const padL = 30, padR = 14, padT = 12, padB = 26;
  const innerW = Math.max(40, w - padL - padR);
  const innerH = height - padT - padB;
  const max = Math.max(...data) * 1.1 || 1;
  const bw = innerW / data.length - 8;
  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg width={w} height={height} className="chart-area">
        {[0, 0.5, 1].map((p, i) => {
          const y = padT + innerH - innerH * p;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="var(--line-soft)" strokeDasharray={i === 0 ? "" : "2 4"} />
              <text x={padL - 8} y={y + 3} fill="var(--fg-4)" fontSize="10.5" textAnchor="end">
                {format(max * p)}
              </text>
            </g>
          );
        })}
        {data.map((v, i) => {
          const h = (v / max) * innerH;
          const x = padL + 4 + i * (bw + 8);
          return (
            <g key={i}>
              <rect x={x} y={padT + innerH - h} width={bw} height={h} rx="3" fill={color} fillOpacity="0.85" />
              <text x={x + bw / 2} y={height - 8} textAnchor="middle" fill="var(--fg-4)" fontSize="10.5">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------- Donut ----------
const Donut = ({ value = 0, size = 96, stroke = 8, color = "var(--accent)", label, sub }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span className="t-num" style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>
          {label ?? `${value}%`}
        </span>
        {sub && <span style={{ fontSize: 10.5, color: "var(--fg-4)" }}>{sub}</span>}
      </div>
    </div>
  );
};

// ---------- KPI Card ----------
const KpiCard = ({ kpi, onClick, active }) => {
  const toneColor = {
    accent: "var(--accent)",
    success: "var(--success)",
    danger: "var(--danger)",
    warning: "var(--warning)",
    ai: "var(--ai)",
    info: "var(--info)",
  }[kpi.tone || "accent"];
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset",
        cursor: onClick ? "pointer" : "default",
        display: "block",
        borderRadius: "var(--radius-3)",
      }}
    >
      <div
        className="card card-pad fade-in"
        style={{
          padding: "16px 18px",
          position: "relative",
          overflow: "hidden",
          borderColor: active ? "var(--accent-line)" : "var(--line-1)",
          transition: "border-color 0.15s, transform 0.1s",
        }}
      >
        <div className="row gap-2" style={{ marginBottom: 10 }}>
          <span
            style={{
              width: 24, height: 24, borderRadius: 7,
              background: `color-mix(in oklch, ${toneColor} 16%, transparent)`,
              color: toneColor,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name={kpi.icon} size={13} />
          </span>
          <span className="t-eyebrow" style={{ fontSize: 10.5, color: "var(--fg-3)" }}>
            {kpi.label}
          </span>
        </div>
        <div className="row gap-2" style={{ alignItems: "baseline" }}>
          <span className="t-num" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em" }}>
            {kpi.value}
          </span>
          {kpi.unit && <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>{kpi.unit}</span>}
        </div>
        <div className="row gap-3" style={{ justifyContent: "space-between", marginTop: 10 }}>
          <div className="row gap-2">
            <span
              className={kpi.deltaDir === "up" ? "delta-up" : kpi.deltaDir === "down" ? "delta-down" : "delta-flat"}
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Icon name={kpi.deltaDir === "up" ? "trendUp" : kpi.deltaDir === "down" ? "trendDown" : "minus"} size={12} />
              <span style={{ marginLeft: 4 }}>{kpi.delta}</span>
            </span>
            <span style={{ fontSize: 11.5, color: "var(--fg-4)" }}>{kpi.sub}</span>
          </div>
          <div style={{ opacity: 0.9 }}>
            <Sparkline data={kpi.spark} width={70} height={24} color={toneColor} />
          </div>
        </div>
      </div>
    </button>
  );
};

// ---------- AI Badge ----------
const AiBadge = ({ label = "AI", size = "sm", style }) => (
  <span
    className="chip chip-ai"
    style={{
      height: size === "sm" ? 20 : 24,
      fontSize: size === "sm" ? 10.5 : 11.5,
      padding: size === "sm" ? "0 7px" : "0 9px",
      ...style,
    }}
  >
    <Icon name="sparkle" size={size === "sm" ? 10 : 11} />
    {label}
  </span>
);

// ---------- Skeleton ----------
const Skeleton = ({ w = "100%", h = 14, radius = 4 }) => (
  <div className="ai-shimmer" style={{ width: w, height: h, borderRadius: radius }} />
);

// ---------- AI thinking line ----------
const AiThinking = ({ text = "Generando…" }) => (
  <span className="row gap-2" style={{ color: "var(--ai)", fontSize: 12, fontWeight: 500 }}>
    <Icon name="sparkle" size={12} />
    <span>{text}</span>
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </span>
);

// ---------- Risk meter ----------
const RiskBar = ({ value = 0 }) => {
  const tone = value >= 70 ? "var(--danger)" : value >= 40 ? "var(--warning)" : "var(--success)";
  return (
    <div className="row gap-2" style={{ minWidth: 110 }}>
      <div style={{ flex: 1, height: 4, background: "var(--bg-3)", borderRadius: 999 }}>
        <div style={{ width: `${value}%`, height: "100%", background: tone, borderRadius: 999, transition: "width .3s" }} />
      </div>
      <span className="t-mono" style={{ color: "var(--fg-2)", fontSize: 11.5, minWidth: 28, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
};

// ---------- Status pill mapping ----------
const StatusPill = ({ status }) => {
  const map = {
    ok: { label: "Saludable", cls: "chip-success", icon: "check" },
    warn: { label: "Atención", cls: "chip-warning", icon: "alert" },
    risk: { label: "En riesgo", cls: "chip-warning", icon: "alert" },
    critical: { label: "Crítico", cls: "chip-danger", icon: "alert" },
    active: { label: "Activa", cls: "chip-success", icon: "play" },
    draft: { label: "Borrador", cls: "chip", icon: "pencil" },
    paused: { label: "Pausada", cls: "chip-warning", icon: "pause" },
    ready: { label: "Listo", cls: "chip-success", icon: "check" },
    open: { label: "Abierta", cls: "chip-danger", icon: "dot" },
    ack: { label: "Reconocida", cls: "chip-warning", icon: "dot" },
    resolved: { label: "Resuelta", cls: "chip", icon: "check" },
  };
  const m = map[status] || { label: status, cls: "chip", icon: "dot" };
  return (
    <span className={`chip ${m.cls}`}>
      <Icon name={m.icon} size={11} />
      {m.label}
    </span>
  );
};

// ---------- Empty state ----------
const Empty = ({ title, sub, action }) => (
  <div className="col" style={{ alignItems: "center", justifyContent: "center", padding: 32, gap: 8 }}>
    <Icon name="search" size={20} style={{ color: "var(--fg-4)" }} />
    <div className="t-h3">{title}</div>
    {sub && <div className="t-small" style={{ textAlign: "center", maxWidth: 320 }}>{sub}</div>}
    {action}
  </div>
);

export { Icon, Sparkline, Bars, LineChart, BarChart, Donut, KpiCard, AiBadge, Skeleton, AiThinking, RiskBar, StatusPill, Empty };
