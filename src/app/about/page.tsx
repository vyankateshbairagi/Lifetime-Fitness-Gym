import type { Metadata } from "next";
import { Check } from "lucide-react";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "About", description: "Discover the training philosophy behind Lifetime Fitness Gym." };

const values = ["Consistency over quick fixes", "Progress you can feel and sustain", "A welcoming, focused training environment"];

export default function AboutPage() {
  return <PublicPage><PageIntro eyebrow="About Lifetime" title="Fitness that fits real life." text="Lifetime Fitness Gym is built around a simple idea: the best routine is the one you can return to. Find a place to train with focus, learn what works for you, and keep progressing." /><section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-28"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Our philosophy</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Strong habits make strong foundations.</h2></div><div className="space-y-5 text-lg leading-8 text-slate-600"><p>Every member arrives with a different starting point. Our role is to give you the space, equipment, and encouragement to make your next session count.</p><ul className="space-y-4 pt-3">{values.map((value) => <li key={value} className="flex gap-3 text-base text-slate-800"><Check className="mt-1 size-5 shrink-0 text-emerald-600" />{value}</li>)}</ul></div></section><CtaSection title="Make your next session the first one." text="Explore the space and choose the next step that feels right for you." /></PublicPage>;
}
