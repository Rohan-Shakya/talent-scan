"use client";

import { ShieldIcon, TrendingUpIcon, ZapIcon } from "lucide-react";
import { motion, type Variants, cubicBezier } from "framer-motion";

const EASE = cubicBezier(0.16, 1, 0.3, 1);

const sectionStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

type Card = {
  title: string;
  desc: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CARDS: Card[] = [
  {
    title: "AI-Powered Analysis",
    desc: "Advanced machine learning algorithms analyze resumes across 50+ criteria for comprehensive insights.",
    Icon: TrendingUpIcon,
  },
  {
    title: "Privacy-First Design",
    desc: "All processing happens locally in your browser. No resume data is stored on external servers.",
    Icon: ZapIcon,
  },
  {
    title: "Multi-Language Support",
    desc: "Available in English, Arabic, Spanish, and French, with more languages planned.",
    Icon: ShieldIcon,
  },
];

export default function ProjectHighlights() {
  return (
    <motion.section
      id="features"
      className="section bg-surface/30"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={sectionStagger}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative overflow-hidden">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.6,
              transition: { duration: 0.8, ease: EASE },
            }}
          >
            <div className="absolute -top-10 left-1/3 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-10 right-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          </motion.div>

          <div className="text-center mb-16">
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-bold text-headline mb-4"
            >
              Project Highlights
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-xl text-body-text max-w-2xl mx-auto"
            >
              Key features and capabilities of the Talent Scan platform.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CARDS.map((c, i) => (
              <MotionCard key={c.title} i={i} {...c} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function MotionCard({ title, desc, Icon, i }: Card & { i: number }) {
  return (
    <motion.div
      variants={cardIn}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-[2px]" />
      <div className="relative rounded-lg smooth-hover transition-all duration-200 bg-card text-card-foreground shadow-custom-lg border border-border p-6 text-center h-full">
        <div className="mb-6">
          <div className="relative mx-auto h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-primary text-white grid place-items-center"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>

            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl"
              initial={{ scale: 1, opacity: 0.25 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.25, 0.6, 0.25],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              style={{
                boxShadow:
                  "0 0 0 2px rgba(255,255,255,0.06), 0 0 30px 0 rgba(59,130,246,0.25)",
              }}
            />
          </div>
        </div>

        <motion.h3
          variants={fadeUp}
          className="text-xl font-semibold text-headline mb-4"
        >
          {title}
        </motion.h3>

        <motion.p variants={fadeUp} className="text-body-text leading-relaxed">
          {desc}
        </motion.p>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-2 left-1/2 h-10 w-[60%] -translate-x-1/2 rounded-full bg-black/20 blur-2xl opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </div>
    </motion.div>
  );
}
