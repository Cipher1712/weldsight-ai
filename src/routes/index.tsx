import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { KPICard } from "@/components/industrial/KPICard";
import { WeldInspectionView } from "@/components/industrial/WeldInspectionView";
import { AIDefectPanel } from "@/components/industrial/AIDefectPanel";
import { StationGrid } from "@/components/industrial/StationGrid";
import { AlertCenter } from "@/components/industrial/AlertCenter";
import { ArrowUpRight, Activity, AlertOctagon, UploadCloud, Atom } from "lucide-react";
import { PhysicsConsensusStrip } from "@/components/industrial/PhysicsSignature";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Overview · WeldSight AI" },
      { name: "description", content: "Plant-wide adaptive weld intelligence overview — live telemetry, AI anomaly state, station matrix and operator queue." },
    ],
  }),
  component: Overview,
});

function Quick({ to, icon: Icon, label, code }: { to: string; icon: any; label: string; code: string }) {
  return (
    <Link
      to={to}
      className="panel px-3 py-2.5 flex items-center gap-3 hover:border-border-strong transition-colors group"
    >
      <div className="h-8 w-8 grid place-items-center rounded-sm border border-border bg-surface-2">
        <Icon className="h-4 w-4" style={{ color: "var(--color-cyan)" }} />
      </div>
      <div className="leading-tight min-w-0 flex-1">
        <div className="text-[13px] text-foreground font-serif">{label}</div>
        <div className="mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">{code}</div>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
    </Link>
  );
}

function Overview() {
  const [spike] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="LIVE OPERATIONS · JSR-01 / HRC-04"
        title="Executive Operations Overview"
        sub="Plant-wide adaptive weld intelligence · 10 stations · 24 telemetry channels · WELD-VISION v4.2"
        actions={
          <>
            <button className="chip chip-stable mono">EXPORT BRIEF · PDF</button>
            <button className="chip mono">SHIFT REPORT</button>
          </>
        }
      />

      <div className="p-3 space-y-5">
        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Quick to="/telemetry"     icon={Activity}     label="Live Telemetry Engine"  code="6 ch · 1 kHz" />
          <Quick to="/anomalies"     icon={AlertOctagon} label="Anomaly Intelligence"   code="14 active · 3 crit" />
          <Quick to="/stations"      icon={Activity}     label="Station State Matrix"   code="10 / 10 online" />
          <Quick to="/upload-train"  icon={UploadCloud}  label="Upload & Train Model"   code="profile v4.2.1" />
        </div>

        {/* Compact KPI strip — operational, not vanity */}
        <section>
          <SectionLabel title="Operational Indicators" sub="1 s cadence · adaptive thresholds" />
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
            <KPICard label="Weld Integrity"     value={94.2} unit="%"   delta={0.6}  status="STABLE"   base={94} amp={2} />
            <KPICard label="Arc Stability Idx"  value={0.87} unit="idx" delta={-1.4} status="MODERATE" precision={2} base={0.88} amp={0.04} />
            <KPICard label="Recon Error μ"      value={0.042} unit=""   delta={-1.2} status="STABLE"   precision={3} base={0.04} amp={0.006} />
            <KPICard label="AI Confidence"      value={0.96} unit=""    delta={0.2}  status="STABLE"   precision={2} base={0.95} amp={0.02} />
            <KPICard label="Inference Latency"  value={12.4} unit="ms"  delta={-3.2} status="STABLE"   base={13} amp={1.4} />
            <KPICard label="Stream Lag"         value={0.4}  unit="ms"  delta={0}    status="STABLE"   precision={2} base={0.4} amp={0.05} />
            <KPICard label="Anomalies · 24h"    value={14}   unit=""    delta={9}    status="MODERATE" base={12} amp={3} precision={0} />
            <KPICard label="Critical Events"    value={3}    unit="24h" delta={50}   status="CRITICAL" base={2} amp={1.5} precision={0} />
          </div>
        </section>

        <section>
          <SectionLabel title="Active Inspection · WS-07 · MIG-K400-A" sub="synchronized vision + telemetry · adaptive ROI" />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-3" style={{ height: "min(560px, 64vh)" }}>
            <WeldInspectionView spike={spike} />
            <AIDefectPanel />
          </div>
        </section>

        <section>
          <SectionLabel title="Station State Matrix" sub="HRC-LINE-04 · health, AI confidence, throughput" />
          <StationGrid />
        </section>

        <section>
          <SectionLabel title="Active Event Queue" sub="acknowledgement · escalation" />
          <AlertCenter />
        </section>

        <footer className="mono text-[10px] text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 pb-4">
          <span>© Tata Steel · WeldSight AI · Adaptive Industrial Weld Intelligence Platform · v4.2.1</span>
          <span>Stream 0.4 ms · Inference 12.4 ms · Model WELD-VISION-v4.2 · Kafka weld.telemetry.v3</span>
        </footer>
      </div>
    </>
  );
}
