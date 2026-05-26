import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Bar, Equation, KV, Sparkline, deterministic } from "@/components/industrial/sci";

export const Route = createFileRoute("/predictive-failure")({
  head: () => ({ meta: [{ title: "Predictive Maintenance Intelligence · WeldSight AI" }] }),
  component: PF,
});

const COMPONENTS = [
  { c: "Torch contact tip · WS-07", deg: 0.78, rul: "≈ 12 h", lam: 0.084, sev: "HIGH" },
  { c: "Wire feeder rollers · WS-04", deg: 0.62, rul: "≈ 38 h", lam: 0.026, sev: "MODERATE" },
  { c: "Gas regulator · WS-09",      deg: 0.51, rul: "≈ 64 h", lam: 0.016, sev: "MODERATE" },
  { c: "Power cable insul. · WS-02", deg: 0.34, rul: "≈ 220 h", lam: 0.005, sev: "LOW" },
  { c: "Coolant pump · plant",       deg: 0.41, rul: "≈ 180 h", lam: 0.007, sev: "LOW" },
  { c: "Pyrometer drift · WS-09",    deg: 0.69, rul: "≈ 28 h", lam: 0.036, sev: "HIGH" },
];

const sevCls = (s: string) => s === "CRITICAL" ? "chip-critical" : s === "HIGH" ? "chip-high" : s === "MODERATE" ? "chip-warn" : "chip-stable";

function PF() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · PREDICTIVE FAILURE"
        title="Predictive Maintenance Intelligence"
        sub="Torch · bearing · gas · cable · thermal accumulation · RUL · failure probability"
        actions={<><span className="chip chip-high mono">2 HIGH</span><span className="chip mono">λ avg 0.029 h⁻¹</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Component degradation" sub="live degradation curves" className="xl:col-span-2">
          {COMPONENTS.map(c => (
            <div key={c.c} className="mb-2.5">
              <div className="flex justify-between mono text-[11px]">
                <span className="text-foreground">{c.c}</span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">RUL {c.rul}</span>
                  <span className="text-muted-foreground">λ {c.lam.toFixed(3)}</span>
                  <span className={`chip ${sevCls(c.sev)}`}>{c.sev}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1"><Bar value={c.deg} color={c.deg > 0.7 ? "var(--color-high)" : c.deg > 0.5 ? "var(--color-warn)" : "var(--color-stable)"} /></div>
                <Sparkline data={deterministic(c.c.length, 40, c.deg, 0.08)} w={100} h={20} color="var(--color-foreground)" />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Equations · reliability">
          <Equation note="Remaining useful life — failure time minus current time.">RUL = t<sub>f</sub> − t<sub>c</sub></Equation>
          <Equation note="Exponential failure model — λ is per-hour hazard rate.">P(T ≤ t) = 1 − e<sup>−λt</sup></Equation>
        </Panel>
        <Panel title="Plant-level reliability">
          <KV k="MTBF (last 30 d)"   v="186 h" sevKey="LOW" />
          <KV k="MTTR (last 30 d)"   v="42 m"  sevKey="LOW" />
          <KV k="Forecast incidents · 7 d" v="3.1" sevKey="MODERATE" />
          <KV k="Cost avoidance · MTD"     v="₹ 18.4 L" sevKey="LOW" />
        </Panel>
      </div>
    </>
  );
}
