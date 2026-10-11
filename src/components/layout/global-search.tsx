"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  Dumbbell,
  FileText,
  LayoutDashboard,
  Loader2,
  Receipt,
  Search,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { searchGlobal, type SearchResult } from "@/actions/search";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Navigation" },
  { label: "All Members", href: "/members", icon: Users, category: "Navigation" },
  { label: "Record Payment", href: "/payments/new", icon: Wallet, category: "Actions" },
  { label: "Attendance Desk", href: "/attendance", icon: Calendar, category: "Actions" },
  { label: "Record Expense", href: "/expenses/new", icon: Receipt, category: "Actions" },
  { label: "Financial Reports", href: "/reports", icon: FileText, category: "Navigation" },
  { label: "Membership Plans", href: "/plans", icon: Dumbbell, category: "Navigation" },
];

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchGlobal(trimmed);
        setResults(res);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      // Navigate to top matched result if available
      if (results?.members && results.members.length > 0) {
        handleSelect(`/members/${results.members[0].id}`);
        return;
      }
      if (results?.plans && results.plans.length > 0) {
        handleSelect(`/plans/${results.plans[0].id}`);
        return;
      }
      if (results?.payments && results.payments.length > 0) {
        handleSelect(`/payments/${results.payments[0].id}`);
        return;
      }
      if (results?.expenses && results.expenses.length > 0) {
        handleSelect(`/expenses/${results.expenses[0].id}`);
        return;
      }

      // Default navigate to members search list
      handleSelect(`/members?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const hasAnyResults =
    results &&
    (results.members.length > 0 ||
      results.plans.length > 0 ||
      results.payments.length > 0 ||
      results.expenses.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Bar Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          aria-label="Global search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search members, phone, receipts, plans..."
          className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-16 text-sm outline-none transition focus:border-red-500 focus:bg-background focus:ring-2 focus:ring-red-500/20"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults(null);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-4 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span>Ctrl</span>K
          </kbd>
        )}
      </div>

      {/* Dropdown Overlay Results */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[340px] max-w-lg rounded-xl border border-border/90 bg-card/95 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-red-500" />
              <span>Searching LifeTime Fitness database...</span>
            </div>
          )}

          {!isLoading && query.trim() && !hasAnyResults && (
            <div className="px-4 py-5 text-center text-xs space-y-3">
              <div>
                <p className="font-semibold text-foreground">No matches found for &quot;{query}&quot;</p>
                <p className="mt-1 text-muted-foreground">Search specifically inside one of these modules:</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(`/members?search=${encodeURIComponent(query)}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                >
                  <Users className="size-3.5" />
                  <span>Members</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(`/payments?search=${encodeURIComponent(query)}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                >
                  <Wallet className="size-3.5" />
                  <span>Payments</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(`/expenses?search=${encodeURIComponent(query)}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/20"
                >
                  <Receipt className="size-3.5" />
                  <span>Expenses</span>
                </button>
              </div>
            </div>
          )}

          {!isLoading && hasAnyResults && (
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50 p-2 text-xs">
              {/* Members Section */}
              {results.members.length > 0 && (
                <div className="py-1">
                  <div className="px-2 py-1 font-bold uppercase tracking-wider text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <User className="size-3 text-red-500" />
                    <span>Members ({results.members.length})</span>
                  </div>
                  {results.members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelect(`/members/${m.id}`)}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-muted/70 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground truncate">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {m.phone} {m.memberCode ? `• ${m.memberCode}` : ""}
                        </div>
                      </div>
                      <Badge
                        variant={m.status === "ACTIVE" ? "success" : "secondary"}
                        className="text-[10px] font-bold shrink-0 ml-2"
                      >
                        {m.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* Payments Section */}
              {results.payments.length > 0 && (
                <div className="py-1">
                  <div className="px-2 py-1 font-bold uppercase tracking-wider text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Receipt className="size-3 text-emerald-500" />
                    <span>Payments &amp; Receipts ({results.payments.length})</span>
                  </div>
                  {results.payments.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(`/payments/${p.id}`)}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-muted/70 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground truncate font-mono text-[11px]">
                          {p.receiptNumber}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.memberName} • {p.paymentMethod}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="font-bold text-emerald-500">₹{Number(p.amount).toLocaleString("en-IN")}</div>
                        <Badge
                          variant={p.status === "COMPLETED" ? "success" : "secondary"}
                          className="text-[9px]"
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Plans Section */}
              {results.plans.length > 0 && (
                <div className="py-1">
                  <div className="px-2 py-1 font-bold uppercase tracking-wider text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Dumbbell className="size-3 text-primary" />
                    <span>Membership Plans ({results.plans.length})</span>
                  </div>
                  {results.plans.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => handleSelect(`/plans/${pl.id}`)}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-muted/70 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground truncate">{pl.name}</div>
                        <div className="text-[11px] text-muted-foreground">{pl.durationInDays} days term</div>
                      </div>
                      <span className="font-bold text-foreground shrink-0 ml-2">
                        ₹{Number(pl.price).toLocaleString("en-IN")}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Expenses Section */}
              {results.expenses.length > 0 && (
                <div className="py-1">
                  <div className="px-2 py-1 font-bold uppercase tracking-wider text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3 text-orange-500" />
                    <span>Gym Expenses ({results.expenses.length})</span>
                  </div>
                  {results.expenses.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => handleSelect(`/expenses/${exp.id}`)}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-muted/70 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground truncate">{exp.title}</div>
                        <div className="text-[11px] text-muted-foreground">{exp.category}</div>
                      </div>
                      <span className="font-bold text-orange-400 shrink-0 ml-2">
                        ₹{Number(exp.amount).toLocaleString("en-IN")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions / Shortcuts (When query is empty) */}
          {!query.trim() && (
            <div className="p-2 text-xs">
              <div className="px-2 py-1 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                {QUICK_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleSelect(item.href)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-muted/70 transition"
                    >
                      <Icon className="size-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 border-t border-border/50 px-2 pt-2 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Tip: Type member name or phone</span>
                <span>Press ↵ to view all</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
