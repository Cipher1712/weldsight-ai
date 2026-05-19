import { motion } from "framer-motion";

const ALERTS = [
  { ts: "14:42:18", sev: "CRIT", st: "WS-07", title: "Porosity cluster · ROI-03", cause: "Shielding gas pressure drop · 0.6 bar", metric: "MIG-V σ↑ 0.42" },
  { ts: "14:41:52", sev: "HIGH", st: "WS-07", title: "Arc voltage instability", cause: "Wire feeder slip", metric: "Arc Idx 0.74" },
  { ts: "14:40:21", sev: "MED",  st: "WS-03", title: "Penetration anomaly", cause: "Speed drift +6%", metric: "I +8%" },
  { ts: "14:38:11", sev: "MED",  st: "WS-06", title: "Spatter rate elevated", cause: "Torch angle 87°", metric: "HF noise" },
  { ts: "14:31:04", sev: "INFO", st: "WS-02", title: "Auto-recalibration complete", cause: "Scheduled", metric: "OK" },
  { ts: "14:22:58", sev: "HIGH", st: "WS-06", title: "Thermal excursion", cause: "Coolant flow −18%", metric: "T 512°C" },
];

const sevCls: Record<string, string> = {
  CRIT: "chip-critical", HIGH: "chip-high", MED: "chip-warn", INFO: "chip-stable",
};

export function AlertCenter() {
  return (
    <div className="panel flex flex-col overflow-hidden h-full">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-title">Alert & Event Management</span>
          <span className="chip chip-critical mono">3 unack</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] mono">
          <input placeholder="Search events…" className="bg-surface-2 border border-border rounded px-2 py-1 text-[10.5px] w-36 outline-none focus:border-border-strong" />
          <button className="px-2 py-1 rounded bg-surface-2 border border-border text-muted-foreground">FILTER</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11.5px] mono">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground sticky top-0 bg-panel">
            <tr className="border-b border-border">
              <th className="px-2 py-1.5 text-left font-medium">Time</th>
              <th className="px-2 py-1.5 text-left font-medium">Sev</th>
              <th className="px-2 py-1.5 text-left font-medium">Station</th>
              <th className="px-2 py-1.5 text-left font-medium">Event</th>
              <th className="px-2 py-1.5 text-left font-medium">Root Cause</th>
              <th className="px-2 py-1.5 text-left font-medium">Metric</th>
              <th className="px-2 py-1.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {ALERTS.map((a, i) => (
              <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/60 hover:bg-surface-2">
                <td className="px-2 py-1.5 text-muted-foreground">{a.ts}</td>
                <td className="px-2 py-1.5"><span className={`chip ${sevCls[a.sev]}`}>{a.sev}</span></td>
                <td className="px-2 py-1.5 text-foreground">{a.st}</td>
                <td className="px-2 py-1.5 text-foreground">{a.title}</td>
                <td className="px-2 py-1.5 text-muted-foreground">{a.cause}</td>
                <td className="px-2 py-1.5">{a.metric}</td>
                <td className="px-2 py-1.5 text-right">
                  <button className="text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border-strong text-foreground">ACK</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
