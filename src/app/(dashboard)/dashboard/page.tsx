import {
  AlarmClock,
  ArrowRight,
  CalendarCheck,
  CreditCard,
  IndianRupee,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/dashboard";
import { getCurrentUser } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const statsData = await getDashboardStats(user.organizationId);
  const todaysAttendance = statsData.todaysAttendance;
  const todaysAttendanceCount = todaysAttendance.length;
  const expiringMemberships = statsData.expiringMemberships;
  const recentPayments = statsData.recentPayments;
  const stats = [
    { label: "Total Members", value: statsData.totalMembers.toLocaleString("en-IN"), icon: Users, tone: "default" as const },
    { label: "Active Members", value: statsData.activeMembers.toLocaleString("en-IN"), icon: UserCheck, tone: "positive" as const },
    { label: "Expiring Soon", value: statsData.expiringSoon.toLocaleString("en-IN"), icon: AlarmClock, tone: "warning" as const },
    { label: "Pending Fees", value: `₹${Number(statsData.pendingFees).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, tone: "warning" as const },
  ];

  const maxRevenue = Math.max(...statsData.revenueTrend.map((item) => Number(item.amount)), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Good morning</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening at your gym today.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <Button asChild>
            <Link href="/members">Add member</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IndianRupee className="size-4" />
                  </div>
                  Revenue Overview
                </CardTitle>
                <CardDescription>Collected over the last 6 months</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1.5 font-medium">
                <TrendingUp className="size-3.5" />
                ₹{Number(statsData.currentMonthRevenue).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {statsData.revenueTrend.every((item) => Number(item.amount) === 0) ? (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground">
                No revenue recorded yet. Revenue will appear here once payments are recorded.
              </div>
            ) : (
              <div className="flex items-end gap-3">
                {statsData.revenueTrend.map((bar, index) => {
                  const height = (Number(bar.amount) / maxRevenue) * 100;
                  return (
                    <div key={`${bar.month}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-32 w-full items-end rounded-t-xl bg-muted/80 p-1">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/70 shadow-sm"
                          style={{ height: `${Math.max(height, Number(bar.amount) > 0 ? 12 : 0)}%` }}
                          title={`₹${Number(bar.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{bar.month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck className="size-4" />
              </div>
              Today&apos;s Attendance
            </CardTitle>
            <CardDescription>{todaysAttendanceCount} members checked in so far</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {todaysAttendance.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-5 text-sm text-muted-foreground">
                No members checked in yet today.
              </div>
            ) : (
              todaysAttendance.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.member}</p>
                    <p className="text-xs text-muted-foreground">Checked in</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{a.time}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest transactions across the gym</CardDescription>
            </div>
            <Link href="/payments" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.member}</TableCell>
                    <TableCell className="text-muted-foreground">{p.plan}</TableCell>
                    <TableCell className="text-muted-foreground">{p.method}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ₹{Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Expiring Memberships</CardTitle>
              <CardDescription>Members who need a renewal reminder</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Expires in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringMemberships.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.member}</TableCell>
                    <TableCell className="text-muted-foreground">{m.plan}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="warning" className="font-medium">
                        {m.expiresIn}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Common tasks for your daily gym operations</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/members", label: "Add member", icon: Users, className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
            { href: "/subscriptions", label: "Create subscription", icon: UserCheck, className: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { href: "/payments/new", label: "Record payment", icon: CreditCard, className: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { href: "/attendance", label: "Mark attendance", icon: CalendarCheck, className: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${action.className}`}>
                <Icon className="size-4" />
                {action.label}
                <ArrowRight className="ml-auto size-4" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
