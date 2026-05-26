import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Equation, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/wavelets")({
  head: () => ({ meta: [{ title: "Wavelet Defect Intelligence · WeldSight AI" }] }),
  component: WV,
});

function Scalogram() {
  const rows = 6, cols = 64;
  return (
    <svg viewBox={`0 0 ${cols * 6} ${rows * 18}`} className="block w-full">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const v = 0.3 + 0.5 * Math.exp(-((c - 30) ** 2) / 50) * Math.exp(-((r - 2) ** 2) / 3) + Math.random() * 0.18;
          return (
            <rect key={`${r}-${c}`} x={c * 6} y={r * 18} width={6} height={18}
                  fill={`color-mix(in oklch, var(--color-critical) ${v * 70}%, var(--surface-2))`} />
          );
        })
      )}
      {Array.from({ length: rows }).map((_, r) => (
        <text key={r} x={2} y={r * 18 + 12} fontSize="8" className="mono" fill="var(--color-muted-foreground)">d{r + 1}</text>
      ))}
    </svg>
  );
}

function WV() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · WAVELETS"
        title="Wavelet Defect Intelligence"
        sub="DWT · multi-resolution analysis · scalograms · transient localization"
        actions={<><span className="chip mono">db4 · 6 levels</span><span className="chip chip-stable mono">localized</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        <Panel title="Wavelet scalogram · MIG.I" sub="time × scale · transient energy" className="xl:col-span-2">
          <Scalogram />
        </Panel>
        <Panel title="Sub-band energy">
          {["d1 · 0.5–1.0 kHz", "d2 · 250–500 Hz", "d3 · 125–250 Hz", "d4 · 60–125 Hz", "d5 · 30–60 Hz", "d6 · 15–30 Hz"].map((b, i) => (
            <KV key={b} k={b}
                v={(0.18 + Math.random() * 0.6).toFixed(2)}
                sevKey={i === 2 ? "HIGH" : i === 3 ? "MODERATE" : "LOW"} />
          ))}
        </Panel>
        <Panel title="Equation · CWT">
          <Equation note="Continuous wavelet transform — isolates localized transient events that FFT smears across time.">
            W(a, b) = 1/√a · ∫ x(t) · ψ((t − b) / a) dt
          </Equation>
          <p className="text-[11.5px] text-foreground/70">
            Spatter and short-circuit reignition produce impulsive transients best resolved by detail coefficients d3–d4.
          </p>
        </Panel>
      </div>
    </>
  );
}
