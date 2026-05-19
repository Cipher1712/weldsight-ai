import { motion } from "framer-motion";

const MAINT = [
  { comp: "Wire Feeder · WS-07", state: "DEGRADED", eta: "≈ 38 h", risk: 0.74, action: "Replace drive rollers" },
  { comp: "Torch Nozzle · WS-03", state: "WEAR",     eta: "≈ 12 h", risk: 0.61, action: "Tip cleaning + swap" },
  { comp: "Gas Regulator · WS-07", state: "ANOMALY",  eta: "now",     risk: 0.88, action: "Inspect Ar/CO₂ supply" },
  { comp: "Coolant Pump · WS-06", state: "TREND",    eta: "≈ 96 h", risk: 0.42, action: "Schedule descaling" },
  { comp: "Encoder · WS-05",     state: "OK",       eta: "—",       risk: 0.08, action: "No action" },
];

const stCls: Record<string, string> = {
  DEGRADED: "chip-high", WEAR: "chip-warn", ANOMALY: "chip-critical", TREND: "chip-warn", OK: "chip-stable",
};

export function PredictiveMaintenance() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title">Predictive Maintenance</span>
          <span className="chip mono">RUL · forecast 7d</span>
        </div>
        <span className="chip chip-high mono">2 high-risk</span>
      </div>
      <div className="flex-1 overflow-auto">
        <ul className="divide-y divide-border">
          {MAINT.map((m, i) => (
            <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-2 hover:bg-surface-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] text-foreground">{m.comp}</div>
                <span className={`chip ${stCls[m.state]}`}>{m.state}</span>
              </div>
              <div className="mt-1 grid grid-cols-3 gap-2 mono text-[10.5px]">
                <div><span className="text-muted-foreground">RUL </span><span className="text-foreground">{m.eta}</span></div>
                <div><span className="text-muted-foreground">RISK </span><span className="text-foreground">{(m.risk * 100).toFixed(0)}%</span></div>
                <div className="text-right text-muted-foreground truncate">{m.action}</div>
              </div>
              <div className="mt-1.5 h-1 bg-surface-3 rounded overflow-hidden">
                <div className="h-1" style={{
                  width: `${m.risk * 100}%`,
                  background: m.risk > 0.7 ? "var(--color-critical)" : m.risk > 0.4 ? "var(--color-warn)" : "var(--color-stable)"
                }} />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
