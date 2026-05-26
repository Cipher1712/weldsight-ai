import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { PHYSICS_DEFECTS, PhysicsSignaturePanel, PhysicsConsensusStrip } from "@/components/industrial/PhysicsSignature";

export const Route = createFileRoute("/physics")({
  head: () => ({ meta: [{ title: "Physics Signature Intelligence · WeldSight AI" }] }),
  component: PhysicsPage,
});

function PhysicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · PHYSICS SIGNATURE"
        title="Physics Signature Intelligence"
        sub="Electrical · thermal · spectral · mathematical interpretation of every detected weld defect"
        actions={
          <>
            <span className="chip chip-stable mono">PHYSICS ENGINE · v2.1</span>
            <span className="chip mono">Σ 4 active signatures</span>
          </>
        }
      />
      <div className="p-3 space-y-4">
        <PhysicsConsensusStrip />
        <SectionLabel title="Defect Physics Explanations" sub="dark diagnostic console · governing equations · live indicators" />
        <div className="grid gap-4">
          {PHYSICS_DEFECTS.map(d => <PhysicsSignaturePanel key={d.id} d={d} />)}
        </div>
        <div className="panel px-3 py-2 mono text-[10px] text-muted-foreground flex flex-wrap gap-x-5 gap-y-1">
          <span>physics-kernel · ws07.edge</span>
          <span>kafka · weld.physics.v1</span>
          <span>fft window · hann 1024</span>
          <span>wavelet · db4 · 5-level</span>
          <span>thermal · pyro-2k @ 1 kHz</span>
        </div>
      </div>
    </>
  );
}
