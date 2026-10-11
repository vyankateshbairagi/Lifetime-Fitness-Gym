import Link from "next/link";
import { ArrowRight, Check, MessageCircle, Phone, Sparkles } from "lucide-react";

export interface PublicPlan {
  id: string;
  name: string;
  price: string | number;
  durationInDays: number;
  description?: string | null;
}

interface MembershipPlansProps {
  plans: PublicPlan[];
}

export function MembershipPlans({ plans }: MembershipPlansProps) {
  return (
    <section id="plans" className="scroll-mt-24 bg-[#0d0708] py-10 sm:py-14 text-white border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            <span>MEMBERSHIP OPTIONS</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            TRANSPARENT <span className="text-red-500">MEMBERSHIP</span> PLANS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Flexible gym memberships designed for your routine. No hidden fees, no restrictive locks.
          </p>
        </div>

        {plans.length === 0 ? (
          /* Empty State as required by Master Prompt item 11 */
          <div className="mt-6 mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#120a0b] p-6 text-center shadow-xl">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Sparkles className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold uppercase text-white">
              Plans Currently Being Updated
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Membership plans are currently being updated. Contact us to learn more about our current rates and special offers.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <a
                href="tel:8446648527"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 transition"
              >
                <Phone className="size-3.5" />
                <span>Call Us (8446648527)</span>
              </a>
              <a
                href="https://wa.me/918446648527?text=Hi%20LifeTime%20Fitness,%20I%20would%20like%20to%20know%20more%20about%20your%20current%20membership%20plans."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
              >
                <MessageCircle className="size-3.5 text-red-400" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        ) : (
          /* Active Plans Grid */
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const numericPrice = typeof plan.price === "number" ? plan.price : parseFloat(plan.price) || 0;
              const formattedPrice = numericPrice.toLocaleString("en-IN");
              const durationLabel =
                plan.durationInDays === 30
                  ? "Monthly (30 Days)"
                  : plan.durationInDays === 90
                  ? "Quarterly (3 Months)"
                  : plan.durationInDays === 180
                  ? "Half-Yearly (6 Months)"
                  : plan.durationInDays === 365
                  ? "Annual (12 Months)"
                  : `${plan.durationInDays} Days`;

              const whatsappInquiryUrl = `https://wa.me/918446648527?text=${encodeURIComponent(
                `Hi LifeTime Fitness Gym, I am interested in the ${plan.name} Plan (₹${formattedPrice} for ${durationLabel}). Please share details!`
              )}`;

              return (
                <div
                  key={plan.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#120a0b] p-5 sm:p-6 shadow-xl transition hover:-translate-y-1 hover:border-red-500/50 hover:bg-[#180d0f]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-red-600/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-400 border border-red-500/30">
                        {durationLabel}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black uppercase text-white tracking-wide">
                      {plan.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">₹{formattedPrice}</span>
                      <span className="text-xs font-semibold text-slate-400">/ {plan.durationInDays} days</span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {plan.description || "Full access to gym equipment, strength zone, and floor guidance during operating hours."}
                    </p>

                    <ul className="mt-4 space-y-2 text-xs text-slate-300 border-t border-white/5 pt-3">
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>All strength & cardio machines</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>Morning (6-10 AM) & Evening (4-10 PM)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-red-500 shrink-0" />
                        <span>Floor guidance from trainer</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition hover:bg-red-500"
                    >
                      <span>Ask About This Plan</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                    <Link
                      href="/#free-trial"
                      className="text-center text-[11px] font-semibold text-slate-400 hover:text-white transition py-0.5"
                    >
                      Or book a free trial first
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
