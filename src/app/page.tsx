import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Dumbbell,
  HeartPulse,
  MapPin,
  MessageCircle,
  PersonStanding,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-ui";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LifeTime Fitness Gym | Pune",
  description:
    "LifeTime Fitness Gym in Guruwar Peth, Pune. Build strength, improve fitness, and become your best with quality equipment, training support, and flexible membership options.",
};

const services = [
  ["Weight Training", "Build strength, develop muscle, and improve overall physical performance.", Dumbbell],
  ["Cardio Training", "Improve endurance, cardiovascular fitness, and overall stamina.", Activity],
  ["Personal Training", "Get focused guidance and training support based on your individual goals.", Users],
  ["Functional Training", "Improve mobility, balance, strength, and everyday movement.", PersonStanding],
  ["Strength & Conditioning", "Develop functional strength and improve your overall fitness performance.", Target],
  ["Fitness & Nutrition Guidance", "Support your training with practical guidance for healthier lifestyle choices.", HeartPulse],
] as const;

const reasons = [
  "Quality Equipment",
  "Motivating Environment",
  "Experienced Guidance",
  "Flexible Memberships",
  "Fitness-Focused Community",
  "Convenient Pune Location",
];

const galleryPanels = ["Train with intention", "Find your focus", "Move with confidence", "Build your rhythm"];

async function getPublicPlans() {
  const slug = process.env.PUBLIC_ORGANIZATION_SLUG?.trim();
  if (!slug) return [];

  const organization = await db.organization.findFirst({
    where: { slug, isActive: true },
    select: {
      plans: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, price: true, durationInDays: true, description: true },
      },
    },
  });

  return organization?.plans.map((plan) => ({
    ...plan,
    price: plan.price.toString(),
  })) ?? [];
}

function formatDuration(days: number) {
  if (days % 30 === 0) {
    const months = days / 30;
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  return `${days} days`;
}

export default async function HomePage() {
  const plans = await getPublicPlans();

  return (
    <PublicPage>
      <section id="home" className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(226,27,35,0.2),transparent_30%),radial-gradient(circle_at_20%_90%,rgba(226,27,35,0.08),transparent_35%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <Sparkles className="size-4" /> LifeTime Fitness Gym
            </p>
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Build strength.
              <br />
              Build confidence.
              <br />
              Become your best.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Your journey to a stronger, healthier, and more confident you starts here.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#plans" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950">
                Join now <ArrowRight className="size-4" />
              </Link>
              <Link href="#contact" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950">
                Contact us
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="relative mx-auto flex aspect-[4/5] w-full max-w-md items-end overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-400/30 via-slate-900 to-blue-500/20 p-8 shadow-2xl shadow-black/30">
            <div className="absolute inset-6 rounded-[1.5rem] border border-white/10" />
            <div className="absolute right-8 top-8 flex size-24 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
              <Dumbbell className="size-9 text-emerald-200" />
            </div>
            <div className="relative">
              <p className="text-7xl font-semibold tracking-tight text-white/90">01</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">One good session. Then another. Momentum is built one choice at a time.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 bg-white px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">About LifeTime Fitness</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">A stronger routine starts with the right place.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">LifeTime Fitness Gym is a dedicated fitness destination in the heart of Pune, designed to help you become stronger, healthier, and more confident. With quality equipment, a motivating training environment, and a focus on consistent progress, we welcome beginners and experienced fitness enthusiasts alike. Whether your goal is to build muscle, improve strength, lose weight, or simply live a healthier lifestyle, LifeTime Fitness Gym is here to support your journey.</p>
            <div className="mt-8 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-emerald-600" /> Guruwar Peth, Pune</p>
              <p className="flex gap-3"><Activity className="size-5 shrink-0 text-emerald-600" /> 6:00 AM – 10:00 AM &amp; 4:00 PM – 10:00 PM</p>
              <p className="flex gap-3"><MessageCircle className="size-5 shrink-0 text-emerald-600" /> 8446648527</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Why choose us</p>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2">
              {reasons.map((reason) => <li key={reason} className="flex gap-3 text-sm text-slate-300"><Check className="size-5 shrink-0 text-emerald-300" />{reason}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-slate-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Our services</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Everything you need to keep moving forward.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([title, text, Icon]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Icon className="size-6" /></div><h3 className="mt-7 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 bg-white px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Membership plans</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Choose a routine that meets you where you are.</h2>
          {plans.length > 0 ? <div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map((plan, index) => <article key={plan.id} className={`rounded-xl border bg-[#141414] p-7 ${index === 1 ? "border-red-600 shadow-lg shadow-red-950/30" : "border-white/10"}`}><h3 className="text-2xl font-semibold text-slate-950">{plan.name}</h3><p className="mt-5 text-4xl font-semibold text-red-600">₹{plan.price}</p><p className="mt-2 text-sm text-slate-500">{formatDuration(plan.durationInDays)}</p>{plan.description && <p className="mt-5 leading-7 text-slate-600">{plan.description}</p>}<Link href="#contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500">Join now <ArrowRight className="size-4" /></Link></article>)}</div> : <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><p className="text-lg font-medium text-slate-800">Membership plans are currently being updated. Contact us to learn more.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href="tel:8446648527" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Call us</a><a href="https://wa.me/918446648527" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">WhatsApp</a></div></div>}
        </div>
      </section>

      <section id="trainers" className="scroll-mt-20 bg-slate-950 px-6 py-20 text-white sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div className="flex aspect-square max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-blue-500/20"><Users className="size-20 text-emerald-300" /></div>
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Meet our trainer</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Guidance for the work you want to do.</h2><div className="mt-8 flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-full bg-emerald-400 text-slate-950"><ShieldCheck className="size-7" /></div><div><h3 className="text-xl font-semibold">Dhirendra Pande</h3><p className="mt-1 text-slate-400">Trainer</p></div></div></div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 bg-white px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Gallery</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">A space made for showing up.</h2><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{galleryPanels.map((panel, index) => <div key={panel} className={`relative flex min-h-64 items-end overflow-hidden rounded-2xl p-6 ${index % 2 === 0 ? "bg-emerald-600" : "bg-slate-900"}`}><span className="absolute right-5 top-5 text-sm text-white/50">0{index + 1}</span><h3 className="text-2xl font-semibold text-white">{panel}</h3></div>)}</div></div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-emerald-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Contact</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Take the first step.</h2><div className="mt-8 space-y-5 text-slate-700"><p className="flex gap-3"><MapPin className="size-5 shrink-0 text-emerald-700" />732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth, Pune, Maharashtra 411042</p><p className="flex gap-3"><Activity className="size-5 shrink-0 text-emerald-700" />Morning: 6:00 AM – 10:00 AM<br />Evening: 4:00 PM – 10:00 PM</p></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="tel:8446648527" className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Call 8446648527</a><a href="https://wa.me/918446648527" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">WhatsApp</a></div></div>
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10"><MapPin className="size-8 text-emerald-300" /><h3 className="mt-8 text-2xl font-semibold">Visit the gym</h3><p className="mt-3 leading-7 text-slate-400">Guruwar Peth, Pune</p><a href="https://maps.app.goo.gl/LJAx4xiLBMJK3TFS8" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Get directions <ArrowRight className="size-4" /></a></div>
        </div>
      </section>
    </PublicPage>
  );
}
