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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Industrial AI Weld Intelligence Platform · Tata Steel" },
      { name: "description", content: "Real-time AI-powered weld quality, telemetry, and predictive maintenance command center for steel manufacturing." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [spike, setSpike] = useState(0);

  return (
    <div className="min-h-screen">
      <GlobalHeader />

      <main className="p-3 space-y-3">
        {/* KPI strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
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
        </section>

        {/* Inspection + AI panel */}
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-3" style={{ height: "min(640px, 70vh)" }}>
          <WeldInspectionView spike={spike} />
          <AIDefectPanel />
        </section>

        {/* Telemetry full-width */}
        <section>
          <TelemetryEngine onSpike={setSpike} />
        </section>

        {/* Station grid */}
        <section>
          <StationGrid />
        </section>

        {/* Alerts + Predictive + Operator */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_1fr] gap-3" style={{ minHeight: 380 }}>
          <AlertCenter />
          <PredictiveMaintenance />
          <OperatorActions />
        </section>

        {/* Historical + Digital twin */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3">
          <HistoricalAnalytics />
          <DigitalTwin />
        </section>

        <footer className="mono text-[10px] text-muted-foreground flex items-center justify-between border-t border-border pt-2 pb-4">
          <span>© Tata Steel · Industrial AI Weld Intelligence Platform · v4.2.1 · build 20260518.3</span>
          <span>Stream lag 0.4 ms · Inference 12.4 ms · Edge Jetson AGX · Kafka topic weld.telemetry.v3</span>
        </footer>
      </main>
    </div>
  );
}
