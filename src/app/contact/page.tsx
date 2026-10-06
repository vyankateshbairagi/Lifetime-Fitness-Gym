import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CtaSection, PageIntro, PublicPage } from "@/components/public/public-ui";

export const metadata: Metadata = { title: "Contact", description: "Connect with Lifetime Fitness Gym about your next step." };

export default function ContactPage() {
  return <PublicPage><PageIntro eyebrow="Contact" title="Let’s find the right next step." text="Have a question about membership, the training space, or getting started? Reach out and the gym team can share the latest details." /><section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 sm:px-10 md:grid-cols-2 lg:px-12 lg:py-28"><div className="rounded-2xl bg-slate-950 p-8 text-white"><MessageCircle className="size-7 text-emerald-300" /><h2 className="mt-10 text-2xl font-semibold">Start a conversation</h2><p className="mt-3 leading-7 text-slate-400">Contact details and opening hours can be added here once the gym’s public information is confirmed.</p><Link href="/join" className="mt-8 inline-flex rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Tell us what you need</Link></div><div className="rounded-2xl border border-slate-200 bg-white p-8"><Mail className="size-7 text-emerald-600" /><h2 className="mt-10 text-2xl font-semibold text-slate-950">Keep your details current</h2><p className="mt-3 leading-7 text-slate-600">This page is ready for verified phone, email, location, and hours when those details are approved for public use.</p><p className="mt-8 text-sm font-medium text-slate-500">No public enquiry is submitted yet.</p></div></section><CtaSection title="Take the first step." text="Explore the membership path or visit the gym when you are ready." primary="Explore membership" href="/membership" /></PublicPage>;
}
