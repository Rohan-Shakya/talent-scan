import { AUTHOR_URL, BASE_URL } from "@/lib/const";
import { Metadata } from "next";
import { ReactNode } from "react";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const m = messages.LearnMoreMeta;

  return {
    metadataBase: new URL(BASE_URL),
    title: m.pageTitle,
    description: m.pageDescription,
    keywords: m.pageKeywords,
    authors: [{ name: "Rohan Shakya", url: AUTHOR_URL }],
    alternates: { canonical: BASE_URL + "/learn-more" },
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
      title: m.pageTitle,
    },
    openGraph: {
      title: m.pageTitle,
      description: m.pageDescription,
      url: BASE_URL + "/learn-more",
      siteName: m.publisher,
      type: "website",
      locale: locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: `${BASE_URL}/og/learn-more.png`,
          width: 1200,
          height: 630,
          alt: m.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.pageTitle,
      description: m.pageDescription,
      images: [`${BASE_URL}/og/learn-more.png`],
    },
    other: { publisher: m.publisher },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
