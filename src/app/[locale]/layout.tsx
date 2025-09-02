import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MainProvider } from "@/components/providers/main-provider";
import { AUTHOR_URL, BASE_URL } from "@/lib/const";
import "../globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#171717",
  minimumScale: 1,
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

const ogLocale = (locale: string) =>
  locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : "en_US";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const m = messages.Meta;

  return {
    metadataBase: new URL(BASE_URL),
    title: m.title,
    description: m.description,
    keywords: (m.keywords ?? []) as string[],
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
      title: m.appTitle,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: BASE_URL,
      siteName: m.siteName,
      type: "website",
      locale: ogLocale(locale),
      images: [
        {
          url: `${BASE_URL}/og_image.png`,
          width: 1200,
          height: 630,
          alt: m.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${BASE_URL}/og_image.png`],
    },
    other: { publisher: m.publisher || "Talent Scan" },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const m = messages.Meta;
  const faq = messages.FAQ;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: m.title,
    description: m.description,
    inLanguage: locale,
    isPartOf: { "@id": `${BASE_URL}/#website` },
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: m.siteName,
    inLanguage: locale,
    publisher: { "@id": `${BASE_URL}/#organization` },
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: m.siteName,
    url: BASE_URL,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    description: m.orgDescription,
    foundingDate: "2024",
    knowsAbout: m.knowsAbout,
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: m.softwareName,
    alternateName: m.softwareAltName,
    description: m.softwareDescription,
    url: BASE_URL,
    applicationCategory: ["BusinessApplication", "ProductivityApplication"],
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    datePublished: "2025-07-01",
    dateModified: "2025-08-01",
    inLanguage: [locale],
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
    featureList: m.featureList,
    screenshot: `${BASE_URL}/og_image.png`,
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
        name: faq.q1,
        acceptedAnswer: { "@type": "Answer", text: faq.a1 },
      },
      {
        "@type": "Question",
        name: faq.q2,
        acceptedAnswer: { "@type": "Answer", text: faq.a2 },
      },
      {
        "@type": "Question",
        name: faq.q3,
        acceptedAnswer: { "@type": "Answer", text: faq.a3 },
      },
      {
        "@type": "Question",
        name: faq.q4,
        acceptedAnswer: { "@type": "Answer", text: faq.a4 },
      },
    ],
  };

  const allLd = [webPageLd, webSiteLd, organizationLd, softwareLd, faqLd];

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <body className={`${poppins.className} dark:bg-background antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MainProvider>{children}</MainProvider>
        </NextIntlClientProvider>
        <Script
          id="jsonld-aggregate"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(allLd) }}
        />
      </body>
    </html>
  );
}
