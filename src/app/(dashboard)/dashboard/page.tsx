import {
  AlarmClock,
  ArrowRight,
  CalendarCheck,
  CreditCard,
  ExternalLink,
  IndianRupee,
  MessageCircle,
  Receipt,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
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
import {
  getFeeReminderUrl,
  getPaymentReceiptUrl,
  getRenewalReminderUrl,
} from "@/lib/whatsapp";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const statsData = await getDashboardStats(user.organizationId);

  const todaysAttendance = statsData.todaysAttendance;
  const todaysAttendanceCount = todaysAttendance.length;
  const expiringMemberships = statsData.expiringMemberships;
  const recentPayments = statsData.recentPayments;
  const pendingMemberships = statsData.pendingMemberships || [];

  const maxRevenue = Math.max(
    ...statsData.revenueTrend.map((item) => Number(item.amount)),
    1
  );

  const currentMonthRevenueNum = Number(statsData.currentMonthRevenue);
  const currentMonthExpensesNum = Number(statsData.currentMonthExpenses);
  const netProfitNum = Number(statsData.netProfit);

  return (
    <div className="space-y-6">
      {/* Top Greeting & Action Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Good morning
          </p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-foreground">
            {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Live overview of LifeTime Fitness Gym operations &amp; finances today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/payments/new">
              <CreditCard className="size-3.5 text-red-500" />
              <span>Record payment</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="gap-1.5 bg-red-600 text-white hover:bg-red-500">
            <Link href="/members">
              <UserPlus className="size-3.5" />
              <span>Add member</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Financial & Operational Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Members"
          value={statsData.totalMembers.toLocaleString("en-IN")}
          subtitle={`${statsData.activeMembers.toLocaleString("en-IN")} active memberships`}
          icon={Users}
          tone="default"
        />

        <StatCard
          label="Revenue Overview"
          value={`₹${currentMonthRevenueNum.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle={`Today: ₹${Number(statsData.todayRevenue).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} collected`}
          icon={IndianRupee}
          tone="brand"
        />

        <StatCard
          label="Pending Fees"
          value={`₹${Number(statsData.pendingFees).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle={`${pendingMemberships.length} members with unpaid balance`}
          icon={Wallet}
          tone="warning"
        />

        <StatCard
          label="Net Profit"
          value={`₹${netProfitNum.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle={`Expenses: ₹${currentMonthExpensesNum.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={netProfitNum >= 0 ? TrendingUp : TrendingDown}
          tone={netProfitNum >= 0 ? "positive" : "danger"}
        />
      </div>

      {/* Middle Row: Revenue Trend Bar Chart & Today's Attendance */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Revenue Overview Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                    <IndianRupee className="size-4" />
                  </div>
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-xs">
                  Collections &amp; revenue trend over the last 6 months
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5 font-bold">
                  <TrendingUp className="size-3.5 text-emerald-500" />
                  <span>
                    ₹{currentMonthRevenueNum.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Badge>

                <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                  <Link href="/reports">
                    <span>Reports</span>
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            {statsData.revenueTrend.every((item) => Number(item.amount) === 0) ? (
              <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center">
                <Receipt className="size-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-semibold text-foreground">No revenue recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Payments recorded via Cash, UPI, or Card will populate your monthly collections trend here.
                </p>
              </div>
            ) : (
              <div className="flex items-end gap-3 pt-2">
                {statsData.revenueTrend.map((bar, index) => {
                  const barAmount = Number(bar.amount);
                  const height = (barAmount / maxRevenue) * 100;
                  const isCurrentMonth = index === statsData.revenueTrend.length - 1;

                  return (
                    <div
                      key={`${bar.month}-${index}`}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-36 w-full items-end rounded-t-xl bg-muted/40 p-1">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            isCurrentMonth
                              ? "bg-gradient-to-t from-red-600 to-red-500 shadow-md shadow-red-500/20"
                              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                          style={{
                            height: `${Math.max(height, barAmount > 0 ? 12 : 4)}%`,
                          }}
                          title={`${bar.month}: ₹${barAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                        />
                      </div>
                      <span className="text-[11px] font-bold uppercase text-muted-foreground">
                        {bar.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Attendance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <UserCheck className="size-4" />
                </div>
                Today&apos;s Attendance
              </CardTitle>
              <CardDescription className="text-xs">
                {todaysAttendanceCount} {todaysAttendanceCount === 1 ? "member" : "members"} checked in today
              </CardDescription>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Link href="/attendance">
                <CalendarCheck className="size-3 text-red-500" />
                <span>Mark check-in</span>
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-2.5 pt-4">
            {todaysAttendance.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center">
                <UserCheck className="size-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-semibold text-foreground">No check-ins yet today</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Morning (6-10 AM) or evening (4-10 PM) check-ins will display here.
                </p>
              </div>
            ) : (
              todaysAttendance.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 transition hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">{a.member}</p>
                      <p className="text-[11px] text-muted-foreground">Checked in</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actionable Tables: Expiring Memberships & Recent Payments */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Expiring Memberships with 1-Click WhatsApp Renewal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlarmClock className="size-4 text-amber-500" />
                <span>Expiring Memberships</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Members whose plan is ending in the next 7 days
              </CardDescription>
            </div>
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400"
            >
              <span>Manage</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {expiringMemberships.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <AlarmClock className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                <span>No memberships expiring in the next 7 days.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Expires in</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringMemberships.map((m) => {
                      const whatsappUrl = m.phone
                        ? getRenewalReminderUrl({
                            phone: m.phone,
                            memberName: m.member,
                            planName: m.plan,
                            daysRemaining: m.expiresIn,
                          })
                        : null;

                      return (
                        <TableRow key={m.id}>
                          <TableCell className="font-bold text-foreground">
                            <div>
                              <span>{m.member}</span>
                              {m.phone && (
                                <p className="text-[11px] font-normal text-muted-foreground">
                                  {m.phone}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{m.plan}</TableCell>
                          <TableCell>
                            <Badge variant="warning" className="text-[10px] font-bold">
                              {m.expiresIn}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {whatsappUrl ? (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                                title="Send Renewal Reminder via WhatsApp"
                              >
                                <MessageCircle className="size-3" />
                                <span>Remind</span>
                              </a>
                            ) : (
                              <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                                <Link href="/subscriptions">Renew</Link>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments with Receipt & WhatsApp Confirmation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Receipt className="size-4 text-emerald-500" />
                <span>Recent Payments</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Latest transactions collected at the desk
              </CardDescription>
            </div>
            <Link
              href="/payments"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400"
            >
              <span>View all</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            {recentPayments.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <CreditCard className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                <span>No payments recorded yet.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((p) => {
                      const shareReceiptUrl =
                        p.phone && p.receiptNumber
                          ? getPaymentReceiptUrl({
                              phone: p.phone,
                              memberName: p.member,
                              amount: p.amount,
                              receiptNumber: p.receiptNumber,
                              paymentMethod: p.method,
                              planName: p.plan,
                              date: p.date,
                            })
                          : null;

                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-bold text-foreground">
                            <Link href={`/payments/${p.id}`} className="hover:underline">
                              {p.member}
                            </Link>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {p.plan}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-muted-foreground">
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                              {p.method}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold text-foreground">
                            ₹{Number(p.amount).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {shareReceiptUrl ? (
                              <a
                                href={shareReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:text-emerald-400"
                                title="Send receipt via WhatsApp"
                              >
                                <MessageCircle className="size-3" />
                                <span>Send</span>
                              </a>
                            ) : (
                              <Link
                                href={`/payments/${p.id}`}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                View
                              </Link>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Fees Recovery Panel (If any active members have unpaid balances) */}
      {pendingMemberships.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-950/10">
          <CardHeader className="border-b border-amber-500/20 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-400">
                  <Wallet className="size-4" />
                  <span>Pending Fees Recovery</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Members with unpaid balances. Send 1-click reminders to collect pending gym revenue.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/20">
                <Link href="/payments/new">Collect Fee</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Pending Dues</TableHead>
                    <TableHead className="text-right">WhatsApp Reminder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMemberships.map((item) => {
                    const reminderUrl = getFeeReminderUrl({
                      phone: item.phone,
                      memberName: item.member,
                      planName: item.plan,
                      pendingAmount: item.pendingAmount,
                    });

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-bold text-foreground">{item.member}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.plan}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.phone}</TableCell>
                        <TableCell className="text-right font-black text-amber-400">
                          ₹{Number(item.pendingAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={reminderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                          >
                            <MessageCircle className="size-3" />
                            <span>Remind Fee</span>
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gym Owner Quick Actions Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Quick Operations</CardTitle>
          <CardDescription className="text-xs">
            Everyday management shortcuts for LifeTime Fitness Gym
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/members",
              label: "Add member",
              icon: UserPlus,
              color: "text-red-500 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5",
            },
            {
              href: "/subscriptions",
              label: "Create subscription",
              icon: UserCheck,
              color: "text-blue-500 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5",
            },
            {
              href: "/payments/new",
              label: "Record payment",
              icon: CreditCard,
              color: "text-emerald-500 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5",
            },
            {
              href: "/expenses/new",
              label: "Record expense",
              icon: Receipt,
              color: "text-orange-500 border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/5",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 rounded-xl border bg-card p-3.5 text-xs sm:text-sm font-bold transition-all shadow-sm ${action.color}`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{action.label}</span>
                <ArrowRight className="ml-auto size-3.5 opacity-60" />
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
