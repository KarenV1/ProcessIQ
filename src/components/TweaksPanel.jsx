import React, { useState, useEffect, useRef } from "react";
import { Icon } from "./primitives.jsx";

const STORAGE_KEY = "processiq-tweaks-v1";

export function useTweaks(defaults) {
  const [state, setState] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return { ...defaults, ...(stored || {}) };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {/* ignore quota errors */}
  }, [state]);

  const setTweak = (key, value) => {
    if (typeof key === "object" && key !== null) {
      setState((s) => ({ ...s, ...key }));
    } else {
      setState((s) => ({ ...s, [key]: value }));
    }
  };

  return [state, setTweak];
}

export function TweaksPanel({ title = "Tweaks", children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [pos, setPos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY + "-pos") || "null") || { x: 20, y: 80 };
    } catch {
      return { x: 20, y: 80 };
    }
  });
  const dragRef = useRef(null);
  const dragging = useRef(null);

  useEffect(() => {
    if (!dragging.current) return;
    const onMove = (e) => {
      if (!dragging.current) return;
      const x = Math.max(8, Math.min(window.innerWidth - 280, e.clientX - dragging.current.dx));
      const y = Math.max(8, Math.min(window.innerHeight - 80, e.clientY - dragging.current.dy));
      setPos({ x, y });
    };
    const onUp = () => {
      if (dragging.current) {
        try { localStorage.setItem(STORAGE_KEY + "-pos", JSON.stringify(pos)); } catch {/* ignore */}
      }
      dragging.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  });

  const startDrag = (e) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    dragging.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            left: 20,
            bottom: 20,
            zIndex: 80,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--bg-2)",
            border: "1px solid var(--line-2)",
            color: "var(--fg-1)",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "var(--font-sans)",
            boxShadow: "var(--shadow-pop)",
          }}
        >
          <Icon name="config" size={13} />
          {title}
        </button>
      )}
      {open && (
        <div
          ref={dragRef}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: 280,
            background: "var(--bg-1)",
            border: "1px solid var(--line-2)",
            borderRadius: 12,
            boxShadow: "var(--shadow-pop)",
            zIndex: 80,
            overflow: "hidden",
            fontFamily: "var(--font-sans)",
          }}
        >
          <div
            onMouseDown={startDrag}
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid var(--line-1)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "move",
              userSelect: "none",
              background: "var(--bg-2)",
            }}
          >
            <Icon name="config" size={13} style={{ color: "var(--fg-3)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", flex: 1 }}>
              {title}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                all: "unset",
                cursor: "pointer",
                color: "var(--fg-4)",
                display: "flex",
                padding: 4,
              }}
            >
              <Icon name="x" size={12} />
            </button>
          </div>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
        </div>
      )}
    </>
  );
}

export function TweakSection({ title, children }) {
  return (
    <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line-soft)" }}>
      {title && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg-4)",
            marginBottom: 10,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{label}</span>
      {children}
    </div>
  );
}

export function TweakRadio({ label, value, options, onChange }) {
  return (
    <Row label={label}>
      <div
        style={{
          display: "flex",
          padding: 3,
          background: "var(--bg-2)",
          border: "1px solid var(--line-1)",
          borderRadius: 9,
          gap: 2,
        }}
      >
        {options.map((o) => {
          const isObj = typeof o === "object";
          const v = isObj ? o.value : o;
          const l = isObj ? o.label : o;
          const active = v === value;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              style={{
                flex: 1,
                background: active ? "var(--bg-0)" : "transparent",
                border: 0,
                color: active ? "var(--fg-1)" : "var(--fg-3)",
                fontSize: 11.5,
                fontWeight: 500,
                padding: "6px 9px",
                borderRadius: 6,
                cursor: "pointer",
                boxShadow: active ? "var(--shadow-1)" : "none",
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
    </Row>
  );
}

export function TweakSelect({ label, value, options, onChange }) {
  return (
    <Row label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 30,
          padding: "0 10px",
          background: "var(--bg-2)",
          border: "1px solid var(--line-1)",
          borderRadius: 8,
          color: "var(--fg-1)",
          fontSize: 12,
          fontFamily: "inherit",
        }}
      >
        {options.map((o) => {
          const isObj = typeof o === "object";
          const v = isObj ? o.value : o;
          const l = isObj ? o.label : o;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </Row>
  );
}

export function TweakToggle({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 30,
          height: 18,
          padding: 2,
          background: value ? "var(--accent)" : "var(--bg-3)",
          border: "1px solid var(--line-1)",
          borderRadius: 999,
          cursor: "pointer",
          display: "flex",
          justifyContent: value ? "flex-end" : "flex-start",
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "var(--bg-0)",
          }}
        />
      </button>
    </div>
  );
}
