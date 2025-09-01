import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2025-09-01";
  return [
    {
      url: "https://talent-scan-rohan.vercel.app/",
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://talent-scan-rohan.vercel.app/upload",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://talent-scan-rohan.vercel.app/learn-more",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://talent-scan-rohan.vercel.app/history",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.shakyarohan.com.np",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
