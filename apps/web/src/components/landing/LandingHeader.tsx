"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { id: "01", label: "HRY", href: "/games" },
  { id: "02", label: "PROVIDERI", href: "/providers" },
  { id: "03", label: "NOVINKY", href: "/new-games" },
  { id: "04", label: "BLOG", href: "/blog" },
] as const;

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "landing-header-safe-top sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color] duration-200",
        scrolled
          ? "border-b border-[var(--landing-border)] bg-black/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[var(--platform-base-header-height)] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="landing-display shrink-0 text-xl font-black tracking-tight md:text-2xl">
          <span className="text-[var(--landing-brand)]">SLOT</span>
          <span className="text-[var(--landing-text)]">STAR</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Marketing">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="landing-hud-link text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--landing-text)] hover:text-[var(--landing-brand)]"
            >
              <span className="text-[var(--landing-brand)]">{item.id}</span> {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="landing-display bg-[var(--landing-brand)] px-4 py-2 text-xs font-black tracking-widest text-[var(--landing-text-on-brand)] hover:opacity-95"
          >
            HRAŤ DEMO
          </Link>
          <button
            type="button"
            className="border border-[var(--landing-border)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--landing-text)] md:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Zavrieť" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="landing-mobile-nav"
          className="fixed inset-0 top-[var(--platform-base-header-height)] z-40 bg-black md:hidden"
        >
          <nav className="flex h-full flex-col gap-1 px-6 py-8" aria-label="Mobile marketing">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="landing-display border-b border-[var(--landing-border)] py-5 text-3xl font-black"
              >
                <span className="text-[var(--landing-brand)]">{item.id}</span>{" "}
                <span className="text-[var(--landing-text)]">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/games"
              onClick={() => setOpen(false)}
              className="mt-8 bg-[var(--landing-brand)] px-6 py-4 text-center text-sm font-black tracking-widest text-[var(--landing-text-on-brand)]"
            >
              HRAŤ DEMO →
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
