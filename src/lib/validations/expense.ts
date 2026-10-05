import { z } from "zod";

export const expenseCategories = ["RENT", "ELECTRICITY", "WATER", "INTERNET", "EQUIPMENT", "EQUIPMENT_REPAIR", "MAINTENANCE", "CLEANING", "STAFF", "MARKETING", "SUPPLIES", "SOFTWARE", "INSURANCE", "TAX", "MISCELLANEOUS", "OTHER"] as const;
export const expenseStatuses = ["PAID", "PENDING", "CANCELLED"] as const;
export const expenseSchema = z.object({
  category: z.enum(expenseCategories),
  amount: z.string().trim().regex(/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/, "Enter a valid amount").refine((value) => Number(value) > 0, "Amount must be greater than zero"),
  title: z.string().trim().min(1, "Description is required").max(200, "Description is too long"),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expense date is required"),
  paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE", "OTHER"], { message: "Payment method is required" }),
  referenceNumber: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(expenseStatuses).optional(),
});
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
