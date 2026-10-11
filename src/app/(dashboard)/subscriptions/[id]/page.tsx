import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getFeeReminderUrl, getRenewalReminderUrl } from "@/lib/whatsapp";

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function priceLabel(value: string | number) {
  return Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function displayStatus(status: string, startDate: Date, endDate: Date) {
  if (status === "CANCELLED") return "CANCELLED";
  const today = new Date().toISOString().slice(0, 10);
  if (dateKey(endDate) < today) return "EXPIRED";
  if (dateKey(startDate) > today) return "UPCOMING";
  return "ACTIVE";
}

export default async function SubscriptionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!can(user.role, "subscriptions:view")) redirect("/dashboard");
  const { id } = await params;

  const subscription = await db.subscription.findFirst({
    where: { id, organizationId: user.organizationId },
    select: {
      id: true,
      memberId: true,
      startDate: true,
      endDate: true,
      amount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      member: { select: { id: true, name: true, phone: true } },
      plan: { select: { name: true, durationInDays: true, isActive: true } },
      payments: {
        orderBy: { paymentDate: "desc" },
        select: {
          id: true,
          amount: true,
          paymentDate: true,
          paymentMethod: true,
          receiptNumber: true,
          status: true,
        },
      },
    },
  });

  if (!subscription) notFound();

  const status = displayStatus(subscription.status, subscription.startDate, subscription.endDate);
  const paid = subscription.payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const refunded = subscription.payments
    .filter((payment) => payment.status === "REFUNDED" || payment.status === "PARTIALLY_REFUNDED")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const outstanding = Math.max(0, Number(subscription.amount) - paid + refunded);

  const today = new Date();
  const diffDays = Math.ceil((subscription.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const feeReminderUrl =
    outstanding > 0
      ? getFeeReminderUrl({
          phone: subscription.member.phone,
          memberName: subscription.member.name,
          planName: subscription.plan.name,
          pendingAmount: outstanding,
        })
      : null;

  const renewalReminderUrl =
    status === "ACTIVE" && diffDays <= 7
      ? getRenewalReminderUrl({
          phone: subscription.member.phone,
          memberName: subscription.member.name,
          planName: subscription.plan.name,
          daysRemaining: diffDays,
          endDate: formatDate(subscription.endDate),
        })
      : null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground mb-1"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Subscriptions</span>
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {subscription.plan.name} Membership
            </h1>
            <Badge
              variant={
                status === "ACTIVE"
                  ? "success"
                  : status === "CANCELLED"
                  ? "destructive"
                  : status === "UPCOMING"
                  ? "warning"
                  : "secondary"
              }
              className="text-xs font-bold"
            >
              {status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {outstanding > 0 && can(user.role, "payments:create") && (
              <Button size="sm" asChild className="gap-1.5 text-xs font-semibold">
                <Link href={`/payments/new?subscriptionId=${subscription.id}`}>
                  <Wallet className="size-3.5" />
                  <span>Record Payment</span>
                </Link>
              </Button>
            )}

            {feeReminderUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5 border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold"
              >
                <a href={feeReminderUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-3.5" />
                  <span>Send Due Reminder (WhatsApp)</span>
                </a>
              </Button>
            )}

            {renewalReminderUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold"
              >
                <a href={renewalReminderUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-3.5" />
                  <span>Send Renewal Notice (WhatsApp)</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Subscription Fee</span>
              <Receipt className="size-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{priceLabel(subscription.amount.toString())}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {subscription.plan.name} ({subscription.plan.durationInDays} days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Paid</span>
              <CreditCard className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-500">{priceLabel(paid.toFixed(2))}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {subscription.payments.filter((p) => p.status === "COMPLETED").length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            outstanding > 0
              ? "border-red-500/40 bg-gradient-to-br from-red-950/20 to-card"
              : "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-card"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span className={outstanding > 0 ? "text-red-400" : "text-emerald-400"}>
                {outstanding > 0 ? "Outstanding Due" : "Payment Status"}
              </span>
              {outstanding > 0 ? (
                <AlertCircle className="size-4 text-red-500" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={outstanding > 0 ? "text-2xl font-bold text-red-400" : "text-2xl font-bold text-emerald-400"}>
              {priceLabel(outstanding.toFixed(2))}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {outstanding > 0 ? "Pending member balance" : "Fully settled in full"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Terms & Member Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Subscription terms</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 text-sm">
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs text-muted-foreground block">Member</span>
            <Link
              href={`/members/${subscription.member.id}`}
              className="font-bold text-foreground hover:text-red-400 hover:underline"
            >
              {subscription.member.name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{subscription.member.phone}</p>
          </div>
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs text-muted-foreground block">Plan</span>
            <span className="font-semibold text-foreground">{subscription.plan.name}</span>
          </div>
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs text-muted-foreground block">Start date</span>
            <span className="font-medium text-foreground">{formatDate(subscription.startDate)}</span>
          </div>
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs text-muted-foreground block">End date</span>
            <span className="font-medium text-foreground">{formatDate(subscription.endDate)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Validity status</span>
            <span className={diffDays <= 7 ? "font-bold text-amber-400" : "font-bold text-emerald-400"}>
              {diffDays <= 0 ? "Expired" : `${diffDays} days remaining`}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Payment count</span>
            <span className="font-medium text-foreground">{subscription.payments.length} transactions</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold">Payment history</CardTitle>
          {outstanding > 0 && can(user.role, "payments:create") && (
            <Button size="sm" variant="outline" asChild className="h-8 text-xs font-semibold">
              <Link href={`/payments/new?subscriptionId=${subscription.id}`}>+ Add Payment</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {subscription.payments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No payments recorded for this subscription yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-left text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subscription.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/40 transition">
                      <td className="py-3 px-3 font-mono font-medium">
                        <Link href={`/payments/${payment.id}`} className="hover:underline text-foreground">
                          {payment.receiptNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 px-3 font-bold text-emerald-500">
                        {priceLabel(payment.amount.toString())}
                      </td>
                      <td className="py-3 px-3 font-mono">{payment.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            payment.status === "COMPLETED"
                              ? "success"
                              : payment.status === "REFUNDED"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                          <Link href={`/payments/${payment.id}`}>View Receipt</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}