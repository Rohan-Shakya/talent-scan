"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  FileText,
  TrendingUp,
  CalendarDays,
  LineChart,
  Download as DownloadIcon,
  Eye,
  MoreVertical,
  Trash2,
  Search,
  AlertTriangle,
} from "lucide-react";
import DefaultLayout from "@/components/layouts/default-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SupportedLocale = "en" | "de" | "fr";

type MultiLangSnapshot = {
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  skills?: string[];
  redFlags?: string[];
  candidateName?: string;
};

type HistoryItem = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisDate: string;
  candidateName: string;
  overallScore: number;
  scores?: Record<string, number>;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  skills?: string[];
  experience?: { years?: number };
  primaryLanguage?: SupportedLocale;
  multiLanguageData?: Record<string, MultiLangSnapshot>;
  fileUrl?: string;
};

const STORAGE_KEY = "talent-scan:history" as const;

type SortKey =
  | "date_desc"
  | "date_asc"
  | "score_desc"
  | "score_asc"
  | "name_asc"
  | "name_desc";

const SORT_LABELS: Record<SortKey, string> = {
  date_desc: "Date (Newest First)",
  date_asc: "Date (Oldest First)",
  score_desc: "Score (Highest First)",
  score_asc: "Score (Lowest First)",
  name_asc: "Name (A–Z)",
  name_desc: "Name (Z–A)",
};

const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const fmtDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

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

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [lang, setLang] = useState<string>("en");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(
    (typeof window !== "undefined" &&
      (localStorage.getItem("talent-scan:sort") as SortKey)) ||
      "date_desc"
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed as HistoryItem[]);
    } catch {}
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("talent-scan:sort", sortKey);
    } catch {}
  }, [sortKey]);

  const stats = useMemo(() => {
    if (!items.length) return { total: 0, avg: 0, thisWeek: 0, topCount: 0 };
    const total = items.length;
    const avg = Math.round(
      items.reduce((acc, x) => acc + (x.overallScore || 0), 0) / total
    );
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = items.filter(
      (x) => new Date(x.analysisDate).getTime() >= weekAgo
    ).length;
    const topCount = items.filter((x) => (x.overallScore || 0) >= 85).length;
    return { total, avg, thisWeek, topCount };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const name = (it.candidateName || "").toLowerCase();
      const file = (it.fileName || "").toLowerCase();
      return name.includes(q) || file.includes(q);
    });
  }, [items, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortKey) {
      case "date_desc":
        copy.sort(
          (a, b) =>
            new Date(b.analysisDate).getTime() -
            new Date(a.analysisDate).getTime()
        );
        break;
      case "date_asc":
        copy.sort(
          (a, b) =>
            new Date(a.analysisDate).getTime() -
            new Date(b.analysisDate).getTime()
        );
        break;
      case "score_desc":
        copy.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
        break;
      case "score_asc":
        copy.sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0));
        break;
      case "name_asc":
        copy.sort((a, b) =>
          (a.candidateName || a.fileName).localeCompare(
            b.candidateName || b.fileName
          )
        );
        break;
      case "name_desc":
        copy.sort((a, b) =>
          (b.candidateName || b.fileName).localeCompare(
            a.candidateName || a.fileName
          )
        );
        break;
    }
    return copy;
  }, [filtered, sortKey]);

  const persist = (next: HistoryItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const removeItem = (id: string) => {
    persist(items.filter((x) => x.id !== id));
  };

  const removeAll = () => {
    persist([]);
    setOpenDeleteAll(false);
  };

  const onDownload = async (item: HistoryItem) => {
    if (item.fileUrl) {
      const a = document.createElement("a");
      a.href = item.fileUrl;
      a.download = item.fileName || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      (item.candidateName?.replace(/\s+/g, "_") || "analysis") + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <DefaultLayout>
      <motion.div
        className="min-h-screen py-8"
        initial="hidden"
        animate="show"
        variants={listStagger}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div variants={card} className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-headline mb-4">
              Analysis History
            </h1>
            <p className="text-xl text-body-text">
              View and manage your saved resume analyses
            </p>
          </motion.div>

          <motion.div
            variants={listStagger}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <KpiCard
              icon={FileText}
              color="cyan"
              value={stats.total}
              label="Total Analyses"
            />
            <KpiCard
              icon={LineChart}
              color="emerald"
              value={`${stats.avg}%`}
              label="Average Score"
            />
            <KpiCard
              icon={CalendarDays}
              color="amber"
              value={stats.thisWeek}
              label="This Week"
            />
            <KpiCard
              icon={TrendingUp}
              color="orange"
              value={stats.topCount}
              label="Top Candidates (≥85)"
            />
          </motion.div>

          <motion.div
            variants={card}
            className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-caption" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by filename or candidate name..."
                className="w-full rounded-md border border-border bg-surface/60 pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={sortKey}
                onValueChange={(v: SortKey) => setSortKey(v)}
              >
                <SelectTrigger className="w-56 rounded-md border-border bg-card">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="w-56">
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SORT_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="bg-red-600 hover:bg-red-500 dark:text-white rounded-md"
                onClick={() => setOpenDeleteAll(true)}
                disabled={items.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Delete All
              </Button>
            </div>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              variants={card}
              className="flex flex-col items-center justify-center text-center rounded-2xl border border-border bg-card py-16 shadow-custom-lg"
            >
              <div className="mb-4 rounded-2xl bg-surface p-4 ring-1 ring-border">
                <FileText className="h-10 w-10 text-caption" />
              </div>
              <h3 className="text-xl font-semibold text-headline">
                No analyses yet
              </h3>
              <p className="mt-2 max-w-md text-body-text/80">
                Upload your first resume to get started.
              </p>
              <Link
                href="/upload"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Upload Resume
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={listStagger} className="space-y-4">
              {sorted.length === 0 && (
                <motion.div
                  variants={card}
                  className="rounded-lg border border-border bg-surface/60 p-6 text-center text-caption"
                >
                  No matching analyses.
                </motion.div>
              )}

              <AnimatePresence>
                {sorted.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={card}
                    initial="hidden"
                    animate="show"
                    exit={{
                      opacity: 0,
                      y: 8,
                      transition: { duration: 0.2, ease },
                    }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-border bg-card p-6 shadow-custom-lg transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-headline truncate">
                          {item.candidateName || item.fileName}
                        </h3>
                        <p className="mt-1 text-[15px] text-caption">
                          {item.fileName} • {bytesToSize(item.fileSize)}
                        </p>
                        <p className="mt-2 text-sm opacity-60 leading-relaxed text-body-text line-clamp-2">
                          {item.multiLanguageData?.[lang]?.summary ||
                            item.summary ||
                            "No summary available."}
                        </p>
                        <p className="mt-1 text-xs text-caption/70">
                          Analyzed: {fmtDate(item.analysisDate)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <motion.span
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { duration: 0.35, ease },
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-700/30"
                        >
                          {item.overallScore}%
                        </motion.span>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl bg-surface hover:bg-surface/70"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/analysis/${item.id}`)
                              }
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDownload(item)}
                              className="flex items-center gap-2"
                            >
                              <DownloadIcon className="h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(item.id)}
                              className="flex items-center gap-2 text-red-500"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-border rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <AlertDialogTitle className="text-xl">
                Delete Analysis
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this analysis? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end gap-2">
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 dark:text-white rounded-md"
              onClick={() => {
                if (deleteId) removeItem(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDeleteAll} onOpenChange={setOpenDeleteAll}>
        <AlertDialogContent className="border-border rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <AlertDialogTitle className="text-xl">
                Delete All Analyses
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete all {items.length} analyses? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end gap-2">
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 dark:text-white rounded-md"
              onClick={removeAll}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DefaultLayout>
  );
}

function KpiCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof FileText;
  color: "cyan" | "emerald" | "amber" | "orange";
  value: number | string;
  label: string;
}) {
  const tone =
    color === "cyan"
      ? {
          bg: "bg-cyan-900/30",
          ring: "ring-cyan-700/40",
          text: "text-cyan-300",
        }
      : color === "emerald"
      ? {
          bg: "bg-emerald-900/30",
          ring: "ring-emerald-700/40",
          text: "text-emerald-300",
        }
      : color === "amber"
      ? {
          bg: "bg-amber-900/30",
          ring: "ring-amber-700/40",
          text: "text-amber-300",
        }
      : {
          bg: "bg-orange-900/30",
          ring: "ring-orange-700/40",
          text: "text-orange-300",
        };

  return (
    <motion.div
      variants={card}
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-card text-card-foreground shadow-custom-lg border border-border p-6"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.bg} ${tone.ring} ring-1`}
        >
          <Icon className={`h-6 w-6 ${tone.text}`} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-headline">{value}</p>
          <p className="text-sm text-caption">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
