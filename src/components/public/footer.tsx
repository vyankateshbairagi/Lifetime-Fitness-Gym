import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Dumbbell,
  Lock,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./social-icons";

const FOOTER_LINKS = [
  { label: "Home", href: "/#" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Membership Plans", href: "/#plans" },
  { label: "Trainers", href: "/#trainers" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Location & Contact", href: "/#contact" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#060404] text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10 p-1">
                <Image
                  src="/lifetime-fitness-gym-logo.webp"
                  alt="LifeTime Fitness Gym Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black uppercase tracking-tight text-white">
                  LifeTime Fitness
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  GYM | PUNE
                </span>
              </div>
            </Link>

            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              Build strength, improve conditioning, and become your best self with dedicated coaching and quality
              equipment in Guruwar Peth, Pune.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/#free-trial"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 hover:bg-red-500 transition"
              >
                <Dumbbell className="size-3.5" />
                <span>Free Trial Pass</span>
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 block mb-2.5">
                Follow & Connect
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://www.instagram.com/life_time_fitnesss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-pink-500/50 hover:bg-pink-950/30 hover:text-white transition shadow-sm"
                  aria-label="Follow LifeTime Fitness Gym on Instagram"
                >
                  <InstagramIcon className="size-4 text-pink-500 transition group-hover:scale-110" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@LifeTime_Fitness_Gym_Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-red-500/50 hover:bg-red-950/30 hover:text-white transition shadow-sm"
                  aria-label="Subscribe to LifeTime Fitness Gym on YouTube"
                >
                  <YoutubeIcon className="size-4 text-red-500 transition group-hover:scale-110" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-red-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit & Contact */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                Gym Location
              </h3>
              <p className="mt-2 flex items-start gap-2 text-xs text-slate-300">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                <span>
                  732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth, Pune, Maharashtra 411042
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                Operating Windows
              </h3>
              <div className="mt-2 flex items-start gap-2 text-xs text-slate-300">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-red-500" />
                <div>
                  <p>Morning: 6:00 AM – 10:00 AM</p>
                  <p>Evening: 4:00 PM – 10:00 PM</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                Phone Contact
              </h3>
              <a
                href="tel:+918446648527"
                className="mt-2 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-red-400 transition"
              >
                <Phone className="size-3.5 text-red-500" />
                <span>8446648527</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Attribution & Platform Bar */}
        <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 LifeTime Fitness Gym. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://chalobuild.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition"
            >
              <Sparkles className="size-3 text-red-500" />
              <span>Powered by ChaloBuild Platform</span>
              <ArrowUpRight className="size-3 text-slate-500" />
            </a>

            <div className="h-3 w-px bg-white/10 hidden sm:block" />

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 hover:text-white transition"
            >
              <Lock className="size-3 text-red-500" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
