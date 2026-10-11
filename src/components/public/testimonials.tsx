import { Award, Flame, MessageSquare, Quote, Sparkles, Target, Users } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-[#0d0708] py-10 sm:py-14 text-white border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <span>COMMUNITY & CULTURE</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            BUILT ON <span className="text-red-500">DISCIPLINE</span> & PROGRESS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Real fitness results are forged by showing up consistently. We value honest effort, daily work,
            and mutual respect inside our gym.
          </p>
        </div>

        {/* Culture / Training Values Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#120a0b] p-5 shadow-xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Flame className="size-4.5" />
            </div>
            <h3 className="mt-3 text-base font-black uppercase text-white">Consistency Over Hype</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              We focus on building sustainable lifting and conditioning habits rather than short-lived quick fixes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#120a0b] p-5 shadow-xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Users className="size-4.5" />
            </div>
            <h3 className="mt-3 text-base font-black uppercase text-white">Supportive Training Floor</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Beginners and regular lifters share the floor in an encouraging environment where everyone is working toward their best.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#120a0b] p-5 shadow-xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Target className="size-4.5" />
            </div>
            <h3 className="mt-3 text-base font-black uppercase text-white">Guided Progression</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Floor trainer oversight ensures proper movement patterns so you train safely and minimize injury risk.
            </p>
          </div>
        </div>

        {/* Authentic Community Feedback Prompt */}
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-[#1a0c0e] to-red-950/40 p-5 sm:p-7 text-center shadow-2xl">
          <Quote className="mx-auto size-7 text-red-500/50" />
          <h3 className="mt-2 text-lg sm:text-xl font-black uppercase text-white">
            Your fitness journey could inspire someone next.
          </h3>
          <p className="mt-1.5 max-w-xl mx-auto text-xs sm:text-sm text-slate-300">
            Have you been working out at LifeTime Fitness Gym? We believe in authentic feedback from our Pune
            community. Share your experience and let us know how your training is progressing!
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href="https://wa.me/918446648527?text=Hi%20LifeTime%20Fitness%20Gym,%20I%20would%20like%20to%20share%20my%20experience%20and%20feedback%20training%20at%20the%20gym!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
            >
              <MessageSquare className="size-3.5" />
              <span>Share Your Gym Story On WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
