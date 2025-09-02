"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu, type NavItem } from "./mobile-menu";
import { DEFAULT_LOCALE } from "@/lib/const";

export const Header = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Header");

  const NAV = [
    { href: t("homeUrl"), label: t("home"), aria: t("home") },
    {
      href: t("uploadResumeUrl"),
      label: t("uploadResume"),
      aria: t("uploadResumeAria"),
    },
    { href: t("historyUrl"), label: t("history"), aria: t("historyAria") },
  ] as const satisfies ReadonlyArray<NavItem>;

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <Link
          href="/"
          locale={locale !== DEFAULT_LOCALE ? locale : undefined}
          aria-label={t("brand")}
        >
          <h1 className="text-2xl font-bold text-primary dark:text-white tracking-tight">
            {t("brand")}
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {NAV.map((item) => {
            const active = item.href === pathname;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.aria}
                className={`px-0 py-2 text-sm font-medium transition-all ${
                  active
                    ? "text-primary border-b-2 border-primary"
                    : "text-body-text hover:text-headline"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 ml-8 md:ml-16">
          <ThemeSwitcher />
          <LocaleSwitcher className="hidden md:flex" />
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            aria-label={t("openMenu")}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        nav={NAV}
        brand={t("brand")}
      />
    </header>
  );
};
