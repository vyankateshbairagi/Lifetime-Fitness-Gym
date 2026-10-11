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

export function LocationContact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-[#0d0708] py-10 sm:py-14 text-white border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <MapPin className="size-3.5" />
            <span>FIND US IN PUNE</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            LOCATION & <span className="text-red-500">CONTACT</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Conveniently situated in Guruwar Peth, Pune. Drop by during operating hours or connect with us directly.
          </p>
        </div>

        {/* Content Layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Gym Info & 4 Actions */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#120a0b] p-5 sm:p-7 lg:col-span-5 shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                Facility Address
              </span>
              <h3 className="mt-1.5 text-xl font-black uppercase text-white">
                LifeTime Fitness Gym
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">Guruwar Peth, Pune, Maharashtra 411042</p>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-white/5 p-3 border border-white/5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-red-500" />
                <p className="text-xs leading-relaxed text-slate-300">
                  732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth, Pune, Maharashtra 411042
                </p>
              </div>

              {/* Operating Hours */}
              <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-400">
                  <Clock className="size-3.5" />
                  <span>Training Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Morning Slot:</span>
                  <span className="font-bold text-white">6:00 AM – 10:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Evening Slot:</span>
                  <span className="font-bold text-white">4:00 PM – 10:00 PM</span>
                </div>
              </div>

              {/* Phone */}
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                  <Phone className="size-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Phone</span>
                  <p className="text-sm font-black text-white">8446648527</p>
                </div>
              </div>
            </div>

            {/* 4 Required Action Buttons */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <a
                href="tel:+918446648527"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
              >
                <Phone className="size-3 text-red-400" />
                <span>Call Us</span>
              </a>

              <a
                href="https://wa.me/918446648527"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
              >
                <MessageCircle className="size-3 text-red-400" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href="https://maps.app.goo.gl/LJAx4xiLBMJK3TFS8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600/20 border border-red-500/40 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-600 hover:text-white"
              >
                <ExternalLink className="size-3" />
                <span>Get Directions</span>
              </a>

              <Link
                href="/#free-trial"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-red-500"
              >
                <Dumbbell className="size-3" />
                <span>Free Trial</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#120a0b] lg:col-span-7 shadow-2xl relative min-h-[300px] flex flex-col">
            <div className="relative flex-1 w-full min-h-[260px]">
              <iframe
                title="LifeTime Fitness Gym Pune Location Map"
                src="https://maps.google.com/maps?q=732+Chhatrapati+Shivaji+Maharaj+Rd+near+Rashtrabhushan+Chowk+Guruwar+Peth+Pune+Maharashtra+411042&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-3 bg-[#120a0b] border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Guruwar Peth, Pune</span>
              <a
                href="https://maps.app.goo.gl/LJAx4xiLBMJK3TFS8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
              >
                <span>Open in Google Maps App</span>
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
