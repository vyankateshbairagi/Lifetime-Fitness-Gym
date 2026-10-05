import { redirect } from "next/navigation";

import { ExpenseForm } from "@/components/expenses/expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

export default async function NewExpensePage() {
  const user = await getCurrentUser();
  if (!can(user.role, "expenses:create")) redirect("/expenses");
  return <div className="mx-auto max-w-2xl space-y-6"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Finance</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Record expense</h1><p className="mt-1 text-sm text-muted-foreground">Capture a gym expense with its payment and date details.</p></div><Card><CardHeader><CardTitle>Expense information</CardTitle></CardHeader><CardContent><ExpenseForm /></CardContent></Card></div>;
}
