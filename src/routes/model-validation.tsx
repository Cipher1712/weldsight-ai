import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { Panel, ROCCurve, Equation, KV, Bar } from "@/components/industrial/sci";

export const Route = createFileRoute("/model-validation")({
  head: () => ({ meta: [{ title: "Model Validation Analytics · WeldSight AI" }] }),
  component: MV,
});

const CLASSES = ["Nominal", "Porosity", "Burn-thru", "Spatter", "LoF"];
const CM = [
  [412,   4,   1,   3,   2],
  [  6,  92,   2,   1,   3],
  [  2,   3,  68,   0,   1],
  [  4,   1,   0,  54,   2],
  [  3,   2,   1,   1,  47],
];

function ROCpts(seed: number) {
  const pts = [{ fpr: 0, tpr: 0 }];
  for (let i = 1; i <= 20; i++) {
    const fpr = i / 20;
    const tpr = Math.min(1, fpr + 0.55 + Math.sin(seed + i) * 0.12);
    pts.push({ fpr, tpr });
  }
  pts.push({ fpr: 1, tpr: 1 });
  return pts;
}

function MV() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · VALIDATION"
        title="Model Validation Analytics"
        sub="Confusion · ROC · PR · F1 · calibration · per-defect performance"
        actions={
          <>
            <span className="chip chip-stable mono">F1 0.934 · macro</span>
            <span className="chip mono">test N = 1,820</span>
          </>
        }
      />
      <div className="p-3 grid xl:grid-cols-3 gap-4">
        <Panel title="Confusion matrix" sub="normalized row-wise" className="xl:col-span-2">
          <div className="grid" style={{ gridTemplateColumns: `100px repeat(${CLASSES.length}, 1fr)`, gap: 1 }}>
            <div />
            {CLASSES.map(c => <div key={c} className="mono text-[10px] text-muted-foreground text-center">{c}</div>)}
            {CM.map((row, r) => {
              const tot = row.reduce((a, b) => a + b, 0);
              return (
                <>
                  <div key={`l${r}`} className="mono text-[10.5px] text-muted-foreground pr-1 truncate">{CLASSES[r]}</div>
                  {row.map((v, c) => {
                    const n = v / tot;
                    const bg = r === c
                      ? `color-mix(in oklch, var(--color-stable) ${n * 80}%, var(--surface-2))`
                      : `color-mix(in oklch, var(--color-critical) ${n * 80}%, var(--surface-2))`;
                    return (
                      <div key={`${r}-${c}`} className="h-9 grid place-items-center mono text-[10.5px] text-foreground" style={{ background: bg }}>
                        {v}
                      </div>
                    );
                  })}
                </>
              );
            })}
          </div>
        </Panel>
        <Panel title="Per-defect metrics" sub="precision · recall · F1">
          <div className="space-y-2">
            {CLASSES.map((c, i) => {
              const p = 0.86 + Math.random() * 0.12;
              const r = 0.82 + Math.random() * 0.14;
              const f1 = (2 * p * r) / (p + r);
              return (
                <div key={c} className="border border-border rounded-sm p-2 bg-surface-2/40">
                  <div className="flex justify-between mono text-[11px]"><span>{c}</span><span className="text-muted-foreground">F1 {f1.toFixed(3)}</span></div>
                  <Bar value={p} label="precision" color="var(--color-cyan)" />
                  <Bar value={r} label="recall"    color="var(--color-stable)" />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="ROC curves · per class">
          <div className="grid grid-cols-2 gap-2">
            {CLASSES.map((c, i) => (
              <div key={c} className="border border-border rounded-sm p-2 bg-surface-2/40">
                <div className="mono text-[10px] text-muted-foreground mb-1">{c}</div>
                <ROCCurve points={ROCpts(i + 1)} label={`AUC ${(0.91 + i * 0.012).toFixed(3)}`} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Precision–Recall" sub="weighted macro">
          <ROCCurve points={ROCpts(7)} label="AP 0.927" />
          <Equation note="Harmonic mean balances precision and recall under class imbalance.">
            F<sub>1</sub> = 2 · (Precision · Recall) / (Precision + Recall)
          </Equation>
        </Panel>

        <Panel title="Calibration · reliability" sub="20-bin ECE 0.041">
          <svg viewBox="0 0 220 160" className="block">
            <line x1={22} y1={144} x2={216} y2={4} stroke="var(--color-border-strong)" strokeDasharray="2 2" />
            {Array.from({ length: 20 }).map((_, i) => {
              const x = 22 + (i / 19) * 194;
              const conf = i / 19;
              const acc = Math.min(1, conf + (Math.sin(i) * 0.05));
              return <rect key={i} x={x - 4} y={144 - acc * 140} width={8} height={acc * 140} fill="var(--color-cyan)" opacity={0.6} />;
            })}
          </svg>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <KV k="ECE" v="0.041" sevKey="LOW" />
            <KV k="MCE" v="0.118" sevKey="MODERATE" />
            <KV k="Brier" v="0.083" />
          </div>
        </Panel>
      </div>
    </>
  );
}
