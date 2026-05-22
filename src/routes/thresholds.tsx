import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/thresholds")({
  head: () => ({ meta: [{ title: "Threshold Management · WeldSight AI" }] }),
  component: Thresholds,
});

const ROWS = [
  ["MIG.I",     "Arc Current",       "215.0 A",  "± 32.4 A",  "μ + 3σ", "ADAPTIVE", "chip-stable"],
  ["MIG.V",     "Arc Voltage",       "24.6 V",   "± 2.9 V",   "μ + 3σ", "ADAPTIVE", "chip-stable"],
  ["TIG.I",     "TIG Current",       "145.0 A",  "± 18.0 A",  "μ + 3σ", "ADAPTIVE", "chip-stable"],
  ["ENC.HZ",    "Wire Encoder",      "480 Hz",   "± 21 Hz",   "fixed",  "MANUAL",   "chip-warn"],
  ["AI.ARC.IDX","Arc Stability",     "0.92",     "≥ 0.78",    "soft",   "ADAPTIVE", "chip-stable"],
  ["RECON.ERR", "Reconstruction Err","0.040",    "≤ 0.110",   "p99.7",  "ADAPTIVE", "chip-stable"],
  ["PYRO.°C",   "Pyrometer",         "412 °C",   "≤ 460 °C",  "fixed",  "MANUAL",   "chip-warn"],
  ["RIPPLE.σ",  "Ripple Variance",   "0.40",     "≤ 0.55",    "p99",    "ADAPTIVE", "chip-stable"],
];

function Thresholds() {
  return (
    <>
      <PageHeader
        eyebrow="AI & TRAINING · ADAPTIVE THRESHOLDS"
        title="Threshold Management"
        sub="Per-signal control bands · adaptive (rolling p99 / μ+3σ) or operator-fixed"
        actions={<button className="chip chip-stable mono">APPLY CHANGES</button>}
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Signal Threshold Registry" sub="WELD-VISION v4.2 · WS-07 active profile" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Signal</th>
                <th className="text-left px-3 py-2">Label</th>
                <th className="text-right px-3 py-2">Setpoint</th>
                <th className="text-right px-3 py-2">Band</th>
                <th className="text-left px-3 py-2">Rule</th>
                <th className="text-left px-3 py-2">Mode</th>
                <th className="text-right px-3 py-2 pr-3">Edit</th>
              </tr>
            </thead>
            <tbody className="mono">
              {ROWS.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{r[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r[1]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[2]}</td>
                  <td className="px-3 py-2 text-right text-foreground">{r[3]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r[4]}</td>
                  <td className="px-3 py-2"><span className={`chip mono ${r[6]}`}>{r[5]}</span></td>
                  <td className="px-3 py-2 text-right pr-3"><button className="chip mono">TUNE</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
