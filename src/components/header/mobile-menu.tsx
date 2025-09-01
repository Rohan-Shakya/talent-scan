"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LocaleSwitcher } from "./locale-switcher";

type NavItem = { href: string; label: string; aria: string };

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  brand?: string;
};

const variants: Variants = {
  initial: { x: "100%" },
  enter: {
    x: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
};

export const MobileMenu = ({
  open,
  onClose,
  nav,
  brand = "Talent Scan",
}: Props) => {
  const pathname = usePathname();

  const isMobile = useMediaQuery("(max-width: 767px)", {
    defaultValue: false,
    initializeWithValue: false,
  });

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="
            fixed inset-0 z-[60]
            bg-background flex flex-col
            w-screen h-[100dvh] overscroll-none
          "
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-border">
            <h2 className="text-xl font-bold text-primary dark:text-white">
              {brand}
            </h2>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="p-2 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-10">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.aria}
                  className={`text-2xl font-medium ${
                    active
                      ? "text-primary"
                      : "text-body-text hover:text-headline"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <LocaleSwitcher className="w-full" />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
