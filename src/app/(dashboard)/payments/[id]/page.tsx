import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, Receipt, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefundDialog } from "@/components/payments/refund-dialog";
import { PrintReceiptButton } from "@/components/payments/print-receipt-button";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getPaymentReceiptUrl } from "@/lib/whatsapp";

function date(value: Date) {
  const [year, month, day] = value.toISOString().slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function price(value: string) {
  const [whole, decimals] = value.split(".");
  return `₹${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${decimals ? `.${decimals}` : ".00"}`;
}

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!can(user.role, "payments:view")) redirect("/dashboard");
  const { id } = await params;

  const payment = await db.payment.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      member: { select: { name: true, phone: true, email: true } },
      subscription: {
        select: {
          startDate: true,
          endDate: true,
          status: true,
          amount: true,
          plan: { select: { name: true } },
        },
      },
      creator: { select: { name: true } },
      adjustments: {
        select: {
          id: true,
          amount: true,
          status: true,
          notes: true,
          createdAt: true,
        },
      },
    },
  });

  if (!payment) notFound();

  const whatsappReceiptUrl = payment.member.phone
    ? getPaymentReceiptUrl({
        phone: payment.member.phone,
        memberName: payment.member.name,
        amount: payment.amount.toString(),
        receiptNumber: payment.receiptNumber,
        paymentMethod: payment.paymentMethod,
        planName: payment.subscription?.plan.name,
        date: date(payment.paymentDate),
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/payments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Payments</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              {payment.receiptNumber}
            </h1>
            <Badge
              variant={
                payment.status === "COMPLETED"
                  ? "success"
                  : payment.status === "REFUNDED"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs font-bold"
            >
              {payment.status}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {whatsappReceiptUrl && (
            <a
              href={whatsappReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition shadow-sm"
            >
              <MessageCircle className="size-3.5" />
              <span>Share on WhatsApp</span>
            </a>
          )}

          <PrintReceiptButton />
        </div>
      </div>

      {/* Main Payment & Member Receipt Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border/80 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="size-4 text-red-500" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Amount Paid</p>
              <p className="text-2xl font-black text-foreground">
                {price(payment.amount.toString())}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Method</p>
              <p className="text-base font-bold text-foreground">
                {payment.paymentMethod.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Date</p>
              <p className="text-sm font-semibold text-foreground">
                {date(payment.paymentDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Receipt Number</p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {payment.receiptNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected By</p>
              <p className="text-sm font-semibold text-foreground">
                {payment.creator?.name ?? "Desk Staff"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                variant={
                  payment.status === "COMPLETED"
                    ? "success"
                    : payment.status === "REFUNDED"
                    ? "destructive"
                    : "secondary"
                }
                className="mt-1"
              >
                {payment.status}
              </Badge>
            </div>
            {payment.notes && (
              <div className="sm:col-span-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">Notes / Reference</p>
                <p className="text-sm text-foreground mt-0.5">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/80 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-red-500" />
              <span>Member &amp; Plan Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Member</p>
              <p className="text-lg font-bold text-foreground">{payment.member.name}</p>
              <p className="text-xs text-muted-foreground">
                Phone: {payment.member.phone} {payment.member.email ? `· ${payment.member.email}` : ""}
              </p>
            </div>

            {payment.subscription && (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {payment.subscription.plan.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {payment.subscription.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Subscription Fee:</span>
                  <span className="font-bold text-foreground">
                    {price(payment.subscription.amount.toString())}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Valid Period:</span>
                  <span className="font-medium text-foreground">
                    {date(payment.subscription.startDate)} to {date(payment.subscription.endDate)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Refund Management (Owner/Authorized) */}
      {(payment.status === "COMPLETED" || payment.status === "PARTIALLY_REFUNDED") &&
        can(user.role, "payments:refund") && (
          <RefundDialog paymentId={payment.id} amount={payment.amount.toString()} />
        )}

      {payment.adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Refund History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {payment.adjustments.map((adjustment) => (
              <div
                key={adjustment.id}
                className="flex items-center justify-between border-b pb-2 text-xs"
              >
                <span>{adjustment.notes ?? "Partial / Full Refund"}</span>
                <span className="font-bold text-rose-500">
                  {price(adjustment.amount.toString())} · {date(adjustment.createdAt)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
