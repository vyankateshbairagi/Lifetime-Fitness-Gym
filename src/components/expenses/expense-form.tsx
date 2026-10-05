"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { createExpense } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { expenseCategories, expenseSchema, type ExpenseFormValues } from "@/lib/validations/expense";

const paymentMethods = ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE", "OTHER"] as const;

export function ExpenseForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { amount: "", category: undefined, paymentMethod: undefined, expenseDate: new Date().toISOString().slice(0, 10), title: "", referenceNumber: "", notes: "", status: "PAID" },
  });

  const submit = (values: ExpenseFormValues) => startTransition(async () => {
    setServerError("");
    const result = await createExpense(values);
    if (!result.success) {
      setServerError(result.message);
      Object.entries(result.fieldErrors ?? {}).forEach(([field, message]) => setError(field as keyof ExpenseFormValues, { message }));
      return;
    }
    router.push("/expenses");
    router.refresh();
  });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <label className="space-y-1.5 text-sm"><span className="font-medium">Amount *</span><Input type="text" inputMode="decimal" placeholder="0.00" {...register("amount")} aria-invalid={Boolean(errors.amount)} />{errors.amount && <span className="text-xs text-destructive">{errors.amount.message}</span>}</label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Category *</span><select {...register("category")} className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm shadow-sm"><option value="">Select category</option>{expenseCategories.map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}</select>{errors.category && <span className="text-xs text-destructive">{errors.category.message}</span>}</label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Payment method *</span><select {...register("paymentMethod")} className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm shadow-sm"><option value="">Select payment method</option>{paymentMethods.map((method) => <option key={method} value={method}>{method.replaceAll("_", " ")}</option>)}</select>{errors.paymentMethod && <span className="text-xs text-destructive">{errors.paymentMethod.message}</span>}</label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Expense date *</span><Input type="date" {...register("expenseDate")} aria-invalid={Boolean(errors.expenseDate)} />{errors.expenseDate && <span className="text-xs text-destructive">{errors.expenseDate.message}</span>}</label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Description *</span><Input placeholder="e.g. AC maintenance" {...register("title")} aria-invalid={Boolean(errors.title)} />{errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}</label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Reference number</span><Input {...register("referenceNumber")} /></label>
      <label className="space-y-1.5 text-sm"><span className="font-medium">Notes</span><textarea {...register("notes")} className="border-input bg-background min-h-24 w-full rounded-lg border px-3 py-2 text-sm shadow-sm" /></label>
      {serverError && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">{serverError}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button><Button type="submit" disabled={isPending}>{isPending ? "Recording..." : "Record expense"}</Button></div>
    </form>
  );
}
