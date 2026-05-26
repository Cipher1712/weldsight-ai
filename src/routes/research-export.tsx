import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, KV } from "@/components/industrial/sci";
import { Download, FileCode2, Boxes, Cpu } from "lucide-react";

export const Route = createFileRoute("/research-export")({
  head: () => ({ meta: [{ title: "Research Export Hub · WeldSight AI" }] }),
  component: RX,
});

const FORMATS = [
  { fmt: "CSV",     desc: "tabular telemetry · features · labels",       size: "84.2 MB" },
  { fmt: "JSON",    desc: "structured events · anomalies · metadata",     size: "12.6 MB" },
  { fmt: "NPZ",     desc: "numpy-compressed raw signals · 32 ch",         size: "412 MB" },
  { fmt: "FFT",     desc: "power spectra · Hann · 25 Hz resolution",      size: "96 MB" },
  { fmt: "EMBED",   desc: "latent vectors · z ∈ ℝ¹²⁸",                    size: "38 MB" },
  { fmt: "WAVELET", desc: "DWT coefficients · db4 · 6 levels",            size: "204 MB" },
  { fmt: "RECON",   desc: "autoencoder reconstruction errors per window", size: "8.4 MB" },
  { fmt: "LOGS",    desc: "anomaly event log · timestamped",              size: "2.1 MB" },
];

function RX() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · RESEARCH EXPORT"
        title="Research Export Hub"
        sub="Reproducible exports · reproducibility metadata · experiment versioning"
        actions={<><span className="chip chip-stable mono">v2.3.1</span><span className="chip mono">SHA · 7a4f2e1</span></>}
      />
      <div className="p-3 grid xl:grid-cols-3 gap-4">
        <Panel title="Available formats" className="xl:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map(f => (
              <div key={f.fmt} className="border border-border rounded-sm p-2 bg-surface-2/40 flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="mono text-[11px] text-foreground">{f.fmt}</div>
                  <div className="text-[11px] text-foreground/70 truncate">{f.desc}</div>
                </div>
                <span className="mono text-[10px] text-muted-foreground">{f.size}</span>
                <button className="chip mono"><Download className="h-3 w-3" /> GET</button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Reproducibility metadata">
          <KV k="Experiment id"   v="EXP-2026-0521-07" />
          <KV k="Model"           v="WELD-VISION-v4.2" />
          <KV k="Seed"            v="42" />
          <KV k="Git SHA"         v="7a4f2e1" />
          <KV k="Station"         v="WS-04 · WS-07" />
          <KV k="Sensor calib"    v="2026-04-12" />
          <KV k="Created"         v="2026-05-26 14:18 IST" />
        </Panel>
        <Panel title="Experiment versioning · last 5" className="xl:col-span-3">
          <table className="w-full mono text-[11px]">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-1.5">VERSION</th><th className="text-left">MODEL</th>
                <th className="text-left">DATASET</th><th className="text-left">F1</th><th className="text-left">SHA</th><th className="text-right">EXPORT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["v2.3.1","WELD-VISION-v4.2","18,744","0.934","7a4f2e1"],
                ["v2.3.0","WELD-VISION-v4.1","17,210","0.928","6c1b8a3"],
                ["v2.2.4","WELD-VISION-v4.1","16,840","0.921","5fd0c12"],
                ["v2.2.0","WELD-VISION-v4.0","15,202","0.912","4a9e7d6"],
                ["v2.1.3","WELD-VISION-v3.9","14,118","0.901","3bd2f49"],
              ].map(r => (
                <tr key={r[0]} className="border-b border-border/60">
                  {r.map((c, i) => <td key={i} className="py-1.5 text-foreground/85">{c}</td>)}
                  <td className="text-right"><button className="chip mono">BUNDLE</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}
