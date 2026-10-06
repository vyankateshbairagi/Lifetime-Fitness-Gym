import type { Metadata } from "next";
import { Award, HeartHandshake, Users } from "lucide-react";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Trainers", description: "Learn about the coaching approach at Lifetime Fitness Gym." };
const approach = [{ icon: Users, title: "Meet you at your level", text: "Your starting point matters. Training should feel challenging, clear, and achievable." }, { icon: Award, title: "Keep the fundamentals clear", text: "Good coaching makes movement easier to understand and progress easier to track." }, { icon: HeartHandshake, title: "Support the long game", text: "The goal is not one perfect workout. It is a routine that keeps working for you." }];

export default function TrainersPage() {
  return <PublicPage><PageIntro eyebrow="Training support" title="Guidance for the work you want to do." text="Our trainer experience is designed to help you build clarity and confidence around your routine. Speak with the gym to learn about current coaching availability." /><section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28"><div className="grid gap-5 md:grid-cols-3">{approach.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl bg-slate-950 p-7 text-white"><Icon className="size-7 text-emerald-300" /><h2 className="mt-12 text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-slate-400">{text}</p></article>)}</div></section><CtaSection title="Want help finding your starting point?" text="Get in touch and we will help you understand the next step." primary="Talk to the gym" href="/contact" /></PublicPage>;
}
