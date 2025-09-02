"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const LANG = {
  en: { flag: "🇺🇸" },
  de: { flag: "🇩🇪" },
  fr: { flag: "🇫🇷" },
} as const;

export const LocaleSwitcher = ({ className }: { className?: string }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Languages");

  const handleLocaleChange = (next: string) => {
    router.replace(pathname as "/upload" | "/learn-more" | "/history", {
      locale: next,
    });
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className={`w-[200px] ${className ?? ""}`}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        {Object.entries(LANG).map(([value, meta]) => (
          <SelectItem key={value} value={value} className="py-2">
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{meta.flag}</span>
              <span className="text-base">{t(`${value}`)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
