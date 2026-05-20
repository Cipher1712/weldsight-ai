import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  spike: number; // 0..1, drives overlay intensity
}

export function WeldInspectionView({ spike }: Props) {
  const [opacity, setOpacity] = useState(0.55);
  const [mode, setMode] = useState<"AI" | "THERMAL" | "SEG" | "ANOM">("AI");
  const [t, setT] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      ref.current += 1;
      setT(ref.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const arc = 0.6 + 0.4 * Math.abs(Math.sin(t / 18));
  const fps = (58.7 + Math.sin(t / 30) * 1.3 + (Math.random() - 0.5) * 0.15).toFixed(2);
  const encoder = (1284.62 + Math.sin(t / 14) * 0.8 + t * 0.0021).toFixed(3);
  const weldSpeed = (38.2 + Math.sin(t / 22) * 0.6).toFixed(2);
  const sync = (0.38 + Math.abs(Math.sin(t / 40)) * 0.18).toFixed(2);
  const packets = (99.982 - Math.abs(Math.sin(t / 60)) * 0.008).toFixed(3);
  const dropped = Math.max(0, Math.floor(2 + Math.sin(t / 80) * 1.5));
  const aiConf = (0.94 - spike * 0.12 + Math.sin(t / 25) * 0.01).toFixed(3);
  const thermal = (412 + Math.sin(t / 18) * 6 + spike * 14).toFixed(0);
  const frameId = (t * 2).toString().padStart(7, "0");

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="panel-title">Live Weld Inspection</span>
          <span className="mono text-[10px] text-muted-foreground">·</span>
          <span className="mono text-[10px] text-foreground">WS-07 / MIG-CAM-02 / EDGE-JTX-07</span>
          <span className="chip chip-stable ml-1">
            <span className="dot pulse-critical" style={{ background: "var(--color-critical)" }} />
            RTSP · REC
          </span>
          <span className="chip mono">1920×1080 · {fps} FPS</span>
          <span className="chip mono">H.265 · 8 Mbps</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] mono">
          {(["AI", "THERMAL", "SEG", "ANOM"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2 py-1 rounded border ${
                mode === m
                  ? "bg-surface-3 border-border-strong text-foreground"
                  : "bg-surface-2 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Viewport */}
      <div className="relative flex-1 overflow-hidden bg-[oklch(0.12_0.01_240)]">
        {/* Weld plate background — simulated */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <defs>
              <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="oklch(0.28 0.01 240)" />
                <stop offset="0.5" stopColor="oklch(0.22 0.01 240)" />
                <stop offset="1" stopColor="oklch(0.16 0.008 240)" />
              </linearGradient>
              <linearGradient id="bead" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="oklch(0.55 0.04 60)" />
                <stop offset="0.3" stopColor="oklch(0.7 0.12 55)" />
                <stop offset="0.55" stopColor="oklch(0.85 0.18 70)" />
                <stop offset="0.8" stopColor="oklch(0.62 0.1 50)" />
                <stop offset="1" stopColor="oklch(0.45 0.05 50)" />
              </linearGradient>
              <radialGradient id="arc" cx="0.55" cy="0.5" r="0.18">
                <stop offset="0" stopColor="oklch(0.98 0.04 90)" stopOpacity={arc} />
                <stop offset="0.4" stopColor="oklch(0.85 0.18 70)" stopOpacity={arc * 0.6} />
                <stop offset="1" stopColor="oklch(0.4 0.05 50)" stopOpacity="0" />
              </radialGradient>
              <pattern id="brushed" width="3" height="3" patternUnits="userSpaceOnUse">
                <path d="M0 1.5 L3 1.5" stroke="oklch(1 0 0 / 0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="450" fill="url(#plate)" />
            <rect width="800" height="450" fill="url(#brushed)" />
            {/* Weld bead ripples */}
            <g>
              {Array.from({ length: 40 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${i * 22 - 10} 230 q 11 ${-8 - (i % 3) * 2} 22 0`}
                  stroke="oklch(0.45 0.06 55)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.5"
                />
              ))}
            </g>
            <rect x="0" y="216" width="800" height="32" fill="url(#bead)" />
            {/* Live arc / molten pool */}
            <circle cx={420 + Math.sin(t / 10) * 6} cy={232} r={70} fill="url(#arc)" />
            {/* spatter */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={420 + Math.cos(i + t / 5) * (30 + i * 3)}
                cy={232 + Math.sin(i + t / 5) * (20 + i * 2)}
                r={Math.random() * 1.2 + 0.3}
                fill="oklch(0.9 0.15 80)"
                opacity={0.5 + Math.random() * 0.4}
              />
            ))}
          </svg>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-[0.18] pointer-events-none" />

        {/* AI overlays */}
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ opacity }}
        >
          {mode === "AI" && (
            <>
              {/* ROI boxes */}
              <g fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-cyan)">
                <rect x="160" y="190" width="120" height="70" stroke="var(--color-stable)" strokeWidth="1.2" fill="none" />
                <text x="162" y="186" fill="var(--color-stable)">ROI-01 · STABLE 0.97</text>

                <rect x="360" y="180" width="140" height="92" stroke="var(--color-warn)" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
                <text x="362" y="176" fill="var(--color-warn)">ROI-02 · RIPPLE δ 0.42</text>

                <rect x="540" y="200" width="130" height="64" stroke="var(--color-critical)" strokeWidth="1.6" fill="none" />
                <text x="542" y="196" fill="var(--color-critical)">ROI-03 · POROSITY p=0.86 ◆ TELEM-LINK</text>
                <rect x="540" y="200" width="130" height="64" fill="var(--color-critical)" opacity={0.06 + spike * 0.25} />
              </g>
              {/* Cross-hair tracker on pool */}
              <g stroke="var(--color-cyan)" strokeWidth="1">
                <circle cx={420 + Math.sin(t / 10) * 6} cy="232" r="38" fill="none" />
                <line x1="0" y1="232" x2="800" y2="232" opacity="0.25" strokeDasharray="2 4" />
                <line x1={420 + Math.sin(t / 10) * 6} y1="0" x2={420 + Math.sin(t / 10) * 6} y2="450" opacity="0.25" strokeDasharray="2 4" />
              </g>
            </>
          )}
          {mode === "THERMAL" && (
            <g>
              {Array.from({ length: 60 }).map((_, i) => (
                <rect
                  key={i}
                  x={(i % 20) * 40}
                  y={Math.floor(i / 20) * 100 + 150}
                  width="40"
                  height="100"
                  fill={`oklch(${0.5 + Math.random() * 0.4} 0.18 ${30 + Math.random() * 50})`}
                  opacity="0.55"
                />
              ))}
            </g>
          )}
          {mode === "SEG" && (
            <g>
              <path d="M 0 220 Q 200 200 400 224 T 800 220 L 800 248 Q 600 270 400 244 T 0 248 Z"
                    fill="var(--color-cyan)" opacity="0.3" />
              <path d="M 540 210 q 30 -8 60 4 q 20 14 50 6 l 0 50 q -40 8 -70 -4 q -20 -10 -40 -2 Z"
                    fill="var(--color-critical)" opacity={0.35 + spike * 0.3} />
            </g>
          )}
          {mode === "ANOM" && (
            <g>
              <circle cx="600" cy="232" r={18 + spike * 14} fill="var(--color-critical)" opacity="0.5" />
              <circle cx="600" cy="232" r={32 + spike * 18} fill="none" stroke="var(--color-critical)" />
              <text x="624" y="228" fontSize="10" fontFamily="var(--font-mono)" fill="var(--color-critical)">
                ANOM-074 · POROSITY · 0.86
              </text>
            </g>
          )}
        </svg>

        {/* Calibration corner markers */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          {[[8, 8], [8, "calc(100% - 8px)"], ["calc(100% - 8px)", 8], ["calc(100% - 8px)", "calc(100% - 8px)"]].map((p, i) => (
            <g key={i} stroke="var(--color-cyan)" strokeWidth="1" opacity="0.6">
              <line x1={p[0] as any} y1={p[1] as any} x2={`calc(${p[0]} ${typeof p[0]==='string'&&p[0].includes('100%')?'+':'+ '}10px)` as any} y2={p[1] as any} />
            </g>
          ))}
        </svg>

        {/* HUD telemetry — left column (vision/edge) */}
        <div className="absolute top-2 left-2 flex flex-col gap-[3px] text-[10px] mono">
          {[
            ["INFER",   "YOLOv8-WELD-INT8 · v4.2", "ok"],
            ["EDGE",    "EDGE-JTX-07 · Orin 47.2°C", "ok"],
            ["LAT",     "12.4 ms", "ok"],
            ["FRAME",   `#${frameId}`, "muted"],
            ["TS",      "2026-05-20T14:42:18.412Z", "muted"],
            ["ENC",     `${encoder} mm · Δ +0.021`, "ok"],
            ["PKT",     `${packets}% · drop ${dropped}/10⁴`, dropped > 2 ? "warn" : "ok"],
            ["SYNC",    `OPC-BUS-A Δ ${sync} ms`, "ok"],
          ].map(([k, v, tone]) => (
            <div key={k as string} className="flex items-center gap-2 bg-[oklch(0.12_0.01_240/0.72)] border border-border px-1.5 py-[1px] rounded-sm">
              <span className="text-muted-foreground w-10">{k}</span>
              <span style={{ color: tone === "warn" ? "var(--color-warn)" : tone === "muted" ? "var(--color-muted-foreground)" : "var(--color-cyan)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* HUD telemetry — right column (process/AI) */}
        <div className="absolute top-2 right-2 flex flex-col gap-[3px] text-[10px] mono items-end">
          <div className="chip chip-stable">AI OVERLAY · ON</div>
          {[
            ["AI CONF",  aiConf, Number(aiConf) < 0.85 ? "warn" : "ok"],
            ["SPEED",    `${weldSpeed} cm/min`, "ok"],
            ["PYRO",     `${thermal} °C`, Number(thermal) > 420 ? "warn" : "ok"],
            ["WIRE",     "8.2 m/min · ER70S-6", "ok"],
            ["GAS",      "Ar/CO₂ 82/18 · 14 L/min", "ok"],
            ["PLC",      "PLC-HRC-04 · RUN", "ok"],
            ["ZOOM",     "1.00× · F-AUTO", "muted"],
            ["ROI",      "X 540 Y 200 W 130 H 64", "muted"],
          ].map(([k, v, tone]) => (
            <div key={k as string} className="flex items-center gap-2 bg-[oklch(0.12_0.01_240/0.72)] border border-border px-1.5 py-[1px] rounded-sm">
              <span className="text-muted-foreground">{k}</span>
              <span style={{ color: tone === "warn" ? "var(--color-warn)" : tone === "muted" ? "var(--color-muted-foreground)" : "var(--color-cyan)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Bottom HUD bar */}
        <div className="absolute inset-x-0 bottom-0 bg-[oklch(0.12_0.01_240/0.88)] border-t border-border px-3 py-2 flex items-center gap-3 text-[10.5px] mono">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">OVERLAY</span>
            <input
              type="range" min={0} max={100} value={opacity * 100}
              onChange={(e) => setOpacity(Number(e.target.value) / 100)}
              className="accent-cyan h-1 w-24"
            />
            <span className="text-foreground w-8">{Math.round(opacity * 100)}%</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <Btn>◀◀</Btn><Btn>⏸</Btn><Btn>▶</Btn><Btn>▶▶</Btn>
          <div className="h-4 w-px bg-border" />
          {/* timeline */}
          <div className="relative flex-1 h-6">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-surface-3 rounded" />
            <div className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-cyan rounded" style={{ width: `${((t / 4) % 100)}%` }} />
            {[18, 34, 51, 67, 82].map((p) => (
              <div key={p} className="absolute top-1/2 -translate-y-1/2 h-3 w-0.5"
                   style={{ left: `${p}%`, background: p === 82 ? "var(--color-critical)" : p === 67 ? "var(--color-warn)" : "var(--color-stable)" }} />
            ))}
          </div>
          <div className="text-muted-foreground">T+ <span className="text-foreground">00:42:18.412</span></div>
          <Btn>⛶</Btn>
        </div>
      </div>
    </div>
  );
}

function Btn({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-2 py-0.5 rounded bg-surface-2 border border-border text-foreground hover:bg-surface-3">
      {children}
    </button>
  );
}
