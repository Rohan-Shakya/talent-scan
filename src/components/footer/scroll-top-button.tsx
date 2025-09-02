"use client";

import { useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import {
  motion,
  MotionConfig,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { useTranslations } from "next-intl";

export const ScrollTopButton = () => {
  const [isShown, setIsShown] = useState(false);
  const { scrollY } = useScroll();
  const prefersReduced = useReducedMotion();

  const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];
  const easeInOut: Transition["ease"] = [0.45, 0, 0.55, 1];

  const t = useTranslations("Footer");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsShown(latest > 200);
  });

  const flyIn: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: easeOut },
    },
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        aria-label={t("backToTop")} // Translate the label dynamically
        initial="hidden"
        animate={isShown ? "visible" : "hidden"}
        variants={flyIn}
        onClick={handleScrollToTop}
        style={{ pointerEvents: isShown ? "auto" : "none" }}
        className="group flex items-center space-x-2 text-sm text-caption transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: easeOut }}
      >
        <span className="hidden sm:inline">{t("backToTop")}</span>{" "}
        {/* Use dynamic translation here */}
        <motion.span
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : {
                  y: [0, -2, 0],
                  transition: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: easeInOut,
                  },
                }
          }
          whileHover={{ y: -3, rotate: -6 }}
          whileTap={{ y: 0, rotate: 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="grid place-items-center"
        >
          <ArrowUpIcon className="h-4 w-4 transition-colors group-hover:text-primary" />
        </motion.span>
      </motion.button>
    </MotionConfig>
  );
};
