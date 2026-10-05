// Branded loading UI shown while a dashboard route segment is loading
// (via Next.js `loading.tsx` Suspense boundaries — see the various
// `loading.tsx` files under `src/app/(dashboard)/`).
//
// GymFlow does not currently store a per-organization logo anywhere
// (no field on the `Organization` model, no upload flow in Settings), so
// this reuses the same static 🏋️ + "GymFlow" mark already used in
// `dashboard-shell.tsx` and `sidebar-nav.tsx`. If a real organization logo
// is added to Settings later, swap the emoji span below for an
// `<img src={logoUrl} .../>` with the same fallback to this mark.
//
// No data fetching happens here on purpose: this component takes no
// props and triggers no database query, so it adds zero extra work to
// every navigation.

export function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-center"
    >
      <span
        className="text-4xl motion-safe:animate-pulse"
        aria-hidden
      >
        🏋️
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        GymFlow
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
