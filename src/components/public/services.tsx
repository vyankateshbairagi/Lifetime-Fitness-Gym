import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Dumbbell,
  HeartPulse,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

const SERVICES = [
  {
    title: "Weight Training",
    description: "Build strength, develop muscle, and improve overall physical performance with dedicated free weights and plate-loaded machines.",
    icon: Dumbbell,
  },
  {
    title: "Cardio Training",
    description: "Improve endurance, cardiovascular fitness, and overall stamina through high-efficiency aerobic sessions.",
    icon: Activity,
  },
  {
    title: "Personal Training",
    description: "Get focused guidance and training support based on your individual goals and fitness level.",
    icon: Users,
  },
  {
    title: "Functional Training",
    description: "Improve mobility, balance, core stability, and everyday natural movements.",
    icon: UserCheck,
  },
  {
    title: "Strength & Conditioning",
    description: "Develop functional strength, power output, and long-term athletic durability.",
    icon: Target,
  },
  {
    title: "Fitness & Nutrition Guidance",
    description: "Support your gym workouts with practical advice for healthier, sustainable lifestyle habits.",
    icon: HeartPulse,
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-[#090909] py-10 sm:py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <span>TRAINING PROGRAMS</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            SERVICES CRAFTED FOR <span className="text-red-500">REAL RESULTS</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Whatever your starting point, our structured training programs give you the equipment and direction
            to reach your physical potential.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#120a0b] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:bg-[#180d0f] shadow-lg shadow-black/40"
              >
                <div>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 transition group-hover:bg-red-600 group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-3 text-base font-black uppercase tracking-wide text-white group-hover:text-red-300 transition">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300 font-normal">
                    {s.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <Link
                    href="/#free-trial"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400 transition group-hover:text-red-300"
                  >
                    <span>Try with free trial</span>
                    <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
