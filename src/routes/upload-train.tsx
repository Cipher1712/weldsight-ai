import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, X, Cpu } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Area, ComposedChart,
} from "recharts";

export const Route = createFileRoute("/upload-train")({
  head: () => ({ meta: [{ title: "Upload & Train · WeldSight AI" }] }),
  component: UploadTrain,
});

type UFile = { name: string; size: string; kind: "current" | "voltage" | "combined" | "image" | "wave"; status: "OK" | "VALIDATING" };
type Stage = { key: string; label: string; pct: number };

const INITIAL_FILES: UFile[] = [
  { name: "ws07_current_20260518_1421.csv",  size: "8.4 MB",  kind: "current",  status: "OK" },
  { name: "ws07_voltage_20260518_1421.csv",  size: "8.4 MB",  kind: "voltage",  status: "OK" },
  { name: "ws07_combined_20260518_1421.csv", size: "16.1 MB", kind: "combined", status: "OK" },
  { name: "ws07_macro_018.png",              size: "1.8 MB",  kind: "image",    status: "OK" },
  { name: "ws07_waveform_segment_42.npz",    size: "12.6 MB", kind: "wave",     status: "VALIDATING" },
];

const STAGES: Stage[] = [
  { key: "preproc",   label: "Pre-processing",          pct: 100 },
  { key: "norm",      label: "Normalisation",           pct: 100 },
  { key: "feat",      label: "Feature Extraction",      pct: 92 },
  { key: "win",       label: "Rolling Window Generation", pct: 78 },
  { key: "train",     label: "Model Training",          pct: 46 },
  { key: "recon",     label: "Reconstruction Loss",     pct: 46 },
  { key: "thresh",    label: "Adaptive Threshold Calc.", pct: 0 },
  { key: "version",   label: "Model Versioning",        pct: 0 },
];

const LOSS = Array.from({ length: 60 }, (_, i) => ({
  e: i,
  train: 0.42 * Math.exp(-i / 22) + 0.018 + Math.random() * 0.004,
  val:   0.46 * Math.exp(-i / 20) + 0.026 + Math.random() * 0.006,
}));

const THRESH = Array.from({ length: 80 }, (_, i) => ({
  t: i,
  err: 0.05 + Math.abs(Math.sin(i / 6)) * 0.04 + Math.random() * 0.012,
}));

function kindIcon(k: UFile["kind"]) {
  if (k === "image") return ImageIcon;
  return FileText;
}

function UploadTrain() {
  const [files, setFiles] = useState<UFile[]>(INITIAL_FILES);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(list: FileList | null) {
    if (!list) return;
    const added: UFile[] = Array.from(list).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      kind: f.name.endsWith(".png") || f.name.endsWith(".jpg") ? "image" : "combined",
      status: "VALIDATING",
    }));
    setFiles((cur) => [...added, ...cur]);
  }

  return (
    <>
      <PageHeader
        eyebrow="AI & TRAINING · UPLOAD PIPELINE"
        title="Upload &amp; Train Adaptive Model"
        sub="Ingest welding telemetry, waveform segments and macro imagery · build adaptive thresholds and versioned model profiles"
        actions={
          <>
            <button className="chip mono">SCHEMA · weld.v3</button>
            <button className="chip chip-stable mono">PROFILE · WELD-VISION v4.2</button>
            <button className="chip mono">DEPLOY</button>
          </>
        }
      />

      <div className="p-3 space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-3">
          {/* Upload zone */}
          <div className="panel p-0 overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">Dataset Ingestion</span>
              <span className="mono text-[10px] text-muted-foreground">CSV · NPZ · PNG · JPG · ≤ 2 GB per dataset</span>
            </div>
            <div className="p-3 space-y-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); onPick(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-md border-2 border-dashed p-7 grid-bg ${
                  drag ? "border-cyan-foreground" : "border-border-strong"
                }`}
                style={{ borderColor: drag ? "var(--color-cyan)" : undefined }}
              >
                <input ref={inputRef} type="file" multiple hidden onChange={(e) => onPick(e.target.files)} />
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <UploadCloud className="h-7 w-7" style={{ color: "var(--color-cyan)" }} />
                  <div className="font-serif text-[18px] text-foreground">Drop welding datasets here</div>
                  <div className="mono text-[10.5px] text-muted-foreground">
                    combined.csv · current.csv · voltage.csv · waveform.npz · macro.png/jpg
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="chip mono">BROWSE FILES</button>
                    <span className="mono text-[10px] text-muted-foreground">or paste S3 / MinIO URI</span>
                  </div>
                </div>
              </div>

              {/* file list */}
              <div className="rounded-md border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_90px_100px_110px_28px] gap-2 px-3 py-1.5 mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border bg-surface/40">
                  <div>File</div><div>Size</div><div>Kind</div><div>Status</div><div></div>
                </div>
                {files.map((f) => {
                  const Icon = kindIcon(f.kind);
                  return (
                    <div key={f.name} className="grid grid-cols-[1fr_90px_100px_110px_28px] gap-2 px-3 py-1.5 text-[11.5px] border-b border-border/60 last:border-0 items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate text-foreground mono">{f.name}</span>
                      </div>
                      <div className="mono text-muted-foreground">{f.size}</div>
                      <div className="mono uppercase text-[10px] text-muted-foreground">{f.kind}</div>
                      <div>
                        {f.status === "OK"
                          ? <span className="chip chip-stable mono"><CheckCircle2 className="h-3 w-3" />OK</span>
                          : <span className="chip chip-warn mono">VALIDATING</span>}
                      </div>
                      <button
                        onClick={() => setFiles((cur) => cur.filter((x) => x.name !== f.name))}
                        className="text-muted-foreground hover:text-foreground"
                      ><X className="h-3.5 w-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="panel p-0 overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">Dataset Metadata</span>
              <span className="mono text-[10px] text-muted-foreground">required for traceable training</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2.5">
              {[
                ["Dataset Name", "ws07_mig_k400a_20260518_b"],
                ["Station ID", "WS-07"],
                ["Material", "ASTM A572 Gr.50 · 8 mm"],
                ["Process", "GMAW · MIG"],
                ["Operator", "2241 · R. MAHATO"],
                ["Shielding Gas", "82 Ar / 18 CO₂"],
                ["Wire Feed", "8.4 m/min"],
                ["Environment", "JSR-01 · Bay 4 · 32 °C"],
              ].map(([k, v]) => (
                <label key={k} className="block">
                  <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground mb-0.5">{k}</div>
                  <input
                    defaultValue={v}
                    className="w-full bg-surface-2 border border-border rounded-sm px-2 py-1 text-[11.5px] mono text-foreground focus:outline-none focus:border-border-strong"
                  />
                </label>
              ))}
              <label className="block col-span-2">
                <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground mb-0.5">Notes</div>
                <textarea
                  rows={2}
                  defaultValue="Recorded during Shift B. Pyrometer drift logged at 14:11 (ticket PM-2418). Recommended retrain after drift fix."
                  className="w-full bg-surface-2 border border-border rounded-sm px-2 py-1 text-[11.5px] mono text-foreground focus:outline-none focus:border-border-strong resize-none"
                />
              </label>
              <div className="col-span-2 flex items-center justify-between border-t border-border pt-2 mt-1">
                <span className="mono text-[10px] text-muted-foreground">SHA-256 of bundle · a47b…f0c9</span>
                <button className="chip chip-stable mono">START TRAINING</button>
              </div>
            </div>
          </div>
        </div>

        {/* Training console */}
        <section>
          <SectionLabel title="Training Console" sub="adaptive model · rolling window · reconstruction loss" right={<span className="mono text-[10px]" style={{ color: "var(--color-cyan)" }}>● EPOCH 46 / 100 · ETA 04:18</span>} />
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr] gap-3">
            <div className="panel p-3">
              <div className="font-serif text-[15px] text-foreground mb-2">Pipeline Stages</div>
              <div className="space-y-2">
                {STAGES.map((s) => {
                  const done = s.pct === 100;
                  const active = s.pct > 0 && s.pct < 100;
                  return (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mono text-[10.5px] mb-0.5">
                        <span className={done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground"}>
                          {done ? "✓" : active ? "▶" : "○"} {s.label}
                        </span>
                        <span className={done ? "text-stable" : "text-muted-foreground"} style={{ color: done ? "var(--color-stable)" : active ? "var(--color-cyan)" : undefined }}>{s.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-sm bg-surface-2 overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${s.pct}%`,
                            background: done ? "var(--color-stable)" : active ? "var(--color-cyan)" : "var(--color-border-strong)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-serif text-[14px] text-foreground">Reconstruction Loss</div>
                    <div className="mono text-[10px] text-muted-foreground">train · val</div>
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={LOSS} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                        <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
                        <XAxis dataKey="e" tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} />
                        <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={32} />
                        <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 11 }} />
                        <Line type="monotone" dataKey="train" stroke="var(--color-cyan)"   strokeWidth={1.4} dot={false} />
                        <Line type="monotone" dataKey="val"   stroke="var(--color-warn)"   strokeWidth={1.4} dot={false} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-serif text-[14px] text-foreground">Adaptive Threshold</div>
                    <div className="mono text-[10px] text-muted-foreground">μ + 3σ rolling</div>
                  </div>
                  <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={THRESH} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
                        <CartesianGrid stroke="var(--color-grid)" strokeDasharray="2 3" vertical={false} />
                        <XAxis dataKey="t" hide />
                        <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: "var(--color-muted-foreground)" }} width={32} domain={[0, 0.16]} />
                        <ReferenceLine y={0.11} stroke="var(--color-critical)" strokeDasharray="3 3" label={{ value: "TH", fill: "var(--color-critical)", fontSize: 9 }} />
                        <Area type="monotone" dataKey="err" stroke="none" fill="var(--color-warn)" fillOpacity={0.15} />
                        <Line type="monotone" dataKey="err" stroke="var(--color-warn)" strokeWidth={1.4} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-border pt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-serif text-[14px] text-foreground">Training Log</div>
                  <div className="mono text-[10px] text-muted-foreground">tail -f</div>
                </div>
                <pre className="bg-surface text-[10.5px] mono p-2 rounded-sm border border-border h-[120px] overflow-auto whitespace-pre-wrap text-muted-foreground leading-relaxed">
{`[14:31:02] ▸ pipeline.preprocess ── 32,768 samples ─ ok
[14:31:04] ▸ normalisation        ── z-score (μ=0.0021, σ=1.0007)
[14:31:06] ▸ feature.extract      ── 24 features · FFT 0-1.8kHz
[14:31:09] ▸ window.gen           ── 1.0 s / 0.25 s stride
[14:31:12] ▸ trainer.start        ── arch=LSTM-AE · params=412k
[14:32:48] epoch 23  train=0.041  val=0.046  Δ=-0.0021
[14:33:51] epoch 35  train=0.029  val=0.034  Δ=-0.0011
[14:34:40] epoch 46  train=0.024  val=0.029  Δ=-0.0007  ⇒ checkpoint`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Profile registry */}
        <section>
          <SectionLabel title="Profile Registry" sub="model profiles · deployment state · threshold configs" />
          <div className="panel overflow-hidden">
            <table className="w-full text-[11.5px]">
              <thead className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-3 py-2">Profile</th>
                  <th className="text-left px-3 py-2">Version</th>
                  <th className="text-left px-3 py-2">Process</th>
                  <th className="text-right px-3 py-2">Threshold</th>
                  <th className="text-right px-3 py-2">Trained</th>
                  <th className="text-left px-3 py-2">State</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="mono">
                {[
                  ["MIG · K400 · A572", "v4.2.1", "GMAW", "0.110", "2026-05-18", "ACTIVE",   "chip-stable"],
                  ["TIG · S304 · Thin",  "v3.8.0", "GTAW", "0.084", "2026-04-22", "DEPLOYED", "chip-stable"],
                  ["MIG · K400 · A572", "v4.2.2-rc", "GMAW", "0.108", "2026-05-22", "STAGING", "chip-warn"],
                  ["SAW · Heavy Plate",  "v2.1.4", "SAW",  "0.142", "2026-02-14", "ARCHIVED", ""],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? "bg-surface/20" : ""}>
                    <td className="px-3 py-2 text-foreground">{row[0]}</td>
                    <td className="px-3 py-2 text-foreground">{row[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                    <td className="px-3 py-2 text-right text-foreground">{row[3]}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{row[4]}</td>
                    <td className="px-3 py-2"><span className={`chip mono ${row[6]}`}>{row[5]}</span></td>
                    <td className="px-3 py-2 text-right pr-3">
                      <button className="chip mono"><Cpu className="h-3 w-3" />ACTIVATE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
