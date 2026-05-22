import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { TelemetryEngine } from "@/components/industrial/TelemetryEngine";
import { WeldInspectionView } from "@/components/industrial/WeldInspectionView";
import { Play, Square, Rewind, Pause } from "lucide-react";

export const Route = createFileRoute("/telemetry")({
  head: () => ({ meta: [{ title: "Live Telemetry · WeldSight AI" }] }),
  component: TelemetryPage,
});

function StreamButton({ icon: Icon, label, tone = "default" }: { icon: any; label: string; tone?: "default" | "stable" | "critical" }) {
  const cls = tone === "stable" ? "chip-stable" : tone === "critical" ? "chip-critical" : "";
  return (
    <button className={`chip ${cls} mono px-2.5 py-1.5`}>
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function TelemetryPage() {
  const [spike, setSpike] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="LIVE OPERATIONS · TELEMETRY ENGINE"
        title="Real-Time Telemetry Engine"
        sub="WS-07 · PLC-HRC-04 · 1 kHz sampling · 6 of 24 channels · synchronized to vision stream"
        actions={
          <>
            <StreamButton icon={Play} label="START STREAM" tone="stable" />
            <StreamButton icon={Pause} label="PAUSE" />
            <StreamButton icon={Square} label="STOP" tone="critical" />
            <StreamButton icon={Rewind} label="REPLAY SESSION" />
          </>
        }
      />
      <div className="p-3 space-y-5">
        {/* Stream telemetry strip */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-border border border-border rounded-md overflow-hidden">
          {[
            ["WS BADGE", "● LIVE", "var(--color-stable)"],
            ["STREAM LAG", "0.4 ms", "var(--color-stable)"],
            ["PACKET RATE", "1,024 / s", "var(--color-foreground)"],
            ["SYNC DRIFT", "Δ 0.38 ms", "var(--color-stable)"],
            ["DROPPED", "0.018 %", "var(--color-warn)"],
            ["INFERENCE", "12.4 ms", "var(--color-stable)"],
          ].map(([k, v, c]) => (
            <div key={k} className="bg-panel px-3 py-2">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{k}</div>
              <div className="mono text-[14px]" style={{ color: c as string }}>{v}</div>
            </div>
          ))}
        </div>

        <section>
          <SectionLabel title="Synchronized Vision · WS-07" sub="ROI overlay locked to telemetry spike window" />
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3" style={{ height: "min(440px, 56vh)" }}>
            <WeldInspectionView spike={spike} />
            <div className="panel p-3 overflow-y-auto">
              <div className="font-serif text-[15px] text-foreground mb-2">Stream Diagnostics</div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 mono text-[11px]">
                {[
                  ["Edge node", "EDGE-JTX-07"],
                  ["PLC channel", "PLC-HRC-04"],
                  ["Sampling", "1,000 Hz"],
                  ["Codec", "H.264 / RTSP"],
                  ["Frame", "1920×1080 · 60 fps"],
                  ["Encoder pos", "1284.624"],
                  ["Pyrometer", "412 °C"],
                  ["Weld speed", "38.2 cm/min"],
                  ["Wire feed", "8.4 m/min"],
                  ["Gas mix", "82 Ar / 18 CO₂"],
                  ["Window", "60 s rolling"],
                  ["Topic", "weld.telemetry.v3"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground uppercase tracking-[0.14em] text-[9.5px] self-center">{k}</dt>
                    <dd className="text-foreground text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel title="Signal Channels · FFT · Spectral" />
          <TelemetryEngine onSpike={setSpike} />
        </section>
      </div>
    </>
  );
}
