import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  subtitle,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "warning" | "danger" | "brand";
  subtitle?: string;
}) {
  return (
    <Card className="overflow-hidden transition-all hover:border-border/80 hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-transform",
            tone === "positive" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
            tone === "warning" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
            tone === "danger" && "border-rose-500/30 bg-rose-500/10 text-rose-500",
            tone === "brand" && "border-red-500/30 bg-red-500/10 text-red-500 shadow-sm shadow-red-500/20",
            tone === "default" && "border-border bg-muted/80 text-foreground"
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
