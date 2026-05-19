import { motion, AnimatePresence } from "framer-motion";
import { sevColor, type Severity } from "@/lib/sim";

interface Defect {
  id: string;
  name: string;
  conf: number;
  sev: Severity;
  region: string;
  signal: string;
  ts: string;
  impact: string;
}

const DEFECTS: Defect[] = [
  { id: "AN-074", name: "Porosity cluster", conf: 0.86, sev: "CRITICAL", region: "ROI-03 · Bead 540-670", signal: "MIG-V ripple ↑", ts: "T+42:18.412", impact: "Reject probability 0.72" },
  { id: "AN-071", name: "Arc voltage instability", conf: 0.78, sev: "HIGH", region: "Global", signal: "Arc Stability Idx ↓", ts: "T+41:52.880", impact: "Bead consistency −12%" },
  { id: "AN-068", name: "Penetration anomaly", conf: 0.64, sev: "MODERATE", region: "ROI-02", signal: "Current ↑ 8%", ts: "T+40:21.104", impact: "Strength margin −6%" },
  { id: "AN-064", name: "Spatter rate elevated", conf: 0.59, sev: "MODERATE", region: "Pool", signal: "HF Noise band", ts: "T+38:11.700", impact: "Rework risk" },
  { id: "AN-061", name: "Ripple inconsistency", conf: 0.52, sev: "LOW", region: "Bead 200-340", signal: "Encoder Δ", ts: "T+36:02.030", impact: "Cosmetic" },
];

const ACTIONS = [
  { txt: "Reduce wire feed by 4%", urg: "HIGH", conf: 0.81, impact: "+8% bead stability" },
  { txt: "Inspect shielding gas flow (Ar/CO₂)", urg: "HIGH", conf: 0.74, impact: "Eliminate porosity" },
  { txt: "Stabilize arc voltage setpoint to 24.6 V", urg: "MED", conf: 0.69, impact: "+11% arc index" },
  { txt: "Torch angle correction −3°", urg: "LOW", conf: 0.58, impact: "Ripple uniformity" },
];

const PREDICTIONS = [
  { k: "Process degradation", v: "12% in 45 min", sev: "HIGH" as Severity },
  { k: "Failure probability", v: "0.27 next hour", sev: "MODERATE" as Severity },
  { k: "Stability window left", v: "≈ 38 min", sev: "MODERATE" as Severity },
  { k: "Projected defect rate", v: "2.1% (Δ +0.7)", sev: "HIGH" as Severity },
  { k: "Thermal trend", v: "↑ 14°C/h", sev: "MODERATE" as Severity },
];

export function AIDefectPanel() {
  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title">AI Defect Intelligence</span>
          <span className="chip chip-stable mono">MODEL · WELD-VISION-v4.2</span>
        </div>
        <span className="chip mono">14 active · 3 critical</span>
      </div>

      <div className="flex-1 overflow-auto">
        <Section title="Active Defects · Live">
          <ul className="divide-y divide-border">
            <AnimatePresence>
              {DEFECTS.map((d) => (
                <motion.li
                  key={d.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="dot" style={{ background: sevColor[d.sev] }} />
                        <span className="text-[13px] font-medium text-foreground truncate">{d.name}</span>
                        <span className="mono text-[10px] text-muted-foreground">{d.id}</span>
                      </div>
                      <div className="mt-0.5 mono text-[10.5px] text-muted-foreground">
                        {d.region} · {d.signal} · {d.ts}
                      </div>
                      <div className="mt-0.5 text-[11px] text-foreground/80">{d.impact}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="mono text-[14px] text-foreground">{(d.conf * 100).toFixed(0)}<span className="text-[10px] text-muted-foreground">%</span></div>
                      <span className={`chip ${d.sev === "CRITICAL" ? "chip-critical" : d.sev === "HIGH" ? "chip-high" : d.sev === "MODERATE" ? "chip-warn" : "chip-stable"}`}>
                        {d.sev}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 w-full bg-surface-3 rounded">
                    <div className="h-1 rounded" style={{ width: `${d.conf * 100}%`, background: sevColor[d.sev] }} />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Section>

        <Section title="Recommended Actions">
          <ul className="px-3 py-2 space-y-1.5">
            {ACTIONS.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-[12px] bg-surface-2 border border-border rounded px-2 py-1.5">
                <span className={`chip ${a.urg === "HIGH" ? "chip-critical" : a.urg === "MED" ? "chip-warn" : "chip-stable"}`}>{a.urg}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground truncate">{a.txt}</div>
                  <div className="mono text-[10px] text-muted-foreground">conf {(a.conf * 100).toFixed(0)}% · {a.impact}</div>
                </div>
                <button className="text-[10.5px] mono px-2 py-0.5 rounded border border-border-strong bg-surface-3 hover:bg-surface text-foreground">APPLY</button>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Predictive Analytics · Next 60 min">
          <div className="px-3 py-2 grid grid-cols-1 gap-1.5">
            {PREDICTIONS.map((p) => (
              <div key={p.k} className="flex items-center justify-between bg-surface-2 border border-border rounded px-2 py-1.5">
                <span className="text-[11.5px] text-muted-foreground uppercase tracking-wider">{p.k}</span>
                <div className="flex items-center gap-2">
                  <span className="mono text-[12px] text-foreground">{p.v}</span>
                  <span className="dot" style={{ background: sevColor[p.sev] }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border last:border-0">
      <div className="px-3 pt-2.5 pb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">{title}</div>
      {children}
    </div>
  );
}
