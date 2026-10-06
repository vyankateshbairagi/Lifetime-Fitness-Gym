import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Join", description: "Take the first step toward your Lifetime Fitness Gym routine." };
const steps = ["Explore the membership options", "Connect with the gym about availability", "Choose a routine and start showing up"];

export default function JoinPage() {
  return <PublicPage><PageIntro eyebrow="Your next step" title="Start where you are. Build from there." text="Joining should feel clear and straightforward. Explore the options, ask your questions, and choose the routine that fits your goals." /><section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_0.8fr] lg:px-12 lg:py-28"><div><h2 className="text-3xl font-semibold tracking-tight text-slate-950">How to get started</h2><div className="mt-8 space-y-5">{steps.map((step, index) => <div key={step} className="flex gap-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">0{index + 1}</span><p className="pt-1 text-lg text-slate-700">{step}</p></div>)}</div><div className="mt-10 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/membership">View membership <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/contact">Contact the gym</Link></Button></div></div><div className="rounded-2xl bg-emerald-50 p-8"><h2 className="text-2xl font-semibold text-slate-950">A better routine starts with one decision.</h2><ul className="mt-7 space-y-4">{["No public account registration", "No pressure to choose before you are ready", "A clear path to learn more and begin"].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><Check className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div></section></PublicPage>;
}
