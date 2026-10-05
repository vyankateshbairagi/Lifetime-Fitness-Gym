import { Card, CardContent } from "@/components/ui/card";
import { PlanWorkspace } from "@/components/membership-plans/plan-workspace";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function PlansPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "plans:view")) redirect("/dashboard");
  const plans = await db.membershipPlan.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, description: true, price: true, durationInDays: true, isActive: true, createdAt: true, updatedAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Catalog</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Membership Plans</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the plans offered by your gym.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <PlanWorkspace
            plans={plans.map((plan) => ({ ...plan, price: plan.price.toString(), createdAt: plan.createdAt.toISOString(), updatedAt: plan.updatedAt.toISOString() }))}
            canCreate={can(user.role, "plans:create")}
            canEdit={can(user.role, "plans:update")}
            canDeactivate={can(user.role, "plans:deactivate")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
