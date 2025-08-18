"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home", aria: "Go to Home" },
  { href: "/upload", label: "Upload Resume", aria: "Go to Upload Resume" },
  { href: "/history", label: "History", aria: "Go to History" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-8 ms-[200px]">
      {NAV.map((item) => {
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
    </div>
  );
};

export default Navbar;
