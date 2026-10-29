import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Dumbbell, Flame, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/photos/img_0600.webp"
          alt="LifeTime Fitness Gym Training Floor and Equipment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.30] contrast-[1.10]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/25 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:py-14 sm:px-8 lg:px-12 w-full">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Athletic Headline, Value Prop & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/50 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 backdrop-blur-md mb-3">
              <Flame className="size-3 text-red-500 animate-pulse" />
              <span>YOUR FITNESS JOURNEY STARTS HERE</span>
            </div>

            {/* Main Athletic Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.02]">
              BUILD STRENGTH.
              <br />
              BUILD CONFIDENCE.
              <br />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                BECOME YOUR BEST.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-3.5 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-medium">
              Your journey to a stronger, healthier, and more confident you starts here. Train with purpose, build
              consistency, and become the strongest version of yourself at LifeTime Fitness, Pune.
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/#free-trial"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/40 transition hover:from-red-500 hover:to-red-600 hover:shadow-red-500/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <Dumbbell className="size-4 transition-transform group-hover:rotate-12" />
                <span>Book Your Free Trial</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <span>Explore Our Gym</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-white/10 w-full max-w-xl">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-slate-300">
                <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                <span>Personal Guidance</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-slate-300">
                <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                <span>Strength & Fitness</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wide text-slate-300">
                <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                <span>Motivating Environment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Big Size Gym Logo with Glowing Athletic Frame */}
          <div className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0">
            <div className="relative group">
              {/* Pulsing Ambient Glow Behind Logo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/40 via-red-500/25 to-amber-500/20 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />

              {/* Decorative Accent Rings */}
              <div className="absolute -inset-2 rounded-full border border-red-500/20" />
              <div className="absolute -inset-5 rounded-full border border-dashed border-white/10 hidden sm:block" />

              {/* Main Circular Logo Container */}
              <div className="relative size-56 sm:size-72 md:size-80 lg:w-[340px] lg:h-[340px] xl:w-[390px] xl:h-[390px] rounded-full p-2.5 bg-gradient-to-b from-red-500/40 via-black to-red-950/60 shadow-[0_0_60px_rgba(220,38,38,0.35)] border border-red-500/40 backdrop-blur-md">
                <div className="relative size-full rounded-full overflow-hidden bg-[#0a0506] border border-white/10 p-3 sm:p-4 flex items-center justify-center shadow-inner">
                  <Image
                    src="/lifetime-fitness-gym-logo.png"
                    alt="LifeTime Fitness Gym Official Logo"
                    width={400}
                    height={400}
                    priority
                    className="h-full w-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Floating Pill Badges */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-1 sm:left-1 flex items-center gap-1.5 rounded-full border border-red-500/40 bg-black/90 px-3 py-1 backdrop-blur-md shadow-xl shadow-black/80">
                <Sparkles className="size-3 text-red-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Guruwar Peth, Pune</span>
              </div>

              <div className="absolute -top-2 -right-2 sm:top-1 sm:right-1 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/90 px-3 py-1 backdrop-blur-md shadow-xl shadow-black/80 whitespace-nowrap">
                <span className="size-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  6 AM – 10 AM | 4 PM – 10 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
