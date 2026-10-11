import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Dumbbell, HeartPulse, MapPin, Sparkles, Target, Users } from "lucide-react";

const BENEFITS = [
  { title: "Quality Gym Equipment", desc: "Well-maintained weight stacks, dumbbells, and benches for optimal workouts.", icon: Dumbbell },
  { title: "Motivating Workout Environment", desc: "An energetic atmosphere designed to keep you focused and committed.", icon: Sparkles },
  { title: "Experienced Guidance", desc: "Trainer support to help you practice proper exercise form and technique.", icon: Target },
  { title: "Flexible Membership Options", desc: "Transparent, adaptable plans tailored to your personal fitness schedule.", icon: HeartPulse },
  { title: "Fitness-Focused Community", desc: "Train alongside disciplined members who show up every day.", icon: Users },
  { title: "Convenient Location in Pune", desc: "Easily accessible in Guruwar Peth, near Rashtrabhushan Chowk.", icon: MapPin },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-[#0d0708] py-10 sm:py-14 text-white border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left: Text & Benefits */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
              <span>ABOUT LIFETIME FITNESS</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              A DEDICATED SPACE FOR <span className="text-red-500">STRENGTH</span> & PROGRESS.
            </h2>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              LifeTime Fitness Gym is a fitness destination in Guruwar Peth, Pune, built to help people
              develop strength, confidence, and healthier habits. Whether you are beginning your fitness
              journey or looking to improve your training, we provide a motivating environment to help you
              work toward your goals.
            </p>

            {/* Benefits Grid */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-white/[0.08]"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-white">{b.title}</h3>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-400">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <Link
                href="/#free-trial"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition"
              >
                <span>Experience our facility first-hand</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: High-Res Real Gym Photo */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[16/11] max-h-[380px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/photos/img_0605.webp"
                alt="LifeTime Fitness Gym Workout Floor and Free Weights"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block rounded-md bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  Pune Facility
                </span>
                <p className="mt-1.5 text-base font-bold text-white">
                  732, Chhatrapati Shivaji Maharaj Rd, Guruwar Peth
                </p>
                <p className="text-[11px] text-slate-300">Modern free weights, benches, and strength equipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
