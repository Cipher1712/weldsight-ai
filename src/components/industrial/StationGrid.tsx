import { motion } from "framer-motion";

type S = "STABLE" | "WARN" | "CRIT" | "IDLE";

interface Station {
  id: string; line: string; op: string; status: S;
  throughput: number; defect: number; ai: number; thermal: number; anomalies: number;
}

const STATIONS: Station[] = [
  { id: "WS-01", line: "HRC-04", op: "MIG · Stitch", status: "STABLE", throughput: 98, defect: 0.6, ai: 0.97, thermal: 412, anomalies: 0 },
  { id: "WS-02", line: "HRC-04", op: "MIG · Long",   status: "STABLE", throughput: 94, defect: 0.9, ai: 0.95, thermal: 438, anomalies: 1 },
  { id: "WS-03", line: "HRC-04", op: "TIG · Trim",   status: "WARN",   throughput: 71, defect: 2.4, ai: 0.82, thermal: 502, anomalies: 4 },
  { id: "WS-04", line: "CRC-02", op: "Spot",         status: "STABLE", throughput: 102, defect: 0.4, ai: 0.98, thermal: 388, anomalies: 0 },
  { id: "WS-05", line: "CRC-02", op: "MIG · Long",   status: "STABLE", throughput: 96, defect: 0.7, ai: 0.93, thermal: 421, anomalies: 1 },
  { id: "WS-06", line: "PLT-01", op: "Submerged",    status: "WARN",   throughput: 64, defect: 1.8, ai: 0.86, thermal: 488, anomalies: 3 },
  { id: "WS-07", line: "HRC-04", op: "MIG · Long",   status: "CRIT",   throughput: 58, defect: 3.7, ai: 0.74, thermal: 561, anomalies: 7 },
  { id: "WS-08", line: "PLT-01", op: "TIG · Root",   status: "STABLE", throughput: 88, defect: 0.5, ai: 0.96, thermal: 402, anomalies: 0 },
  { id: "WS-09", line: "TUB-03", op: "ERW",          status: "IDLE",   throughput: 0,  defect: 0,   ai: 0,    thermal: 240, anomalies: 0 },
  { id: "WS-10", line: "TUB-03", op: "ERW",          status: "STABLE", throughput: 110,defect: 0.3, ai: 0.99, thermal: 396, anomalies: 0 },
];

const tone = (s: S) => s === "CRIT" ? "critical" : s === "WARN" ? "warn" : s === "STABLE" ? "stable" : "muted";

export function StationGrid() {
  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <span className="panel-title">Multi-Station Monitoring · Plant JSR-01</span>
          <span className="chip mono">10 stations · 4 lines · 1 critical</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] mono">
          {["ALL", "HRC", "CRC", "PLT", "TUB"].map((f, i) => (
            <button key={f} className={`px-2 py-1 rounded border ${i === 0 ? "bg-surface-3 border-border-strong text-foreground" : "bg-surface-2 border-border text-muted-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-px bg-border">
        {STATIONS.map((s) => <StationCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}

function StationCard({ s }: { s: Station }) {
  const t = tone(s.status);
  const chipCls = t === "critical" ? "chip-critical" : t === "warn" ? "chip-warn" : t === "stable" ? "chip-stable" : "";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-panel p-2.5 hover:bg-surface-2 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`dot ${s.status === "CRIT" ? "pulse-critical" : ""}`} style={{
            background: t === "critical" ? "var(--color-critical)" : t === "warn" ? "var(--color-warn)" : t === "stable" ? "var(--color-stable)" : "var(--color-muted-foreground)"
          }} />
          <span className="mono text-[12px] font-semibold text-foreground">{s.id}</span>
          <span className="mono text-[10px] text-muted-foreground">{s.line}</span>
        </div>
        <span className={`chip ${chipCls}`}>{s.status}</span>
      </div>

      {/* mini thumbnail */}
      <div className="relative h-14 mt-2 rounded border border-border overflow-hidden bg-[oklch(0.14_0.01_240)]">
        <svg viewBox="0 0 200 56" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`b${s.id}`} x1="0" x2="1">
              <stop offset="0" stopColor="oklch(0.55 0.05 60)" />
              <stop offset="0.5" stopColor="oklch(0.78 0.16 70)" />
              <stop offset="1" stopColor="oklch(0.5 0.05 50)" />
            </linearGradient>
          </defs>
          <rect width="200" height="56" fill="oklch(0.2 0.01 240)" />
          {s.status !== "IDLE" && <rect y="24" width="200" height="10" fill={`url(#b${s.id})`} />}
          {s.status !== "IDLE" && <circle cx={s.status === "CRIT" ? 130 : 100} cy="29" r="9" fill="oklch(0.95 0.05 90)" opacity="0.8" />}
          {s.status === "CRIT" && <rect x="115" y="20" width="35" height="18" fill="none" stroke="var(--color-critical)" strokeWidth="1" />}
          {s.status === "WARN" && <rect x="60" y="20" width="40" height="18" fill="none" stroke="var(--color-warn)" strokeWidth="1" strokeDasharray="3 2" />}
        </svg>
        <span className="absolute bottom-0.5 left-1 mono text-[9px] text-muted-foreground">{s.op}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 mono text-[10.5px]">
        <Stat k="THP"   v={`${s.throughput}/h`} />
        <Stat k="DEF"   v={`${s.defect.toFixed(1)}%`} tone={s.defect > 2 ? "crit" : s.defect > 1 ? "warn" : "ok"} />
        <Stat k="AI"    v={s.ai ? `${(s.ai * 100).toFixed(0)}%` : "—"} />
        <Stat k="TEMP"  v={`${s.thermal}°C`} tone={s.thermal > 500 ? "crit" : s.thermal > 450 ? "warn" : "ok"} />
        <Stat k="ANOM"  v={`${s.anomalies}`} tone={s.anomalies > 3 ? "crit" : s.anomalies > 0 ? "warn" : "ok"} />
        <Stat k="MODE"  v={s.status === "IDLE" ? "STOP" : "RUN"} />
      </div>
    </motion.div>
  );
}

function Stat({ k, v, tone = "ok" }: { k: string; v: string; tone?: "ok" | "warn" | "crit" }) {
  const c = tone === "crit" ? "var(--color-critical)" : tone === "warn" ? "var(--color-warn)" : "var(--color-foreground)";
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span style={{ color: c }}>{v}</span>
    </div>
  );
}
