"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Download,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Building2,
  CircleDot,
  FileText,
  UploadCloudIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type MultiLangMap = Record<
  string,
  {
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    skills?: string[];
    redFlags?: string[];
    candidateName?: string;
  }
>;

type AnalysisItem = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisDate: string;
  candidateName: string;
  overallScore: number;
  scores?: {
    technical?: number;
    experience?: number;
    communication?: number;
    cultureFit?: number;
    [k: string]: number | undefined;
  };
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  skills?: string[];
  experience?: {
    years?: number;
    positions?: string[];
    companies?: string[];
  };
  redFlags?: string[];
  primaryLanguage?: string;
  multiLanguageData?: MultiLangMap;
  fileUrl?: string;
};

type BarTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string }>;
  label?: string | number;
};

type PieTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string }>;
  label?: string | number;
};

const STORAGE_KEY = "talent-scan:history" as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const listStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};
const card: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } },
};

export default function AnalysisPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [lang, setLang] = useState("en");
  const [item, setItem] = useState<AnalysisItem | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: AnalysisItem[] = raw ? JSON.parse(raw) : [];
      setItem(list.find((x) => x.id === params.id) ?? null);
    } catch {
      setItem(null);
    }
  }, [params.id]);

  const safeItem = useMemo<AnalysisItem>(() => {
    return (
      item ?? {
        id: "",
        fileName: "",
        fileSize: 0,
        uploadDate: "",
        analysisDate: "",
        candidateName: "",
        overallScore: 0,
        scores: {
          technical: 0,
          experience: 0,
          communication: 0,
          cultureFit: 0,
        },
      }
    );
  }, [item]);

  const summary =
    safeItem.multiLanguageData?.[lang]?.summary || safeItem.summary || "";

  const scoreList = useMemo(() => {
    const s = safeItem.scores || {};
    const base: { key: string; label: string; value: number }[] = [
      { key: "technical", label: "Technical Skills", value: s.technical ?? 0 },
      {
        key: "experience",
        label: "Experience Level",
        value: s.experience ?? 0,
      },
      {
        key: "communication",
        label: "Communication",
        value: s.communication ?? 0,
      },
      { key: "cultureFit", label: "Culture Fit", value: s.cultureFit ?? 0 },
    ];
    Object.entries(s).forEach(([k, v]) => {
      if (!base.find((b) => b.key === k))
        base.push({ key: k, label: k, value: v ?? 0 });
    });
    return base;
  }, [safeItem.scores]);

  const barData = useMemo(
    () => scoreList.map((s) => ({ name: s.label, Score: s.value })),
    [scoreList]
  );

  const pieData = useMemo(
    () =>
      scoreList.map((s, i) => ({
        name: s.label,
        value: s.value,
        color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4],
      })),
    [scoreList]
  );

  const pct = safeItem.overallScore ?? 0;

  const shareLink = () => `${window.location.origin}/analysis/${safeItem.id}`;
  const onBack = () =>
    document.referrer ? router.back() : router.push("/history");
  const onShare = async () => {
    const url = shareLink();
    const title = `Resume Analysis – ${safeItem.candidateName || "Candidate"}`;
    try {
      if (navigator.share)
        await navigator.share({ url, title, text: "Resume analysis link" });
      else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {}
  };
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(safeItem, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      (safeItem.candidateName?.replace(/\s+/g, "_") || "analysis") + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const exportPDF = () => window.print();
  const printReport = () => window.print();

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="mb-3 text-3xl font-bold">Analysis Not Found</h1>
            <p className="">
              We couldn&apos;t find this analysis in your local history. It may
              have been deleted.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => router.push("/history")}
                className="rounded-lg"
              >
                View All Analyses
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const axisColor = "#9CA3AF";

  function RotatedTick({
    x = 0,
    y = 0,
    payload,
  }: {
    x?: number;
    y?: number;
    payload?: { value?: string | number };
  }) {
    const text = String(payload?.value ?? "");
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          dy={12}
          textAnchor="end"
          transform="rotate(-35)"
          fill={axisColor}
          fontSize={12}
        >
          {text}
        </text>
      </g>
    );
  }

  function PieValueLabel({
    cx = 0,
    cy = 0,
    outerRadius = 0,
    midAngle = 0,
    payload,
  }: {
    cx?: number;
    cy?: number;
    outerRadius?: number;
    midAngle?: number;
    payload?: { value?: number; color?: string };
  }) {
    const RAD = Math.PI / 180;
    const r = outerRadius + 18;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const anchor: "start" | "end" = x > cx ? "start" : "end";
    const fill = payload?.color ?? "#e5e7eb";
    const raw =
      typeof payload?.value === "number" ? Math.round(payload.value) : 0;
    return (
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
        fill={fill}
        fontSize={12}
        fontWeight={600}
      >
        {`${raw}%`}
      </text>
    );
  }

  const BarTooltip = ({ active, payload, label }: BarTooltipProps) =>
    active && payload && payload.length ? (
      <div className="space-y-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <div className="font-semibold">{label}</div>
        <div>Score: {payload[0].value}%</div>
      </div>
    ) : null;

  const PieTooltip = ({ active, payload }: PieTooltipProps) =>
    active && payload && payload.length ? (
      <div className="space-y-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <div className="font-semibold">{payload[0]?.name}</div>
        <div>Score: {payload[0]?.value}%</div>
      </div>
    ) : null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <Button
            onClick={onBack}
            size="lg"
            className="rounded-lg border-2 border-primary bg-transparent font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={onShare}
              size="lg"
              className="rounded-lg border-2 border-primary bg-transparent font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-lg border-2 border-primary bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Report
                  <ChevronDown className="ml-2 h-5 w-5 opacity-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={downloadJSON}>
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}>
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={printReport}>
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <h1 className="mb-2 text-3xl font-bold lg:text-5xl">
            Analysis Results
          </h1>
          <p className="text-lg ">
            {safeItem.fileName} • {safeItem.candidateName}
          </p>
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="my-10 rounded-2xl border border-border bg-card p-8"
        >
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.5, ease },
              }}
              className="relative h-40 w-40 shrink-0"
            >
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(#10b981 ${
                    clamp01(pct / 100) * 360
                  }deg, rgba(255,255,255,0.08) 0deg)`,
                }}
              />
              <div className="absolute inset-5 rounded-full bg-background" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-emerald-400">
                {pct}%
              </div>
            </motion.div>

            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold">Overall Match Score</h2>
              <p className="mt-3 text-base leading-relaxed">{summary}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="mb-6 text-xl font-bold">
              Score Breakdown - Bar Chart
            </h3>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 8, right: 16, left: 8, bottom: 90 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 6"
                    stroke="rgba(255,255,255,0.12)"
                  />
                  <XAxis dataKey="name" interval={0} tick={<RotatedTick />} />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 12 }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <RTooltip content={<BarTooltip />} />
                  <defs>
                    <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <linearGradient id="bar4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="Score" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell
                        key={`b-${i}`}
                        fill={
                          [
                            "url(#bar1)",
                            "url(#bar2)",
                            "url(#bar3)",
                            "url(#bar4)",
                          ][i % 4]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="mb-6 text-xl font-bold">
              Score Breakdown - Distribution
            </h3>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, right: 8, bottom: 44, left: 8 }}>
                  <RTooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    height={44}
                    wrapperStyle={{
                      paddingTop: 8,
                      color: "#E5E7EB",
                      fontSize: 14,
                    }}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    labelLine={false}
                    label={(props) => <PieValueLabel {...props} />}
                    stroke="#0b1220"
                    strokeWidth={2}
                    isAnimationActive
                  >
                    {pieData.map((d, i) => (
                      <Cell key={`p-${i}`} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="mt-8 rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-6 text-xl font-bold">Detailed Score Breakdown</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {scoreList.map((s, i) => {
              const color = ["#22c55e", "#10b981", "#f59e0b", "#8b5cf6"][i % 4];
              return (
                <div key={s.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-sm font-bold" style={{ color }}>
                      {s.value}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${clamp01((s.value || 0) / 100) * 100}%`,
                        transition: { duration: 0.8, ease },
                      }}
                      className="h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 flex items-center text-xl font-bold">
              <CheckCircle2 className="mr-3 h-6 w-6 text-emerald-400" /> Key
              Strengths
            </h3>
            <ul className="space-y-4">
              {(safeItem.strengths ?? []).map((t, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span className="leading-relaxed ">{t}</span>
                </li>
              ))}
              {!safeItem.strengths?.length && (
                <p className="text-caption">No strengths captured.</p>
              )}
            </ul>
          </motion.div>

          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 flex items-center text-xl font-bold">
              <AlertTriangle className="mr-3 h-6 w-6 text-amber-400" /> Areas
              for Improvement
            </h3>
            <ul className="space-y-4">
              {(safeItem.weaknesses ?? []).map((t, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-amber-500" />
                  <span className="leading-relaxed ">{t}</span>
                </li>
              ))}
              {!safeItem.weaknesses?.length && (
                <p className="text-caption">No weaknesses captured.</p>
              )}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 text-xl font-bold">Skills Identified</h3>
            <div className="flex flex-wrap gap-3">
              {(safeItem.skills ?? []).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {s}
                </span>
              ))}
              {!safeItem.skills?.length && (
                <span className="text-caption">No skills extracted.</span>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={card}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 text-xl font-bold">Experience Summary</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <CircleDot className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-caption">Years of Experience</p>
                  <p className="text-lg font-semibold">
                    {safeItem.experience?.years ?? "-"}{" "}
                    {safeItem.experience?.years === 1 ? "year" : "years"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-violet-400" />
                <div>
                  <p className="text-sm text-caption">Previous Companies</p>
                  <p className="text-lg font-semibold">
                    {(safeItem.experience?.companies ?? []).join(", ") || "-"}
                  </p>
                </div>
              </div>
              {safeItem.experience?.positions?.length ? (
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-caption">Roles</p>
                    <p className="text-lg font-semibold">
                      {safeItem.experience.positions.join(", ")}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="mt-8 rounded-2xl border border-border bg-card p-8"
        >
          <h3 className="mb-6 text-xl font-bold">Hiring Recommendations</h3>
          <ul className="space-y-4">
            {(safeItem.recommendations ?? []).map((t, idx) => (
              <li key={idx} className="flex items-center space-x-4">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">
                    {idx + 1}
                  </span>
                </div>
                <span className="leading-relaxed ">{t}</span>
              </li>
            ))}
            {!safeItem.recommendations?.length && (
              <p className="text-caption">No recommendations generated.</p>
            )}
          </ul>
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-8"
        >
          <h3 className="mb-6 flex items-center text-xl font-bold text-rose-200">
            <AlertTriangle className="mr-3 h-6 w-6" /> Potential Red Flags
          </h3>
          {safeItem.redFlags?.length ? (
            <ul className="space-y-3 text-rose-100">
              {safeItem.redFlags.map((rf, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-rose-400" />
                  <span className="leading-relaxed ">{rf}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-caption">No red flags detected.</p>
          )}
        </motion.div>

        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="my-12 text-center"
        >
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-custom-base transition-all duration-200 hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto sm:px-8 sm:py-4"
              aria-label="Analyze another resume"
            >
              <motion.span
                className="inline-flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ ease, duration: 0.2 }}
              >
                <UploadCloudIcon className="mr-2 h-5 w-5" />
                Analyze Another Resume
              </motion.span>
            </Link>

            <Link
              href="/history"
              className="inline-flex w-full items-center justify-center rounded-lg border-2 border-primary bg-transparent px-6 py-3 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-auto sm:px-8 sm:py-4"
              aria-label="View all analyses"
            >
              <motion.span
                className="inline-flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ ease, duration: 0.2 }}
              >
                View All Analyses
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
