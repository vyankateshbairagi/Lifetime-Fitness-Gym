import { DashboardPageSkeleton } from "@/components/shared/page-skeleton";

// Suspense fallback for any route in this group that doesn't define its
// own `loading.tsx` (currently /dashboard and /settings). Routes below
// this one that already have their own `loading.tsx` use that instead —
// see the sibling `loading.tsx` files under each section for those.
export default function Loading() {
  return <DashboardPageSkeleton />;
}
