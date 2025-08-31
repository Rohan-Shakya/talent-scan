import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { MainProvider } from "@/components/providers/main-provider";
import { AUTHOR_URL, BASE_URL } from "@/lib/const";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Talent Scan - AI-Powered Resume Analysis & Candidate Screening",
  description:
    "Transform your hiring process with AI. Upload resumes and get instant, comprehensive candidate insights, skills assessment, and hiring recommendations.",
  keywords: [
    "AI resume analysis",
    "candidate screening",
    "hiring tool",
    "resume parser",
    "recruitment AI",
    "HR technology",
    "talent acquisition",
    "resume screening",
    "candidate assessment",
    "rohan shakya",
  ],
  authors: [{ name: "Rohan Shakya", url: AUTHOR_URL }],
  alternates: { canonical: BASE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Talent Scan",
  },
  openGraph: {
    title: "Talent Scan - AI-Powered Resume Analysis & Candidate Screening",
    description:
      "Transform your hiring process with AI. Upload resumes and get instant, comprehensive candidate insights, skills assessment, and hiring recommendations.",
    url: BASE_URL,
    siteName: "Talent Scan",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Talent Scan - AI-Powered Resume Analysis & Candidate Screening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talent Scan - AI-Powered Resume Analysis & Candidate Screening",
    description:
      "Transform your hiring process with AI. Upload resumes and get instant, comprehensive candidate insights, skills assessment, and hiring recommendations.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  other: { publisher: "Talent Scan" },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  minimumScale: 1,
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: "Talent Scan - AI-Powered Resume Analysis & Candidate Screening",
  description:
    "Transform your hiring process with AI. Upload resumes and get instant, comprehensive candidate insights, skills assessment, and hiring recommendations.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Talent Scan",
  publisher: { "@id": `${BASE_URL}/#organization` },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Talent Scan",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
  },
  description: "AI-powered resume analysis platform for modern recruitment.",
  foundingDate: "2024",
  knowsAbout: [
    "Artificial Intelligence",
    "Resume Analysis",
    "Human Resources",
    "Recruitment Technology",
    "Candidate Screening",
  ],
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": ["WebApplication", "SoftwareApplication"],
  name: "Talent Scan",
  alternateName: "Talent Scan Resume Analyzer",
  description:
    "AI-Powered Resume Analysis & Candidate Screening Tool with instant insights and skills assessment.",
  url: BASE_URL,
  applicationCategory: ["BusinessApplication", "ProductivityApplication"],
  operatingSystem: "Web Browser",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "1.0.0",
  datePublished: "2025-07-01",
  dateModified: "2025-08-01",
  inLanguage: ["en"],
  isAccessibleForFree: true,
  creator: {
    "@type": "Person",
    name: "Rohan Shakya",
    url: AUTHOR_URL,
    jobTitle: "Software Developer",
  },
  publisher: { "@id": `${BASE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "AI-powered resume analysis",
    "Instant candidate insights",
    "Skills assessment and evaluation",
    "Hiring recommendations",
    "PDF resume parsing",
    "Candidate scoring and ranking",
    "Export analysis reports",
    "Privacy-focused local processing",
  ],
  screenshot: `${BASE_URL}/og-image.jpg`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
  applicationSubCategory: "Human Resources",
  downloadUrl: BASE_URL,
  installUrl: BASE_URL,
  memoryRequirements: "2GB",
  processorRequirements: "1GHz",
  storageRequirements: "50MB",
  supportingData: "PDF files up to 5MB",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate is the AI analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI is trained on thousands of resumes and job descriptions, achieving high accuracy in skills identification and experience evaluation.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure and private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All resume processing happens locally in your browser. We do not store resume content on our servers.",
      },
    },
    {
      "@type": "Question",
      name: "What file formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently support PDF files up to 5MB. Additional formats are planned.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Talent Scan cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Talent Scan is currently free to use to help organizations of all sizes.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const allLd = [webPageLd, webSiteLd, organizationLd, softwareLd, faqLd];

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${poppins.className} dark:bg-background antialiased`}>
        <MainProvider>{children}</MainProvider>
        <Script
          id="jsonld-aggregate"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(allLd),
          }}
        />
      </body>
    </html>
  );
}
