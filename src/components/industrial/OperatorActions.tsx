const ACTIONS = [
  { k: "ACK", label: "Acknowledge Alerts", tone: "warn" },
  { k: "INS", label: "Request Inspection", tone: "ok" },
  { k: "FLG", label: "Flag Anomaly", tone: "warn" },
  { k: "PSE", label: "Pause Operation", tone: "crit" },
  { k: "EXP", label: "Export Report", tone: "ok" },
  { k: "ESC", label: "Escalate Event", tone: "crit" },
];

export function OperatorActions() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header">
        <span className="panel-title">Operator Action Center</span>
        <span className="chip mono">OP-2241</span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {ACTIONS.map((a) => {
          const cls = a.tone === "crit" ? "border-critical/40 text-critical hover:bg-critical/10"
                    : a.tone === "warn" ? "border-warn/40 text-warn hover:bg-warn/10"
                    : "border-border-strong text-foreground hover:bg-surface-3";
          return (
            <button key={a.k} className={`text-left p-2 rounded border bg-surface-2 ${cls}`} style={{
              borderColor: a.tone === "crit" ? "color-mix(in oklch, var(--color-critical) 35%, transparent)"
                       : a.tone === "warn" ? "color-mix(in oklch, var(--color-warn) 35%, transparent)"
                       : undefined
            }}>
              <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{a.k}</div>
              <div className="text-[12px] font-medium">{a.label}</div>
            </button>
          );
        })}
      </div>
      <div className="px-3 pb-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Operator notes</div>
        <textarea
          placeholder="Log observation, root cause hypothesis, corrective action…"
          className="w-full h-20 bg-surface-2 border border-border rounded p-2 text-[11.5px] outline-none focus:border-border-strong resize-none"
        />
        <div className="mt-1.5 flex justify-end gap-1.5">
          <button className="text-[10.5px] mono px-2 py-1 rounded border border-border bg-surface-2 text-muted-foreground">CLEAR</button>
          <button className="text-[10.5px] mono px-2 py-1 rounded border border-border-strong bg-surface-3 text-foreground">SUBMIT</button>
        </div>
      </div>
    </div>
  );
}
