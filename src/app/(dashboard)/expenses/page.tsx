import Link from "next/link";
import { Prisma, type ExpenseCategory, type ExpenseStatus, type PaymentMethod } from "@prisma/client";
import { redirect } from "next/navigation";
import { Plus, Receipt, TrendingDown, ArrowDownRight, Layers } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/shared/stat-card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

const categories = [
  "RENT",
  "ELECTRICITY",
  "WATER",
  "INTERNET",
  "EQUIPMENT",
  "EQUIPMENT_REPAIR",
  "MAINTENANCE",
  "CLEANING",
  "STAFF",
  "MARKETING",
  "SUPPLIES",
  "SOFTWARE",
  "INSURANCE",
  "TAX",
  "MISCELLANEOUS",
  "OTHER",
] as const;

const methods = ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE", "OTHER"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function money(value: Prisma.Decimal | string | number, currency: string) {
  return Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function date(value: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: timezone,
  }).format(value);
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!can(user.role, "expenses:view")) redirect("/dashboard");

  const params = await searchParams;
  const search = first(params.search)?.trim() ?? "";
  const category = first(params.category);
  const method = first(params.method);
  const status = first(params.status);
  const from = first(params.from);
  const to = first(params.to);
  const page = Math.max(1, Number(first(params.page) ?? "1") || 1);
  const pageSize = 20;

  const where: Prisma.ExpenseWhereInput = { organizationId: user.organizationId };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
      { referenceNumber: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category && categories.includes(category as typeof categories[number])) {
    where.category = category as ExpenseCategory;
  }
  if (method && methods.includes(method as typeof methods[number])) {
    where.paymentMethod = method as PaymentMethod;
  }
  if (status && ["PAID", "PENDING", "CANCELLED"].includes(status)) {
    where.status = status as ExpenseStatus;
  }
  if (from || to) {
    where.expenseDate = {
      ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
      ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
    };
  }

  const [expenses, total, aggregate] = await Promise.all([
    db.expense.findMany({
      where,
      orderBy: { expenseDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        paymentMethod: true,
        expenseDate: true,
        status: true,
        creator: { select: { name: true } },
      },
    }),
    db.expense.count({ where }),
    db.expense.aggregate({ where, _sum: { amount: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currency = user.organization.currency;
  const totalAmount = aggregate._sum.amount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-500">
            LifeTime Fitness · Finance
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track operational expenses, rent, utilities, equipment repairs, and cash outflows.
          </p>
        </div>
        {can(user.role, "expenses:create") && (
          <Button asChild className="gap-1.5 font-semibold">
            <Link href="/expenses/new">
              <Plus className="size-4" />
              <span>Record expense</span>
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Filtered total"
          value={money(totalAmount, currency)}
          tone="danger"
          subtitle="Total cash outflow under active filter"
          icon={ArrowDownRight}
        />
        <StatCard
          label="Expenses"
          value={String(total)}
          tone="brand"
          subtitle="Total expense transactions recorded"
          icon={Receipt}
        />
        <StatCard
          label="Showing"
          value={String(expenses.length)}
          tone="default"
          subtitle={`Page ${page} of ${totalPages} entries`}
          icon={Layers}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <form className="grid gap-3 border-b border-border/80 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              aria-label="Search expenses"
              name="search"
              defaultValue={search}
              placeholder="Search description or reference"
            />
            <select
              aria-label="Filter by category"
              name="category"
              defaultValue={category ?? ""}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm shadow-sm"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {label(item)}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by payment method"
              name="method"
              defaultValue={method ?? ""}
              className="border-input bg-background h-10 rounded-lg border px-3 text-sm shadow-sm"
            >
              <option value="">All methods</option>
              {methods.map((item) => (
                <option key={item} value={item}>
                  {label(item)}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Input
                aria-label="Filter expenses from date"
                type="date"
                name="from"
                defaultValue={from}
              />
              <Input
                aria-label="Filter expenses to date"
                type="date"
                name="to"
                defaultValue={to}
              />
              <Button type="submit">Filter</Button>
            </div>
          </form>

          {expenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <TrendingDown className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-2 font-semibold">No expenses found.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Record your first gym expense to start tracking operational spending and cash flow.
              </p>
              {can(user.role, "expenses:create") && (
                <Button asChild className="mt-4">
                  <Link href="/expenses/new">Record expense</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-left text-xs uppercase font-semibold text-muted-foreground">
                    <th className="h-10 px-4">Date</th>
                    <th className="h-10 px-4">Category</th>
                    <th className="h-10 px-4">Description</th>
                    <th className="h-10 px-4">Method</th>
                    <th className="h-10 px-4">Amount</th>
                    <th className="h-10 px-4">Created by</th>
                    <th className="h-10 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-muted/40 transition">
                      <td className="whitespace-nowrap p-4 text-xs text-muted-foreground">
                        {date(expense.expenseDate, user.organization.timezone)}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[11px] font-semibold uppercase">
                          {label(expense.category)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/expenses/${expense.id}`}
                          className="font-medium text-foreground hover:text-red-400 hover:underline"
                        >
                          {expense.title}
                        </Link>
                      </td>
                      <td className="p-4 text-xs font-mono">
                        {expense.paymentMethod ? label(expense.paymentMethod) : "-"}
                      </td>
                      <td className="whitespace-nowrap p-4 font-bold text-red-400">
                        {money(expense.amount, currency)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {expense.creator?.name ?? "System"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            expense.status === "PAID"
                              ? "success"
                              : expense.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {expense.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/80 p-4 text-sm">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} ({total} total expenses)
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/expenses?page=${page - 1}`}>Previous</Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/expenses?page=${page + 1}`}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
