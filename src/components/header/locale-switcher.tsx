"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LocaleSwitcher = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("lang", value);
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LocaleSwitcher;
