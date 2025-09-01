"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  UploadIcon,
  FileTextIcon,
  XIcon,
  Loader2Icon,
  ZapIcon,
  ActivityIcon,
  CloudUploadIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import DefaultLayout from "@/components/layouts/default-layout";
import type { Options as ConfettiOptions } from "canvas-confetti";

type AnalysisResponse = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisDate: string;
  candidateName: string;
  overallScore: number;
  scores: {
    technical: number;
    experience: number;
    communication: number;
    cultureFit: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skills: string[];
  experience: { years: number; positions: string[]; companies: string[] };
  education: { degree: string; institution: string; year: number }[];
  keyHighlights?: string[];
  redFlags: string[];
  rawText: string;
  multiLanguageData: Record<
    "en" | "de" | "fr",
    {
      summary: string;
      strengths: string[];
      weaknesses: string[];
      recommendations?: string[];
      skills: string[];
      redFlags?: string[];
      candidateName: string;
    }
  >;
  primaryLanguage: "en";
};

type Stage = "idle" | "parse" | "ai" | "report" | "done";

type StoredRecord = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisDate: string;
  candidateName: string;
  overallScore: number;
  scores: AnalysisResponse["scores"];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skills: string[];
  experience: AnalysisResponse["experience"];
  redFlags: string[];
  primaryLanguage: AnalysisResponse["primaryLanguage"];
  multiLanguageData: AnalysisResponse["multiLanguageData"];
  fileUrl: string;
};

const STORAGE_KEY = "talent-scan:history";
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const group: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.25, ease },
  },
};

export default function UploadPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [drag, setDrag] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [stage, setStage] = React.useState<Stage>("idle");
  const [pct, setPct] = React.useState(0);
  const [result, setResult] = React.useState<AnalysisResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const timerRef = React.useRef<number | null>(null);

  const startProgress = React.useCallback(() => {
    if (timerRef.current != null) return;
    timerRef.current = window.setInterval(() => {
      setPct((p) => (p >= 95 ? p : Math.min(p + 1, 95)));
    }, 50);
  }, []);

  const stopProgress = React.useCallback(() => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const blastConfetti = React.useCallback(async () => {
    const mod = await import("canvas-confetti");
    const confetti = mod.default;
    const base = 140;
    const fire = (ratio: number, opts: ConfettiOptions = {}) =>
      confetti({
        particleCount: Math.floor(base * ratio),
        spread: 70,
        origin: { y: 0.6 },
        ...opts,
      });
    fire(0.25, { startVelocity: 45 });
    fire(0.2, {});
    fire(0.35, { decay: 0.91, scalar: 1.05 });
    fire(0.2, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  }, []);

  const clearAll = React.useCallback(() => {
    stopProgress();
    abortRef.current?.abort();
    abortRef.current = null;
    setStage("idle");
    setPct(0);
    setResult(null);
    setFile(null);
    setError(null);
    setModalOpen(false);
  }, [stopProgress]);

  const onCancel = React.useCallback(() => {
    clearAll();
  }, [clearAll]);

  const analyze = React.useCallback(
    async (f: File) => {
      setError(null);
      setModalOpen(true);
      setStage("parse");
      setPct(0);
      startProgress();
      const fd = new FormData();
      fd.append("file", f);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const r = await fetch("/api/analyze", {
          method: "POST",
          body: fd,
          signal: ctrl.signal,
        });
        setStage("ai");
        const raw: unknown = await r.json();
        setStage("report");
        if (!r.ok) {
          const errMsg =
            (raw as { error?: string } | null)?.error || "Unexpected error";
          throw new Error(errMsg);
        }
        const json = raw as AnalysisResponse;
        const saved = persistToHistory(f, json);
        setResult(saved);
        stopProgress();
        setPct(100);
        setStage("done");
        blastConfetti();
        setTimeout(() => setModalOpen(false), 650);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        stopProgress();
        setError(e instanceof Error ? e.message : "Failed to analyze");
        setModalOpen(false);
        setStage("idle");
        setPct(0);
      } finally {
        abortRef.current = null;
      }
    },
    [blastConfetti, startProgress, stopProgress]
  );

  const onFile = React.useCallback(
    (f: File) => {
      setFile(f);
      setResult(null);
      setError(null);
      analyze(f);
    },
    [analyze]
  );

  React.useEffect(() => {
    if (!modalOpen) stopProgress();
  }, [modalOpen, stopProgress]);

  return (
    <DefaultLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="py-10 md:py-16">
          <HeaderHero />
          <div className="mx-auto max-w-6xl px-5">
            <UploadSection
              file={file}
              drag={drag}
              done={!!result}
              setDrag={setDrag}
              onFile={onFile}
            />
            <AnimatePresence initial={false} mode="popLayout">
              {!!file && (
                <UploadedCard key={file.name} file={file} onClear={clearAll} />
              )}
            </AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mx-auto mt-4 max-w-4xl rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200"
              >
                {error}
              </motion.div>
            )}
            <AnimatePresence initial={false} mode="wait">
              {result && (
                <motion.div
                  key={result.id}
                  variants={group}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="mt-10 space-y-8"
                >
                  <HeroScoreCard
                    score={result.overallScore}
                    summary={result.summary}
                  />
                  <MetricTiles scores={result.scores} />
                  <motion.div
                    variants={card}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                  >
                    <BulletCard
                      title="Key Strengths"
                      icon={
                        <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />
                      }
                      bullets={result.strengths}
                      tone="ok"
                    />
                    <BulletCard
                      title="Areas for Improvement"
                      icon={
                        <AlertTriangleIcon className="h-5 w-5 text-amber-400" />
                      }
                      bullets={result.weaknesses}
                      tone="warn"
                    />
                  </motion.div>
                  <motion.div
                    variants={card}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                  >
                    <PillCard title="Skills Identified" pills={result.skills} />
                    <ExperienceCard
                      years={result.experience.years}
                      companies={result.experience.companies}
                    />
                  </motion.div>
                  <motion.div variants={card}>
                    <RecommendationsCard items={result.recommendations} />
                  </motion.div>
                  {!!result.redFlags?.length && (
                    <motion.div variants={card}>
                      <RedFlagsCard items={result.redFlags} />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnalyzeModal
            open={modalOpen}
            onCancel={onCancel}
            stage={stage}
            progress={pct}
            fileName={file?.name || "resume.pdf"}
          />
        </div>
      </motion.div>
    </DefaultLayout>
  );
}

function HeaderHero() {
  return (
    <div className="mx-auto max-w-6xl px-3 pb-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="mb-4">
          <Image
            src="/upload.svg"
            alt="Upload"
            width={200}
            height={180}
            className="mx-auto"
          />
        </div>
      </motion.div>
      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="mt-4 text-4xl font-semibold tracking-tight"
      >
        Upload Resume
      </motion.h1>
      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease, delay: 0.05 }}
        className="mx-auto mt-3 max-w-2xl text-zinc-300/85"
      >
        Upload a PDF resume to get instant AI-powered analysis and insights.
      </motion.p>
    </div>
  );
}

function UploadSection({
  file,
  drag,
  done,
  setDrag,
  onFile,
}: {
  file: File | null;
  drag: boolean;
  done: boolean;
  setDrag: (b: boolean) => void;
  onFile: (f: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  void file;
  const success = done;
  return (
    <motion.div variants={card} initial="hidden" animate="show" exit="exit">
      <motion.div
        role="button"
        tabIndex={0}
        whileHover={{ scale: 1.002 }}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? inputRef.current?.click() : null
        }
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={[
          "relative mx-auto grid max-w-4xl place-items-center rounded-3xl border-2 p-12 transition",
          "focus:outline-none",
          success
            ? "border-emerald-500/60 bg-emerald-500/5"
            : drag
            ? "border-sky-400/70 bg-sky-400/5"
            : "border-dashed border-white/15 bg-white/[0.03] hover:border-sky-400/70 hover:bg-white/[0.04]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) onFile(f);
          }}
        />
        <div className="text-center">
          <motion.div
            key={success ? "ok" : "idle"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease }}
            className={[
              "mx-auto grid h-14 w-14 place-items-center rounded-full",
              success
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-white/5 text-zinc-200",
            ].join(" ")}
          >
            {success ? (
              <CheckCircle2Icon className="h-7 w-7" />
            ) : (
              <CloudUploadIcon className="h-7 w-7" />
            )}
          </motion.div>
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease }}
            className="mt-4 mb-2 text-xl font-semibold"
          >
            {success
              ? "Analysis Complete"
              : "Drag & drop resume here, or click to select"}
          </motion.div>
          <div className="text-sm text-zinc-400">PDF files only (max 5MB)</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UploadedCard({ file, onClear }: { file: File; onClear: () => void }) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mx-auto mt-5 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/5">
            <FileTextIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{file.name}</div>
            <div className="text-xs text-zinc-400">
              {(file.size / 1024).toFixed(0)} KB • 1 Pages
            </div>
          </div>
          <span className="ml-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
            Upload successful
          </span>
        </div>
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.96 }}
          onClick={onClear}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/5 hover:bg-white/10"
          aria-label="Clear"
        >
          <XIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function HeroScoreCard({ score, summary }: { score: number; summary: string }) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8"
    >
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <AnimatedRing score={s} />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Overall Match Score</h2>
          <p className="mt-3 text-base leading-relaxed">{summary}</p>
        </div>
      </div>
    </motion.div>
  );
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function AnimatedRing({ score }: { score: number }) {
  const deg = clamp01(score / 100) * 360;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease } }}
      className="relative h-40 w-40 shrink-0"
    >
      <motion.div
        initial={{
          background: `conic-gradient(#10b981 0deg, rgba(255,255,255,0.08) 0deg)`,
        }}
        animate={{
          background: `conic-gradient(#10b981 ${deg}deg, rgba(255,255,255,0.08) 0deg)`,
        }}
        transition={{ duration: 0.9, ease }}
        className="h-full w-full rounded-full"
      />
      <div className="absolute inset-5 rounded-full bg-background" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35, ease }}
        className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-emerald-400"
      >
        {score}%
      </motion.div>
    </motion.div>
  );
}

function MetricTiles({ scores }: { scores: AnalysisResponse["scores"] }) {
  const items = [
    { label: "Technical Skills", value: scores.technical },
    { label: "Experience Level", value: scores.experience },
    { label: "Communication", value: scores.communication },
    { label: "Culture Fit", value: scores.cultureFit },
  ];
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((it) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease } }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="text-sm opacity-80">{it.label}</div>
          <div className="mb-1 mt-3 text-3xl font-semibold">
            {Math.round(it.value)}%
          </div>
          <div className="text-sm text-emerald-400">Excellent</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function BulletCard({
  title,
  icon,
  bullets,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  bullets: string[];
  tone: "ok" | "warn";
}) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-8"
    >
      <div className="mb-3 flex items-center gap-2 text-lg font-semibold md:text-xl">
        {icon} {title}
      </div>
      <ul className="space-y-3 text-zinc-200">
        {bullets.map((b, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.25, ease, delay: i * 0.02 },
            }}
            className="flex items-start gap-3 leading-relaxed"
          >
            <span
              className={`mt-2 h-2 w-2 rounded-full ${
                tone === "ok" ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            {b}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function PillCard({ title, pills }: { title: string; pills: string[] }) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pills.map((p, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.25, ease, delay: i * 0.015 },
            }}
            className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            {p}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function ExperienceCard({
  years,
  companies,
}: {
  years: number;
  companies: string[];
}) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="text-lg font-semibold">Experience Summary</div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="opacity-70">Years of Experience</div>
        <div className="text-right">{years} years</div>
        <div className="opacity-70">Previous Companies</div>
        <div className="truncate text-right">{companies.join(", ")}</div>
      </div>
    </motion.div>
  );
}

function RecommendationsCard({ items }: { items: string[] }) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="text-lg font-semibold">Hiring Recommendations</div>
      <ol className="mt-4 space-y-4">
        {items.map((t, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.25, ease, delay: i * 0.02 },
            }}
            className="flex items-center space-x-3"
          >
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-bold text-primary">{i + 1}</span>
            </div>
            <span className="text-zinc-200">{t}</span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function RedFlagsCard({ items }: { items: string[] }) {
  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-200">
        <AlertTriangleIcon className="h-5 w-5" /> Potential Red Flags
      </div>
      <ul className="space-y-3 text-rose-100">
        {items.map((b, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.25, ease, delay: i * 0.02 },
            }}
            className="flex items-center gap-3"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" /> {b}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function AnalyzeModal({
  open,
  onCancel,
  fileName,
  progress = 0,
  stage,
}: {
  open: boolean;
  onCancel: () => void;
  fileName?: string;
  progress?: number;
  stage: Stage;
}) {
  const pretty = Math.max(0, Math.min(100, Math.round(progress)));
  const doing = (s: Stage) => stage === s;
  const done = (s: Stage) =>
    ["ai", "report", "done"].includes(stage) &&
    (s === "parse" ||
      (s === "ai" && ["report", "done"].includes(stage)) ||
      (s === "report" && stage === "done"));
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[92vw] max-w-lg rounded-2xl bg-[#111a19] p-6 text-white ring-1 ring-white/10 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="text-center">
              <div className="text-2xl font-semibold">Analyzing Resume</div>
              <div className="mt-1 text-sm opacity-80">
                {fileName || "resume.pdf"}
              </div>
            </div>
            <div className="mt-6">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-sky-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pretty}%` }}
                  transition={{ ease, duration: 0.3 }}
                />
              </div>
              <div className="mt-2 text-center text-sm opacity-85">
                {pretty}% Complete
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <StageRow
                label="Parsing Document"
                sub="Extracting text and structure from your resume"
                leftIcon="check"
                state={
                  doing("parse") ? "doing" : done("parse") ? "done" : "idle"
                }
              />
              <StageRow
                label="AI Analysis"
                sub="Evaluating skills, experience, and qualifications"
                leftIcon="zap"
                state={doing("ai") ? "doing" : done("ai") ? "done" : "idle"}
              />
              <StageRow
                label="Generating Report"
                sub="Creating comprehensive insights and recommendations"
                leftIcon="activity"
                state={
                  doing("report") ? "doing" : done("report") ? "done" : "idle"
                }
              />
            </div>
            <div className="mt-8 text-center">
              <div className="mb-3 text-base font-semibold">Did you know?</div>
              <div className="text-sm text-zinc-300/70">
                Our AI analyzes over 50 different criteria to provide
                comprehensive candidate insights.
              </div>
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="rounded-lg bg-white/5 px-4 py-2 hover:bg-white/10"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type RowState = "idle" | "doing" | "done";

function StageRow({
  label,
  sub,
  leftIcon,
  state,
}: {
  label: string;
  sub: string;
  leftIcon: "check" | "zap" | "activity";
  state: RowState;
}) {
  const wrap =
    state === "doing"
      ? "bg-sky-500/15 ring-1 ring-sky-500/20"
      : state === "done"
      ? "bg-emerald-500/10"
      : "bg-transparent";
  const leftBg =
    state === "done"
      ? "bg-emerald-500/20"
      : state === "doing"
      ? "bg-sky-500/20"
      : "bg-white/5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${wrap}`}
    >
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${leftBg}`}>
        {leftIcon === "check" &&
          (state === "done" ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />
          ) : (
            <UploadIcon className="h-5 w-5 text-zinc-300" />
          ))}
        {leftIcon === "zap" &&
          (state === "done" ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />
          ) : (
            <ZapIcon className="h-5 w-5 text-sky-300" />
          ))}
        {leftIcon === "activity" &&
          (state === "done" ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-400" />
          ) : (
            <ActivityIcon className="h-5 w-5 text-zinc-300" />
          ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium">{label}</div>
        <div className="truncate text-sm opacity-75">{sub}</div>
      </div>
      {state === "doing" && (
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">
          <Loader2Icon className="h-5 w-5 animate-spin text-sky-300" />
        </div>
      )}
    </motion.div>
  );
}

function persistToHistory(file: File, res: AnalysisResponse): AnalysisResponse {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const list: StoredRecord[] = Array.isArray(parsed)
      ? (parsed as StoredRecord[])
      : [];
    const record: StoredRecord = {
      id: res.id,
      fileName: res.fileName || file.name,
      fileSize: res.fileSize || file.size,
      uploadDate: res.uploadDate || new Date().toISOString(),
      analysisDate: res.analysisDate || new Date().toISOString(),
      candidateName:
        res.candidateName || res.multiLanguageData?.en?.candidateName || "",
      overallScore: res.overallScore,
      scores: res.scores,
      summary: res.summary,
      strengths: res.strengths,
      weaknesses: res.weaknesses,
      recommendations: res.recommendations,
      skills: res.skills,
      experience: res.experience,
      redFlags: res.redFlags,
      primaryLanguage: res.primaryLanguage || "en",
      multiLanguageData: res.multiLanguageData,
      fileUrl: "",
    };
    const i = list.findIndex((x) => x.id === record.id);
    if (i >= 0) list[i] = record;
    else list.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
  return res;
}
