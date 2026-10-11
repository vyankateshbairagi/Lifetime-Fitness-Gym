import Link from "next/link";
import { Prisma, type PaymentMethod, type PaymentStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  CreditCard,
  IndianRupee,
  MessageCircle,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { PaymentActions } from "@/components/payments/payment-actions";
import { getPaymentReceiptUrl } from "@/lib/whatsapp";

function price(value: string) {
  const [whole, decimals] = value.split(".");
  return `₹${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${decimals ? `.${decimals}` : ".00"}`;
}

function date(value: Date) {
  const [year, month, day] = value.toISOString().slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!can(user.role, "payments:view")) redirect("/dashboard");
  const params = await searchParams;

  const search = first(params.search)?.trim() ?? "";
  const method = first(params.method);
  const status = first(params.status);
  const page = Math.max(1, Number(first(params.page) ?? "1") || 1);
  const pageSize = 20;

  const where: Prisma.PaymentWhereInput = { organizationId: user.organizationId };
  if (method) where.paymentMethod = method as PaymentMethod;
  if (status) where.status = status as PaymentStatus;
  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { receiptNumber: { contains: search, mode: "insensitive" } },
      { member: { name: { contains: search, mode: "insensitive" } } },
      { member: { phone: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [payments, total, completed, refunded, subscriptions] = await Promise.all([
    db.payment.findMany({
      where,
      orderBy: { paymentDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        paymentDate: true,
        receiptNumber: true,
        status: true,
        member: { select: { name: true, phone: true } },
        subscription: { select: { plan: { select: { name: true } } } },
      },
    }),
    db.payment.count({ where }),
    db.payment.aggregate({
      where: { organizationId: user.organizationId, status: "COMPLETED" },
      _sum: { amount: true },
    }),
    db.payment.aggregate({
      where: {
        organizationId: user.organizationId,
        status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] },
      },
      _sum: { amount: true },
    }),
    db.subscription.findMany({
      where: { organizationId: user.organizationId },
      select: {
        amount: true,
        payments: {
          where: { status: "COMPLETED" },
          select: { amount: true },
        },
      },
    }),
  ]);

  const outstanding = subscriptions.reduce(
    (sum, subscription) =>
      sum +
      Number(subscription.amount) -
      subscription.payments.reduce((paid, payment) => paid + Number(payment.amount), 0),
    0
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Money Management
          </p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-foreground">
            Payments &amp; Collections
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Complete transaction history, receipts, and cash flow for LifeTime Fitness Gym.
          </p>
        </div>

        {can(user.role, "payments:create") && (
          <Button asChild className="gap-1.5 bg-red-600 text-white hover:bg-red-500">
            <Link href="/payments/new">
              <Plus className="size-4" />
              <span>Record payment</span>
            </Link>
          </Button>
        )}
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Collected</span>
              <IndianRupee className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">
              {price(completed._sum.amount?.toString() ?? "0")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Completed collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Refunded</span>
              <RotateCcw className="size-4 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-rose-500">
              {price(refunded._sum.amount?.toString() ?? "0")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Returned fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Outstanding</span>
              <Wallet className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-amber-500">
              {price(Math.max(0, outstanding).toFixed(2))}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Uncollected subscription dues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Payments</span>
              <Receipt className="size-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">{total}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Data Table */}
      <Card>
        <CardContent className="p-0">
          <form className="flex flex-col gap-3 border-b border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search payments"
                name="search"
                defaultValue={search}
                placeholder="Search member, phone, payment ID, or receipt number"
                className="h-10 pl-9"
              />
            </div>

            <select
              aria-label="Filter by payment method"
              name="method"
              defaultValue={method ?? ""}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm shadow-sm"
            >
              <option value="">All methods</option>
              {["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE", "OTHER"].map(
                (value) => (
                  <option key={value} value={value}>
                    {value.replace(/_/g, " ")}
                  </option>
                )
              )}
            </select>

            <select
              aria-label="Filter by payment status"
              name="status"
              defaultValue={status ?? ""}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm shadow-sm"
            >
              <option value="">All statuses</option>
              {[
                "PENDING",
                "FAILED",
                "COMPLETED",
                "REFUNDED",
                "PARTIALLY_REFUNDED",
                "VOIDED",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <Button type="submit" variant="outline">
              Filter
            </Button>
          </form>

          {payments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CreditCard className="mx-auto size-8 text-muted-foreground/40 mb-2" />
              <p className="font-bold text-foreground">No payments found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Record a payment to begin building your financial history.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold text-muted-foreground">
                    <th className="h-10 px-4">Receipt</th>
                    <th className="h-10 px-4">Member</th>
                    <th className="h-10 px-4">Subscription</th>
                    <th className="h-10 px-4">Amount</th>
                    <th className="h-10 px-4">Method</th>
                    <th className="h-10 px-4">Date</th>
                    <th className="h-10 px-4">Status</th>
                    <th className="h-10 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const whatsappUrl =
                      payment.member.phone && payment.status === "COMPLETED"
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
                      <tr
                        key={payment.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <Link
                            href={`/payments/${payment.id}`}
                            className="font-mono text-xs font-bold text-foreground hover:underline"
                          >
                            {payment.receiptNumber}
                          </Link>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-foreground">{payment.member.name}</span>
                          {payment.member.phone && (
                            <p className="text-[11px] text-muted-foreground">
                              {payment.member.phone}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {payment.subscription?.plan.name ?? "—"}
                        </td>
                        <td className="whitespace-nowrap p-4 font-black text-foreground">
                          {price(payment.amount.toString())}
                        </td>
                        <td className="p-4">
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            {payment.paymentMethod.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap p-4 text-xs text-muted-foreground">
                          {date(payment.paymentDate)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              payment.status === "COMPLETED"
                                ? "success"
                                : payment.status === "REFUNDED"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-[10px] font-bold"
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                                title="Send receipt on WhatsApp"
                              >
                                <MessageCircle className="size-3.5" />
                              </a>
                            )}
                            {payment.status === "COMPLETED" && (
                              <PaymentActions
                                paymentId={payment.id}
                                amount={payment.amount.toString()}
                                canRefund={can(user.role, "payments:refund")}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/80 p-4 text-xs">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/payments?page=${page - 1}`}>Previous</Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/payments?page=${page + 1}`}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
