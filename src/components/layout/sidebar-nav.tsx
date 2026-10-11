"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mainNavItems, secondaryNavItems } from "@/components/layout/nav-items";
import { logoutAction } from "@/actions/auth";
import type { CurrentUser } from "@/lib/auth";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

const ROLE_LABELS: Record<CurrentUser["role"], string> = {
  OWNER: "Owner",
  STAFF: "Staff",
};

export function SidebarNav({
  user,
  onNavigate,
}: {
  user: CurrentUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleSecondaryItems = secondaryNavItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3.5 shrink-0">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10 p-1">
          <Image
            src="/lifetime-fitness-gym-logo.png"
            alt="Lifetime Fitness Gym Logo"
            width={40}
            height={40}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black uppercase tracking-tight text-foreground truncate">
            LifeTime Fitness
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
            GYM MANAGEMENT
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {mainNavItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-red-500/10 text-red-500 font-semibold shadow-sm ring-1 ring-red-500/30"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {visibleSecondaryItems.length > 0 && <Separator className="my-3" />}

        {visibleSecondaryItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-red-500/10 text-red-500 font-semibold shadow-sm ring-1 ring-red-500/30"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Public Site Quick Link & User Footer */}
      <div className="border-t border-border/80 p-3 space-y-2 shrink-0 mt-auto">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <span>View Public Website</span>
          <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">↗ Live</span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-2.5 border border-border/50">
          <Avatar className="size-9 ring-1 ring-red-500/30 bg-red-950/40 text-red-400 font-bold">
            <AvatarFallback>{initials(user.name) || "LT"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
            <p className="truncate text-[11px] font-semibold text-red-500">
              {ROLE_LABELS[user.role]} · Guruwar Peth
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Log out"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
