import Link from "next/link";
import React from "react";
import LocaleSwitcher from "./locale-switcher";

const SimpleHeader = () => {
  return (
    <header dir="ltr" className="w-full flex justify-between items-center mb-6">
      <Link href="/">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          className="text-primary"
          height="32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M249.38 336 170 256l79.38-80m-68.35 80H342"
          ></path>
          <path
            fill="none"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          ></path>
        </svg>
      </Link>
      <div className="relative ">
        <LocaleSwitcher />
      </div>
    </header>
  );
};

export default SimpleHeader;
