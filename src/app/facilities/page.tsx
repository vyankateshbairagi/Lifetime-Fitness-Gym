import type { Metadata } from "next";
import { Activity, Dumbbell, PersonStanding, Waves } from "lucide-react";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Facilities", description: "Explore the training environment at Lifetime Fitness Gym." };
const areas = [{ icon: Dumbbell, title: "Strength training", text: "A space to build a strong foundation through focused resistance work." }, { icon: Activity, title: "Cardio movement", text: "Keep your routine moving with energy-building cardio sessions." }, { icon: PersonStanding, title: "Functional training", text: "Train movement patterns that support the way you move every day." }, { icon: Waves, title: "Your training zone", text: "Settle into a clean, considered environment made for showing up." }];

export default function FacilitiesPage() {
  return <PublicPage><PageIntro eyebrow="The space" title="Room to move, focus, and get stronger." text="Explore a training environment that keeps the essentials close and the distractions low." /><section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28"><div className="grid gap-5 sm:grid-cols-2">{areas.map(({ icon: Icon, title, text }) => <article key={title} className="group min-h-64 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-emerald-300"><Icon className="size-6" /></div><h2 className="mt-12 text-2xl font-semibold text-slate-950">{title}</h2><p className="mt-3 max-w-sm leading-7 text-slate-600">{text}</p></article>)}</div></section><CtaSection title="See where your routine could take you." text="Take the next step and start a conversation with Lifetime Fitness Gym." /></PublicPage>;
}
