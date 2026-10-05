import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, ReceiptText, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getReportsData } from "@/lib/reports";

function money(value: string, currency: string) {
  return Number(value).toLocaleString("en-IN", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function date(value: string) {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}
function label(value: string) {
  return value.replaceAll("_", " ");
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const user = await getCurrentUser();
  if (!can(user.role, "reports:view")) redirect("/dashboard");
  const params = await searchParams;
  const data = await getReportsData(user.organizationId, params.range);
  const currency = user.organization.currency;
  const maxRevenue = Math.max(1, ...data.revenueTrend.map((item) => Number(item.amount)));
  const maxAttendance = Math.max(1, ...data.attendance.trend.map((item) => item.count));
  const maxFinancial = Math.max(1, ...data.financialTrend.flatMap((item) => [Number(item.revenue), Number(item.expenses)]));

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Insights</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Reports &amp; Analytics</h1><p className="mt-1 text-sm text-muted-foreground">Financial and operational insights for your gym.</p></div>
      <div className="flex flex-wrap gap-2">{[["this-month", "This month"], ["today", "Today"], ["this-week", "This week"], ["last-month", "Last month"], ["this-year", "This year"]].map(([value, text]) => <Button key={value} variant={data.range.key === value ? "default" : "outline"} size="sm" asChild><Link href={`/reports?range=${value}`}>{text}</Link></Button>)}</div>
    </div>

    <section className="space-y-3">
      <div><h2 className="text-lg font-semibold">Financial Overview</h2><p className="text-sm text-muted-foreground">{data.range.label} · Current Outstanding reflects the current member balance.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Wallet className="size-4 text-primary" />Money collected</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{money(data.financial.collected, currency)}</p><p className="mt-1 text-xs text-muted-foreground">{data.financial.paymentCount} successful payments</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><ReceiptText className="size-4 text-orange-600" />Expenses</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{money(data.financial.expenses, currency)}</p><p className="mt-1 text-xs text-muted-foreground">{data.financial.expenseCount} recorded expenses</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><CircleDollarSign className="size-4 text-amber-600" />Current outstanding</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{money(data.financial.outstanding, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Pending member dues</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm">{Number(data.financial.netCashFlow) < 0 ? <ArrowDownRight className="size-4 text-destructive" /> : <ArrowUpRight className="size-4 text-emerald-600" />}Net cash flow</CardTitle></CardHeader><CardContent><p className={Number(data.financial.netCashFlow) < 0 ? "text-2xl font-semibold text-destructive" : "text-2xl font-semibold"}>{money(data.financial.netCashFlow, currency)}</p><p className="mt-1 text-xs text-muted-foreground">Collected - expenses</p></CardContent></Card>
      </div>
      <p className="text-sm text-muted-foreground">Refunds in this period: <span className="font-medium text-foreground">{money(data.financial.refunds, currency)}</span> · Net revenue after refunds: <span className="font-medium text-foreground">{money(data.financial.revenue, currency)}</span></p>
    </section>

    <section className="space-y-3">
      <div><h2 className="text-lg font-semibold">Revenue vs Expenses</h2><p className="text-sm text-muted-foreground">Monthly financial activity for {data.range.label.toLowerCase()}.</p></div>
      <Card><CardContent className="pt-5">{data.financialTrend.every((item) => Number(item.revenue) === 0 && Number(item.expenses) === 0) ? <p className="py-16 text-center text-sm text-muted-foreground">No financial activity for this period.</p> : <div className="flex h-56 items-end gap-2">{data.financialTrend.map((item) => <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="flex h-44 w-full items-end gap-1"><div className="min-w-0 flex-1 rounded-t bg-primary/80" style={{ height: `${Math.max(2, (Number(item.revenue) / maxFinancial) * 100)}%` }} title={`Revenue ${money(item.revenue, currency)}`} /><div className="min-w-0 flex-1 rounded-t bg-orange-500/80" style={{ height: `${Math.max(2, (Number(item.expenses) / maxFinancial) * 100)}%` }} title={`Expenses ${money(item.expenses, currency)}`} /></div><span className="truncate text-xs text-muted-foreground">{item.label}</span></div>)}</div>}<div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground"><span><span className="mr-1 inline-block size-2 rounded-full bg-primary/80" />Revenue</span><span><span className="mr-1 inline-block size-2 rounded-full bg-orange-500/80" />Expenses</span></div></CardContent></Card>
    </section>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Payment methods</CardTitle></CardHeader><CardContent>{data.paymentMethods.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No payments for this period.</p> : <div className="space-y-3">{data.paymentMethods.map((item) => <div key={item.method} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"><span>{label(item.method)}</span><span className="font-medium">{money(item.amount, currency)}</span></div>)}</div>}</CardContent></Card>
      <Card><CardHeader><CardTitle>Expense breakdown</CardTitle></CardHeader><CardContent>{data.expenseBreakdown.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No expenses for this period.</p> : <div className="space-y-3">{data.expenseBreakdown.map((item) => <div key={item.category} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0"><span>{label(item.category)}</span><span className="font-medium">{money(item.amount, currency)}</span></div>)}</div>}</CardContent></Card>
    </div>

    <section className="space-y-3"><h2 className="text-lg font-semibold">Membership Overview</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total members</p><p className="mt-2 text-2xl font-semibold">{data.members.total}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Active members</p><p className="mt-2 text-2xl font-semibold">{data.members.active}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">New members</p><p className="mt-2 text-2xl font-semibold">{data.members.newMembers}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Expiring in 7 days</p><p className="mt-2 text-2xl font-semibold">{data.members.expiring}</p></CardContent></Card></div></section>
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Monthly revenue</CardTitle></CardHeader><CardContent><div className="flex h-48 items-end gap-2">{data.revenueTrend.map((item) => <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="flex h-40 w-full items-end"><div className="w-full rounded-t bg-primary/80" style={{ height: `${Math.max(4, (Number(item.amount) / maxRevenue) * 100)}%` }} title={money(item.amount, currency)} /></div><span className="text-xs text-muted-foreground">{item.month}</span></div>)}</div></CardContent></Card><Card><CardHeader><CardTitle>Attendance trend</CardTitle></CardHeader><CardContent>{data.attendance.trend.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">No attendance records for this period.</p> : <div className="flex h-48 items-end gap-2">{data.attendance.trend.map((item) => <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="flex h-40 w-full items-end"><div className="w-full rounded-t bg-emerald-500/80" style={{ height: `${Math.max(4, (item.count / maxAttendance) * 100)}%` }} title={`${item.count} visits`} /></div><span className="truncate text-xs text-muted-foreground">{item.date.slice(5)}</span></div>)}</div>}</CardContent></Card></div>
    <Card><CardHeader><CardTitle>Expiring memberships</CardTitle></CardHeader><CardContent>
      {data.expiringMemberships.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No memberships expiring in the next 7 days.</p> : <Table rows={data.expiringMemberships.map((item) => [item.member, item.plan, date(item.endDate), `${item.daysRemaining} days`])} headers={["Member", "Plan", "End date", "Days remaining"]} />}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Payment collection history</CardTitle></CardHeader><CardContent>
      {data.payments.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No payment activity for this period.</p> : <Table rows={data.payments.map((payment) => [date(payment.date), payment.member, money(payment.amount, currency), label(payment.method), payment.status, payment.reference])} headers={["Date", "Member", "Amount", "Method", "Status", "Reference"]} badges />}
    </CardContent></Card>
  </div>;
}

function Table({ headers, rows, badges = false }: { headers: string[]; rows: string[][]; badges?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr>{headers.map((header) => <th key={header} className="h-10 border-b px-4 text-left font-medium text-muted-foreground">{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`${row[0]}-${rowIndex}`} className="border-b last:border-0 hover:bg-muted/50">{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="p-4">{badges && cellIndex === 4 ? <Badge variant={cell === "COMPLETED" ? "success" : "secondary"}>{cell}</Badge> : cell}</td>)}</tr>)}</tbody></table></div>;
}
