import { motion } from "framer-motion";

const EVENTS = [
  { t: "T+42:18.412", sev: "CRITICAL", node: "WS-07 · VISION", msg: "Porosity cluster propagated → telemetry MIG-V ripple ↑ 18% → AI inferred AN-074 → maintenance risk ↑" },
  { t: "T+41:52.880", sev: "HIGH",     node: "WS-07 · TELEMETRY", msg: "Arc Stability Idx dropped 0.91 → 0.78 across 4 sync frames" },
  { t: "T+40:21.104", sev: "MOD",      node: "WS-03 · VISION", msg: "Penetration anomaly · ROI-02 segmentation 0.64 conf" },
  { t: "T+38:11.700", sev: "MOD",      node: "WS-07 · EDGE",  msg: "HF spectral band 4.2–6.1 kHz elevated · spatter rate +12%" },
  { t: "T+36:02.030", sev: "LOW",      node: "WS-05 · PLC",   msg: "Encoder Δ correction applied · bead ripple stabilized" },
  { t: "T+34:50.220", sev: "INFO",     node: "WELD-VISION",   msg: "Model v4.2 hot-loaded · 0 dropped frames" },
];

const sevCls: Record<string, string> = {
  CRITICAL: "chip-critical", HIGH: "chip-high", MOD: "chip-warn", LOW: "chip-stable", INFO: "chip",
};

export function SyncTimeline() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title-serif">Synchronization Timeline</span>
          <span className="chip mono">vision ↔ telemetry ↔ AI ↔ PLC</span>
        </div>
        <span className="chip chip-stable mono">drift 0.4 ms</span>
      </div>
      <div className="flex-1 overflow-auto px-3 py-2">
        <ol className="relative border-l border-border ml-2 space-y-2.5">
          {EVENTS.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="pl-3 relative"
            >
              <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-border-strong"
                style={{ background:
                  e.sev === "CRITICAL" ? "var(--color-critical)" :
                  e.sev === "HIGH"     ? "var(--color-high)" :
                  e.sev === "MOD"      ? "var(--color-warn)" :
                  e.sev === "LOW"      ? "var(--color-stable)" : "var(--color-muted-foreground)" }} />
              <div className="flex items-center gap-2">
                <span className={`chip ${sevCls[e.sev]}`}>{e.sev}</span>
                <span className="mono text-[10px] text-muted-foreground">{e.t}</span>
                <span className="mono text-[10px] text-foreground">{e.node}</span>
              </div>
              <div className="text-[11.5px] text-foreground/85 mt-0.5">{e.msg}</div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
