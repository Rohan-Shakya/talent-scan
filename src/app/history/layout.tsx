import { BASE_URL } from "@/lib/const";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Talent Scan",
  title: {
    default: "Analysis History - Talent Scan",
    template: "%s | Talent Scan",
  },
  description:
    "Review and manage your AI resume analysis history. Reopen reports, compare scores, track candidates, and export insights for compliant, data-driven hiring decisions.",
  keywords: [
    "analysis history",
    "resume analysis history",
    "candidate reports",
    "hiring analytics",
    "talent intelligence",
    "ATS insights",
    "HR audit trail",
    "compare candidates",
    "saved evaluations",
    "AI recruiting analytics",
  ],
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: "Analysis History - Talent Scan",
    description:
      "Access your past AI resume analyses in one place. Compare performance, track progress, and export reports.",
    url: "/history",
    siteName: "Talent Scan",
    type: "website",
    images: [
      {
        url: "/og/history.png",
        width: 1200,
        height: 630,
        alt: "Talent Scan — Analysis History",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analysis History - Talent Scan",
    description:
      "Browse your AI resume analysis history. Reopen, compare, and export insights for smarter hiring.",
    images: ["/og/history.png"],
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
