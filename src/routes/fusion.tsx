import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Bar, Equation, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/fusion")({
  head: () => ({ meta: [{ title: "Fusion Intelligence Engine · WeldSight AI" }] }),
  component: Fusion,
});

const MODALITIES = [
  { name: "Signal telemetry", w: 0.34, p: 0.91, color: "var(--color-cyan)" },
  { name: "Vision AI",        w: 0.28, p: 0.88, color: "var(--color-stable)" },
  { name: "Thermal pyrometry",w: 0.22, p: 0.84, color: "var(--color-warn)" },
  { name: "Runtime diagnostics", w: 0.16, p: 0.78, color: "var(--color-high)" },
];

function Fusion() {
  const fused = MODALITIES.reduce((a, m) => a + m.w * m.p, 0);
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · MULTI-MODAL FUSION"
        title="Fusion Intelligence Engine"
        sub="Modality contribution · agreement · fusion confidence · disagreement detection"
        actions={<><span className="chip chip-stable mono">FUSION · v2</span><span className="chip mono">latency 18.6 ms</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Modality contributions" sub="weighted Bayesian fusion">
          {MODALITIES.map(m => (
            <div key={m.name} className="mb-2">
              <div className="flex justify-between mono text-[11px]">
                <span className="text-foreground">{m.name}</span>
                <span className="text-muted-foreground">w {m.w.toFixed(2)} · P {m.p.toFixed(2)}</span>
              </div>
              <Bar value={m.w * m.p} max={0.34} color={m.color} />
            </div>
          ))}
          <Equation note="Posterior fusion across independent sensing modalities.">
            P(y | x) = Σ<sub>i</sub> w<sub>i</sub> · P<sub>i</sub>(y | x)
          </Equation>
        </Panel>
        <Panel title="Consensus state">
          <KV k="Fusion confidence"  v={fused.toFixed(3)} sevKey="HIGH" />
          <KV k="Agreement score"    v="0.86" sevKey="LOW" hint="pairwise Cohen κ across modalities" />
          <KV k="Disagreements · 5 m" v="2"   sevKey="MODERATE" hint="vision↔thermal on WS-04 14:18" />
          <KV k="Active modalities"  v="4 / 4" sevKey="LOW" />
          <KV k="Failsafe mode"      v="OFF"   sevKey="LOW" />
        </Panel>
        <Panel title="Modality agreement matrix" sub="pairwise κ" className="xl:col-span-2">
          <div className="grid grid-cols-5 gap-1">
            <div />
            {MODALITIES.map(m => <div key={m.name} className="mono text-[9.5px] text-muted-foreground text-center truncate">{m.name.split(" ")[0]}</div>)}
            {MODALITIES.map((r, ri) => (
              <>
                <div key={r.name} className="mono text-[9.5px] text-muted-foreground truncate">{r.name.split(" ")[0]}</div>
                {MODALITIES.map((c, ci) => {
                  const v = ri === ci ? 1 : 0.7 + Math.random() * 0.25;
                  return (
                    <div key={`${ri}-${ci}`} className="h-9 grid place-items-center mono text-[10px] text-foreground"
                         style={{ background: `color-mix(in oklch, var(--color-stable) ${v * 70}%, var(--surface-2))` }}>
                      {v.toFixed(2)}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
