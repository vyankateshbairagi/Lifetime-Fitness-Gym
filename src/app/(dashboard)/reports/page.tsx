import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  MessageCircle,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getReportsData } from "@/lib/reports";
import { getPaymentReceiptUrl, getRenewalReminderUrl } from "@/lib/whatsapp";

function money(value: string | number, currency: string) {
  return Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function date(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await getCurrentUser();
  if (!can(user.role, "reports:view")) redirect("/dashboard");
  const params = await searchParams;
  const data = await getReportsData(user.organizationId, params.range);
  const currency = user.organization.currency;

  const maxRevenue = Math.max(1, ...data.revenueTrend.map((item) => Number(item.amount)));
  const maxAttendance = Math.max(1, ...data.attendance.trend.map((item) => item.count));
  const maxFinancial = Math.max(
    1,
    ...data.financialTrend.flatMap((item) => [Number(item.revenue), Number(item.expenses)])
  );

  const isNetCashFlowPositive = Number(data.financial.netCashFlow) >= 0;

  return (
    <div className="space-y-6">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-500">
            LifeTime Fitness · Insights
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete financial P&amp;L, operational cash flow, membership retention, and attendance insights.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ["this-month", "This month"],
            ["today", "Today"],
            ["this-week", "This week"],
            ["last-month", "Last month"],
            ["this-year", "This year"],
          ].map(([value, text]) => (
            <Button
              key={value}
              variant={data.range.key === value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/reports?range=${value}`}>{text}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Financial Overview</h2>
            <p className="text-xs text-muted-foreground">
              {data.range.label} · Money collected vs operational expenses and pending member balances.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/80 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Money collected</span>
                <Wallet className="size-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-500">
                {money(data.financial.collected, currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.financial.paymentCount} successful collections
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Operating Expenses</span>
                <ReceiptText className="size-4 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-400">
                {money(data.financial.expenses, currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.financial.expenseCount} recorded expenditures
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Current outstanding</span>
                <CircleDollarSign className="size-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-400">
                {money(data.financial.outstanding, currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Unpaid member dues to collect</p>
            </CardContent>
          </Card>

          <Card
            className={
              isNetCashFlowPositive
                ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-card"
                : "border-destructive/40 bg-gradient-to-br from-destructive/20 to-card"
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                <span className={isNetCashFlowPositive ? "text-emerald-400" : "text-destructive"}>
                  Net cash flow
                </span>
                {isNetCashFlowPositive ? (
                  <ArrowUpRight className="size-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="size-4 text-destructive" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  isNetCashFlowPositive
                    ? "text-2xl font-bold text-emerald-400"
                    : "text-2xl font-bold text-destructive"
                }
              >
                {money(data.financial.netCashFlow, currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Gross collections minus operational expenses</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
          <span>
            Refunds issued in this period:{" "}
            <span className="font-semibold text-foreground">
              {money(data.financial.refunds, currency)}
            </span>
          </span>
          <span>•</span>
          <span>
            Net revenue after refunds:{" "}
            <span className="font-semibold text-emerald-400">
              {money(data.financial.revenue, currency)}
            </span>
          </span>
        </div>
      </section>

      {/* Revenue vs Expenses Chart */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Revenue vs Expenses</h2>
          <p className="text-xs text-muted-foreground">
            Monthly cash inflow compared with outflow for {data.range.label.toLowerCase()}.
          </p>
        </div>
        <Card>
          <CardContent className="pt-5">
            {data.financialTrend.every(
              (item) => Number(item.revenue) === 0 && Number(item.expenses) === 0
            ) ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No financial activity recorded for this period.
              </p>
            ) : (
              <div className="flex h-56 items-end gap-2">
                {data.financialTrend.map((item) => (
                  <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-44 w-full items-end gap-1">
                      <div
                        className="min-w-0 flex-1 rounded-t bg-emerald-500/80 transition hover:bg-emerald-400"
                        style={{
                          height: `${Math.max(2, (Number(item.revenue) / maxFinancial) * 100)}%`,
                        }}
                        title={`Revenue ${money(item.revenue, currency)}`}
                      />
                      <div
                        className="min-w-0 flex-1 rounded-t bg-orange-500/80 transition hover:bg-orange-400"
                        style={{
                          height: `${Math.max(2, (Number(item.expenses) / maxFinancial) * 100)}%`,
                        }}
                        title={`Expenses ${money(item.expenses, currency)}`}
                      />
                    </div>
                    <span className="truncate text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground border-t border-border/60 pt-3">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
                <span>Revenue (Collections)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-orange-500" />
                <span>Expenses (Operational)</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Breakdowns: Payment Methods and Expense Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Payment methods</CardTitle>
          </CardHeader>
          <CardContent>
            {data.paymentMethods.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No payments for this period.
              </p>
            ) : (
              <div className="space-y-3">
                {data.paymentMethods.map((item) => (
                  <div
                    key={item.method}
                    className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-foreground">{label(item.method)}</span>
                    <span className="font-bold text-emerald-500">{money(item.amount, currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Expense breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data.expenseBreakdown.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No expenses for this period.
              </p>
            ) : (
              <div className="space-y-3">
                {data.expenseBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-foreground">{label(item.category)}</span>
                    <span className="font-bold text-orange-400">{money(item.amount, currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Membership Overview */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Membership Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total members
              </p>
              <p className="mt-2 text-2xl font-bold">{data.members.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active members
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-500">{data.members.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                New members
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">{data.members.newMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Expiring in 7 days
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-500">{data.members.expiring}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Monthly Revenue & Attendance Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {data.revenueTrend.map((item) => (
                <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end">
                    <div
                      className="w-full rounded-t bg-red-600/80 transition hover:bg-red-500"
                      style={{
                        height: `${Math.max(4, (Number(item.amount) / maxRevenue) * 100)}%`,
                      }}
                      title={money(item.amount, currency)}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Attendance trend</CardTitle>
          </CardHeader>
          <CardContent>
            {data.attendance.trend.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No attendance records for this period.
              </p>
            ) : (
              <div className="flex h-48 items-end gap-2">
                {data.attendance.trend.map((item) => (
                  <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end">
                      <div
                        className="w-full rounded-t bg-emerald-500/80 transition hover:bg-emerald-400"
                        style={{ height: `${Math.max(4, (item.count / maxAttendance) * 100)}%` }}
                        title={`${item.count} visits`}
                      />
                    </div>
                    <span className="truncate text-xs text-muted-foreground">{item.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expiring Memberships with WhatsApp Renewal Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Expiring memberships</CardTitle>
        </CardHeader>
        <CardContent>
          {data.expiringMemberships.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No memberships expiring in the next 7 days.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase font-semibold text-muted-foreground">
                    <th className="h-10 px-4">Member</th>
                    <th className="h-10 px-4">Plan</th>
                    <th className="h-10 px-4">End date</th>
                    <th className="h-10 px-4">Days remaining</th>
                    <th className="h-10 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.expiringMemberships.map((item, idx) => {
                    const renewalUrl = item.phone
                      ? getRenewalReminderUrl({
                          phone: item.phone,
                          memberName: item.member,
                          planName: item.plan,
                          daysRemaining: item.daysRemaining,
                          endDate: date(item.endDate),
                        })
                      : null;

                    return (
                      <tr key={`${item.member}-${idx}`} className="hover:bg-muted/40 transition">
                        <td className="p-4 font-semibold text-foreground">{item.member}</td>
                        <td className="p-4">{item.plan}</td>
                        <td className="p-4 whitespace-nowrap text-muted-foreground">
                          {date(item.endDate)}
                        </td>
                        <td className="p-4 font-medium text-amber-500">
                          {item.daysRemaining} days
                        </td>
                        <td className="p-4 text-right">
                          {renewalUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold"
                            >
                              <a href={renewalUrl} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="size-3.5" />
                                <span>WhatsApp Reminder</span>
                              </a>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Collection History with WhatsApp Receipt Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Payment collection history</CardTitle>
        </CardHeader>
        <CardContent>
          {data.payments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No payment activity for this period.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase font-semibold text-muted-foreground">
                    <th className="h-10 px-4">Date</th>
                    <th className="h-10 px-4">Member</th>
                    <th className="h-10 px-4">Amount</th>
                    <th className="h-10 px-4">Method</th>
                    <th className="h-10 px-4">Status</th>
                    <th className="h-10 px-4">Reference</th>
                    <th className="h-10 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.payments.map((payment) => {
                    const receiptUrl = payment.phone
                      ? getPaymentReceiptUrl({
                          phone: payment.phone,
                          memberName: payment.member,
                          amount: Number(payment.amount),
                          receiptNumber: payment.reference,
                          paymentMethod: payment.method,
                          date: date(payment.date),
                        })
                      : null;

                    return (
                      <tr key={payment.id} className="hover:bg-muted/40 transition">
                        <td className="p-4 whitespace-nowrap text-muted-foreground">
                          {date(payment.date)}
                        </td>
                        <td className="p-4 font-semibold text-foreground">{payment.member}</td>
                        <td className="p-4 whitespace-nowrap font-bold text-emerald-500">
                          {money(payment.amount, currency)}
                        </td>
                        <td className="p-4 text-xs font-mono">{label(payment.method)}</td>
                        <td className="p-4">
                          <Badge
                            variant={payment.status === "COMPLETED" ? "success" : "secondary"}
                            className="text-[10px]"
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-xs">{payment.reference}</td>
                        <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                            <Link href={`/payments/${payment.id}`}>View</Link>
                          </Button>
                          {receiptUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-7 px-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs"
                            >
                              <a
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Share on WhatsApp"
                              >
                                <MessageCircle className="size-3" />
                              </a>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
