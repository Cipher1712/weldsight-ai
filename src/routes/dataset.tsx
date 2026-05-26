import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Bar, Equation, KV, Sparkline, deterministic } from "@/components/industrial/sci";

export const Route = createFileRoute("/dataset")({
  head: () => ({ meta: [{ title: "Dataset Intelligence · WeldSight AI" }] }),
  component: DS,
});

const CLS = [
  { c: "Nominal",     n: 12480, color: "var(--color-stable)" },
  { c: "Porosity",    n: 2104,  color: "var(--color-critical)" },
  { c: "Burn-through",n: 1320,  color: "var(--color-high)" },
  { c: "Spatter",     n: 1860,  color: "var(--color-warn)" },
  { c: "LoF",         n:  980,  color: "var(--color-cyan)" },
];

function DS() {
  const total = CLS.reduce((a, b) => a + b.n, 0);
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · DATASET"
        title="Dataset Intelligence"
        sub="Quality scoring · class balance · corruption detection · drift analysis"
        actions={<><span className="chip chip-stable mono">QUALITY Q · 0.91</span><span className="chip mono">N = 18,744</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Class distribution" sub="train / val / test = 70 / 15 / 15">
          {CLS.map(c => (
            <div key={c.c} className="mb-2">
              <div className="flex justify-between mono text-[11px]">
                <span className="text-foreground">{c.c}</span>
                <span className="text-muted-foreground">{c.n.toLocaleString()} · {((c.n / total) * 100).toFixed(1)}%</span>
              </div>
              <Bar value={c.n} max={total / 2} color={c.color} />
            </div>
          ))}
          <KV k="Class imbalance ratio" v="12.7 : 1" sevKey="MODERATE" hint="Nominal vs LoF · SMOTE applied" />
        </Panel>
        <Panel title="Quality breakdown">
          <KV k="Signal quality"       v="0.94" sevKey="LOW" />
          <KV k="Corrupted samples"    v="0.6%" sevKey="LOW" hint="112 / 18,744 quarantined" />
          <KV k="Label noise (est.)"   v="2.1%" sevKey="MODERATE" />
          <KV k="Missing channels"     v="0.3%" sevKey="LOW" />
          <KV k="Distribution drift Δ" v="0.08" sevKey="LOW" />
          <Equation note="Higher score ⇒ lower spectral disorder ⇒ cleaner signal manifold.">
            Q = 1 − H(x) / H<sub>max</sub>
          </Equation>
        </Panel>
        <Panel title="Train / val / test drift" sub="population stability index" className="xl:col-span-2">
          <Sparkline data={deterministic(81, 200, 0.2, 0.12)} w={640} h={60} color="var(--color-cyan)" />
          <div className="grid grid-cols-4 gap-2 mt-2">
            <KV k="PSI · train→val"  v="0.06" sevKey="LOW" />
            <KV k="PSI · train→test" v="0.11" sevKey="MODERATE" />
            <KV k="KS · entropy"     v="0.04" sevKey="LOW" />
            <KV k="KS · rms_power"   v="0.09" sevKey="LOW" />
          </div>
        </Panel>
      </div>
    </>
  );
}
