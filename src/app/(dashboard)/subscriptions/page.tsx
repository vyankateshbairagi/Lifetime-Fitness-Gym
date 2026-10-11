import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionWorkspace } from "@/components/subscriptions/subscription-workspace";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function SubscriptionsPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "subscriptions:view")) redirect("/dashboard");

  const [subscriptions, members, plans] = await Promise.all([
    db.subscription.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        memberId: true,
        planId: true,
        startDate: true,
        endDate: true,
        amount: true,
        status: true,
        member: { select: { name: true, phone: true } },
        plan: { select: { name: true } },
        payments: {
          select: { amount: true, status: true, originalPaymentId: true },
        },
      },
    }),
    db.member.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true },
    }),
    db.membershipPlan.findMany({
      where: { organizationId: user.organizationId, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, durationInDays: true },
    }),
  ]);

  const subscriptionsWithFinancials = subscriptions.map((subscription) => {
    const paid = subscription.payments
      .filter((p) => p.originalPaymentId === null && p.status === "COMPLETED")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const refunded = subscription.payments
      .filter(
        (p) =>
          p.originalPaymentId !== null &&
          (p.status === "REFUNDED" || p.status === "PARTIALLY_REFUNDED")
      )
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const outstanding = Math.max(0, Number(subscription.amount) - paid + refunded);

    return {
      id: subscription.id,
      memberId: subscription.memberId,
      planId: subscription.planId,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
      amount: subscription.amount.toString(),
      status: subscription.status,
      member: subscription.member,
      plan: subscription.plan,
      paid,
      outstanding,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-500">
          LifeTime Fitness · Memberships
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage member membership lifecycles, active periods, and fee collection balances.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          <SubscriptionWorkspace
            subscriptions={subscriptionsWithFinancials}
            members={members}
            plans={plans.map((plan) => ({ ...plan, price: plan.price.toString() }))}
            canCreate={can(user.role, "subscriptions:create")}
            canCancel={can(user.role, "subscriptions:cancel")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
