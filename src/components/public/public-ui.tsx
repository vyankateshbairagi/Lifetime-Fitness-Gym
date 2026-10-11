import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { FloatingWhatsAppButton } from "@/components/public/whatsapp-button";
import { BackToTop } from "@/components/public/back-to-top";

export function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site min-h-full flex flex-col bg-[#090909] text-white">
      <PublicHeader />
      <main className="flex-1">
        <div className="min-h-[70vh]">{children}</div>
      </main>
      <PublicFooter />
      <FloatingWhatsAppButton />
      <BackToTop />
    </div>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">{title}</h1>
      <p className="mt-5 text-base leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="bg-black text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase tracking-tight sm:text-6xl text-white">{title}</h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">{text}</p>
      </div>
    </section>
  );
}

export function CtaSection({ title, text, primary = "Claim Free Trial Pass", href = "/#free-trial" }: { title: string; text: string; primary?: string; href?: string }) {
  return (
    <section className="bg-[#120a0b] border-y border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-16 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{text}</p>
        </div>
        <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider rounded-full px-8">
          <Link href={href}>
            {primary}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function BackLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 transition">
      <ArrowLeft className="size-4" /> Back to Home
    </Link>
  );
}
