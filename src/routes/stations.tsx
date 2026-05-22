import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { StationGrid } from "@/components/industrial/StationGrid";
import { PredictiveMaintenance } from "@/components/industrial/PredictiveMaintenance";
import { OperatorActions } from "@/components/industrial/OperatorActions";

export const Route = createFileRoute("/stations")({
  head: () => ({ meta: [{ title: "Multi-Station Monitoring · WeldSight AI" }] }),
  component: StationsPage,
});

function StationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="LIVE OPERATIONS · STATION MATRIX"
        title="Multi-Station Monitoring"
        sub="HRC-LINE-04 · 10 welding stations · live health, AI confidence, throughput and station mode"
        actions={
          <>
            <button className="chip mono">LINE · HRC-04</button>
            <button className="chip mono">SHIFT · B</button>
            <button className="chip chip-stable mono">10 / 10 ONLINE</button>
          </>
        }
      />
      <div className="p-3 space-y-5">
        <SectionLabel title="Station State Matrix" sub="WS-01 → WS-10" />
        <StationGrid />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3" style={{ minHeight: 360 }}>
          <PredictiveMaintenance />
          <OperatorActions />
        </div>
      </div>
    </>
  );
}
