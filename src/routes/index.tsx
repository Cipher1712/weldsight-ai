import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlobalHeader } from "@/components/industrial/GlobalHeader";
import { KPICard } from "@/components/industrial/KPICard";
import { WeldInspectionView } from "@/components/industrial/WeldInspectionView";
import { AIDefectPanel } from "@/components/industrial/AIDefectPanel";
import { TelemetryEngine } from "@/components/industrial/TelemetryEngine";
import { StationGrid } from "@/components/industrial/StationGrid";
import { AlertCenter } from "@/components/industrial/AlertCenter";
import { HistoricalAnalytics } from "@/components/industrial/HistoricalAnalytics";
import { PredictiveMaintenance } from "@/components/industrial/PredictiveMaintenance";
import { DigitalTwin } from "@/components/industrial/DigitalTwin";
import { OperatorActions } from "@/components/industrial/OperatorActions";
import { DefectHeatmap } from "@/components/industrial/DefectHeatmap";
import { SyncTimeline } from "@/components/industrial/SyncTimeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeldSight AI · Adaptive Industrial Weld Intelligence · Tata Steel" },
      { name: "description", content: "WeldSight AI — real-time adaptive weld intelligence, synchronized vision + telemetry, predictive maintenance and process stability analytics for Tata Steel Industry 4.0 plants." },
    ],
  }),
  component: Dashboard,
});

function SectionLabel({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-1.5 mb-2">
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-[17px] text-foreground tracking-tight">{title}</h2>
        {sub && <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</span>}
      </div>
      <span className="mono text-[10px] text-muted-foreground">LIVE · synchronized</span>
    </div>
  );
}

function Dashboard() {
  const [spike, setSpike] = useState(0);

  return (
    <div className="min-h-screen">
      <GlobalHeader />

      <main className="p-3 space-y-5">
        {/* KPI strip */}
        <section>
          <SectionLabel title="Executive Operations Overview" sub="16 indicators · 1-second cadence" />
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
            <KPICard label="Weld Integrity"     value={94.2} unit="%"   delta={0.6}  status="STABLE"   base={94} amp={2} />
            <KPICard label="Arc Stability Idx"  value={0.87} unit="idx" delta={-1.4} status="MODERATE" precision={2} base={0.88} amp={0.04} />
            <KPICard label="Thermal Drift"      value={14.6} unit="°C/h" delta={2.1}  status="HIGH"    base={12} amp={3} />
            <KPICard label="AI Confidence"      value={0.96} unit=""    delta={0.2}  status="STABLE"   precision={2} base={0.95} amp={0.02} />
            <KPICard label="Process Stability"  value={88.4} unit="%"   delta={-0.9} status="MODERATE" base={88} amp={2} />
            <KPICard label="Defect Density"     value={2.14} unit="/m"  delta={4.2}  status="HIGH"    base={2} amp={0.4} />
            <KPICard label="Heat Input"         value={1.42} unit="kJ/mm" delta={-0.3} status="STABLE" precision={2} base={1.4} amp={0.08} />
            <KPICard label="Throughput"         value={284}  unit="u/h" delta={1.1}  status="STABLE"   base={280} amp={6} precision={0} />
            <KPICard label="Inspection Latency" value={12.4} unit="ms"  delta={-3.2} status="STABLE"   base={13} amp={1.4} />
            <KPICard label="Downtime Risk"      value={27}   unit="%"   delta={5.4}  status="HIGH"    base={24} amp={4} precision={0} />
            <KPICard label="Op. Efficiency"     value={91.8} unit="%"   delta={0.4}  status="STABLE"   base={91} amp={1.5} />
            <KPICard label="Weld Pass Rate"     value={97.1} unit="%"   delta={-0.2} status="STABLE"   base={97} amp={1} />
            <KPICard label="Active Defect Zones" value={6}   unit=""    delta={20}   status="HIGH"    base={5} amp={2} precision={0} />
            <KPICard label="Critical Events"    value={3}    unit="24h" delta={50}   status="CRITICAL" base={2} amp={1.5} precision={0} />
            <KPICard label="Signal Consistency" value={0.91} unit="idx" delta={-1.0} status="MODERATE" precision={2} base={0.92} amp={0.03} />
            <KPICard label="Real-Time Health"   value={82}   unit=""    delta={-2.2} status="MODERATE" base={82} amp={3} precision={0} />
          </div>
        </section>

        <section>
          <SectionLabel title="Live Weld Inspection &amp; AI Defect Intelligence" sub="WS-07 · MIG-K400-A · synchronized vision + telemetry" />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-3" style={{ height: "min(640px, 70vh)" }}>
            <WeldInspectionView spike={spike} />
            <AIDefectPanel />
          </div>
        </section>

        <section>
          <SectionLabel title="Real-Time Telemetry Engine" sub="6 channels · FFT · ripple · thermal drift" />
          <TelemetryEngine onSpike={setSpike} />
        </section>

        <section>
          <SectionLabel title="Multi-Station Monitoring" sub="10 stations · HRC-LINE-04" />
          <StationGrid />
        </section>

        <section>
          <SectionLabel title="Event Management, Predictive Maintenance &amp; Operator Actions" />
          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_1fr] gap-3" style={{ minHeight: 380 }}>
            <AlertCenter />
            <PredictiveMaintenance />
            <OperatorActions />
          </div>
        </section>

        <section>
          <SectionLabel title="Defect Heatmap &amp; Synchronization Timeline" sub="cross-station correlation · last 60 min" />
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-3" style={{ minHeight: 360 }}>
            <DefectHeatmap />
            <SyncTimeline />
          </div>
        </section>

        <section>
          <SectionLabel title="Historical Analytics &amp; Plant Digital Twin" sub="executive reporting view" />
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3">
            <HistoricalAnalytics />
            <DigitalTwin />
          </div>
        </section>

        <footer className="mono text-[10px] text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 pb-4">
          <span>© Tata Steel · WeldSight AI · Adaptive Industrial Weld Intelligence Platform · v4.2.1 · build 20260518.3</span>
          <span>Stream lag 0.4 ms · Inference 12.4 ms · Edge Jetson AGX Orin · Kafka weld.telemetry.v3 · Model WELD-VISION-v4.2</span>
        </footer>
      </main>
    </div>
  );
}
