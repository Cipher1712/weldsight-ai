import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { SyncTimeline } from "@/components/industrial/SyncTimeline";
import { Rewind, FastForward, Play } from "lucide-react";

export const Route = createFileRoute("/replay")({
  head: () => ({ meta: [{ title: "Replay Engine · WeldSight AI" }] }),
  component: Replay,
});

function Replay() {
  return (
    <>
      <PageHeader
        eyebrow="AI & TRAINING · REPLAY ENGINE"
        title="Session Replay"
        sub="Frame-accurate replay of vision + telemetry · ±5 s around any anomaly event"
        actions={
          <>
            <button className="chip mono"><Rewind className="h-3 w-3" />-5s</button>
            <button className="chip chip-stable mono"><Play className="h-3 w-3" />PLAY</button>
            <button className="chip mono"><FastForward className="h-3 w-3" />+5s</button>
          </>
        }
      />
      <div className="p-3 space-y-4">
        <div className="panel p-3">
          <div className="font-serif text-[15px] text-foreground mb-2">Session · WS-07 · 14:18:32 → 14:22:11</div>
          <div className="h-2 rounded-sm bg-surface-2 relative overflow-hidden">
            <div className="absolute inset-y-0 left-[18%] right-[42%]" style={{ background: "color-mix(in oklch, var(--color-cyan) 30%, transparent)" }} />
            <div className="absolute inset-y-0" style={{ left: "40%", width: "2px", background: "var(--color-critical)" }} />
          </div>
          <div className="flex justify-between mono text-[10px] text-muted-foreground mt-1">
            <span>14:18:32</span><span>14:20:21 · INCIDENT</span><span>14:22:11</span>
          </div>
        </div>
        <SectionLabel title="Synchronized Event Timeline" />
        <SyncTimeline />
      </div>
    </>
  );
}
