import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";

const links = [
  ["Home", "/#"],
  ["About", "/#about"],
  ["Services", "/#services"],
  ["Plans", "/#plans"],
  ["Trainers", "/#trainers"],
  ["Gallery", "/#gallery"],
  ["Contact", "/#contact"],
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#070707] text-white">
      <div aria-hidden="true" className="absolute right-0 top-0 h-px w-1/3 bg-red-600" />
      <div aria-hidden="true" className="absolute -right-32 -top-36 size-96 rounded-full border-[28px] border-red-600/5" />
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-10 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.5fr_0.7fr_1fr_1.1fr] lg:gap-10">
          <div>
            <Image
              src="/lifetime-fitness-gym-logo.png"
              alt="Lifetime Fitness Gym"
              width={148}
              height={83}
              className="h-20 w-auto object-contain"
            />
            <p className="mt-6 max-w-xs text-lg font-bold uppercase leading-tight tracking-tight">
              Build strength.
              <br />
              Build confidence.
              <br />
              <span className="text-red-600">Become your best.</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              A focused training space for stronger habits, better movement, and lasting progress.
            </p>
            <Link
              href="/#plans"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-500 transition hover:text-red-400"
            >
              Start your journey <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Explore</h2>
            <nav className="mt-6 grid gap-3 text-sm text-slate-300">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="w-fit transition-colors hover:text-red-500">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Visit us</h2>
            <div className="mt-6 space-y-5 text-sm leading-6 text-slate-300">
              <p className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-red-500" />
                732, Chhatrapati Shivaji Maharaj Rd, Guruwar Peth, Pune
              </p>
              <a href="tel:8446648527" className="flex gap-3 transition hover:text-red-500">
                <Phone className="mt-1 size-4 shrink-0 text-red-500" />
                8446648527
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">Opening hours</h2>
            <div className="mt-6 flex gap-3 text-sm leading-6 text-slate-300">
              <Clock3 className="mt-1 size-4 shrink-0 text-red-500" />
              <p>
                <span className="font-semibold text-white">Morning</span>
                <br />
                6:00 AM – 10:00 AM
                <br />
                <span className="mt-3 inline-block font-semibold text-white">Evening</span>
                <br />
                4:00 PM – 10:00 PM
              </p>
            </div>
            <Link
              href="/login"
              className="mt-7 inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:border-red-600 hover:text-red-500"
            >
              Member login <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Lifetime Fitness Gym. All rights reserved.</p>
          <p className="uppercase tracking-[0.16em]">Train hard. Stay consistent.</p>
        </div>
      </div>
    </footer>
  );
}
