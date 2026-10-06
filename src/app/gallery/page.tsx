import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Gallery", description: "Get a feel for the Lifetime Fitness Gym experience." };
const panels = ["Train with intention", "Find your focus", "Move with confidence", "Build your rhythm", "Make progress visible", "Keep showing up"];

export default function GalleryPage() {
  return <PublicPage><PageIntro eyebrow="The experience" title="A visual space for your next chapter." text="Real gym imagery will be added as the Lifetime Fitness Gym gallery grows. For now, explore the feeling we are building: focused, energetic, and welcoming." /><section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{panels.map((panel, index) => <div key={panel} className={`relative flex min-h-64 items-end overflow-hidden rounded-2xl p-6 ${index % 3 === 0 ? "bg-emerald-600" : index % 3 === 1 ? "bg-slate-900" : "bg-blue-700"}`}><div className="absolute right-5 top-5 rounded-full border border-white/20 p-3 text-white/70"><ImageIcon className="size-5" /></div><div><span className="text-sm text-white/60">0{index + 1}</span><h2 className="mt-2 text-2xl font-semibold text-white">{panel}</h2></div></div>)}</div></section><CtaSection title="Ready to make it real?" text="Come see how your next session could feel." /></PublicPage>;
}
