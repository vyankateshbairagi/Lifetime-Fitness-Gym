import { notFound, redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

function money(value: Prisma.Decimal, currency: string) { return Number(value).toLocaleString("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }); }
function label(value: string) { return value.replaceAll("_", " "); }
function date(value: Date, timezone: string) { return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(value); }

export default async function ExpenseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!can(user.role, "expenses:view")) redirect("/dashboard");
  const { id } = await params;
  const expense = await db.expense.findFirst({ where: { id, organizationId: user.organizationId }, select: { id: true, title: true, amount: true, category: true, paymentMethod: true, expenseDate: true, referenceNumber: true, notes: true, status: true, createdAt: true, updatedAt: true, creator: { select: { name: true, email: true } } } });
  if (!expense) notFound();
  return <div className="space-y-6"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Expense details</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{expense.title}</h1><p className="mt-1 text-sm text-muted-foreground">Recorded {date(expense.createdAt, user.organization.timezone)}</p></div><Card><CardHeader><CardTitle>Expense information</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Amount</p><p className="text-2xl font-semibold">{money(expense.amount, user.organization.currency)}</p></div><div><p className="text-xs text-muted-foreground">Status</p><Badge variant={expense.status === "PAID" ? "success" : expense.status === "CANCELLED" ? "destructive" : "secondary"}>{expense.status}</Badge></div><div><p className="text-xs text-muted-foreground">Category</p><p>{label(expense.category)}</p></div><div><p className="text-xs text-muted-foreground">Payment method</p><p>{expense.paymentMethod ? label(expense.paymentMethod) : "-"}</p></div><div><p className="text-xs text-muted-foreground">Expense date</p><p>{date(expense.expenseDate, user.organization.timezone)}</p></div><div><p className="text-xs text-muted-foreground">Reference</p><p>{expense.referenceNumber ?? "-"}</p></div><div><p className="text-xs text-muted-foreground">Created by</p><p>{expense.creator?.name ?? "System"}{expense.creator?.email ? ` · ${expense.creator.email}` : ""}</p></div><div className="sm:col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p>{expense.notes ?? "-"}</p></div></CardContent></Card></div>;
}
