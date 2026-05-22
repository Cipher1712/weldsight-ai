import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/validation")({
  head: () => ({ meta: [{ title: "Validation Standards · WeldSight AI" }] }),
  component: Validation,
});

const STDS = [
  ["AWS D1.1",   "Structural Welding Code — Steel",        "v2024", "MAPPED", "chip-stable"],
  ["ISO 5817",   "Quality levels for imperfections (fusion welding)", "Level B", "MAPPED", "chip-stable"],
  ["ISO 3834-2", "Quality requirements for fusion welding · comprehensive", "—", "MAPPED", "chip-stable"],
  ["ASME IX",    "Welding & brazing qualifications",       "2023", "PARTIAL", "chip-warn"],
  ["EN 287-1",   "Approval testing of welders · fusion",   "—",    "MAPPED", "chip-stable"],
  ["IS 9595",    "Metal-arc welding of carbon steels",     "—",    "MAPPED", "chip-stable"],
];

function Validation() {
  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS · VALIDATION"
        title="Validation Standards"
        sub="Standards-to-detector mapping · acceptance criteria for AI defect classes"
        actions={<button className="chip mono">EXPORT MAPPING</button>}
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Standards Registry" />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Standard</th>
                <th className="text-left px-3 py-2">Title</th>
                <th className="text-left px-3 py-2">Edition</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="mono">
              {STDS.map((s, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{s[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s[1]}</td>
                  <td className="px-3 py-2 text-foreground">{s[2]}</td>
                  <td className="px-3 py-2"><span className={`chip mono ${s[4]}`}>{s[3]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
