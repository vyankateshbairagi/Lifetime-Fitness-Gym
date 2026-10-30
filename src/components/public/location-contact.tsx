import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Dumbbell,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./social-icons";

export function LocationContact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-[#0d0708] py-20 sm:py-28 text-white border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-red-400">
            <MapPin className="size-3.5" />
            <span>FIND US IN PUNE</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            LOCATION & <span className="text-red-500">CONTACT</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Conveniently situated in Guruwar Peth, Pune. Drop by during operating hours or connect with us directly.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Gym Info & 4 Actions */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#120a0b] p-6 sm:p-10 lg:col-span-5 shadow-2xl">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                Facility Address
              </span>
              <h3 className="mt-2 text-2xl font-black uppercase text-white">
                LifeTime Fitness Gym
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">Guruwar Peth, Pune, Maharashtra 411042</p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/5">
                <MapPin className="mt-0.5 size-5 shrink-0 text-red-500" />
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth, Pune, Maharashtra 411042
                </p>
              </div>

              {/* Operating Hours */}
              <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                  <Clock className="size-4" />
                  <span>Training Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm border-b border-white/5 pb-2">
                  <span className="text-slate-400">Morning Slot:</span>
                  <span className="font-bold text-white">6:00 AM – 10:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Evening Slot:</span>
                  <span className="font-bold text-white">4:00 PM – 10:00 PM</span>
                </div>
              </div>

              {/* Phone */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Phone className="size-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Phone</span>
                  <p className="text-base font-black text-white">8446648527</p>
                </div>
              </div>

              {/* Official Social Channels */}
              <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/5 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
                  Official Social Channels
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="https://www.instagram.com/life_time_fitnesss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs font-semibold text-slate-200 hover:border-pink-500/50 hover:text-white hover:bg-pink-950/30 transition shadow-sm"
                  >
                    <InstagramIcon className="size-4 text-pink-500 shrink-0" />
                    <span className="truncate">Instagram</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@LifeTime_Fitness_Gym_Pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs font-semibold text-slate-200 hover:border-red-500/50 hover:text-white hover:bg-red-950/30 transition shadow-sm"
                  >
                    <YoutubeIcon className="size-4 text-red-500 shrink-0" />
                    <span className="truncate">YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Required Action Buttons */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
              <a
                href="tel:+918446648527"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
              >
                <Phone className="size-3.5 text-red-400" />
                <span>Call Us</span>
              </a>

              <a
                href="https://wa.me/918446648527"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
              >
                <MessageCircle className="size-3.5 text-red-400" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href="https://maps.app.goo.gl/LJAx4xiLBMJK3TFS8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600/20 border border-red-500/40 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-600 hover:text-white"
              >
                <ExternalLink className="size-3.5" />
                <span>Get Directions</span>
              </a>

              <Link
                href="/#free-trial"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-red-500"
              >
                <Dumbbell className="size-3.5" />
                <span>Free Trial</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#120a0b] lg:col-span-7 shadow-2xl relative min-h-[380px] flex flex-col">
            <div className="relative flex-1 w-full min-h-[340px]">
              <iframe
                title="LifeTime Fitness Gym Pune Location Map"
                src="https://maps.google.com/maps?q=LifeTime+Fitness+Gym,+Guruwar+Peth,+Pune&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                style={{ filter: "invert(90%) hue-rotate(180deg) contrast(115%) brightness(95%)" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-4 bg-[#120a0b] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-white">732, Chhatrapati Shivaji Maharaj Rd</span>
                <span className="text-slate-400">near rashtrabhushan chowk, Guruwar Peth</span>
              </div>
              <a
                href="https://www.google.com/maps/place/LifeTime+Fitness+Gym/@18.5043852,73.8592322,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-400 hover:text-red-300 shrink-0"
              >
                <span>Open in Google Maps App</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
