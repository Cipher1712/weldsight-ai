import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Sparkline, Equation, KV, deterministic } from "@/components/industrial/sci";

export const Route = createFileRoute("/drift")({
  head: () => ({ meta: [{ title: "AI Drift Intelligence · WeldSight AI" }] }),
  component: Drift,
});

const CHANNELS = [
  { c: "Feature drift · spectral_entropy", kl: 0.18, sev: "MODERATE" },
  { c: "Feature drift · rms_power",        kl: 0.08, sev: "LOW" },
  { c: "Concept drift · class boundary",   kl: 0.24, sev: "HIGH" },
  { c: "Latent drift · ‖μ_z − μ_z₀‖",      kl: 0.14, sev: "MODERATE" },
  { c: "Reconstruction drift",             kl: 0.11, sev: "LOW" },
  { c: "Sensor drift · pyrometer",         kl: 0.32, sev: "HIGH" },
];

const sevCls = (s: string) => s === "HIGH" ? "chip-high" : s === "MODERATE" ? "chip-warn" : "chip-stable";

function Drift() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · DRIFT"
        title="AI Drift Intelligence"
        sub="KL divergence · feature · concept · latent · sensor · reconstruction"
        actions={<><span className="chip chip-high mono">2 HIGH</span><span className="chip mono">window 24 h</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Drift channels" sub="rolling KL · last 24 h" className="xl:col-span-2">
          {CHANNELS.map((c, i) => (
            <div key={c.c} className="border border-border rounded-sm p-2 bg-surface-2/40 mb-2">
              <div className="flex items-center justify-between">
                <span className="mono text-[11px] text-foreground">{c.c}</span>
                <span className="flex items-center gap-2">
                  <span className="mono text-[11px] text-muted-foreground">D_KL = {c.kl.toFixed(2)}</span>
                  <span className={`chip ${sevCls(c.sev)}`}>{c.sev}</span>
                </span>
              </div>
              <Sparkline data={deterministic(i + 9, 96, c.kl, 0.12)} w={620} h={28} color={c.sev === "HIGH" ? "var(--color-high)" : "var(--color-cyan)"} baseline={0.2} />
            </div>
          ))}
        </Panel>
        <Panel title="Equation">
          <Equation note="KL divergence — distance from reference distribution Q to current P.">
            D<sub>KL</sub>(P ‖ Q) = Σ P(x) · log( P(x) / Q(x) )
          </Equation>
        </Panel>
        <Panel title="Mitigation state">
          <KV k="Auto-retrain"      v="ARMED · ≥ 0.30" sevKey="MODERATE" />
          <KV k="Last retrain"      v="2026-05-19" />
          <KV k="Sensor recal due"  v="pyrometer · 2 d" sevKey="HIGH" />
          <KV k="Operator alert"    v="dispatched · WS-09" sevKey="HIGH" />
        </Panel>
      </div>
    </>
  );
}
