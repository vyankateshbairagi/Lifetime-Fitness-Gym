import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Membership", description: "Explore flexible membership options at Lifetime Fitness Gym." };

const options = [
  { name: "Essential", label: "Build your foundation", points: ["Access to the training floor", "A focused environment for your routine", "A simple place to start"] },
  { name: "Progress", label: "Keep moving forward", points: ["Everything in Essential", "Room to refine your routine", "Support for consistent progress"] },
  { name: "Performance", label: "Train with intention", points: ["Everything in Progress", "A routine built around your goals", "More ways to make sessions count"] },
];

export default function MembershipPage() {
  return <PublicPage><PageIntro eyebrow="Membership" title="Choose a routine that meets you where you are." text="Membership information is presented as a starting point while final availability and pricing are confirmed directly with the gym." /><section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28"><div className="grid gap-5 lg:grid-cols-3">{options.map((option, index) => <article key={option.name} className={`rounded-2xl border p-7 ${index === 1 ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-900/10" : "border-slate-200 bg-white"}`}><p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">{option.label}</p><h2 className="mt-4 text-3xl font-semibold text-slate-950">{option.name}</h2><ul className="mt-7 space-y-4">{option.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 size-4 shrink-0 text-emerald-600" />{point}</li>)}</ul><Button asChild variant={index === 1 ? "default" : "outline"} className="mt-8 w-full"><Link href="/join">Ask about this option <ArrowRight className="size-4" /></Link></Button></article>)}</div></section><CtaSection title="Have questions before you join?" text="We can help you find the right place to begin." primary="Contact us" href="/contact" /></PublicPage>;
}
