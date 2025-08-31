"use client";

import { motion, type Variants, cubicBezier } from "framer-motion";

const EASE = cubicBezier(0.16, 1, 0.3, 1);

const sectionStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
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
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

const badgePop: Variants = {
  hidden: { scale: 0.7, opacity: 0, rotate: -6 },
  show: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

type Step = { n: string; title: string; desc: string };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Upload Resume",
    desc: "Simply drag and drop a PDF resume or click to select.",
  },
  {
    n: "02",
    title: "AI Analysis",
    desc: "Our advanced AI analyzes skills, experience, and fit.",
  },
  {
    n: "03",
    title: "Get Insights",
    desc: "Receive detailed analysis with scores and recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="section bg-surface/30"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={sectionStagger}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-headline mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xl text-body-text max-w-2xl mx-auto"
          >
            Get started with Talent Scan in just three simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <StepCard key={s.n} {...s} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function StepCard({ n, title, desc, isLast }: Step & { isLast?: boolean }) {
  return (
    <motion.div variants={cardIn} className="relative text-center">
      <div className="relative mb-6">
        <motion.div
          variants={badgePop}
          className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-sm"
        >
          {n}
        </motion.div>

        {!isLast && (
          <motion.div
            aria-hidden="true"
            className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border origin-left translate-x-8"
            variants={lineGrow}
          />
        )}
      </div>

      <motion.h3
        variants={fadeUp}
        className="text-xl font-semibold text-headline mb-3"
      >
        {title}
      </motion.h3>
      <motion.p variants={fadeUp} className="text-body-text">
        {desc}
      </motion.p>
    </motion.div>
  );
}
