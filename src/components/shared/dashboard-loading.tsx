import Image from "next/image";

export function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-center"
    >
      <Image
        src="/lifetime-fitness-gym-logo.png"
        alt="Lifetime Fitness Gym"
        width={220}
        height={124}
        className="h-20 w-auto object-contain motion-safe:animate-pulse"
        priority
      />
      <span className="text-sm font-semibold tracking-tight text-foreground">
        Lifetime Fitness Gym
      </span>
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="size-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-bounce" />
      </div>
      <span className="text-xs text-muted-foreground">Loading…</span>
    </div>
  );
}
