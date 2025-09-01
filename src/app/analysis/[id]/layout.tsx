import { BASE_URL } from "@/lib/const";
import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    metadataBase: new URL(BASE_URL),
    applicationName: "Talent Scan",
    title: {
      default: "Analysis Results - Talent Scan",
      template: "%s | Talent Scan",
    },
    description:
      "View AI-powered resume analysis results with overall match score, skill breakdowns, strengths, risks, and actionable hiring recommendations.",
    keywords: [
      "analysis results",
      "resume analysis report",
      "AI resume analyzer",
      "candidate evaluation",
      "skills breakdown",
      "culture fit score",
      "ATS parsing",
      "hiring insights",
      "recruiting analytics",
      "talent intelligence",
    ],
    alternates: { canonical: `/analysis/${id}` },
    openGraph: {
      title: "Analysis Results - Talent Scan",
      description:
        "Explore comprehensive AI-driven candidate insights: scores, strengths, risks, and recommendations to accelerate hiring decisions.",
      url: `/analysis/${id}`,
      siteName: "Talent Scan",
      type: "article",
      images: [
        {
          url: "/og/analysis.png",
          width: 1200,
          height: 630,
          alt: "Talent Scan — Analysis Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Analysis Results - Talent Scan",
      description:
        "AI-powered resume analysis with objective scoring, skill mapping, and hiring recommendations.",
      images: ["/og/analysis.png"],
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
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
