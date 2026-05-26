import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/industrial/AppShell";
import { Panel, Sparkline, deterministic, KV } from "@/components/industrial/sci";
import { Play, SkipForward, SkipBack } from "lucide-react";

export const Route = createFileRoute("/defect-evolution")({
  head: () => ({ meta: [{ title: "Defect Formation Timeline · WeldSight AI" }] }),
  component: DE,
});

const EVENTS = [
  { t: "00:00.0", k: "BASELINE",     sev: "LOW",      txt: "Process nominal · entropy 0.42 · Q 0.96 kJ/mm" },
  { t: "00:18.4", k: "DRIFT ONSET",  sev: "MODERATE", txt: "Spectral entropy rising · gas flow −4%" },
  { t: "00:31.7", k: "SUB-CRITICAL", sev: "HIGH",     txt: "Wavelet d3 +2.1× · ripple σ crosses 0.55" },
  { t: "00:42.1", k: "FORMATION",    sev: "CRITICAL", txt: "Porosity cluster detected · vision recon 0.31" },
  { t: "00:57.6", k: "ESCALATION",   sev: "CRITICAL", txt: "AI consensus 0.93 · operator notified" },
];

const sevCls = (s: string) => s === "CRITICAL" ? "chip-critical" : s === "HIGH" ? "chip-high" : s === "MODERATE" ? "chip-warn" : "chip-stable";

function DE() {
  return (
    <>
      <PageHeader
        eyebrow="INTELLIGENCE · DEFECT EVOLUTION"
        title="Defect Formation Timeline"
        sub="Confidence · entropy · heat accumulation · thermal runaway · escalation"
        actions={
          <>
            <button className="chip mono"><SkipBack className="h-3 w-3" /></button>
            <button className="chip chip-stable mono"><Play className="h-3 w-3" /> PLAY</button>
            <button className="chip mono"><SkipForward className="h-3 w-3" /></button>
          </>
        }
      />
      <div className="p-3 grid xl:grid-cols-[2fr_1fr] gap-4">
        <Panel title="Progressive escalation curves" sub="WS-04 · 14:18:00 → 14:18:58">
          <div className="space-y-3">
            <div>
              <div className="mono text-[10px] text-muted-foreground">AI confidence</div>
              <Sparkline data={deterministic(1, 120, 0.4, 0.45)} w={620} h={48} color="var(--color-critical)" baseline={0.5} />
            </div>
            <div>
              <div className="mono text-[10px] text-muted-foreground">Spectral entropy H</div>
              <Sparkline data={deterministic(2, 120, 0.45, 0.35)} w={620} h={48} color="var(--color-high)" />
            </div>
            <div>
              <div className="mono text-[10px] text-muted-foreground">Heat accumulation ∫Q dt</div>
              <Sparkline data={deterministic(3, 120, 0.55, 0.3)} w={620} h={48} color="var(--color-warn)" />
            </div>
            <div>
              <div className="mono text-[10px] text-muted-foreground">Thermal runaway index</div>
              <Sparkline data={deterministic(4, 120, 0.45, 0.4)} w={620} h={48} color="var(--color-critical)" />
            </div>
          </div>
        </Panel>
        <Panel title="Annotated events">
          <ol className="space-y-1.5">
            {EVENTS.map(e => (
              <li key={e.t} className="border border-border rounded-sm p-2 bg-surface-2/40">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10.5px] text-foreground">{e.t}</span>
                  <span className={`chip ${sevCls(e.sev)}`}>{e.k}</span>
                </div>
                <div className="text-[11.5px] text-foreground/80 mt-1 leading-snug">{e.txt}</div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Critical-onset summary" className="xl:col-span-3">
          <div className="grid grid-cols-5 gap-2">
            <KV k="Lead time"        v="24.3 s" sevKey="MODERATE" />
            <KV k="Δ entropy"        v="+0.34"  sevKey="HIGH" />
            <KV k="Peak ∫Q"          v="2.18 kJ/mm" sevKey="HIGH" />
            <KV k="Time → critical"  v="42.1 s" sevKey="CRITICAL" />
            <KV k="Operator MTTR"    v="9.8 s"  sevKey="LOW" />
          </div>
          <p className="text-[11.5px] text-foreground/70 mt-2 leading-snug">
            Defects are progressive dynamic processes — the platform exposes the full formation trajectory so engineers can intervene
            during the sub-critical window before AI consensus reaches escalation.
          </p>
        </Panel>
      </div>
    </>
  );
}
