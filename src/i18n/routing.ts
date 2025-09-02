import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": {
      de: "/",
      fr: "/",
    },
    "/upload": {
      de: "/hochladen",
      fr: "/telecharger",
    },
    "/learn-more": {
      de: "/mehr-erfahren",
      fr: "/en-savoir-plus",
    },
    "/history": {
      de: "/geschichte",
      fr: "/histoire",
    },
    "/analysis/[id]": {
      de: "/analyse/[id]",
      fr: "/analyse/[id]",
    },
  },
});
