import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  Check,
  Dumbbell,
  HeartPulse,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";

export interface PublicPlan {
  id: string;
  name: string;
  price: string | number;
  durationInDays: number;
  description?: string | null;
}

interface MembershipPlansProps {
  plans: PublicPlan[];
}

export function MembershipPlans({ plans }: MembershipPlansProps) {
  // Categorize or find specific plans from database or fallback to flyer definitions
  const findPlan = (nameKeyword: string, duration?: number) =>
    plans.find(
      (p) =>
        p.name.toLowerCase().includes(nameKeyword.toLowerCase()) ||
        (duration !== undefined && p.durationInDays === duration)
    );

  const plan1Month = findPlan("1 Month", 30) || {
    id: "plan-1m",
    name: "1 Month",
    price: 599,
    durationInDays: 30,
    description: "Complete gym access, cardio & strength zone.",
  };

  const plan3Months = findPlan("3 Months", 90) || {
    id: "plan-3m",
    name: "3 Months",
    price: 1499,
    durationInDays: 90,
    description: "Quarterly fitness pack with floor guidance.",
  };

  const plan6Months = findPlan("6 Months", 180) || {
    id: "plan-6m",
    name: "6 Months",
    price: 2999,
    durationInDays: 180,
    description: "Half-yearly transformation plan with goal tracking.",
  };

  const plan1Year = findPlan("1 Year", 365) || {
    id: "plan-1y",
    name: "1 Year",
    price: 5999,
    durationInDays: 365,
    description: "Annual elite membership — best value for serious fitness.",
  };

  const womenPlan = findPlan("Women") || {
    id: "plan-women",
    name: "Special For Women",
    price: 999,
    durationInDays: 30,
    description: "Dedicated monthly package with trainer and personal guide.",
  };

  const dayPassPlan = findPlan("One Day") || {
    id: "plan-day",
    name: "One Day Workout",
    price: 89,
    durationInDays: 1,
    description: "Single day drop-in workout charge.",
  };

  const mainTierPlans = [
    {
      ...plan1Month,
      headerTitle: "1 MONTH",
      badge: "Flexible",
      highlight: false,
      priceNum: 599,
    },
    {
      ...plan3Months,
      headerTitle: "3 MONTHS",
      badge: "Popular",
      highlight: true,
      priceNum: 1499,
    },
    {
      ...plan6Months,
      headerTitle: "6 MONTHS",
      badge: "Save More",
      highlight: false,
      priceNum: 2999,
    },
    {
      ...plan1Year,
      headerTitle: "1 YEAR",
      badge: "Best Value",
      highlight: false,
      priceNum: 5999,
    },
  ];

  const valuePillars = [
    { label: "EXPERT TRAINERS", icon: Award },
    { label: "BETTER HEALTH", icon: HeartPulse },
    { label: "BUILD STRENGTH", icon: Dumbbell },
    { label: "IMPROVE ENDURANCE", icon: Activity },
    { label: "BOOST CONFIDENCE", icon: Smile },
  ];

  return (
    <section
      id="plans"
      className="scroll-mt-24 bg-[#0a0506] py-14 sm:py-20 text-white border-y border-white/5 relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Flyer-Style Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-red-400">
            <span>STRONGER • HEALTHIER • HAPPIER</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            GYM <span className="text-red-500">SUBSCRIPTION</span>
          </h2>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-[2px] w-12 bg-gradient-to-r from-transparent to-red-600" />
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-300">
              CHOOSE YOUR PLAN
            </p>
            <span className="h-[2px] w-12 bg-gradient-to-l from-transparent to-red-600" />
          </div>
        </div>

        {/* 4 Core Subscription Cards (Flyer Grid) */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mainTierPlans.map((plan) => {
            const rawPrice =
              typeof plan.price === "number"
                ? plan.price
                : parseFloat(String(plan.price)) || plan.priceNum;
            const formattedPrice = Number(rawPrice).toLocaleString("en-IN");

            const whatsappUrl = `https://wa.me/918446648527?text=${encodeURIComponent(
              `Hi LifeTime Fitness Gym, I want to join the ${plan.headerTitle} Plan (₹${formattedPrice}/-). Please guide me with the joining process!`
            )}`;

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                  plan.highlight
                    ? "border-red-500 bg-gradient-to-b from-[#1c0c0e] to-[#120708] shadow-2xl shadow-red-900/30 scale-[1.02] sm:scale-105 z-10"
                    : "border-white/10 bg-[#120708] hover:border-red-500/50 hover:bg-[#180a0c] shadow-xl"
                }`}
              >
                {/* Flyer Red Header Strip */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-center relative shadow-md">
                  <span className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                    {plan.headerTitle}
                  </span>
                  {plan.badge && (
                    <span className="absolute top-2 right-2 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-200 border border-white/20">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Calendar Icon & Price Tag */}
                    <div className="flex flex-col items-center justify-center pt-2 pb-4 border-b border-white/10">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-red-400 group-hover:scale-110 transition-transform">
                        <Calendar className="size-5" />
                      </div>
                      <div className="mt-3 flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          ₹{formattedPrice}/-
                        </span>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                        {plan.durationInDays === 365
                          ? "Annual Validity"
                          : `${plan.durationInDays} Days Access`}
                      </span>
                    </div>

                    {/* Features list */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>All gym & cardio equipment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>Morning (6-10 AM) & Evening (4-10 PM)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>Locker & changing room access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>Floor guidance from certified trainers</span>
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:from-red-500 hover:to-red-600 active:scale-98"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Ask About This Plan</span>
                    </a>
                    <Link
                      href="/#free-trial"
                      className="text-center text-[11px] font-semibold text-slate-400 hover:text-white transition py-0.5"
                    >
                      Book 1-Day Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2 Quick Service / Fee Badges (Flyer Row 2) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New Member Joining Fee */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#14080a] p-4 sm:p-5 shadow-lg hover:border-red-500/40 transition">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
                <UserPlus className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  One-Time Registration
                </span>
                <h4 className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                  NEW MEMBER JOINING FEE
                </h4>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-center shadow-md shadow-red-600/30 shrink-0">
              <span className="text-base sm:text-lg font-black text-white">₹99/-</span>
            </div>
          </div>

          {/* One Day Workout Charge */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#14080a] p-4 sm:p-5 shadow-lg hover:border-red-500/40 transition">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 shrink-0">
                <Dumbbell className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Drop-In Pass
                </span>
                <h4 className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                  ONE DAY WORKOUT CHARGE
                </h4>
              </div>
            </div>
            <a
              href={`https://wa.me/918446648527?text=${encodeURIComponent(
                "Hi LifeTime Fitness, I would like to get a One Day Workout Pass (₹89/-)."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-center shadow-md shadow-red-600/30 shrink-0 hover:from-red-500 hover:to-red-600 transition"
            >
              <span className="text-base sm:text-lg font-black text-white">₹89/-</span>
            </a>
          </div>
        </div>

        {/* Special for Women Card (Flyer Highlight Section) */}
        <div className="mt-6 rounded-2xl border-2 border-pink-500/40 bg-gradient-to-r from-[#1b0811] via-[#15070d] to-[#1a0810] p-6 sm:p-8 shadow-2xl shadow-pink-950/40 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-40 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left side: Badge & Text */}
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="relative flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-500/20 border border-pink-500/50 text-pink-400 shadow-lg shadow-pink-500/20">
                <Dumbbell className="size-8 text-pink-400" />
                <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                  ♀
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-pink-300 border border-pink-500/30">
                  <Sparkles className="size-3 text-pink-300" />
                  <span>DEDICATED WOMEN FITNESS PROGRAM</span>
                </div>
                <h3 className="mt-1 text-2xl sm:text-4xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200">
                  SPECIAL FOR WOMEN
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-pink-200/90">
                  WITH TRAINER AND GUIDE
                </p>
                <p className="mt-0.5 text-xs text-slate-300 max-w-xl">
                  Personalized workout guidance, safe supportive environment, fat loss & toning
                  routines designed especially for women.
                </p>
              </div>
            </div>

            {/* Right side: Price & Direct WhatsApp CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0">
              <div className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 text-center shadow-lg shadow-pink-600/40">
                <span className="text-2xl sm:text-3xl font-black text-white">₹999/-</span>
                <span className="block text-[10px] font-black uppercase tracking-wider text-pink-100">
                  PER MONTH
                </span>
              </div>

              <a
                href={`https://wa.me/918446648527?text=${encodeURIComponent(
                  "Hi LifeTime Fitness, I am interested in the Special for Women package (₹999/month with trainer and guide). Please share details!"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-500/50 bg-pink-950/40 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-pink-200 hover:bg-pink-600 hover:text-white transition shadow-sm"
              >
                <MessageCircle className="size-3.5 text-pink-400" />
                <span>Ask About This Plan</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom 5 Pillars Banner (Flyer Footer) */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-white/10 bg-[#120709] p-5 sm:p-6 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {valuePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center p-2 group">
                  <div className="flex size-11 items-center justify-center rounded-full bg-red-600 text-white shadow-md shadow-red-600/40 group-hover:scale-110 transition-transform">
                    <Icon className="size-5" />
                  </div>
                  <span className="mt-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                    {pillar.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-red-500">
              YOUR FITNESS • OUR PRIORITY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
