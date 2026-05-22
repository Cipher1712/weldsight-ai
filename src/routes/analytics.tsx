import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { HistoricalAnalytics } from "@/components/industrial/HistoricalAnalytics";
import { DefectHeatmap } from "@/components/industrial/DefectHeatmap";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Historical Analytics · WeldSight AI" }] }),
  component: Analytics,
});

function Analytics() {
  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS · HISTORICAL"
        title="Historical Analytics"
        sub="Pass / fail trend · anomaly density · station comparison · drift evolution"
        actions={
          <>
            <button className="chip chip-stable mono">7 D</button>
            <button className="chip mono">30 D</button>
            <button className="chip mono">90 D</button>
            <button className="chip mono">EXPORT · PDF</button>
            <button className="chip mono">EXPORT · CSV</button>
          </>
        }
      />
      <div className="p-3 space-y-5">
        <SectionLabel title="Plant Performance" />
        <HistoricalAnalytics />
        <SectionLabel title="Defect Density Heatmap" sub="cross-station · last 60 min" />
        <DefectHeatmap />
      </div>
    </>
  );
}
