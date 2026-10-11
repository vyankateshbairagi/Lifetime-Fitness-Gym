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

import { MemberAttendanceSection } from "@/components/attendance/member-attendance-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getFeeReminderUrl, getRenewalReminderUrl, getPaymentReceiptUrl } from "@/lib/whatsapp";

function formatCurrency(amount: number, currency: string = "INR") {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: Date, timezone: string = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: timezone,
  }).format(date);
}

export default async function MemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!can(user.role, "members:view")) redirect("/dashboard");
  const { id } = await params;

  const member = await db.member.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          startDate: true,
          endDate: true,
          amount: true,
          status: true,
          plan: { select: { name: true, durationInDays: true } },
        },
      },
      payments: {
        orderBy: { paymentDate: "desc" },
        take: 10,
        select: {
          id: true,
          amount: true,
          paymentDate: true,
          paymentMethod: true,
          receiptNumber: true,
          status: true,
          subscription: { select: { id: true, plan: { select: { name: true } } } },
        },
      },
      attendance: {
        orderBy: { date: "desc" },
        take: 15,
        select: { id: true, date: true, checkInTime: true, checkOutTime: true },
      },
    },
  });

  if (!member) notFound();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalVisits, thisMonthVisits] = await Promise.all([
    db.attendance.count({ where: { organizationId: user.organizationId, memberId: member.id } }),
    db.attendance.count({
      where: { organizationId: user.organizationId, memberId: member.id, date: { gte: monthStart } },
    }),
  ]);

  const currency = user.organization.currency;
  const timezone = user.organization.timezone;
  const today = new Date();

  // Find active subscription if any
  const currentMembership = member.subscriptions.find(
    (sub) => sub.status === "ACTIVE" && new Date(sub.endDate) >= today
  ) ?? member.subscriptions[0];

  const totalFees = member.subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);
  const totalPaid = member.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalRefunded = member.payments
    .filter((p) => p.status === "REFUNDED" || p.status === "PARTIALLY_REFUNDED")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const outstanding = Math.max(0, totalFees - totalPaid + totalRefunded);

  // Expiring calculation
  let daysRemaining: number | null = null;
  if (currentMembership) {
    const end = new Date(currentMembership.endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    daysRemaining = diff;
  }

  const cleanPhone = member.phone.replace(/\D/g, "");
  const directWhatsAppUrl = `https://wa.me/91${cleanPhone.slice(-10)}`;

  const feeReminderUrl =
    outstanding > 0
      ? getFeeReminderUrl({
          phone: member.phone,
          memberName: member.name,
          planName: currentMembership?.plan.name ?? "Gym Membership",
          pendingAmount: outstanding,
        })
      : null;

  const renewalReminderUrl =
    currentMembership && daysRemaining !== null && daysRemaining <= 7
      ? getRenewalReminderUrl({
          phone: member.phone,
          memberName: member.name,
          planName: currentMembership.plan.name,
          daysRemaining,
          endDate: formatDate(new Date(currentMembership.endDate), timezone),
        })
      : null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/members"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground mb-1"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Members</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {/* Note: keep exact single h1 element for test invariant */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{member.name}</h1>
            <Badge
              variant={member.status === "ACTIVE" ? "success" : member.status === "EXPIRED" ? "warning" : "secondary"}
              className="text-xs font-bold"
            >
              {member.status}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {member.memberCode}
            </Badge>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs font-semibold">
            <a href={`tel:${member.phone}`}>
              <Phone className="size-3.5 text-muted-foreground" />
              <span>Call ({member.phone})</span>
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold"
          >
            <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-3.5" />
              <span>WhatsApp Chat</span>
            </a>
          </Button>

          {can(user.role, "payments:create") && (
            <Button size="sm" asChild className="gap-1.5 text-xs font-semibold">
              <Link href={`/payments/new${currentMembership ? `?subscriptionId=${currentMembership.id}` : ""}`}>
                <Wallet className="size-3.5" />
                <span>Record Payment</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Money Management & Financial KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Fees Incurred</span>
              <Receipt className="size-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{formatCurrency(totalFees, currency)}</div>
            <p className="mt-1 text-xs text-muted-foreground">{member.subscriptions.length} subscription terms</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Paid</span>
              <CreditCard className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-500">
              {formatCurrency(totalPaid, currency)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {member.payments.filter((p) => p.status === "COMPLETED").length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Refunded Amount</span>
              <Receipt className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-500">
              {formatCurrency(totalRefunded, currency)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalRefunded > 0 ? "Refund transactions on record" : "Zero refunds"}
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
                {outstanding > 0 ? "Outstanding Dues" : "Balance Status"}
              </span>
              {outstanding > 0 ? (
                <AlertCircle className="size-4 text-red-500" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={outstanding > 0 ? "text-2xl font-bold tracking-tight text-red-400" : "text-2xl font-bold tracking-tight text-emerald-400"}>
              {formatCurrency(outstanding, currency)}
            </div>
            <div className="mt-2">
              {outstanding > 0 && feeReminderUrl ? (
                <a
                  href={feeReminderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 underline"
                >
                  <MessageCircle className="size-3" />
                  <span>Send Fee Reminder via WhatsApp</span>
                </a>
              ) : (
                <span className="text-xs text-emerald-500/80 font-medium">All dues fully settled</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left Dossier / Right Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Personal info & Current Membership */}
        <div className="space-y-6 lg:col-span-1">
          {/* Member Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <User className="size-4 text-primary" />
                <span>Contact and Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Mobile Phone</span>
                <span className="font-semibold text-foreground">{member.phone}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Email Address</span>
                <span className="font-medium text-foreground">{member.email ?? "Not provided"}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-medium text-foreground">
                  {member.dateOfBirth ? formatDate(member.dateOfBirth, timezone) : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium text-foreground">{member.gender ?? "Not specified"}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Join Date</span>
                <span className="font-medium text-foreground">{formatDate(member.joiningDate, timezone)}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Emergency Contact</span>
                <span className="font-medium text-foreground text-right">{member.emergencyContact ?? "None"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-0.5">Address</span>
                <p className="text-xs text-foreground/80 leading-relaxed">{member.address ?? "No address registered."}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Membership Term */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-red-500" />
                <span>Current Membership Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentMembership ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-base text-foreground">{currentMembership.plan.name}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatCurrency(Number(currentMembership.amount), currency)} · {currentMembership.plan.durationInDays} days
                        </p>
                      </div>
                      <Badge variant={currentMembership.status === "ACTIVE" ? "success" : "secondary"}>
                        {currentMembership.status}
                      </Badge>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Valid From</span>
                        <span className="font-medium text-foreground">{formatDate(new Date(currentMembership.startDate), timezone)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Expires On</span>
                        <span className="font-medium text-foreground">{formatDate(new Date(currentMembership.endDate), timezone)}</span>
                      </div>
                    </div>

                    {daysRemaining !== null && (
                      <div className="mt-3 text-xs font-semibold flex items-center justify-between">
                        <span className="text-muted-foreground">Validity:</span>
                        <span className={daysRemaining <= 7 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                          {daysRemaining <= 0 ? "Expired" : `${daysRemaining} days left`}
                        </span>
                      </div>
                    )}
                  </div>

                  {renewalReminderUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full gap-2 border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold"
                    >
                      <a href={renewalReminderUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="size-3.5" />
                        <span>Send WhatsApp Renewal Reminder</span>
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  <p>No active membership plan on record.</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href={`/subscriptions?memberId=${member.id}`}>Assign Plan</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payments and Attendance */}
        <div className="space-y-6 lg:col-span-2">
          {/* Attendance Section */}
          <MemberAttendanceSection
            records={member.attendance.map((record) => ({
              ...record,
              date: record.date.toISOString(),
              checkInTime: record.checkInTime?.toISOString() ?? null,
              checkOutTime: record.checkOutTime?.toISOString() ?? null,
            }))}
            totalVisits={totalVisits}
            thisMonthVisits={thisMonthVisits}
            canUpdate={can(user.role, "attendance:update")}
          />

          {/* Payment History Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Receipt className="size-4 text-emerald-500" />
                <span>Payment History</span>
              </CardTitle>
              {can(user.role, "payments:create") && (
                <Button size="sm" variant="outline" asChild className="h-8 text-xs font-semibold">
                  <Link href={`/payments/new${currentMembership ? `?subscriptionId=${currentMembership.id}` : ""}`}>
                    + Record Payment
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {member.payments.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No payment records found for this member.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/80 bg-muted/30 text-left text-muted-foreground">
                        <th className="py-2.5 px-4 font-semibold">Receipt #</th>
                        <th className="py-2.5 px-4 font-semibold">Date</th>
                        <th className="py-2.5 px-4 font-semibold">Plan</th>
                        <th className="py-2.5 px-4 font-semibold">Amount</th>
                        <th className="py-2.5 px-4 font-semibold">Mode</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {member.payments.map((p) => {
                        const receiptShareUrl = getPaymentReceiptUrl({
                          phone: member.phone,
                          memberName: member.name,
                          amount: Number(p.amount),
                          receiptNumber: p.receiptNumber,
                          paymentMethod: p.paymentMethod,
                          planName: p.subscription?.plan.name,
                          date: formatDate(p.paymentDate, timezone),
                        });

                        return (
                          <tr key={p.id} className="hover:bg-muted/40 transition">
                            <td className="py-3 px-4 font-mono font-medium">
                              <Link href={`/payments/${p.id}`} className="hover:underline text-foreground">
                                {p.receiptNumber}
                              </Link>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                              {formatDate(p.paymentDate, timezone)}
                            </td>
                            <td className="py-3 px-4 font-medium text-foreground">
                              {p.subscription?.plan.name ?? "General"}
                            </td>
                            <td className="py-3 px-4 font-bold text-foreground">
                              {formatCurrency(Number(p.amount), currency)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-[10px] uppercase">
                                {p.paymentMethod.replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  p.status === "COMPLETED"
                                    ? "success"
                                    : p.status === "REFUNDED"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {p.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                              <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs font-semibold">
                                <Link href={`/payments/${p.id}`}>View</Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-7 px-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold"
                              >
                                <a
                                  href={receiptShareUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Share receipt on WhatsApp"
                                >
                                  <MessageCircle className="size-3" />
                                </a>
                              </Button>
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
      </div>
    </div>
  );
}
