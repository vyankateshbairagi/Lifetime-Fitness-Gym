"use server";

import { Prisma, type ExpenseCategory, type ExpenseStatus, type PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { expenseSchema } from "@/lib/validations/expense";

type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}

function dateOnly(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createExpense(input: unknown): Promise<ActionResult> {
  const user = await requireAuth();
  if (!can(user.role, "expenses:create")) {
    return { success: false, message: "You do not have permission to record expenses." };
  }

  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }

  const expenseDate = dateOnly(parsed.data.expenseDate);
  if (!expenseDate) {
    return { success: false, message: "Please enter a valid expense date.", fieldErrors: { expenseDate: "Enter a valid date." } };
  }

  try {
    await db.$transaction(async (tx) => {
      const created = await tx.expense.create({
        data: {
          organizationId: user.organizationId,
          title: parsed.data.title.trim(),
          amount: new Prisma.Decimal(parsed.data.amount),
          category: parsed.data.category,
          expenseDate,
          paymentMethod: parsed.data.paymentMethod,
          referenceNumber: parsed.data.referenceNumber?.trim() || null,
          notes: parsed.data.notes?.trim() || null,
          status: parsed.data.status ?? "PAID",
          createdBy: user.id,
        },
        select: { id: true, amount: true, category: true, paymentMethod: true, status: true },
      });

      await tx.auditLog.create({
        data: {
          organizationId: user.organizationId,
          userId: user.id,
          action: "EXPENSE_CREATED",
          entity: "Expense",
          entityId: created.id,
          newData: {
            amount: created.amount.toString(),
            category: created.category,
            paymentMethod: created.paymentMethod,
            status: created.status,
          },
        },
      });

      return created;
    });

    revalidatePath("/expenses");
    revalidatePath("/reports");
    revalidatePath("/dashboard");
    return { success: true, message: "Expense recorded successfully." };
  } catch {
    return { success: false, message: "Unable to record the expense. Please try again." };
  }
}

export async function updateExpense(input: unknown): Promise<ActionResult> {
  const user = await requireAuth();
  if (!can(user.role, "expenses:adjust")) {
    return { success: false, message: "You do not have permission to adjust expenses." };
  }

  const parsedInput = expenseSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsedInput.error) };
  }

  const expenseId = typeof input === "object" && input !== null && "id" in input && typeof input.id === "string" ? input.id : "";
  if (!expenseId) return { success: false, message: "Expense not found." };
  const expenseDate = dateOnly(parsedInput.data.expenseDate);
  if (!expenseDate) return { success: false, message: "Please enter a valid expense date.", fieldErrors: { expenseDate: "Enter a valid date." } };

  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await tx.expense.findFirst({ where: { id: expenseId, organizationId: user.organizationId } });
      if (!existing) throw new Error("EXPENSE_NOT_FOUND");
      const updated = await tx.expense.update({
        where: { id: existing.id },
        data: {
          title: parsedInput.data.title.trim(),
          amount: new Prisma.Decimal(parsedInput.data.amount),
          category: parsedInput.data.category,
          expenseDate,
          paymentMethod: parsedInput.data.paymentMethod,
          referenceNumber: parsedInput.data.referenceNumber?.trim() || null,
          notes: parsedInput.data.notes?.trim() || null,
          status: parsedInput.data.status ?? "PAID",
        },
        select: { id: true, amount: true, category: true, status: true },
      });
      await tx.auditLog.create({
        data: {
          organizationId: user.organizationId,
          userId: user.id,
          action: "EXPENSE_UPDATED",
          entity: "Expense",
          entityId: updated.id,
          oldData: { amount: existing.amount.toString(), category: existing.category, status: existing.status },
          newData: { amount: updated.amount.toString(), category: updated.category, status: updated.status },
        },
      });
      return updated;
    });
    revalidatePath("/expenses");
    revalidatePath(`/expenses/${result.id}`);
    revalidatePath("/reports");
    revalidatePath("/dashboard");
    return { success: true, message: "Expense updated successfully." };
  } catch (error) {
    if (error instanceof Error && error.message === "EXPENSE_NOT_FOUND") return { success: false, message: "Expense not found." };
    return { success: false, message: "Unable to update the expense. Please try again." };
  }
}

export type ExpenseFilter = {
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  status?: ExpenseStatus;
};
