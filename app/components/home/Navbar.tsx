"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navbarData } from "../../data/navbar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-main flex justify-center px-4 pt-6 sticky top-0 z-50">
      <nav
        className="
        w-full max-w-6xl
        flex items-center justify-between
        px-6 md:px-8 py-3 md:py-4
        rounded-full
        bg-navbar/80 backdrop-blur-xl
        border border-borderSoft
        transition-all duration-300
        "
        style={{
          boxShadow: "0 0 30px rgba(99,102,241,0.12)",
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-semibold tracking-tight text-primary"
        >
          {navbarData.logo}
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10 text-sm">
          {navbarData.links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="
                text-muted
                hover:text-primary
                transition-all duration-300
                relative
                after:absolute after:left-0 after:-bottom-1
                after:h-[2px] after:w-0
                after:bg-white
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {item.name}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href={navbarData.cta.href}
            className="text-accent text-blue-300 font-medium hover:opacity-80 transition"
          >
            {navbarData.cta.name}
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`
        absolute top-[90px] left-0 w-full px-4
        md:hidden transition-all duration-300
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}
        `}
      >
        <div
          className="
          bg-navbar/95 backdrop-blur-xl
          border border-borderSoft
          rounded-2xl
          p-5 flex flex-col gap-4
          "
          style={{
            boxShadow: "0 0 25px rgba(99,102,241,0.12)",
          }}
        >
          {navbarData.links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-primary transition"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href={navbarData.cta.href}
            onClick={() => setIsOpen(false)}
            className="text-accent font-medium"
          >
            {navbarData.cta.name}
          </Link>
        </div>
      </div>
    </header>
  );
}