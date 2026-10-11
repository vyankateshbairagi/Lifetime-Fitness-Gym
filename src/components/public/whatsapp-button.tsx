import { MessageCircle } from "lucide-react";

export function FloatingWhatsAppButton() {
  const whatsappUrl = `https://wa.me/918446648527?text=${encodeURIComponent(
    "Hi LifeTime Fitness Gym! I'm interested in training and would like to know more about membership and free trials."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with LifeTime Fitness Gym on WhatsApp"
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 transition hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
      >
        <MessageCircle className="size-7" />
        <span className="absolute right-16 hidden rounded-lg bg-black/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm whitespace-nowrap group-hover:block">
          Chat With Us
        </span>
      </a>
    </div>
  );
}
