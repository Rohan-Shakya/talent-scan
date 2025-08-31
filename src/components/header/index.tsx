import Link from "next/link";
import Navbar from "./navbar";
import ThemeSwitcher from "./theme-switcher";
import LocaleSwitcher from "./locale-switcher";

const Header = () => {
  return (
    <header
      dir="ltr"
      className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <Link href="/" aria-label="Talent Scan">
          <h1 className="text-2xl font-bold text-primary dark:text-white tracking-tight">
            Talent Scan
          </h1>
        </Link>
        <Navbar />
        <div className="flex items-center space-x-4 ml-8 md:ml-16">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
