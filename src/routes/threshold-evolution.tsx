import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, MultiLine, Equation, KV, deterministic } from "@/components/industrial/sci";

export const Route = createFileRoute("/threshold-evolution")({
  head: () => ({ meta: [{ title: "Adaptive Threshold Intelligence · WeldSight AI" }] }),
  component: TE,
});

function TE() {
  const N = 200;
  const signal = deterministic(7, N, 0.5, 0.25);
  const mu = signal.map((_, i) => {
    const w = signal.slice(Math.max(0, i - 20), i + 1);
    return w.reduce((a, b) => a + b, 0) / w.length;
  });
  const up = mu.map((m, i) => m + 0.18 + Math.sin(i * 0.04) * 0.02);
  const dn = mu.map((m, i) => m - 0.18 - Math.sin(i * 0.04) * 0.02);

  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · ADAPTIVE THRESHOLDS"
        title="Adaptive Threshold Intelligence"
        sub="Rolling μ · drift-aware σ · dynamic anomaly boundaries · evolution timeline"
        actions={<><span className="chip mono">k · 2.5σ</span><span className="chip chip-stable mono">DRIFT TRACKER · ON</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="MIG.V σ-band evolution" sub="rolling N = 20 · last 200 s" className="xl:col-span-2">
          <MultiLine
            series={[
              { name: "signal", color: "var(--color-cyan)",    data: signal },
              { name: "μ_t",    color: "var(--color-foreground)", data: mu },
              { name: "T = μ+kσ", color: "var(--color-critical)", data: up },
              { name: "T = μ−kσ", color: "var(--color-high)",     data: dn },
            ]}
            w={640} h={200}
            labels={["V", "t"]}
          />
        </Panel>
        <Panel title="Equations · rolling estimator">
          <Equation note="Rolling mean over N samples — adaptive to drift.">μ<sub>t</sub> = 1/N · Σ<sub>i=t−N..t</sub> x<sub>i</sub></Equation>
          <Equation note="Threshold band — k typically 2.5 for industrial conservatism.">T = μ + k · σ</Equation>
          <p className="text-[11.5px] text-foreground/70">
            Thresholds adapt automatically to process drift and environmental variation (substrate temperature, gas mix, wire batch).
          </p>
        </Panel>
        <Panel title="Per-channel adaptive state">
          {["MIG.V","MIG.I","PYRO","WIRE","GAS","VISION"].map((c, i) => (
            <div key={c}>
              <KV k={c} v={`μ ${(0.4 + i * 0.05).toFixed(2)} · σ ${(0.06 + i * 0.01).toFixed(2)}`}
                  sevKey={i === 2 ? "HIGH" : i === 4 ? "MODERATE" : "LOW"}
                  hint={i === 2 ? "drift +0.18 over last 5 min" : "within nominal envelope"} />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
