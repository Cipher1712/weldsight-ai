import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { PageHeader, SectionLabel } from "@/components/industrial/AppShell";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Cpu,
} from "lucide-react";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  Area,
  ComposedChart,
} from "recharts";

export const Route = createFileRoute("/upload-train")({
  head: () => ({
    meta: [{ title: "Upload & Train · WeldSight AI" }],
  }),
  component: UploadTrain,
});

type UFile = {
  name: string;
  size: string;
  kind: "current" | "voltage" | "combined" | "image" | "wave";
  status: "OK" | "VALIDATING";
};

type Stage = {
  key: string;
  label: string;
  pct: number;
};

const INITIAL_FILES: UFile[] = [];

const STAGES: Stage[] = [
  { key: "preproc", label: "Pre-processing", pct: 100 },
  { key: "norm", label: "Normalisation", pct: 100 },
  { key: "feat", label: "Feature Extraction", pct: 92 },
  { key: "win", label: "Rolling Window Generation", pct: 78 },
  { key: "train", label: "Model Training", pct: 46 },
  { key: "recon", label: "Reconstruction Loss", pct: 46 },
  { key: "thresh", label: "Adaptive Threshold Calc.", pct: 0 },
  { key: "version", label: "Model Versioning", pct: 0 },
];

const LOSS = Array.from({ length: 60 }, (_, i) => ({
  e: i,
  train: 0.42 * Math.exp(-i / 22) + 0.018 + Math.random() * 0.004,
  val: 0.46 * Math.exp(-i / 20) + 0.026 + Math.random() * 0.006,
}));

const THRESH = Array.from({ length: 80 }, (_, i) => ({
  t: i,
  err:
    0.05 +
    Math.abs(Math.sin(i / 6)) * 0.04 +
    Math.random() * 0.012,
}));

function kindIcon(k: UFile["kind"]) {
  if (k === "image") return ImageIcon;
  return FileText;
}

function UploadTrain() {

  const [files, setFiles] = useState<UFile[]>(INITIAL_FILES);

  const [drag, setDrag] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(list: FileList | null) {

    if (!list) return;

    const selectedFiles = Array.from(list);

    // instantly add to UI
    const tempFiles: UFile[] = selectedFiles.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      kind:
        f.name.endsWith(".png") || f.name.endsWith(".jpg")
          ? "image"
          : "combined",
      status: "VALIDATING",
    }));

    setFiles((cur) => [...tempFiles, ...cur]);

    // upload to backend
    for (const file of selectedFiles) {

      try {

        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          "https://web-production-0d600.up.railway.app/upload-dataset",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        console.log("UPLOAD RESPONSE:", data);

        // SUCCESS
        if (data.status === "success") {

          setFiles((cur) =>
            cur.map((f) =>
              f.name === file.name
                ? { ...f, status: "OK" }
                : f
            )
          );

        } else {

          console.error(
            "VALIDATION FAILED:",
            data
          );

          setFiles((cur) =>
            cur.filter((f) => f.name !== file.name)
          );
        }

      } catch (err) {

        console.error("UPLOAD ERROR:", err);

        setFiles((cur) =>
          cur.filter((f) => f.name !== file.name)
        );
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="AI & TRAINING · UPLOAD PIPELINE"
        title="Upload & Train Adaptive Model"
        sub="Ingest welding telemetry, waveform segments and macro imagery · build adaptive thresholds and versioned model profiles"
        actions={
          <>
            <button className="chip mono">
              SCHEMA · weld.v3
            </button>

            <button className="chip chip-stable mono">
              PROFILE · WELD-VISION v4.2
            </button>

            <button className="chip mono">
              DEPLOY
            </button>
          </>
        }
      />

      <div className="p-3 space-y-5">

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-3">

          {/* Upload zone */}

          <div className="panel p-0 overflow-hidden">

            <div className="panel-header">

              <span className="panel-title">
                Dataset Ingestion
              </span>

              <span className="mono text-[10px] text-muted-foreground">
                CSV · NPZ · PNG · JPG · ≤ 2 GB per dataset
              </span>

            </div>

            <div className="p-3 space-y-3">

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}

                onDragLeave={() => setDrag(false)}

                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  onPick(e.dataTransfer.files);
                }}

                onClick={() => inputRef.current?.click()}

                className={`relative cursor-pointer rounded-md border-2 border-dashed p-7 grid-bg ${
                  drag
                    ? "border-cyan-foreground"
                    : "border-border-strong"
                }`}
              >

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => onPick(e.target.files)}
                />

                <div className="flex flex-col items-center justify-center text-center gap-2">

                  <UploadCloud
                    className="h-7 w-7"
                    style={{
                      color: "var(--color-cyan)",
                    }}
                  />

                  <div className="font-serif text-[18px] text-foreground">
                    Drop welding datasets here
                  </div>

                  <div className="mono text-[10.5px] text-muted-foreground">
                    combined.csv · current.csv · voltage.csv · waveform.npz · macro.png/jpg
                  </div>

                  <div className="flex items-center gap-2 mt-1">

                    <button className="chip mono">
                      BROWSE FILES
                    </button>

                    <span className="mono text-[10px] text-muted-foreground">
                      or paste S3 / MinIO URI
                    </span>

                  </div>
                </div>
              </div>

              {/* FILE LIST */}

              <div className="rounded-md border border-border overflow-hidden">

                <div className="grid grid-cols-[1fr_90px_100px_110px_28px] gap-2 px-3 py-1.5 mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border bg-surface/40">

                  <div>File</div>
                  <div>Size</div>
                  <div>Kind</div>
                  <div>Status</div>
                  <div></div>

                </div>

                {files.map((f) => {

                  const Icon = kindIcon(f.kind);

                  return (

                    <div
                      key={f.name}
                      className="grid grid-cols-[1fr_90px_100px_110px_28px] gap-2 px-3 py-1.5 text-[11.5px] border-b border-border/60 last:border-0 items-center"
                    >

                      <div className="flex items-center gap-2 min-w-0">

                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

                        <span className="truncate text-foreground mono">
                          {f.name}
                        </span>

                      </div>

                      <div className="mono text-muted-foreground">
                        {f.size}
                      </div>

                      <div className="mono uppercase text-[10px] text-muted-foreground">
                        {f.kind}
                      </div>

                      <div>

                        {f.status === "OK" ? (

                          <span className="chip chip-stable mono">

                            <CheckCircle2 className="h-3 w-3" />

                            OK

                          </span>

                        ) : (

                          <span className="chip chip-warn mono">
                            VALIDATING
                          </span>

                        )}

                      </div>

                      <button
                        onClick={() =>
                          setFiles((cur) =>
                            cur.filter(
                              (x) => x.name !== f.name
                            )
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >

                        <X className="h-3.5 w-3.5" />

                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
