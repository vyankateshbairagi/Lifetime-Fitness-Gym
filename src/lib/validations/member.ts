import { z } from "zod";

export const memberStatusSchema = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]);

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
export function normalizeIndianMobile(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (compact.startsWith("+91")) return compact.slice(3);
  if (compact.startsWith("91") && compact.length === 12) return compact.slice(2);
  return compact;
}

export const indianMobileSchema = z
  .string()
  .transform(normalizeIndianMobile)
  .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a valid 10-digit mobile number.");

export const memberFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  phone: indianMobileSchema,
  email: z.string().trim().email("Enter a valid email address").max(160).optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  gender: optionalText(40),
  address: optionalText(300),
  emergencyContactName: optionalText(120),
  emergencyContactPhone: z.union([indianMobileSchema, z.literal("")]).optional(),
  joiningDate: z.string().min(1, "Join date is required"),
  status: memberStatusSchema,
});

export const memberUpdateSchema = memberFormSchema.extend({ id: z.string().min(1) });
export const memberCreateSchema = memberFormSchema.extend({
  planId: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required when a plan is selected.").optional().or(z.literal("")),
  paymentAmount: z.string().trim().optional().or(z.literal("")),
  paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE", "OTHER"]).optional(),
}).superRefine((value, context) => {
  if (value.planId && !value.startDate) {
    context.addIssue({ code: "custom", path: ["startDate"], message: "Start date is required when a plan is selected." });
  }
  if (value.paymentAmount && (!value.planId || !value.paymentMethod)) {
    context.addIssue({ code: "custom", path: ["paymentAmount"], message: "Select a plan and payment method before entering a payment." });
  }
  if (value.paymentAmount && !/^\d{1,8}(?:\.\d{1,2})?$/.test(value.paymentAmount)) {
    context.addIssue({ code: "custom", path: ["paymentAmount"], message: "Enter a valid payment amount." });
  }
});
export type MemberFormValues = z.infer<typeof memberFormSchema>;
export type MemberCreateValues = z.infer<typeof memberCreateSchema>;