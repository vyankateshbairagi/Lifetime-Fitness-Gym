"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const links = [
  ["Home", "/#"],
  ["About", "/#about"],
  ["Services", "/#services"],
  ["Plans", "/#plans"],
  ["Trainers", "/#trainers"],
  ["Gallery", "/#gallery"],
  ["Contact", "/#contact"],
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090909]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/lifetime-fitness-gym-logo.webp" alt="Lifetime Fitness Gym" width={148} height={83} className="h-16 w-auto object-contain" />
          <span className="hidden text-sm font-semibold tracking-tight text-white sm:block">Lifetime Fitness Gym</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:text-emerald-600">{label}</Link>)}
          <Button asChild className="bg-[#e21b23] font-bold text-white hover:bg-[#ff3038]"><Link href="/login">Login</Link></Button>
        </nav>
        <button type="button" className="inline-flex size-10 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile navigation" className="border-t border-white/10 bg-[#090909] px-6 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide text-slate-300 hover:bg-white/5 hover:text-emerald-700">{label}</Link>)}
            <Button asChild className="mt-2 bg-[#e21b23] font-bold text-white hover:bg-[#ff3038]"><Link href="/login" onClick={() => setOpen(false)}>Login</Link></Button>
          </div>
        </nav>
      )}
    </header>
  );
}
