"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Menu, Phone, X } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./social-icons";

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
    <nav className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#090708]/90 backdrop-blur-xl shadow-lg shadow-black/40">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3.5 sm:px-8 lg:px-12">
        {/* Brand Identity */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3.5 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative size-9 min-[360px]:size-10 sm:size-12 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10 p-0.5 sm:p-1 shadow-sm transition group-hover:border-red-500/50">
            <Image
              src="/lifetime-fitness-gym-logo.webp"
              alt="LifeTime Fitness Gym Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm min-[360px]:text-base sm:text-xl font-black uppercase tracking-tight text-white transition group-hover:text-red-400 truncate">
              LifeTime Fitness
            </span>
            <span className="text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-red-500 leading-none mt-0.5">
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

        {/* Mobile Actions & Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <Link
            href="/#free-trial"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-red-600 to-red-500 px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-red-600/30 hover:from-red-500 hover:to-red-600 transition"
            onClick={() => setMobileOpen(false)}
          >
            <Dumbbell className="size-3" />
            <span>Free Pass</span>
          </Link>
          <button
            type="button"
            className="inline-flex size-9 sm:size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:border-red-500/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5 text-red-400" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0c0607]/98 backdrop-blur-2xl px-4 py-5 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-white/5 hover:text-red-400"
              >
                <span>{item.label}</span>
                <span className="text-xs text-red-500/60 font-mono">→</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 mt-2 space-y-3">
              <Link
                href="/#free-trial"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-center text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 hover:from-red-500 hover:to-red-600 transition"
              >
                <Dumbbell className="size-4" />
                <span>Book Free Trial Pass</span>
              </Link>

              <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-400">
                <a
                  href="tel:+918446648527"
                  className="inline-flex items-center gap-1.5 hover:text-white transition font-medium"
                >
                  <Phone className="size-3.5 text-red-500" />
                  <span>8446648527</span>
                </a>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold transition"
                >
                  <span>Staff Login</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/5">
                <a
                  href="https://www.instagram.com/life_time_fitnesss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-pink-400 hover:bg-white/10 transition"
                >
                  <InstagramIcon className="size-3.5 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@LifeTime_Fitness_Gym_Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-white/10 transition"
                >
                  <YoutubeIcon className="size-3.5 text-red-500" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
