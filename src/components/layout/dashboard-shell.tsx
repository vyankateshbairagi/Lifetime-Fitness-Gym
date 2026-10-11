"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, HelpCircle, Menu, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { GlobalSearch } from "@/components/layout/global-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth";
import type { CurrentUser } from "@/lib/auth";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CurrentUser;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/80 bg-background/95 backdrop-blur-xl md:flex md:flex-col z-30">
        <SidebarNav user={user} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarNav user={user} onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 md:hidden">
              <Image
                src="/lifetime-fitness-gym-logo.png"
                alt="Lifetime Fitness Gym"
                width={116}
                height={64}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 max-w-md mx-2">
              <GlobalSearch />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:inline-flex gap-1.5 text-xs font-semibold h-8"
              >
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <span>View Gym Site</span>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">↗</span>
                </Link>
              </Button>

              <div className="hidden rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground md:inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2 border border-border/60">
                    <Avatar className="size-7 ring-1 ring-red-500/30">
                      <AvatarFallback className="bg-red-950/40 text-red-400 font-bold text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-24 truncate text-xs font-bold lg:block">
                      {user.name}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate font-bold text-sm">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-[10px] font-bold text-red-500">
                      {user.role} · LifeTime Fitness
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings &amp; Staff</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                      Visit Public Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="w-full text-left text-destructive font-semibold">
                        Log out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
