import MinimalLayout from "@/components/layouts/minimal-layout";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const LearnMore = () => {
  return (
    <MinimalLayout>
      <main className="w-full max-w-6xl rounded-lg px-6 py-10 md:px-12 md:py-14 border border-border bg-surface/80 backdrop-blur-sm shadow-lg">
        <div className="space-y-8">
          <div className="space-y-8 w-full max-w-6xl prose sm:prose-lg dark:prose-invert prose-figcaption:text-sm prose-figcaption:text-center prose-figcaption:mt-2">
            <section className="text-center mb-12">
              <div className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                AI-Powered Recruitment Revolution
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-headline mb-6 leading-tight">
                Welcome to Talent Scan
              </h1>
              <p className="text-xl md:text-2xl text-body-text max-w-3xl mx-auto leading-relaxed">
                Transform your hiring process with intelligent resume analysis.
              </p>
            </section>

            <section className="my-12">
              <hr className="border-border" />
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4 border-b border-border pb-3">
                What is Talent Scan?
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-body-text leading-relaxed">
                  Talent-Scan is a revolutionary AI-powered platform designed to
                  streamline and enhance your recruitment process. Our advanced
                  technology analyzes resumes with unprecedented accuracy,
                  providing you with actionable insights to make better hiring
                  decisions.
                </p>
                <p className="text-lg text-body-text leading-relaxed">
                  Built with cutting-edge machine learning algorithms,
                  Talent-Scan transforms the traditional resume screening
                  process from a time-consuming manual task into an intelligent,
                  automated system that delivers results in seconds.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-headline mb-8">
                Key Features
              </h3>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {[
                  {
                    icon: "🤖",
                    title: "AI-Powered Analysis",
                    desc: "Advanced machine learning algorithms that understand context and nuance",
                  },
                  {
                    icon: "🔒",
                    title: "Privacy-First Design",
                    desc: "All processing happens locally in your browser - your data never leaves your device",
                  },
                  {
                    icon: "🌍",
                    title: "Multi-Language Support",
                    desc: "Available in 4 languages with intelligent language detection",
                  },
                  {
                    icon: "⚡",
                    title: "Real-time Processing",
                    desc: "Get comprehensive analysis results in seconds, not hours",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="p-6 bg-surface/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{f.icon}</span>
                      <h4 className="text-xl font-semibold text-headline !m-0">
                        {f.title}
                      </h4>
                    </div>
                    <p className="text-body-text leading-relaxed !mb-0">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4 border-b border-border pb-3">
                Why Choose Talent-Scan?
              </h2>
              <h3 className="text-2xl font-semibold text-headline mb-6 mt-8">
                Core Advantages
              </h3>
              <p className="text-lg text-body-text leading-relaxed">
                Traditional resume screening is time-consuming, subjective, and
                prone to human bias. Talent-Scan eliminates these challenges by
                providing objective, comprehensive analysis that helps you
                identify the best candidates quickly and fairly.
              </p>
            </section>

            <section className="mb-12">
              <div className="grid gap-6 grid-cols-1">
                {[
                  {
                    num: "1",
                    title: "Lightning-Fast Analysis",
                    desc: "Process resumes in seconds, not hours - dramatically reduce your time-to-hire",
                  },
                  {
                    num: "2",
                    title: "Objective, Bias-Free Evaluation",
                    desc: "AI removes human bias and provides consistent, fair assessment for all candidates",
                  },
                  {
                    num: "3",
                    title: "Comprehensive Skill Assessment",
                    desc: "Analyze 50+ criteria including technical skills, experience, and cultural fit",
                  },
                  {
                    num: "4",
                    title: "Complete Privacy Protection",
                    desc: "No data leaves your browser - maintain complete control over sensitive information",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 p-6 bg-surface/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {a.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-xl font-semibold text-headline !m-0">
                          {a.title}
                        </h4>
                      </div>
                      <p className="text-body-text leading-relaxed !mb-0">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-quote absolute top-6 left-6 text-4xl text-primary/30"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                  <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                </svg>
                <blockquote className="relative z-10">
                  <p className="text-xl md:text-2xl text-headline font-medium italic leading-relaxed mb-6 pl-8">
                    &quot;Talent-Scan helped us reduce our screening time by 90%
                    while improving candidate quality!&quot;
                  </p>
                  <footer className="flex items-center space-x-4 pl-8">
                    <div>
                      <cite className="text-lg font-semibold text-headline not-italic">
                        Sarah Johnson
                      </cite>
                      <p className="text-body-text">
                        HR Director, Tech Startup
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4 border-b border-border pb-3">
                How It Works
              </h2>
              <h3 className="text-2xl font-semibold text-headline mb-6 mt-8">
                Simple 3-Step Process
              </h3>
              <p className="text-lg text-body-text leading-relaxed">
                Getting started with Talent-Scan is incredibly simple. Our
                streamlined process ensures you can begin analyzing resumes
                immediately without any complex setup or training.
              </p>
            </section>

            <section className="mb-12">
              <div className="grid gap-6 grid-cols-1">
                {[
                  {
                    num: "1",
                    title: "Upload",
                    desc: "Drag and drop your PDF resume or select from your device",
                  },
                  {
                    num: "2",
                    title: "Analyze",
                    desc: "Our AI processes the document instantly using advanced NLP",
                  },
                  {
                    num: "3",
                    title: "Review",
                    desc: "Get detailed insights, recommendations, and actionable feedback",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 p-6 bg-surface/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {s.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-xl font-semibold text-headline !m-0">
                          {s.title}
                        </h4>
                      </div>
                      <p className="text-body-text leading-relaxed !mb-0">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4 border-b border-border pb-3">
                Advanced Technology
              </h2>
              <p className="text-lg text-body-text leading-relaxed">
                Our platform leverages state-of-the-art artificial intelligence
                to deliver unparalleled resume analysis capabilities.
              </p>
            </section>

            <section className="mb-12">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {[
                  {
                    icon: "🧠",
                    title: "Natural Language Processing",
                    desc: "Advanced NLP for accurate skill extraction and context understanding",
                  },
                  {
                    icon: "🤖",
                    title: "Machine Learning Models",
                    desc: "Trained on thousands of resumes for optimal pattern recognition",
                  },
                  {
                    icon: "🔍",
                    title: "Pattern Recognition",
                    desc: "Intelligent evaluation of experience levels and career progression",
                  },
                  {
                    icon: "🎯",
                    title: "Contextual Analysis",
                    desc: "Role-specific insights tailored to your industry and requirements",
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="p-6 bg-surface/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{t.icon}</span>
                      <h4 className="text-xl font-semibold text-headline !m-0">
                        {t.title}
                      </h4>
                    </div>
                    <p className="text-body-text leading-relaxed !mb-0">
                      {t.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-headline mb-4">
                Integration Example
              </h3>
              <p className="text-body-text mb-6">
                Simple API integration for developers
              </p>
              <div className="relative bg-surface border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-surface/80 border-b border-border">
                  <span className="text-sm font-medium text-caption">
                    javascript
                  </span>
                  <button className="flex items-center space-x-2 text-sm text-caption hover:text-primary transition-colors">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      className="w-4 h-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="336"
                        height="336"
                        x="128"
                        y="128"
                        fill="none"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        rx="57"
                        ry="57"
                      ></rect>
                      <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"
                      ></path>
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-4 bg-white dark:bg-background text-foreground dark:text-white overflow-x-auto text-sm leading-relaxed">
                  <code>
                    {`// Example: How Talent-Scan processes your resume
const analysis = await analyzeResume(resumeFile);
console.log(analysis.skills, analysis.experience, analysis.recommendations);

// Get detailed insights
const insights = analysis.getInsights();`}
                  </code>
                </pre>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4 border-b border-border pb-3">
                Privacy & Security
              </h2>
              <h3 className="text-2xl font-semibold text-headline mb-6 mt-8">
                Your Data is Safe
              </h3>
              <p className="text-lg text-body-text leading-relaxed">
                We understand that resume data is highly sensitive. That&apos;s why
                Talent-Scan is built with privacy-first principles, ensuring
                your data remains completely secure and under your control.
              </p>
            </section>

            <section className="mb-12">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {[
                  {
                    icon: "💻",
                    title: "Local Processing",
                    desc: "Everything happens in your browser - no data sent to external servers",
                  },
                  {
                    icon: "🚫",
                    title: "No Data Storage",
                    desc: "We never save, store, or cache your resume content anywhere",
                  },
                  {
                    icon: "✅",
                    title: "GDPR Compliant",
                    desc: "Full compliance with international privacy regulations",
                  },
                  {
                    icon: "🔓",
                    title: "Open Source",
                    desc: "Transparent, auditable code that you can trust",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="p-6 bg-surface/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{p.icon}</span>
                      <h4 className="text-xl font-semibold text-headline !m-0">
                        {p.title}
                      </h4>
                    </div>
                    <p className="text-body-text leading-relaxed !mb-0">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section>
            <div className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold text-headline mb-4">
                Get Started Today
              </h2>
              <p className="text-lg text-body-text mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to revolutionize your hiring process? Upload your first
                resume and experience the power of AI-driven analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div tabIndex={0}>
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center transition-all duration-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-custom-base hover:shadow-custom-lg rounded-lg w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px] sm:min-h-[56px]"
                  >
                    <span className="">Start Analyzing</span>
                    <span className="ml-2 flex-shrink-0">
                      <ArrowRightIcon />
                    </span>
                  </Link>
                </div>
                <div tabIndex={0}>
                  <Link
                    href="/learn-more#demo"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary bg-transparent border-2 border-primary rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MinimalLayout>
  );
};

export default LearnMore;
