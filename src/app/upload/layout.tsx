import { BASE_URL } from "@/lib/const";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Talent Scan",
  title: {
    default: "Upload Resume for AI Analysis | Talent Scan",
    template: "%s | Talent Scan",
  },
  description:
    "Upload your resume and get instant, AI-powered analysis: skills extraction, experience scoring, culture-fit signals, strengths, risks, and actionable hiring recommendations.",
  keywords: [
    "resume analysis",
    "AI resume analyzer",
    "candidate insights",
    "skills assessment",
    "talent intelligence",
    "hiring recommendations",
    "ATS parsing",
    "resume parser",
    "talent scan",
    "HR tech",
    "recruiting automation",
  ],
  alternates: {
    canonical: "/upload",
  },
  openGraph: {
    title: "Upload Resume for AI Analysis | Talent Scan",
    description:
      "Transform screening with instant, AI-driven resume insights. Upload a PDF and receive a comprehensive report in seconds.",
    url: "/upload",
    siteName: "Talent Scan",
    type: "website",
    images: [
      {
        url: "/og/upload.png",
        width: 1200,
        height: 630,
        alt: "Talent Scan — Upload Resume for AI Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Resume for AI Analysis | Talent Scan",
    description:
      "AI-powered resume analysis with skill extraction, scoring, and hiring recommendations.",
    images: ["/og/upload.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
