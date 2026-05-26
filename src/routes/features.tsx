import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Boxplot, Equation, Sparkline, deterministic, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Feature Distribution Explorer · WeldSight AI" }] }),
  component: Features,
});

const FEATURES = [
  { name: "spectral_entropy", unit: "bits", series: [
    { label: "OK",  min: 0.20, q1: 0.35, med: 0.42, q3: 0.50, max: 0.60, color: "var(--color-stable)" },
    { label: "POR", min: 0.55, q1: 0.68, med: 0.76, q3: 0.84, max: 0.95, color: "var(--color-critical)" },
    { label: "BRN", min: 0.30, q1: 0.42, med: 0.48, q3: 0.55, max: 0.68, color: "var(--color-high)" },
    { label: "SPT", min: 0.40, q1: 0.55, med: 0.63, q3: 0.70, max: 0.82, color: "var(--color-warn)" },
    { label: "LoF", min: 0.18, q1: 0.28, med: 0.34, q3: 0.42, max: 0.52, color: "var(--color-cyan)" },
  ]},
  { name: "rms_power", unit: "kW", series: [
    { label: "OK",  min: 1.8, q1: 2.2, med: 2.5, q3: 2.8, max: 3.1, color: "var(--color-stable)" },
    { label: "POR", min: 2.4, q1: 2.7, med: 3.0, q3: 3.3, max: 3.6, color: "var(--color-critical)" },
    { label: "BRN", min: 3.2, q1: 3.6, med: 4.0, q3: 4.4, max: 5.1, color: "var(--color-high)" },
    { label: "SPT", min: 2.0, q1: 2.4, med: 2.7, q3: 3.1, max: 3.4, color: "var(--color-warn)" },
    { label: "LoF", min: 1.4, q1: 1.6, med: 1.8, q3: 2.0, max: 2.3, color: "var(--color-cyan)" },
  ]},
  { name: "ripple_sigma", unit: "V", series: [
    { label: "OK",  min: 0.10, q1: 0.16, med: 0.21, q3: 0.27, max: 0.34, color: "var(--color-stable)" },
    { label: "POR", min: 0.32, q1: 0.42, med: 0.49, q3: 0.58, max: 0.71, color: "var(--color-critical)" },
    { label: "BRN", min: 0.18, q1: 0.24, med: 0.30, q3: 0.36, max: 0.45, color: "var(--color-high)" },
    { label: "SPT", min: 0.22, q1: 0.30, med: 0.36, q3: 0.44, max: 0.55, color: "var(--color-warn)" },
    { label: "LoF", min: 0.08, q1: 0.12, med: 0.16, q3: 0.20, max: 0.28, color: "var(--color-cyan)" },
  ]},
  { name: "thermal_drift", unit: "°C/min", series: [
    { label: "OK",  min: -1.0, q1: -0.4, med: 0.1, q3: 0.5, max: 1.0, color: "var(--color-stable)" },
    { label: "POR", min:  0.5, q1:  1.0, med: 1.4, q3: 1.9, max: 2.6, color: "var(--color-critical)" },
    { label: "BRN", min:  1.8, q1:  2.4, med: 3.0, q3: 3.6, max: 4.5, color: "var(--color-high)" },
    { label: "SPT", min:  0.2, q1:  0.6, med: 1.0, q3: 1.5, max: 2.1, color: "var(--color-warn)" },
    { label: "LoF", min: -1.6, q1: -1.0, med: -0.6, q3: -0.2, max: 0.4, color: "var(--color-cyan)" },
  ]},
  { name: "wavelet_energy", unit: "—", series: [
    { label: "OK",  min: 0.18, q1: 0.24, med: 0.30, q3: 0.36, max: 0.44, color: "var(--color-stable)" },
    { label: "POR", min: 0.32, q1: 0.42, med: 0.50, q3: 0.58, max: 0.68, color: "var(--color-critical)" },
    { label: "BRN", min: 0.40, q1: 0.50, med: 0.58, q3: 0.66, max: 0.78, color: "var(--color-high)" },
    { label: "SPT", min: 0.55, q1: 0.68, med: 0.76, q3: 0.84, max: 0.95, color: "var(--color-warn)" },
    { label: "LoF", min: 0.12, q1: 0.18, med: 0.23, q3: 0.28, max: 0.36, color: "var(--color-cyan)" },
  ]},
];

function Features() {
  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS · DISTRIBUTIONS"
        title="Feature Distribution Explorer"
        sub="Box · violin · KDE · class-wise histograms · percentile bands"
        actions={<><span className="chip mono">N = 12,480 windows</span><span className="chip chip-stable mono">healthy distributions</span></>}
      />
      <div className="p-3 grid xl:grid-cols-2 gap-4">
        {FEATURES.map(f => (
          <Panel key={f.name} title={f.name} sub={f.unit} right={<span className="chip mono">classes · 5</span>}>
            <Boxplot series={f.series} />
            <Sparkline data={deterministic(f.name.length * 7, 80, 0.5, 0.3)} w={420} h={36} color="var(--color-cyan)" />
            <div className="grid grid-cols-3 gap-2 mt-2">
              <KV k="μ"     v={(f.series[1].med).toFixed(3)} />
              <KV k="σ"     v={((f.series[1].q3 - f.series[1].q1) / 1.35).toFixed(3)} />
              <KV k="z-score @ POR" v={((f.series[1].med - f.series[0].med) / ((f.series[0].q3 - f.series[0].q1) / 1.35)).toFixed(2)} sevKey="HIGH" />
            </div>
          </Panel>
        ))}
        <Panel title="Statistical primitives" sub="formulae used across pipeline">
          <Equation note="Sample variance over rolling window.">Var(X) = 1/N · Σ (xᵢ − μ)²</Equation>
          <Equation note="Standard score — how many σ a feature deviates from class mean.">z = (x − μ) / σ</Equation>
          <p className="text-[11.5px] text-foreground/70 leading-snug">
            Distribution shifts (Δμ, Δσ, KS-statistic) indicate abnormal welding dynamics and defect onset before classifier confidence
            crosses the operational threshold.
          </p>
        </Panel>
      </div>
    </>
  );
}
