"use client";

import { Link } from "@/i18n/navigation";
import {
  TrendingUpIcon,
  ShieldIcon,
  GlobeIcon,
  CloudUploadIcon,
  HistoryIcon,
  FileIcon,
  CircleQuestionMarkIcon,
  CirclePlayIcon,
} from "lucide-react";
import {
  motion,
  MotionConfig,
  type Variants,
  type Transition,
} from "framer-motion";
import { ScrollTopButton } from "./scroll-top-button";
import { useLocale, useTranslations } from "next-intl";
import { DEFAULT_LOCALE } from "@/lib/const";

const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const itemHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: easeOut },
  },
  tap: { scale: 0.98, transition: { duration: 0.15, ease: easeOut } },
};

export const Footer = () => {
  const locale = useLocale();
  const t = useTranslations("Footer");

  return (
    <MotionConfig reducedMotion="user">
      <motion.footer
        className="bg-gradient-to-br from-surface/50 to-surface/30 border-t border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <motion.div className="lg:col-span-2" variants={fadeUp}>
                <div className="mb-6">
                  <motion.p
                    className="text-3xl font-bold text-primary dark:text-white"
                    variants={fadeUp}
                  >
                    {t("talentScan")}
                  </motion.p>
                  <motion.p
                    className="text-sm text-primary/80 dark:text-white/80 mt-1 font-medium"
                    variants={fadeUp}
                  >
                    {t("aiPoweredHiring")}
                  </motion.p>
                </div>
                <motion.p
                  className="text-body-text leading-relaxed mb-6 max-w-md"
                  variants={fadeUp}
                >
                  {t("recruitmentDescription")}
                </motion.p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                  {t("product")}
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <TrendingUpIcon className="w-4 h-4" />
                      </span>
                      <span>{t("features")}</span>
                    </button>
                  </motion.li>
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <ShieldIcon className="w-4 h-4" />
                      </span>
                      <span>{t("benefits")}</span>
                    </button>
                  </motion.li>
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <GlobeIcon className="w-4 h-4" />
                      </span>
                      <span>{t("howItWorks")}</span>
                    </button>
                  </motion.li>
                </ul>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                  {t("application")}
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href="/upload"
                      locale={locale !== DEFAULT_LOCALE ? locale : undefined}
                      className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                    >
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <CloudUploadIcon className="w-4 h-4" />
                      </span>
                      <span>{t("uploadResume")}</span>
                    </Link>
                  </motion.li>
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href="/history"
                      locale={locale !== DEFAULT_LOCALE ? locale : undefined}
                      className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                    >
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <HistoryIcon className="w-4 h-4" />
                      </span>
                      <span>{t("analysisHistory")}</span>
                    </Link>
                  </motion.li>
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href="/learn-more"
                      locale={locale !== DEFAULT_LOCALE ? locale : undefined}
                      className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                    >
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <FileIcon className="w-4 h-4" />
                      </span>
                      <span>{t("aboutUs")}</span>
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                  {t("help")}
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <CircleQuestionMarkIcon className="w-4 h-4" />
                      </span>
                      <span>{t("faq")}</span>
                    </button>
                  </motion.li>
                  <motion.li
                    variants={itemHover}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                      <span className="text-caption group-hover:text-primary transition-colors">
                        <CirclePlayIcon className="w-4 h-4" />
                      </span>
                      <span>{t("getStarted")}</span>
                    </button>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.div
            dir="ltr"
            className="border-t border-border py-6"
            variants={fadeUp}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-caption text-sm">
                <div className="flex flex-col min-[400px]:flex-row items-center space-x-2">
                  <span>© 2025 Talent Scan</span>
                  <span className="text-caption/60">•</span>
                  <span className="text-caption/80">
                    {t("aiPoweredHiring")}
                  </span>
                </div>
              </div>
              <ScrollTopButton />
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </MotionConfig>
  );
};
