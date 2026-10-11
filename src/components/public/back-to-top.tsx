"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition hover:border-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
