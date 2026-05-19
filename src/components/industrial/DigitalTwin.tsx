interface Node {
  id: string; x: number; y: number; status: "STABLE" | "WARN" | "CRIT" | "IDLE"; label: string;
}

const NODES: Node[] = [
  { id: "WS-01", x: 12, y: 28, status: "STABLE", label: "HRC" },
  { id: "WS-02", x: 22, y: 28, status: "STABLE", label: "HRC" },
  { id: "WS-03", x: 32, y: 28, status: "WARN",   label: "HRC" },
  { id: "WS-07", x: 42, y: 28, status: "CRIT",   label: "HRC" },
  { id: "WS-04", x: 18, y: 56, status: "STABLE", label: "CRC" },
  { id: "WS-05", x: 32, y: 56, status: "STABLE", label: "CRC" },
  { id: "WS-06", x: 46, y: 56, status: "WARN",   label: "PLT" },
  { id: "WS-08", x: 60, y: 56, status: "STABLE", label: "PLT" },
  { id: "WS-09", x: 74, y: 40, status: "IDLE",   label: "TUB" },
  { id: "WS-10", x: 84, y: 40, status: "STABLE", label: "TUB" },
];

const color = (s: Node["status"]) =>
  s === "CRIT" ? "var(--color-critical)" :
  s === "WARN" ? "var(--color-warn)" :
  s === "STABLE" ? "var(--color-stable)" : "var(--color-muted-foreground)";

export function DigitalTwin() {
  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title">Digital Twin · Plant Floor JSR-01</span>
          <span className="chip mono">4 lines · 10 stations</span>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] mono">
          {(["STABLE", "WARN", "CRIT", "IDLE"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="dot" style={{ background: color(s) }} />
              <span className="text-muted-foreground">{s}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="relative h-[280px] grid-bg">
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {/* line lanes */}
          {[28, 56].map((y) => (
            <g key={y}>
              <rect x="8" y={y - 4} width="62" height="8" fill="oklch(0.24 0.013 240)" stroke="var(--color-border)" />
              <line x1="8" y1={y} x2="70" y2={y} stroke="var(--color-cyan)" strokeOpacity="0.35" strokeDasharray="1 1.5" />
            </g>
          ))}
          {/* tube line */}
          <rect x="70" y="36" width="22" height="8" fill="oklch(0.24 0.013 240)" stroke="var(--color-border)" />
          {/* labels */}
          <text x="8" y="20" fontSize="2.6" fill="var(--color-muted-foreground)" fontFamily="var(--font-mono)">HRC-LINE-04 → SLITTER</text>
          <text x="8" y="48" fontSize="2.6" fill="var(--color-muted-foreground)" fontFamily="var(--font-mono)">CRC-LINE-02 / PLATE-MILL</text>
          <text x="70" y="32" fontSize="2.6" fill="var(--color-muted-foreground)" fontFamily="var(--font-mono)">TUBE-MILL-03</text>

          {/* flow direction */}
          <text x="68" y="28" fontSize="3" fill="var(--color-cyan)">▶</text>
          <text x="68" y="56" fontSize="3" fill="var(--color-cyan)">▶</text>

          {/* nodes */}
          {NODES.map((n) => (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              <circle r="3" fill={color(n.status)} opacity="0.2" />
              <circle r="1.6" fill={color(n.status)} />
              <text y="-3.5" fontSize="2" textAnchor="middle" fontFamily="var(--font-mono)" fill="var(--color-foreground)">{n.id}</text>
              <text y="5.5" fontSize="1.7" textAnchor="middle" fontFamily="var(--font-mono)" fill="var(--color-muted-foreground)">{n.label}</text>
              {n.status === "CRIT" && (
                <circle r="4.5" fill="none" stroke="var(--color-critical)" strokeWidth="0.3">
                  <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
