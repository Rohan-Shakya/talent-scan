import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import type { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5";
const MAX_TEXT_CHARS = 100_000;

const MultiLangBlock = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()),
  redFlags: z.array(z.string()).optional().default([]),
  candidateName: z.string(),
});

const LLMAnalysisSchema = z.object({
  candidateName: z.string(),
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    technical: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    cultureFit: z.number().min(0).max(100),
  }),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.object({
    years: z.number(),
    positions: z.array(z.string()),
    companies: z.array(z.string()),
  }),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.union([z.number(), z.string()]),
    })
  ),
  keyHighlights: z.array(z.string()).optional().default([]),
  redFlags: z.array(z.string()).optional().default([]),
  multiLanguageData: z
    .object({
      en: MultiLangBlock,
      de: MultiLangBlock.optional(),
      fr: MultiLangBlock.optional(),
    })
    .optional(),
});

type SupportedLocale = "en" | "de" | "fr";
type MultiLangSnapshot = z.infer<typeof MultiLangBlock>;

interface AnalysisResponse {
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
  experience: {
    years: number;
    positions: string[];
    companies: string[];
  };
  education: { degree: string; institution: string; year: number }[];
  keyHighlights?: string[];
  redFlags: string[];
  rawText: string;
  multiLanguageData: Record<SupportedLocale, MultiLangSnapshot>;
  primaryLanguage: "en";
}

async function extractTextFromPdf(file: File): Promise<string> {
  const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
  const ab = await file.arrayBuffer();
  const buf = Buffer.from(ab);
  const result: { text?: string } = await pdfParse(buf);
  let text = (result.text ?? "")
    .replace(/\u00AD/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text) text = "[No extractable text detected in PDF]";
  if (text.length > MAX_TEXT_CHARS) text = text.slice(0, MAX_TEXT_CHARS);
  return text;
}

function buildPrompt(resumeText: string): string {
  return `
You are an expert HR professional and resume screener. Analyze the following resume text and provide a comprehensive evaluation in JSON format.

IMPORTANT: Provide all analysis content in English.

RESUME TEXT:
${resumeText}

Return strictly valid JSON:

{
  "candidateName": "...",
  "overallScore": 85,
  "scores": { "technical": 80, "experience": 85, "communication": 90, "cultureFit": 80 },
  "summary": "2–3 sentence profile",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "skills": ["..."],
  "experience": { "years": 5, "positions": ["..."], "companies": ["..."] },
  "education": [{ "degree": "...", "institution": "...", "year": "2019" }],
  "keyHighlights": ["..."],
  "redFlags": ["..."]
}`;
}

function resumeJsonSchema() {
  return {
    name: "ResumeAnalysis",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        candidateName: { type: "string" },
        overallScore: { type: "number", minimum: 0, maximum: 100 },
        scores: {
          type: "object",
          additionalProperties: false,
          properties: {
            technical: { type: "number", minimum: 0, maximum: 100 },
            experience: { type: "number", minimum: 0, maximum: 100 },
            communication: { type: "number", minimum: 0, maximum: 100 },
            cultureFit: { type: "number", minimum: 0, maximum: 100 },
          },
          required: ["technical", "experience", "communication", "cultureFit"],
        },
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        recommendations: { type: "array", items: { type: "string" } },
        skills: { type: "array", items: { type: "string" } },
        experience: {
          type: "object",
          additionalProperties: false,
          properties: {
            years: { type: "number" },
            positions: { type: "array", items: { type: "string" } },
            companies: { type: "array", items: { type: "string" } },
          },
          required: ["years", "positions", "companies"],
        },
        education: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              degree: { type: "string" },
              institution: { type: "string" },
              year: { anyOf: [{ type: "number" }, { type: "string" }] },
            },
            required: ["degree", "institution", "year"],
          },
        },
        keyHighlights: { type: "array", items: { type: "string" } },
        redFlags: { type: "array", items: { type: "string" } },
        multiLanguageData: {
          type: "object",
          additionalProperties: false,
          properties: {
            en: {
              type: "object",
              additionalProperties: false,
              properties: {
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                skills: { type: "array", items: { type: "string" } },
                redFlags: { type: "array", items: { type: "string" } },
                candidateName: { type: "string" },
              },
              required: [
                "summary",
                "strengths",
                "weaknesses",
                "skills",
                "candidateName",
              ],
            },
            de: {
              type: "object",
              additionalProperties: false,
              properties: {
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                skills: { type: "array", items: { type: "string" } },
                redFlags: { type: "array", items: { type: "string" } },
                candidateName: { type: "string" },
              },
              required: [
                "summary",
                "strengths",
                "weaknesses",
                "skills",
                "candidateName",
              ],
            },
            fr: {
              type: "object",
              additionalProperties: false,
              properties: {
                summary: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                skills: { type: "array", items: { type: "string" } },
                redFlags: { type: "array", items: { type: "string" } },
                candidateName: { type: "string" },
              },
              required: [
                "summary",
                "strengths",
                "weaknesses",
                "skills",
                "candidateName",
              ],
            },
          },
          required: ["en"],
        },
      },
      required: [
        "candidateName",
        "overallScore",
        "scores",
        "summary",
        "strengths",
        "weaknesses",
        "recommendations",
        "skills",
        "experience",
        "education",
      ],
    },
    strict: true,
  } as const;
}

type FuncToolCall = Extract<
  ChatCompletionMessageToolCall,
  { type: "function" }
>;

function isFuncToolCall(x: ChatCompletionMessageToolCall): x is FuncToolCall {
  return x.type === "function";
}

async function generateAnalysisJSON(promptText: string): Promise<string> {
  try {
    const chatFn = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional and resume screener.",
        },
        { role: "user", content: promptText },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "emit_analysis",
            description:
              "Return the resume analysis using the exact fields requested.",
            parameters: resumeJsonSchema().schema,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "emit_analysis" } },
      temperature: 0,
    });

    const calls = (chatFn.choices?.[0]?.message?.tool_calls ??
      []) as ChatCompletionMessageToolCall[];
    const fn = calls.find(isFuncToolCall);
    const argStr = fn?.function?.arguments ?? "";
    const trimmed = typeof argStr === "string" ? argStr.trim() : "";
    if (trimmed) return trimmed;
  } catch {}

  try {
    const chatSchema = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional and resume screener.",
        },
        { role: "user", content: promptText },
      ],
      response_format: { type: "json_schema", json_schema: resumeJsonSchema() },
      temperature: 0,
    });
    const text = chatSchema.choices?.[0]?.message?.content?.trim();
    if (text) return text;
  } catch {}

  const chatPlain = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert HR professional and resume screener. Respond with ONLY valid JSON that matches the requested shape. Do not include any prose outside JSON.",
      },
      { role: "user", content: promptText },
    ],
    temperature: 0,
  });
  const plain = chatPlain.choices?.[0]?.message?.content?.trim();
  if (plain) return plain;

  throw new Error("Model returned empty output.");
}

const nowISO = () => new Date().toISOString();

function toYearNumber(year: number | string): number {
  if (typeof year === "number" && Number.isFinite(year)) return year;
  const n = Number(year);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

type PartialAnalysis = Partial<z.infer<typeof LLMAnalysisSchema>> & {
  multiLanguageData?: Partial<
    Record<SupportedLocale, Partial<MultiLangSnapshot>>
  >;
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files: File[] = [
      ...form.getAll("file").filter((f): f is File => f instanceof File),
      ...form.getAll("files").filter((f): f is File => f instanceof File),
    ];

    if (files.length === 0) {
      return NextResponse.json(
        {
          error:
            "No PDF files found. Use 'file' or 'files' in multipart/form-data.",
        },
        { status: 400 }
      );
    }

    const uploadDate = nowISO();

    const results: AnalysisResponse[] = await Promise.all(
      files.map(async (file) => {
        if (!file.type?.toLowerCase().includes("pdf")) {
          throw new Error(
            `Unsupported file type for "${file.name}". Only application/pdf is allowed.`
          );
        }

        const rawText = await extractTextFromPdf(file);
        const promptText = buildPrompt(rawText);
        const jsonText = await generateAnalysisJSON(promptText);

        const base = JSON.parse(jsonText) as unknown;
        const parsed = LLMAnalysisSchema.safeParse(base);

        const data = parsed.success
          ? parsed.data
          : (() => {
              const loose = base as PartialAnalysis;

              const fallback: z.infer<typeof LLMAnalysisSchema> = {
                candidateName: String(loose.candidateName ?? ""),
                overallScore: Number(loose.overallScore ?? 0),
                scores: {
                  technical: Number(loose.scores?.technical ?? 0),
                  experience: Number(loose.scores?.experience ?? 0),
                  communication: Number(loose.scores?.communication ?? 0),
                  cultureFit: Number(loose.scores?.cultureFit ?? 0),
                },
                summary: String(loose.summary ?? ""),
                strengths: Array.isArray(loose.strengths)
                  ? (loose.strengths as string[])
                  : [],
                weaknesses: Array.isArray(loose.weaknesses)
                  ? (loose.weaknesses as string[])
                  : [],
                recommendations: Array.isArray(loose.recommendations)
                  ? (loose.recommendations as string[])
                  : [],
                skills: Array.isArray(loose.skills)
                  ? (loose.skills as string[])
                  : [],
                experience: {
                  years: Number(
                    (loose.experience as { years?: number })?.years ?? 0
                  ),
                  positions: Array.isArray(
                    (loose.experience as { positions?: string[] })?.positions
                  )
                    ? ((loose.experience as { positions?: string[] })
                        .positions as string[])
                    : [],
                  companies: Array.isArray(
                    (loose.experience as { companies?: string[] })?.companies
                  )
                    ? ((loose.experience as { companies?: string[] })
                        .companies as string[])
                    : [],
                },
                education: Array.isArray(loose.education)
                  ? (
                      loose.education as Array<{
                        degree?: string;
                        institution?: string;
                        year?: number | string;
                      }>
                    ).map((e) => ({
                      degree: String(e.degree ?? ""),
                      institution: String(e.institution ?? ""),
                      year: e.year ?? "",
                    }))
                  : [],
                keyHighlights: Array.isArray(loose.keyHighlights)
                  ? (loose.keyHighlights as string[])
                  : [],
                redFlags: Array.isArray(loose.redFlags)
                  ? (loose.redFlags as string[])
                  : [],
                multiLanguageData: {
                  en: {
                    summary: String(
                      loose.multiLanguageData?.en?.summary ??
                        loose.summary ??
                        ""
                    ),
                    strengths:
                      (loose.multiLanguageData?.en?.strengths as string[]) ??
                      (Array.isArray(loose.strengths)
                        ? (loose.strengths as string[])
                        : []),
                    weaknesses:
                      (loose.multiLanguageData?.en?.weaknesses as string[]) ??
                      (Array.isArray(loose.weaknesses)
                        ? (loose.weaknesses as string[])
                        : []),
                    recommendations:
                      (loose.multiLanguageData?.en
                        ?.recommendations as string[]) ??
                      (Array.isArray(loose.recommendations)
                        ? (loose.recommendations as string[])
                        : []),
                    skills:
                      (loose.multiLanguageData?.en?.skills as string[]) ??
                      (Array.isArray(loose.skills)
                        ? (loose.skills as string[])
                        : []),
                    redFlags:
                      (loose.multiLanguageData?.en?.redFlags as string[]) ??
                      (Array.isArray(loose.redFlags)
                        ? (loose.redFlags as string[])
                        : []),
                    candidateName: String(
                      loose.multiLanguageData?.en?.candidateName ??
                        loose.candidateName ??
                        ""
                    ),
                  },
                  de: loose.multiLanguageData?.de
                    ? {
                        summary: String(loose.multiLanguageData.de.summary),
                        strengths:
                          (loose.multiLanguageData.de.strengths as string[]) ??
                          [],
                        weaknesses:
                          (loose.multiLanguageData.de.weaknesses as string[]) ??
                          [],
                        recommendations:
                          (loose.multiLanguageData.de
                            .recommendations as string[]) ?? [],
                        skills:
                          (loose.multiLanguageData.de.skills as string[]) ?? [],
                        redFlags:
                          (loose.multiLanguageData.de.redFlags as string[]) ??
                          [],
                        candidateName: String(
                          loose.multiLanguageData.de.candidateName ?? ""
                        ),
                      }
                    : undefined,
                  fr: loose.multiLanguageData?.fr
                    ? {
                        summary: String(loose.multiLanguageData.fr.summary),
                        strengths:
                          (loose.multiLanguageData.fr.strengths as string[]) ??
                          [],
                        weaknesses:
                          (loose.multiLanguageData.fr.weaknesses as string[]) ??
                          [],
                        recommendations:
                          (loose.multiLanguageData.fr
                            .recommendations as string[]) ?? [],
                        skills:
                          (loose.multiLanguageData.fr.skills as string[]) ?? [],
                        redFlags:
                          (loose.multiLanguageData.fr.redFlags as string[]) ??
                          [],
                        candidateName: String(
                          loose.multiLanguageData.fr.candidateName ?? ""
                        ),
                      }
                    : undefined,
                },
              };

              return LLMAnalysisSchema.parse(fallback);
            })();

        const education = data.education.map((e) => ({
          degree: e.degree,
          institution: e.institution,
          year: toYearNumber(e.year),
        }));

        const analysisDate = nowISO();
        const id = `${Date.now()}`;

        const multiLanguageData: AnalysisResponse["multiLanguageData"] = {
          en: data.multiLanguageData?.en ?? {
            summary: data.summary,
            strengths: data.strengths,
            weaknesses: data.weaknesses,
            recommendations: data.recommendations,
            skills: data.skills,
            redFlags: data.redFlags ?? [],
            candidateName: data.candidateName,
          },
          de:
            data.multiLanguageData?.de ??
            ({
              summary: "",
              strengths: [],
              weaknesses: [],
              recommendations: [],
              skills: [],
              redFlags: [],
              candidateName: "",
            } as MultiLangSnapshot),
          fr:
            data.multiLanguageData?.fr ??
            ({
              summary: "",
              strengths: [],
              weaknesses: [],
              recommendations: [],
              skills: [],
              redFlags: [],
              candidateName: "",
            } as MultiLangSnapshot),
        };

        const result: AnalysisResponse = {
          id,
          fileName: file.name,
          fileSize: file.size,
          uploadDate,
          analysisDate,
          candidateName: data.candidateName,
          overallScore: data.overallScore,
          scores: data.scores,
          summary: data.summary,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          recommendations: data.recommendations,
          skills: data.skills,
          experience: data.experience,
          education,
          keyHighlights: data.keyHighlights ?? [],
          redFlags: data.redFlags ?? [],
          rawText,
          multiLanguageData,
          primaryLanguage: "en",
        };

        return result;
      })
    );

    return NextResponse.json(results.length === 1 ? results[0] : { results }, {
      status: 200,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while analyzing PDF(s).";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
