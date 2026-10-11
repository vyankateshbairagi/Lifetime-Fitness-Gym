"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

const TIME_SLOTS = [
  // Morning Window
  "Morning: 6:00 AM – 7:00 AM",
  "Morning: 7:00 AM – 8:00 AM",
  "Morning: 8:00 AM – 9:00 AM",
  "Morning: 9:00 AM – 10:00 AM",
  // Evening Window
  "Evening: 4:00 PM – 5:00 PM",
  "Evening: 5:00 PM – 6:00 PM",
  "Evening: 6:00 PM – 7:00 PM",
  "Evening: 7:00 PM – 8:00 PM",
  "Evening: 8:00 PM – 9:00 PM",
  "Evening: 9:00 PM – 10:00 PM",
];

const FITNESS_GOALS = [
  "Weight loss",
  "Muscle building",
  "Strength training",
  "General fitness",
  "Getting started",
];

export function FreeTrialForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [goal, setGoal] = useState(FITNESS_GOALS[0]);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Please enter your mobile number.";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!date) {
      errs.date = "Please select your preferred workout date.";
    }
    if (!timeSlot) {
      errs.timeSlot = "Please choose a time slot.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const message = [
      `*FREE TRIAL PASS REQUEST — LifeTime Fitness Gym*`,
      `Name: ${fullName.trim()}`,
      `Mobile: ${phone.trim()}`,
      `Date: ${date}`,
      `Time Slot: ${timeSlot}`,
      `Fitness Goal: ${goal}`,
      notes.trim() ? `Message: ${notes.trim()}` : "",
      `Requested via: LifeTime Fitness Gym Website`,
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/918446648527?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    }, 400);
  }

  return (
    <section id="free-trial" className="scroll-mt-24 bg-[#0d0708] py-10 sm:py-14 text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Context & Window Info */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
              <Dumbbell className="size-3.5" />
              <span>CLAIM YOUR PASS</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              BOOK YOUR <span className="text-red-500">FREE TRIAL</span> SESSION
            </h2>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
              Take the first step with zero commitment. Test our training atmosphere, try our equipment, and
              consult with our floor trainer at LifeTime Fitness in Pune.
            </p>

            {/* Gym Operational Windows */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
                Official Training Windows
              </h3>
              <div className="mt-3 grid gap-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-semibold text-slate-300">Morning Slot:</span>
                  <span className="font-bold text-white">6:00 AM – 10:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Evening Slot:</span>
                  <span className="font-bold text-white">4:00 PM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Direct Gym Contact Alternative */}
            <div className="mt-4 flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="size-3.5 text-red-400" />
              <span>Prefer calling directly?</span>
              <a
                href="tel:+918446648527"
                className="font-bold text-white hover:text-red-400 transition underline underline-offset-4"
              >
                8446648527
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#120a0b] p-5 sm:p-7 shadow-2xl">
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-black uppercase text-white">
                    Free Trial Request Sent!
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 max-w-md mx-auto">
                    Your trial request details have been prepared for WhatsApp to confirm your slot with our gym
                    team (+918446648527). Please note that free trial passes are confirmed once slot availability is verified.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href="https://wa.me/918446648527"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500"
                    >
                      <span>Open WhatsApp Chat</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                    >
                      Book Another Slot
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                            errors.fullName
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/10 focus:border-red-500 focus:ring-red-500"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/10 focus:border-red-500 focus:ring-red-500"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {/* Preferred Date */}
                    <div>
                      <label htmlFor="date" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 ${
                            errors.date
                              ? "border-red-500 focus:ring-red-500"
                              : "border-white/10 focus:border-red-500 focus:ring-red-500"
                          }`}
                        />
                      </div>
                      {errors.date && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.date}</p>
                      )}
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label htmlFor="timeSlot" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Preferred Time Slot <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          id="timeSlot"
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0d0708] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot} className="bg-black text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Fitness Goal */}
                  <div>
                    <label htmlFor="goal" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Primary Fitness Goal
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0d0708] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {FITNESS_GOALS.map((g) => (
                          <option key={g} value={g} className="bg-black text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label htmlFor="notes" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Message / Questions <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative mt-1.5">
                      <textarea
                        id="notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any previous injury, specific fitness focus, or timing preference..."
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition hover:from-red-500 hover:to-red-600 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Preparing Your Booking...</span>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>Request Free Trial Session</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <ShieldCheck className="size-3 text-red-400 shrink-0" />
                    <span>Your request will be confirmed with LifeTime Fitness Gym via WhatsApp.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
