import { BASE_URL } from "@/lib/const";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Talent Scan",
  title: {
    default:
      "About Talent Scan – AI-Powered Resume Analysis Platform | Talent Scan",
    template: "%s | Talent Scan",
  },
  description:
    "Learn how Talent Scan transforms hiring with AI. Parse resumes, extract skills, score experience and culture fit, flag risks, and generate actionable recommendations for faster, data-driven decisions.",
  keywords: [
    "about Talent Scan",
    "AI hiring platform",
    "resume analysis",
    "ATS parser",
    "candidate scoring",
    "talent intelligence",
    "recruiting analytics",
    "skills extraction",
    "culture fit analysis",
    "HR technology",
  ],
  alternates: {
    canonical: "/learn-more",
  },
  openGraph: {
    title: "About Talent Scan – AI-Powered Resume Analysis Platform",
    description:
      "Discover the platform that delivers instant, AI-driven resume insights and recommendations to streamline screening and selection.",
    url: "/learn-more",
    siteName: "Talent Scan",
    type: "website",
    images: [
      {
        url: "/og/learn-more.png",
        width: 1200,
        height: 630,
        alt: "Talent Scan — About the Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Talent Scan – AI-Powered Resume Analysis Platform",
    description:
      "See how Talent Scan accelerates hiring with AI-powered resume parsing, scoring, and recommendations.",
    images: ["/og/learn-more.png"],
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
