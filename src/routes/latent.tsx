import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { Panel, Scatter, Equation, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/latent")({
  head: () => ({ meta: [{ title: "Latent Defect Space · WeldSight AI" }] }),
  component: LatentPage,
});

const CLASSES = [
  { key: "ok",      color: "var(--color-stable)",   label: "Nominal" },
  { key: "poros",   color: "var(--color-critical)", label: "Porosity" },
  { key: "burn",    color: "var(--color-high)",     label: "Burn-through" },
  { key: "spatter", color: "var(--color-warn)",     label: "Spatter" },
  { key: "lof",     color: "var(--color-cyan)",     label: "Lack of Fusion" },
];

function cluster(cx: number, cy: number, n: number, spread: number, cls: string, seed: number) {
  const pts: { x: number; y: number; cls: string }[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r1 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const r2 = s / 233280;
    const ang = r1 * Math.PI * 2;
    const rad = Math.sqrt(r2) * spread;
    pts.push({ x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad, cls });
  }
  return pts;
}

const PCA_POINTS = [
  ...cluster(-2.0,  1.2, 120, 1.1, "ok",      1),
  ...cluster( 2.4,  1.8,  70, 0.8, "poros",   2),
  ...cluster( 1.6, -2.2,  55, 0.9, "burn",    3),
  ...cluster(-2.4, -1.6,  45, 0.7, "spatter", 4),
  ...cluster( 0.2,  2.8,  35, 0.6, "lof",     5),
];

const TSNE_POINTS = [
  ...cluster(-5,  4, 120, 2.0, "ok",      11),
  ...cluster( 6,  5,  70, 1.6, "poros",   12),
  ...cluster( 4, -6,  55, 1.7, "burn",    13),
  ...cluster(-6, -4,  45, 1.5, "spatter", 14),
  ...cluster( 0,  9,  35, 1.4, "lof",     15),
];

function LatentPage() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · LATENT MANIFOLD"
        title="Latent Defect Space"
        sub="PCA · t-SNE · UMAP projections of the autoencoder bottleneck · interactive defect clustering"
        actions={
          <>
            <button className="chip chip-stable mono">PCA</button>
            <button className="chip mono">t-SNE</button>
            <button className="chip mono">UMAP</button>
            <span className="chip mono">N = 325 windows</span>
          </>
        }
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="PCA · 2D projection" sub="first 2 components · 71.4% var" right={<span className="chip mono">σ²₁ 0.46 · σ²₂ 0.25</span>}>
          <Scatter points={PCA_POINTS} classes={CLASSES} />
          <Equation note="PCA maximizes between-class scatter relative to within-class scatter.">
            max<sub>w</sub> (wᵀ S<sub>B</sub> w) / (wᵀ S<sub>W</sub> w)
          </Equation>
        </Panel>
        <Panel title="t-SNE · perplexity 30" sub="non-linear manifold embedding" right={<span className="chip mono">iter 1000</span>}>
          <Scatter points={TSNE_POINTS} classes={CLASSES} />
          <Equation note="Similarity preserves local neighborhood structure across defect manifolds.">
            q<sub>ij</sub> = (1+‖y<sub>i</sub>−y<sub>j</sub>‖²)⁻¹ / Σ<sub>k≠l</sub> (1+‖y<sub>k</sub>−y<sub>l</sub>‖²)⁻¹
          </Equation>
        </Panel>
        <Panel title="Cluster density · latent confidence" sub="silhouette + island detection" className="xl:col-span-2">
          <div className="grid grid-cols-5 gap-2">
            {CLASSES.map(c => {
              const sil = 0.45 + Math.random() * 0.35;
              return (
                <div key={c.key} className="rounded-sm border border-border bg-surface-2/60 p-2">
                  <div className="flex items-center gap-1.5 mono text-[10.5px]">
                    <span className="dot" style={{ background: c.color }} /> {c.label}
                  </div>
                  <KV k="silhouette"   v={sil.toFixed(2)} />
                  <KV k="density"      v={(0.3 + Math.random() * 0.6).toFixed(2)} />
                  <KV k="island count" v={Math.ceil(Math.random() * 3)} />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </>
  );
}
