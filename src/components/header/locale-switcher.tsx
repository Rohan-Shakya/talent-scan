"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { className?: string };

const LANG = {
  en: { label: "English", flag: "🇺🇸" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  fr: { label: "Français", flag: "🇫🇷" },
} as const;

type LangKey = keyof typeof LANG;

function getInitialLang(): LangKey {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("talent-scan:lang");
  return saved && saved in LANG ? (saved as LangKey) : "en";
}

export const LocaleSwitcher = ({ className }: Props) => {
  const [language, setLanguage] = useState<LangKey>(getInitialLang);

  const onChange = (value: LangKey) => {
    setLanguage(value);
    if (typeof window !== "undefined")
      localStorage.setItem("talent-scan:lang", value);
  };

  return (
    <Select value={language} onValueChange={onChange}>
      <SelectTrigger className={`w-[200px] ${className ?? ""}`}>
        <SelectValue aria-label={LANG[language].label} />
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        {Object.entries(LANG).map(([value, meta]) => (
          <SelectItem key={value} value={value} className="py-2">
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{meta.flag}</span>
              <span className="text-base">{meta.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
