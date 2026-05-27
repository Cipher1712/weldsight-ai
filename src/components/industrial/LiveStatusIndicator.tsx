import { useEffect, useState } from "react";
import { selectWs, useLiveStore } from "@/store/liveStore";

const TONE: Record<string, { bg: string; led: string; label: string }> = {
  connected:    { bg: "chip-stable",   led: "var(--color-stable)",   label: "WS · LIVE" },
  polling:      { bg: "chip-stable",   led: "var(--color-stable)",   label: "REST · LIVE" },
  connecting:   { bg: "chip-warn",     led: "var(--color-warn)",     label: "CONNECTING" },
  reconnecting: { bg: "chip-warn",     led: "var(--color-warn)",     label: "RECONNECT" },
  idle:         { bg: "",              led: "var(--color-muted-foreground)", label: "IDLE" },
  disconnected: { bg: "chip-critical", led: "var(--color-critical)", label: "OFFLINE" },
  error:        { bg: "chip-critical", led: "var(--color-critical)", label: "ERROR" },
};

export function LiveStatusIndicator({ compact = false }: { compact?: boolean }) {
  const ws = useLiveStore(selectWs);
  const tone = TONE[ws.state] ?? TONE.idle;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const age = ws.lastMessageAt ? Math.max(0, Math.round((now - ws.lastMessageAt) / 1000)) : null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">BACKEND</span>
      <span className={`chip ${tone.bg} mono`} title={ws.url ?? "no transport"}>
        <span className="led" style={{ background: tone.led }} />
        {tone.label}
      </span>
      {!compact && (
        <span className="mono text-[10px] text-muted-foreground hidden xl:inline">
          {ws.packetsPerSec ? `${ws.packetsPerSec}/s · ` : ""}
          Σ {ws.packetCount} pkt
          {age !== null ? ` · ${age}s ago` : ""}
        </span>
      )}
    </div>
  );
}
