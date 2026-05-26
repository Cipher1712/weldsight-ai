import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { Panel, Bar, Equation, Sparkline, KV, deterministic } from "@/components/industrial/sci";
import { PHYSICS_DEFECTS } from "@/components/industrial/PhysicsSignature";

export const Route = createFileRoute("/xai")({
  head: () => ({ meta: [{ title: "Inference Reasoning Engine · WeldSight AI" }] }),
  component: XAIPage,
});

function XAIPage() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · EXPLAINABILITY"
        title="Inference Reasoning Engine"
        sub="SHAP-style attribution · latent deviation · confidence calibration · feature interactions"
        actions={
          <>
            <span className="chip chip-stable mono">XAI · v1.4</span>
            <span className="chip mono">μ recon 0.118 · σ 0.034</span>
          </>
        }
      />
      <div className="p-3 grid xl:grid-cols-3 gap-4">
        {PHYSICS_DEFECTS.map(d => {
          const recon = 0.08 + (1 - d.consensus) * 0.6;
          const uncertainty = 0.02 + (1 - d.conf) * 0.18;
          return (
            <Panel
              key={d.id}
              title={`Why · ${d.name}`}
              sub={`${d.id} · conf ${(d.conf * 100).toFixed(0)}% ± ${(uncertainty * 100).toFixed(1)}%`}
              right={<span className="chip mono">SHAP · kernel</span>}
            >
              <p className="text-[12px] text-foreground/80 mb-2 leading-snug">
                Prediction driven primarily by <span className="text-foreground">{d.contributors[0].name}</span>{" "}
                ({d.contributors[0].pct}%) and <span className="text-foreground">{d.contributors[1].name}</span>{" "}
                ({d.contributors[1].pct}%) deviating from learned normal welding manifold.
              </p>
              <div className="space-y-1.5 mb-3">
                {d.contributors.map(c => (
                  <Bar key={c.name} value={c.pct} max={40} label={c.name} suffix="%" color="var(--color-cyan)" />
                ))}
              </div>
              <KV k="Reconstruction err" v={recon.toFixed(3)} sevKey={recon > 0.3 ? "HIGH" : "MODERATE"} hint="L = 1/N Σ (xᵢ − x̂ᵢ)²" />
              <KV k="Latent Δ (‖z − μ_z‖)" v={(recon * 4.2).toFixed(2)} sevKey={recon > 0.3 ? "HIGH" : "LOW"} />
              <KV k="Confidence band" v={`±${(uncertainty * 100).toFixed(1)}%`} hint="bootstrap N=200, α=0.05" />
              <div className="mt-2">
                <div className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">Recon error · 60 s</div>
                <Sparkline data={deterministic(parseInt(d.id.slice(-2)), 60, recon, 0.18)} w={300} h={36} color="var(--color-high)" />
              </div>
            </Panel>
          );
        })}

        <Panel title="Autoencoder reconstruction" sub="loss surface · last 5 min" className="xl:col-span-2">
          <Equation note="Higher reconstruction error indicates deviation from learned normal welding behaviour.">
            L = 1/N · Σ<sub>i=1..N</sub> (x<sub>i</sub> − x̂<sub>i</sub>)²
          </Equation>
          <Sparkline data={deterministic(99, 240, 0.18, 0.22)} w={600} h={90} color="var(--color-cyan)" baseline={0.18} />
          <div className="grid grid-cols-4 gap-2 mt-2">
            <KV k="μ recon"  v="0.118" />
            <KV k="σ recon"  v="0.034" />
            <KV k="threshold" v="0.30" sevKey="HIGH" />
            <KV k="exceedances · 5 m" v="3" sevKey="MODERATE" />
          </div>
        </Panel>

        <Panel title="Feature interaction graph" sub="top 6 · pairwise gain">
          <svg viewBox="0 0 220 220" className="block w-full">
            {[
              ["spectral_entropy", 110, 30],
              ["ripple_sigma",     190, 90],
              ["voltage_instab",   170, 180],
              ["thermal_drift",    60,  185],
              ["wavelet_d3",       30,  95],
              ["rms_power",        110, 110],
            ].map(([n, x, y], i, arr) =>
              arr.slice(i + 1).map(([_n2, x2, y2], j) => (
                <line key={`${i}-${j}`} x1={x as number} y1={y as number} x2={x2 as number} y2={y2 as number}
                      stroke="var(--color-cyan)" opacity={0.15 + Math.random() * 0.35} />
              ))
            )}
            {[
              ["spectral_entropy", 110, 30],
              ["ripple_sigma",     190, 90],
              ["voltage_instab",   170, 180],
              ["thermal_drift",    60,  185],
              ["wavelet_d3",       30,  95],
              ["rms_power",        110, 110],
            ].map(([n, x, y], i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r={6} fill="var(--color-cyan)" />
                <text x={x as number} y={(y as number) - 9} textAnchor="middle" fontSize="9" className="mono" fill="var(--color-foreground)">{n}</text>
              </g>
            ))}
          </svg>
        </Panel>
      </div>
    </>
  );
}
