"use client";

import { ArrowUpIcon } from "lucide-react";

const ScrollTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="flex items-center space-x-2 text-caption hover:text-primary transition-colors text-sm group"
      onClick={handleScrollToTop}
    >
      <span className="hidden sm:inline">Back to top</span>
      <ArrowUpIcon className="w-4 h-4 group-hover:text-primary transition-colors" />
    </button>
  );
};

export default ScrollTopButton;
