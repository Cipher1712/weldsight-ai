import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/metrics")({
  head: () => ({ meta: [{ title: "Metrics Explorer · WeldSight AI" }] }),
  component: MetricsExplorer,
});

const METRICS = [
  { k: "weld.integrity",       desc: "Composite integrity score (vision + telemetry)", unit: "%",   src: "AI",   freq: "1 Hz" },
  { k: "arc.stability.idx",    desc: "Arc stability index from voltage σ",             unit: "idx", src: "PLC",  freq: "1 kHz" },
  { k: "recon.error",          desc: "Auto-encoder reconstruction error",              unit: "",    src: "AI",   freq: "20 Hz" },
  { k: "ai.confidence",        desc: "Vision model classification confidence",         unit: "",    src: "AI",   freq: "30 Hz" },
  { k: "thermal.drift",        desc: "Pyrometer drift versus setpoint",                unit: "°C/h",src: "PYRO", freq: "5 Hz" },
  { k: "ripple.sigma",         desc: "Inverter ripple variance",                       unit: "",    src: "PLC",  freq: "1 kHz" },
  { k: "spectral.entropy",     desc: "Shannon entropy of arc spectrum",                unit: "bit", src: "AI",   freq: "10 Hz" },
  { k: "weld.pass.rate",       desc: "Pass rate (shift-rolling)",                      unit: "%",   src: "MES",  freq: "60 s" },
  { k: "throughput.uph",       desc: "Units per hour",                                 unit: "u/h", src: "MES",  freq: "60 s" },
  { k: "inference.latency",    desc: "Model inference latency",                        unit: "ms",  src: "EDGE", freq: "30 Hz" },
];

function MetricsExplorer() {
  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS · METRICS"
        title="Metrics Explorer"
        sub="Catalogue of available telemetry, vision and AI metrics exposed by the platform"
        actions={<button className="chip mono">QUERY BUILDER</button>}
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Metric Catalogue" sub={`${METRICS.length} of 124 metrics`} />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Key</th>
                <th className="text-left px-3 py-2">Description</th>
                <th className="text-left px-3 py-2">Unit</th>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-right px-3 py-2 pr-3">Cadence</th>
              </tr>
            </thead>
            <tbody className="mono">
              {METRICS.map((m, i) => (
                <tr key={m.k} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{m.k}</td>
                  <td className="px-3 py-2 text-muted-foreground">{m.desc}</td>
                  <td className="px-3 py-2 text-foreground">{m.unit || "—"}</td>
                  <td className="px-3 py-2"><span className="chip mono">{m.src}</span></td>
                  <td className="px-3 py-2 text-right text-foreground pr-3">{m.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
