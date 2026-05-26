import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Heatmap, Equation, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/correlation")({
  head: () => ({ meta: [{ title: "Signal Correlation Intelligence · WeldSight AI" }] }),
  component: Corr,
});

const SIGNALS = ["MIG.V", "MIG.I", "WIRE", "GAS", "PYRO", "ARC.Z", "ENT", "RMS", "WVL", "VIS"];

function symMatrix(seed: number) {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < SIGNALS.length; i++) {
    for (let j = 0; j < SIGNALS.length; j++) {
      if (i === j) { out.push(1); continue; }
      if (i < j) {
        s = (s * 9301 + 49297) % 233280;
        const v = (s / 233280) * 1.7 - 0.7;
        out.push(Math.max(-0.95, Math.min(0.95, v)));
      } else {
        out.push(out[j * SIGNALS.length + i]);
      }
    }
  }
  return out;
}

function Corr() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · CORRELATION"
        title="Signal Correlation Intelligence"
        sub="Pearson · Spearman · lag-correlation · feature interaction matrix"
        actions={<><span className="chip mono">window · 60 s</span><span className="chip chip-stable mono">lag ±25 ms</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Pearson correlation" sub="linear coupling">
          <Heatmap rows={SIGNALS.length} cols={SIGNALS.length} values={symMatrix(7)} rowLabels={SIGNALS} colLabels={SIGNALS} />
          <Equation note="Linear correlation between two stationary signals over the analysis window.">
            r = Σ (xᵢ − x̄)(yᵢ − ȳ) / √(Σ(xᵢ − x̄)² · Σ(yᵢ − ȳ)²)
          </Equation>
        </Panel>
        <Panel title="Spearman rank correlation" sub="monotonic coupling">
          <Heatmap rows={SIGNALS.length} cols={SIGNALS.length} values={symMatrix(19)} rowLabels={SIGNALS} colLabels={SIGNALS} />
        </Panel>
        <Panel title="Physically coupled phenomena" sub="top correlations · last 60 s" className="xl:col-span-2">
          <div className="grid xl:grid-cols-2 gap-2">
            <KV k="entropy ↔ porosity"        v="+0.83" sevKey="HIGH" hint="broadband arc spectrum signature" />
            <KV k="rms_power ↔ burn-through"  v="+0.79" sevKey="HIGH" hint="thermal accumulation driver" />
            <KV k="wavelet_d3 ↔ spatter"      v="+0.74" sevKey="MODERATE" hint="impulsive transient localization" />
            <KV k="thermal_drift ↔ instab"    v="+0.68" sevKey="MODERATE" hint="pyrometer integral coupling" />
            <KV k="current ↔ LoF"             v="−0.61" sevKey="MODERATE" hint="energy deficit indicator" />
            <KV k="gas_flow ↔ porosity"       v="−0.57" sevKey="MODERATE" hint="shielding integrity inverse" />
          </div>
        </Panel>
      </div>
    </>
  );
}
