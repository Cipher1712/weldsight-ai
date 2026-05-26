import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, KV } from "@/components/industrial/sci";

export const Route = createFileRoute("/standards")({
  head: () => ({ meta: [{ title: "Standards Compliance Intelligence · WeldSight AI" }] }),
  component: STD,
});

const STANDARDS = [
  { code: "AWS D1.1",  scope: "Structural steel welding",  pass: 0.96, level: "Compliant" },
  { code: "ISO 5817",  scope: "Fusion welding · quality",  pass: 0.92, level: "Level B" },
  { code: "ASME IX",   scope: "Welding qualification",     pass: 0.94, level: "Qualified" },
  { code: "EN 287-1",  scope: "Welder qualification · steel", pass: 0.90, level: "Compliant" },
];

const DEFECT_LIMITS = [
  { d: "Porosity (single)",  aws: "≤ 2.4 mm", iso: "≤ 0.3·t", asme: "≤ 3 mm", live: "1.8 mm", ok: true },
  { d: "Porosity (cluster)", aws: "≤ 13 mm/152 mm", iso: "Σ ≤ 25 mm/100 mm", asme: "≤ 19 mm", live: "11.2 mm", ok: true },
  { d: "Undercut depth",     aws: "≤ 1 mm",  iso: "≤ 0.5 mm", asme: "≤ 0.8 mm", live: "0.6 mm", ok: false },
  { d: "Burn-through",       aws: "Not permitted", iso: "Not permitted", asme: "Not permitted", live: "0 events", ok: true },
  { d: "Lack of fusion",     aws: "Not permitted", iso: "Not permitted", asme: "Not permitted", live: "1 event", ok: false },
  { d: "Spatter (heavy)",    aws: "Remove",  iso: "Remove",  asme: "Remove",  live: "minor", ok: true },
];

function STD() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · STANDARDS"
        title="Standards Compliance Intelligence"
        sub="AWS D1.1 · ISO 5817 · ASME IX · EN 287-1 · live defect mapping"
        actions={<><span className="chip chip-stable mono">PASS · 92%</span><span className="chip mono">audit-ready</span></>}
      />
      <div className="p-3 grid xl:grid-cols-4 gap-4">
        {STANDARDS.map(s => (
          <Panel key={s.code} title={s.code} sub={s.scope}>
            <KV k="Pass rate"   v={`${(s.pass * 100).toFixed(0)}%`} sevKey={s.pass > 0.94 ? "LOW" : "MODERATE"} />
            <KV k="Level"       v={s.level} />
            <KV k="Last audit"  v="2026-04-18" />
            <KV k="Next audit"  v="2026-07-18" />
          </Panel>
        ))}
        <Panel title="Defect acceptance · live vs standard" className="xl:col-span-4">
          <table className="w-full mono text-[11px]">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-1.5">DEFECT</th>
                <th className="text-left">AWS D1.1</th>
                <th className="text-left">ISO 5817</th>
                <th className="text-left">ASME IX</th>
                <th className="text-left">LIVE</th>
                <th className="text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {DEFECT_LIMITS.map(r => (
                <tr key={r.d} className="border-b border-border/60">
                  <td className="py-1.5 text-foreground">{r.d}</td>
                  <td className="text-foreground/80">{r.aws}</td>
                  <td className="text-foreground/80">{r.iso}</td>
                  <td className="text-foreground/80">{r.asme}</td>
                  <td className="text-foreground">{r.live}</td>
                  <td className="text-right">
                    <span className={`chip ${r.ok ? "chip-stable" : "chip-high"}`}>{r.ok ? "PASS" : "REVIEW"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}
