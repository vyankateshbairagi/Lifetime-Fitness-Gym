import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export function PublicPage({ children }: { children: React.ReactNode }) {
  return <div className="public-site min-h-full"><PublicHeader /><main><div className="min-h-[70vh]">{children}</div></main><PublicFooter /></div>;
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{text}</p></div>;
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{text}</p></div></section>;
}

export function CtaSection({ title, text, primary = "Join now", href = "/join" }: { title: string; text: string; primary?: string; href?: string }) {
  return <section className="bg-emerald-50"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-16 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12"><div><h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2><p className="mt-3 max-w-xl leading-7 text-slate-600">{text}</p></div><Button asChild size="lg"><Link href={href}>{primary}<ArrowRight className="size-4" /></Link></Button></div></section>;
}

export function BackLink() {
  return <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"><ArrowLeft className="size-4" /> Back home</Link>;
}
