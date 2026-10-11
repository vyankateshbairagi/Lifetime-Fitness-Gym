import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";

export function Trainers() {
  return (
    <section id="trainers" className="scroll-mt-24 bg-[#090909] py-10 sm:py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <span>TRAINER GUIDANCE</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            MEET YOUR <span className="text-red-500">TRAINER</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Get personalized direction, proper technique corrections, and motivating accountability to keep
            you progressing safely.
          </p>
        </div>

        {/* Trainer Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#120a0b] shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center p-5 sm:p-7">
            {/* Trainer Image */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border border-white/10 lg:col-span-4 shadow-lg">
              <Image
                src="/photos/trainer-dhirendra-pande.webp"
                alt="Trainer Dhirendra Pande at LifeTime Fitness Gym"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block rounded-md bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Floor Trainer
                </span>
              </div>
            </div>

            {/* Trainer Details */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">LifeTime Fitness Coach</span>
                  <h3 className="text-xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    Dhirendra Pande
                  </h3>
                </div>
              </div>

              <div className="mt-2 inline-block rounded-lg bg-white/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Role: Trainer
              </div>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                Get guidance and support as you work toward your personal fitness goals. Whether learning the
                fundamentals of barbell movements or fine-tuning your daily training program, Dhirendra is on the
                floor to support your journey.
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                  <span>Individual form evaluation and technique cues</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                  <span>Structured routines for beginner to advanced lifters</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="size-3.5 text-red-500 shrink-0" />
                  <span>Daily floor guidance during morning and evening windows</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                <Link
                  href="/#free-trial"
                  className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 transition"
                >
                  Book Free Session With Dhirendra
                </Link>
                <a
                  href="https://wa.me/918446648527?text=Hi%20Dhirendra,%20I%20would%20like%20to%20know%20more%20about%20training%20at%20LifeTime%20Fitness%20Gym."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white transition"
                >
                  <MessageCircle className="size-3.5 text-red-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
