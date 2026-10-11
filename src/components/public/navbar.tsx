"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/#" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Plans", href: "/#plans" },
  { label: "Trainers", href: "/#trainers" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    (window as unknown as { __REACT_HYDRATED__?: boolean }).__REACT_HYDRATED__ = true;
    document.body.setAttribute("data-hydrated", "true");
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#090909]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Identity */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10 p-1 transition group-hover:border-red-500/50">
            <Image
              src="/lifetime-fitness-gym-logo.webp"
              alt="LifeTime Fitness Gym Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black uppercase tracking-tight text-white transition group-hover:text-red-400">
              LifeTime Fitness
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              GYM | PUNE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:text-red-400"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Primary CTA (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/#free-trial"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:from-red-500 hover:to-red-600 hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <Dumbbell className="size-4 transition-transform group-hover:rotate-45" />
            <span>Free Trial Pass</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/#free-trial"
            className="rounded-full bg-red-600 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-red-500"
            onClick={() => setMobileOpen(false)}
          >
            Free Pass
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0d0708] px-6 py-6 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-white/5 hover:text-red-400"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2">
              <Link
                href="/#free-trial"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-center text-sm font-extrabold uppercase tracking-wider text-white shadow-md shadow-red-600/30 hover:bg-red-500"
              >
                <Dumbbell className="size-4" />
                <span>Book Free Trial Pass</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
