import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";

export const Route = createFileRoute("/model-profiles")({
  head: () => ({ meta: [{ title: "Model Profiles · WeldSight AI" }] }),
  component: ModelProfiles,
});

const PROFILES = [
  { id: "MIG · K400 · A572", ver: "v4.2.1", arch: "LSTM-AE", params: "412k", trained: "2026-05-18", th: 0.110, prec: 0.971, rec: 0.962, state: "ACTIVE", tone: "chip-stable" },
  { id: "TIG · S304 · Thin",  ver: "v3.8.0", arch: "Conv-AE", params: "318k", trained: "2026-04-22", th: 0.084, prec: 0.948, rec: 0.931, state: "DEPLOYED", tone: "chip-stable" },
  { id: "MIG · K400 · A572", ver: "v4.2.2-rc", arch: "LSTM-AE", params: "421k", trained: "2026-05-22", th: 0.108, prec: 0.976, rec: 0.968, state: "STAGING", tone: "chip-warn" },
  { id: "SAW · Heavy Plate",  ver: "v2.1.4", arch: "VAE",     params: "612k", trained: "2026-02-14", th: 0.142, prec: 0.901, rec: 0.886, state: "ARCHIVED", tone: "" },
  { id: "Spot · Auto Body",   ver: "v1.7.2", arch: "Conv-AE", params: "276k", trained: "2026-03-09", th: 0.067, prec: 0.962, rec: 0.940, state: "ACTIVE",   tone: "chip-stable" },
];

function ModelProfiles() {
  return (
    <>
      <PageHeader
        eyebrow="AI & TRAINING · MODEL REGISTRY"
        title="Model Profiles"
        sub="Versioned adaptive model registry · process-specific thresholds and performance metrics"
        actions={<button className="chip chip-stable mono">+ NEW PROFILE</button>}
      />
      <div className="p-3 space-y-4">
        <SectionLabel title="Profile Registry" sub={`${PROFILES.length} profiles · 2 active · 1 staging`} />
        <div className="panel overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left px-3 py-2">Profile</th>
                <th className="text-left px-3 py-2">Version</th>
                <th className="text-left px-3 py-2">Arch</th>
                <th className="text-right px-3 py-2">Params</th>
                <th className="text-right px-3 py-2">Threshold</th>
                <th className="text-right px-3 py-2">Precision</th>
                <th className="text-right px-3 py-2">Recall</th>
                <th className="text-right px-3 py-2">Trained</th>
                <th className="text-left px-3 py-2">State</th>
              </tr>
            </thead>
            <tbody className="mono">
              {PROFILES.map((p, i) => (
                <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                  <td className="px-3 py-2 text-foreground">{p.id}</td>
                  <td className="px-3 py-2 text-foreground">{p.ver}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.arch}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{p.params}</td>
                  <td className="px-3 py-2 text-right text-foreground">{p.th.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{p.prec.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{p.rec.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{p.trained}</td>
                  <td className="px-3 py-2"><span className={`chip mono ${p.tone}`}>{p.state}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
