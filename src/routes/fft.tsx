import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { TelemetryEngine } from "@/components/industrial/TelemetryEngine";
import { useState } from "react";

export const Route = createFileRoute("/fft")({
  head: () => ({ meta: [{ title: "FFT · Spectral Analysis · WeldSight AI" }] }),
  component: FFTPage,
});

function FFTPage() {
  const [, setSpike] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS · SPECTRAL"
        title="FFT &amp; Spectral Analysis"
        sub="Hann-windowed 1.8 kHz spectrum · ripple variance · spectral entropy · thermal drift"
        actions={
          <>
            <button className="chip mono">WINDOW · HANN</button>
            <button className="chip mono">RES · 25 Hz</button>
            <button className="chip chip-stable mono">EXPORT FFT</button>
          </>
        }
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Live Signals · FFT · Ripple · Drift" />
        <TelemetryEngine onSpike={setSpike} />
      </div>
    </>
  );
}
