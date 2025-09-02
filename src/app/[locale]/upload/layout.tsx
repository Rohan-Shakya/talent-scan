import { ReactNode } from "react";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AUTHOR_URL, BASE_URL } from "@/lib/const";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const m = messages.UploadMeta;

  return {
    metadataBase: new URL(BASE_URL),
    title: m.uploadTitle,
    description: m.uploadDescription,
    keywords: m.uploadKeywords,
    authors: [{ name: "Rohan Shakya", url: AUTHOR_URL }],
    alternates: { canonical: BASE_URL + "/upload" },
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
      title: m.uploadTitle,
      description: m.uploadDescription,
      url: BASE_URL + "/upload",
      siteName: m.siteName,
      type: "website",
      locale: locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: `${BASE_URL}/og-upload.jpg`,
          width: 1200,
          height: 630,
          alt: m.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.uploadTitle,
      description: m.uploadDescription,
      images: [`${BASE_URL}/og-upload.jpg`],
    },
    other: { publisher: m.publisher },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
