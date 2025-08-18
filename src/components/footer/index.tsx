import Link from "next/link";
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
import ScrollTopButton from "./scroll-top-button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-surface/50 to-surface/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <button className="text-3xl font-bold text-primary hover:text-primary-hover transition-colors">
                  Talent Scan
                </button>
                <p className="text-sm text-primary/80 mt-1 font-medium">
                  AI-Powered Hiring Intelligence
                </p>
              </div>
              <p className="text-body-text leading-relaxed mb-6 max-w-md">
                Transform your recruitment process with advanced AI technology.
                Get instant, comprehensive candidate insights and make better
                hiring decisions faster.
              </p>
            </div>

            <div>
              <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <TrendingUpIcon className="w-4 h-4" />
                    </span>
                    <span>Features</span>
                  </button>
                </li>
                <li>
                  <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <ShieldIcon className="w-4 h-4" />
                    </span>
                    <span>Benefits</span>
                  </button>
                </li>
                <li>
                  <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <GlobeIcon className="w-4 h-4" />
                    </span>
                    <span>How It Works</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                Application
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/upload"
                    className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                  >
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <CloudUploadIcon className="w-4 h-4" />
                    </span>
                    <span>Upload Resume</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/history"
                    className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                  >
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <HistoryIcon className="w-4 h-4" />
                    </span>
                    <span>Analysis History</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn-more"
                    className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm"
                  >
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <FileIcon className="w-4 h-4" />
                    </span>
                    <span>About Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-headline font-semibold mb-4 text-sm uppercase tracking-wider">
                Help
              </h3>
              <ul className="space-y-3">
                <li>
                  <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <CircleQuestionMarkIcon className="w-4 h-4" />
                    </span>
                    <span>FAQ</span>
                  </button>
                </li>
                <li>
                  <button className="group flex items-center space-x-2 text-body-text hover:text-primary transition-colors text-sm">
                    <span className="text-caption group-hover:text-primary transition-colors">
                      <CirclePlayIcon className="w-4 h-4" />
                    </span>
                    <span>Get Started</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div dir="ltr" className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-caption text-sm">
              <div className="flex items-center space-x-2">
                <span>© 2025 Talent Scan</span>
                <span className="text-caption/60">•</span>
                <span className="text-caption/80">
                  AI-Powered Hiring Intelligence
                </span>
              </div>
            </div>
            <ScrollTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
