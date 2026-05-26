import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { AIDefectPanel } from "@/components/industrial/AIDefectPanel";
import { DefectHeatmap } from "@/components/industrial/DefectHeatmap";
import { SyncTimeline } from "@/components/industrial/SyncTimeline";
import { AlertCenter } from "@/components/industrial/AlertCenter";
import { PHYSICS_DEFECTS, PhysicsSignaturePanel, PhysicsConsensusStrip } from "@/components/industrial/PhysicsSignature";


export const Route = createFileRoute("/anomalies")({
  head: () => ({ meta: [{ title: "Anomaly Center · WeldSight AI" }] }),
  component: AnomaliesPage,
});

const ANOMALIES = [
  { type: "Arc Instability",       sig: "MIG.V",  station: "WS-07", err: 0.184, conf: 0.94, sev: "HIGH",     cause: "Wire feed harmonic at 312 Hz · contact tip wear", action: "Reduce wire feed 4% · inspect tip", ts: "14:21:08", lat: "11.2 ms" },
  { type: "Porosity Cluster",      sig: "VISION", station: "WS-04", err: 0.221, conf: 0.97, sev: "CRITICAL", cause: "Shielding gas turbulence · regulator fluctuation",  action: "Verify gas pressure · pause station", ts: "14:18:44", lat: "14.6 ms" },
  { type: "Ripple Inconsistency",  sig: "AI.IDX", station: "WS-02", err: 0.092, conf: 0.88, sev: "MODERATE", cause: "Inverter ripple beyond σ=0.55 threshold",            action: "Schedule inverter check · next shift",   ts: "14:15:02", lat: "9.8 ms" },
  { type: "Thermal Excursion",     sig: "PYRO",   station: "WS-09", err: 0.137, conf: 0.91, sev: "HIGH",     cause: "Pyrometer drift · coolant flow 78% nominal",         action: "Increase coolant 12% · log drift",       ts: "14:11:37", lat: "10.4 ms" },
  { type: "Penetration Anomaly",   sig: "VISION", station: "WS-07", err: 0.166, conf: 0.92, sev: "HIGH",     cause: "Travel speed deviation +6% above adaptive band",     action: "Trim travel speed · review profile",     ts: "14:09:11", lat: "13.1 ms" },
  { type: "Spectral Drift",        sig: "FFT",    station: "WS-03", err: 0.058, conf: 0.86, sev: "MODERATE", cause: "Energy shift 480→512 Hz · bearing onset",            action: "Predictive maintenance ticket",          ts: "14:04:55", lat: "8.7 ms" },
];

function sevChip(sev: string) {
  if (sev === "CRITICAL") return "chip chip-critical";
  if (sev === "HIGH")     return "chip chip-high";
  if (sev === "MODERATE") return "chip chip-warn";
  return "chip chip-stable";
}

export function AnomalyCard({ a }: { a: typeof ANOMALIES[number] }) {
  return (
    <div className="panel p-3">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={sevChip(a.sev) + " mono"}>{a.sev}</span>
            <span className="font-serif text-[15px] text-foreground">{a.type}</span>
          </div>
          <div className="mono text-[10px] text-muted-foreground mt-1">{a.station} · signal {a.sig} · {a.ts} · inf {a.lat}</div>
        </div>
        <div className="text-right mono text-[10.5px] shrink-0">
          <div className="text-foreground">err {a.err.toFixed(3)}</div>
          <div className="text-muted-foreground">conf {a.conf.toFixed(2)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Probable Cause</div>
          <div className="text-[12px] text-foreground mt-0.5 leading-snug">{a.cause}</div>
        </div>
        <div>
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Recommended Action</div>
          <div className="text-[12px] mt-0.5 leading-snug" style={{ color: "var(--color-cyan)" }}>{a.action}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button className="chip mono">ACKNOWLEDGE</button>
        <button className="chip mono">ESCALATE</button>
        <button className="chip mono">REPLAY ±5s</button>
        <button className="chip mono">CREATE TICKET</button>
      </div>
    </div>
  );
}

function AnomaliesPage() {
  return (
    <>
      <PageHeader
        eyebrow="LIVE OPERATIONS · AI INTELLIGENCE"
        title="Anomaly Intelligence Center"
        sub="Reconstruction-error driven detection · adaptive thresholds · multi-station correlation"
        actions={
          <>
            <button className="chip mono">FILTER · ALL STATIONS</button>
            <button className="chip mono">SEVERITY · ≥ MODERATE</button>
            <button className="chip chip-stable mono">EXPORT INCIDENT LOG</button>
          </>
        }
      />
      <div className="p-3 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border border border-border rounded-md overflow-hidden">
          {[
            ["ACTIVE", "14", "var(--color-warn)"],
            ["CRITICAL", "3", "var(--color-critical)"],
            ["HIGH", "5", "var(--color-high)"],
            ["MEAN RECON ERR", "0.118", "var(--color-foreground)"],
            ["MODEL", "WELD-VISION v4.2", "var(--color-cyan)"],
          ].map(([k, v, c]) => (
            <div key={k} className="bg-panel px-3 py-2">
              <div className="mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{k}</div>
              <div className="mono text-[16px]" style={{ color: c as string }}>{v}</div>
            </div>
          ))}
        </div>

        <section>
          <SectionLabel title="Active Anomalies" sub="ordered by severity · click to inspect ±5 s replay" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {ANOMALIES.map((a) => <AnomalyCard key={a.ts} a={a} />)}
          </div>
        </section>

        <section>
          <SectionLabel title="Correlation · Heatmap · Synchronization" sub="cross-station · last 60 min" />
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-3" style={{ minHeight: 340 }}>
            <DefectHeatmap />
            <SyncTimeline />
          </div>
        </section>

        <section>
          <SectionLabel title="Operator Queue" />
          <AlertCenter />
        </section>

        <section>
          <SectionLabel title="Detection Pipeline · Adaptive Threshold Status" sub="WELD-VISION v4.2 · per-channel σ bands" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
            {[
              ["MIG.V",   "σ 0.52", "0.184", "HIGH",     "var(--color-high)"],
              ["MIG.I",   "σ 0.47", "0.061", "STABLE",   "var(--color-stable)"],
              ["VISION",  "σ 0.61", "0.221", "CRITICAL", "var(--color-critical)"],
              ["AI.IDX",  "σ 0.55", "0.092", "MODERATE", "var(--color-warn)"],
              ["PYRO",    "σ 0.49", "0.137", "HIGH",     "var(--color-high)"],
              ["FFT",     "σ 0.58", "0.058", "MODERATE", "var(--color-warn)"],
            ].map(([ch, band, err, state, color]) => (
              <div key={ch} className="panel px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{ch}</div>
                  <span className="mono text-[9px]" style={{ color: color as string }}>● {state}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <div className="mono text-[15px] text-foreground">{err}</div>
                  <div className="mono text-[9.5px] text-muted-foreground">{band}</div>
                </div>
                <div className="mt-1.5 h-1 bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${Math.min(100, parseFloat(err as string) * 380)}%`, background: color as string }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mono text-[10px] text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 pb-4">
          <span>© Tata Steel · WeldSight AI · Anomaly Intelligence Center · WELD-VISION v4.2</span>
          <span>14 active · 3 critical · μ recon 0.118 · adaptive σ rebuild every 60 s · Kafka weld.telemetry.v3</span>
        </footer>
      </div>
    </>
  );
}
