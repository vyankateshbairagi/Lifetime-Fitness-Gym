import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [["Home", "/#"], ["About", "/#about"], ["Services", "/#services"], ["Plans", "/#plans"], ["Trainers", "/#trainers"], ["Gallery", "/#gallery"], ["Contact", "/#contact"]];

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <Image src="/lifetime-fitness-gym-logo.png" alt="Lifetime Fitness Gym" width={148} height={83} className="h-14 w-auto object-contain brightness-0 invert" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">Build Strength. Build Confidence. Become Your Best.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Explore</h2>
          <nav className="mt-5 grid gap-3 text-sm text-slate-400">{links.map(([label, href]) => <Link key={href} href={href} className="w-fit transition-colors hover:text-white">{label}</Link>)}</nav>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Ready when you are</h2>
          <p className="mt-5 text-sm leading-6 text-slate-400">Take the first step toward a stronger routine.</p>
          <Link href="#plans" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-300">View plans <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500 sm:px-10 lg:px-12">© 2026 LifeTime Fitness Gym. All rights reserved.</div></div>
    </footer>
  );
}
