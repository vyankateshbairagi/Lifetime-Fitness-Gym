import Link from "next/link";
import { Lock, Phone, Sparkles } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./social-icons";

export function AnnouncementBar() {
  return (
    <div className="hidden sm:block border-b border-red-950/60 bg-[#0d0708] text-xs text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-8 lg:px-12">
        {/* Left: Platform Attribution */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="size-3 text-red-500 shrink-0" aria-hidden="true" />
          <a
            href="https://chalobuild.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-medium tracking-wide text-slate-300 transition hover:text-white"
          >
            <span className="font-bold text-red-400 group-hover:text-red-300">CHALOBUILD PLATFORM</span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 group-hover:text-slate-200">
              THE COMPLETE GYM GROWTH PLATFORM
            </span>
            <span className="inline sm:hidden text-slate-400 group-hover:text-slate-200">GYM GROWTH</span>
          </a>
        </div>

        {/* Right: Phone, Social Links & Staff Login */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/life_time_fitnesss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-400 transition"
              aria-label="Instagram @life_time_fitnesss"
            >
              <InstagramIcon className="size-3.5" />
            </a>
            <a
              href="https://www.youtube.com/@LifeTime_Fitness_Gym_Pune"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-500 transition"
              aria-label="YouTube @LifeTime_Fitness_Gym_Pune"
            >
              <YoutubeIcon className="size-3.5" />
            </a>
          </div>

          <div className="h-3 w-px bg-white/10" aria-hidden="true" />

          <a
            href="tel:+918446648527"
            className="inline-flex items-center gap-1 font-medium text-slate-300 transition hover:text-red-400"
            aria-label="Call gym at 8446648527"
          >
            <Phone className="size-3 text-red-500 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-white tracking-wide">8446648527</span>
          </a>

          <div className="h-3 w-px bg-white/10" aria-hidden="true" />

          <Link
            href="/login"
            className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-300 transition hover:border-red-400 hover:bg-red-900/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Lock className="size-2.5 sm:size-3 shrink-0" aria-hidden="true" />
            <span>Staff Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
