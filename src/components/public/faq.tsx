"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I book a free trial session?",
    answer:
      "Simply fill out the Book Your Free Trial form on this website or message us directly on WhatsApp (+918446648527). Our team will connect with you to verify slot availability and reserve your session.",
  },
  {
    question: "What are the gym opening hours?",
    answer:
      "LifeTime Fitness Gym is open in two daily training windows: Morning from 6:00 AM to 10:00 AM, and Evening from 4:00 PM to 10:00 PM (Monday through Saturday).",
  },
  {
    question: "Where is LifeTime Fitness Gym located?",
    answer:
      "We are located at 732, Chhatrapati Shivaji Maharaj Rd, near Rashtrabhushan Chowk, Guruwar Peth, Pune, Maharashtra 411042. You can find Google Maps directions in our Location & Contact section.",
  },
  {
    question: "Is trainer guidance available for workouts?",
    answer:
      "Yes. Our floor trainer, Dhirendra Pande, is available on the gym floor to help evaluate your exercise form, introduce you to machines, and provide guidance on proper lifting technique.",
  },
  {
    question: "Can beginners start training here?",
    answer:
      "Absolutely. Our facility is designed to support beginners taking their very first gym steps as well as regular lifters. We will walk you through equipment usage and foundational movements.",
  },
  {
    question: "How can I inquire about current membership plans?",
    answer:
      "You can view available membership plans in the Membership Plans section of our website, or reach out to us directly via WhatsApp or phone (8446648527) for personalized plan details.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="scroll-mt-24 bg-[#090909] py-10 sm:py-14 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-0.5 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <HelpCircle className="size-3" />
            <span>COMMON QUESTIONS</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            FREQUENTLY ASKED <span className="text-red-500">QUESTIONS</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Everything you need to know about starting your fitness journey at LifeTime Fitness Gym, Pune.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-6 space-y-2">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#120a0b] transition hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 p-3.5 sm:p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`size-4 text-red-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 text-xs leading-relaxed text-slate-300 border-t border-white/5 pt-3 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
