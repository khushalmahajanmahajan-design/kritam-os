"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Link2,
  FileSpreadsheet,
  Database,
  Check,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKritamStore, type KnowledgeFile, type KnowledgeStatus } from "@/lib/store";

const SAMPLE: Omit<KnowledgeFile, "id" | "status" | "progress" | "chunks" | "addedAt">[] = [
  { name: "product-handbook.pdf", type: "pdf", size: "2.4 MB" },
  { name: "customer-faq.csv", type: "csv", size: "880 KB" },
  { name: "https://docs.kritam.space", type: "url", size: "crawl" },
];

const iconFor = (type: KnowledgeFile["type"]) =>
  type === "pdf" ? FileText : type === "csv" ? FileSpreadsheet : Link2;

export function KnowledgeCenter() {
  const [dragOver, setDragOver] = useState(false);
  const idRef = useRef(0);
  const items = useKritamStore((s) => s.knowledgeFiles);
  const addKnowledgeFiles = useKritamStore((s) => s.addKnowledgeFiles);
  const updateKnowledgeFile = useKritamStore((s) => s.updateKnowledgeFile);
  const clearKnowledgeFiles = useKritamStore((s) => s.clearKnowledgeFiles);

  const runPipeline = useCallback(
    (id: string) => {
      const steps: { status: KnowledgeStatus; to: number; chunks: number; delay: number }[] = [
        { status: "ingesting", to: 35, chunks: 0, delay: 500 },
        { status: "vectorising", to: 80, chunks: 128, delay: 1400 },
        { status: "indexed", to: 100, chunks: 256, delay: 2600 },
      ];
      steps.forEach((step) => {
        setTimeout(() => {
          updateKnowledgeFile(id, {
            status: step.status,
            progress: step.to,
            chunks: step.chunks,
          });
        }, step.delay);
      });
    },
    [updateKnowledgeFile]
  );

  const addDocs = useCallback(
    (docs: { name: string; type: KnowledgeFile["type"]; size: string }[]) => {
      const now = Date.now();
      const newItems: KnowledgeFile[] = docs.map((d, i) => ({
        id: `doc-${now}-${idRef.current++}`,
        name: d.name,
        type: d.type,
        size: d.size,
        status: "queued",
        progress: 0,
        chunks: 0,
        addedAt: now + i,
      }));
      addKnowledgeFiles(newItems);
      newItems.forEach((item) => runPipeline(item.id));
    },
    [addKnowledgeFiles, runPipeline]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      addDocs(
        files.map((f) => ({
          name: f.name,
          type: f.name.endsWith(".csv") ? "csv" : "pdf",
          size: `${(f.size / 1024).toFixed(0)} KB`,
        }))
      );
    } else {
      // demo sample (drag without real file)
      addDocs([SAMPLE[Math.floor(Math.random() * SAMPLE.length)]]);
    }
  };

  const addSample = () => addDocs([SAMPLE[Math.floor(Math.random() * SAMPLE.length)]]);

  const remove = (id: string) =>
    useKritamStore.setState((s) => ({
      knowledgeFiles: s.knowledgeFiles.filter((i) => i.id !== id),
    }));

  const indexed = items.filter((i) => i.status === "indexed").length;
  const totalChunks = items.reduce((a, b) => a + b.chunks, 0);

  return (
    <div className="space-y-5">
      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Documents indexed", value: indexed, icon: FileText, color: "#00F2FE" },
          { label: "Vector chunks", value: totalChunks.toLocaleString(), icon: Database, color: "#7F00FF" },
          { label: "Embedding model", value: "kritam-embed-3", icon: Sparkles, color: "#00F2FE" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-card/40 p-4">
            <s.icon className="h-4 w-4" style={{ color: s.color }} />
            <div className="mt-2 text-lg font-bold truncate">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all",
          dragOver
            ? "border-[#00F2FE] bg-[#00F2FE]/5 box-glow-cyan"
            : "border-border/60 bg-card/30"
        )}
      >
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <motion.div
          animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
          className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]"
        >
          <Upload className="h-6 w-6" />
        </motion.div>
        <p className="relative mt-4 font-medium">
          Drop documents to build your vector knowledge base
        </p>
        <p className="relative mt-1 text-sm text-muted-foreground">
          Supports .pdf, .csv and URL crawls · files are chunked, embedded and indexed securely
        </p>
        <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={addSample}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <FileText className="h-4 w-4" /> Add sample document
          </button>
          <span className="text-xs text-muted-foreground">or drag a real file here</span>
        </div>
      </div>

      {/* file list */}
      <div className="rounded-2xl border border-border/60 bg-card/40">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h4 className="text-sm font-semibold">Ingestion pipeline</h4>
          {items.length > 0 && (
            <button
              onClick={clearKnowledgeFiles}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          <AnimatePresence initial={false}>
            {items.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No documents yet. Drop a file to begin.
              </motion.div>
            )}
            {items.map((item) => {
              const Icon = iconFor(item.type);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                        item.type === "url"
                          ? "border-[#7F00FF]/30 bg-[#7F00FF]/10 text-[#b14bff]"
                          : "border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="uppercase">{item.type}</span>
                        <span>·</span>
                        <span>{item.size}</span>
                        {item.chunks > 0 && (
                          <>
                            <span>·</span>
                            <span>{item.chunks} chunks</span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusPill status={item.status} />
                  </div>

                  {/* progress + streaming */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#7F00FF]"
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      {item.status === "vectorising" && (
                        <motion.div
                          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ["-3rem", "100%"] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>
                    <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>

                  {/* streaming data particles */}
                  {item.status === "vectorising" && (
                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className="h-1 w-1 rounded-full bg-[#00F2FE]"
                          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                        />
                      ))}
                      <span className="ml-2 font-mono text-[10px] text-[#00F2FE]">
                        embedding → vector store
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: KnowledgeStatus }) {
  const map = {
    queued: { label: "Queued", cls: "bg-muted/40 text-muted-foreground", Icon: Loader2 },
    ingesting: { label: "Ingesting", cls: "bg-[#00F2FE]/10 text-[#00F2FE]", Icon: Loader2 },
    vectorising: { label: "Vectorising", cls: "bg-[#7F00FF]/10 text-[#b14bff]", Icon: Loader2 },
    indexed: { label: "Indexed", cls: "bg-emerald-500/10 text-emerald-400", Icon: Check },
  }[status];
  const spin = status === "ingesting" || status === "vectorising";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        map.cls
      )}
    >
      <map.Icon className={cn("h-2.5 w-2.5", spin && "animate-spin")} />
      {map.label}
    </span>
  );
}
