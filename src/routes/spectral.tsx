import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Sparkline, Equation, KV, deterministic } from "@/components/industrial/sci";

export const Route = createFileRoute("/spectral")({
  head: () => ({ meta: [{ title: "Spectral Intelligence Engine · WeldSight AI" }] }),
  component: Spectral,
});

function Spectrum({ seed }: { seed: number }) {
  const N = 80;
  const data = Array.from({ length: N }, (_, i) => {
    const f = i / N;
    return (
      0.6 * Math.exp(-((f - 0.18) ** 2) * 80) +
      0.4 * Math.exp(-((f - 0.36) ** 2) * 120) +
      0.25 * Math.exp(-((f - 0.62) ** 2) * 60) +
      Math.random() * 0.08
    );
  });
  return (
    <svg viewBox="0 0 320 120" className="block w-full">
      {data.map((v, i) => (
        <rect key={i} x={(i / N) * 320} width={320 / N - 1} y={120 - v * 100} height={v * 100} fill="var(--color-cyan)" opacity={0.7} />
      ))}
      <line x1={0} x2={320} y1={20} y2={20} stroke="var(--color-grid)" strokeDasharray="2 2" />
      <text x={4} y={14} fontSize="9" className="mono" fill="var(--color-muted-foreground)">|X(f)|</text>
    </svg>
  );
}

function Spectral() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · SPECTRAL"
        title="Spectral Intelligence Engine"
        sub="Centroid · bandwidth · entropy · harmonic tracking · rolloff"
        actions={<><span className="chip mono">HANN · 2048</span><span className="chip chip-stable mono">res 25 Hz</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Live spectrum · MIG.V" sub="0–2 kHz · power spectral density">
          <Spectrum seed={1} />
        </Panel>
        <Panel title="Spectral descriptors" sub="rolling estimator">
          <KV k="Spectral centroid C"  v="412 Hz"  sevKey="MODERATE" hint="energy-weighted mean frequency" />
          <KV k="Spectral bandwidth"   v="284 Hz"  sevKey="HIGH" hint="rising — porosity broadening" />
          <KV k="Spectral entropy H"   v="0.74"    sevKey="HIGH" />
          <KV k="Dominant freq f₀"     v="312 Hz"  hint="wire-feed harmonic" />
          <KV k="Spectral rolloff 95%" v="1.21 kHz" />
          <KV k="Harmonic ratio H/F"   v="0.41"    sevKey="MODERATE" />
        </Panel>
        <Panel title="Equations" className="xl:col-span-2">
          <div className="grid xl:grid-cols-2 gap-2">
            <Equation note="Energy-weighted mean frequency of the spectrum.">C = Σ f<sub>k</sub> X(k) / Σ X(k)</Equation>
            <Equation note="Spread of spectral energy around the centroid.">BW = √(Σ (f<sub>k</sub> − C)² X(k) / Σ X(k))</Equation>
          </div>
        </Panel>
        <Panel title="Dominant frequency evolution" sub="last 60 s" className="xl:col-span-2">
          <Sparkline data={deterministic(33, 240, 0.55, 0.22)} w={640} h={70} color="var(--color-cyan)" baseline={0.5} />
        </Panel>
      </div>
    </>
  );
}
