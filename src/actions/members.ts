"use server";

import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { memberCreateSchema, memberUpdateSchema, type MemberFormValues } from "@/lib/validations/member";

type ActionResult = { success: boolean; message: string; fieldErrors?: Record<string, string> };

function fieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}

function toDate(value: string) { return new Date(`${value}T00:00:00.000Z`); }
function toNullable(value: string | undefined) { return value?.trim() ? value.trim() : null; }

function toEmergencyContact(input: MemberFormValues) {
  const name = input.emergencyContactName?.trim();
  const phone = input.emergencyContactPhone?.trim();
  return name || phone ? [name, phone].filter(Boolean).join(" · ") : null;
}

function memberData(input: MemberFormValues) {
  return {
    name: `${input.firstName.trim()} ${input.lastName.trim()}`,
    phone: input.phone.trim(),
    email: toNullable(input.email)?.toLowerCase() ?? null,
    gender: toNullable(input.gender),
    dateOfBirth: input.dateOfBirth ? toDate(input.dateOfBirth) : null,
    joiningDate: toDate(input.joiningDate),
    address: toNullable(input.address),
    emergencyContact: toEmergencyContact(input),
    status: input.status,
  };
}

function duplicateMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const fields = Array.isArray(error.meta?.target) ? error.meta.target.join(",") : "";
    if (fields.includes("phone")) return "This mobile number is already registered.";
    if (fields.includes("email")) return "This email is already registered.";
  }
  return null;
}

export async function createMember(input: unknown): Promise<ActionResult> {
  const user = await requireAuth();
  if (!can(user.role, "members:create")) return { success: false, message: "You do not have permission to add members." };
  const parsed = memberCreateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await db.$transaction(async (tx) => {
      const email = parsed.data.email?.trim().toLowerCase() ?? "";
      const phone = parsed.data.phone;
      const duplicate = await tx.member.findFirst({
        where: {
          organizationId: user.organizationId,
          OR: [{ phone }, ...(email ? [{ email }] : [])],
        },
        select: { phone: true, email: true },
      });
      if (duplicate?.phone === phone) throw new Error("DUPLICATE_PHONE");
      if (email && duplicate?.email === email) throw new Error("DUPLICATE_EMAIL");

      const member = await tx.member.create({
        data: { organizationId: user.organizationId, memberCode: `GYM-${randomUUID().slice(0, 8).toUpperCase()}`, ...memberData(parsed.data) },
        select: { id: true },
      });

      if (parsed.data.planId) {
        const plan = await tx.membershipPlan.findFirst({
          where: { id: parsed.data.planId, organizationId: user.organizationId, isActive: true },
          select: { id: true, price: true, durationInDays: true },
        });
        if (!plan) throw new Error("PLAN_NOT_FOUND_OR_INACTIVE");
        const start = new Date(`${parsed.data.startDate}T00:00:00.000Z`);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + plan.durationInDays - 1);
        const subscription = await tx.subscription.create({
          data: { organizationId: user.organizationId, memberId: member.id, planId: plan.id, startDate: start, endDate: end, amount: plan.price, status: "ACTIVE" },
          select: { id: true },
        });
        if (parsed.data.paymentAmount) {
          const paymentAmount = new Prisma.Decimal(parsed.data.paymentAmount);
          if (paymentAmount.greaterThan(plan.price) || paymentAmount.lessThanOrEqualTo(0)) throw new Error("INVALID_INITIAL_PAYMENT");
          await tx.payment.create({
            data: {
              organizationId: user.organizationId,
              memberId: member.id,
              subscriptionId: subscription.id,
              amount: paymentAmount,
              paymentMethod: parsed.data.paymentMethod!,
              paymentDate: new Date(),
              receiptNumber: `PAY-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
              status: "COMPLETED",
              createdBy: user.id,
            },
          });
        }
      }
    });
    revalidatePath("/members");
    return { success: true, message: "Member added successfully" };
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_PHONE") return { success: false, message: "This mobile number is already registered.", fieldErrors: { phone: "This mobile number is already registered." } };
    if (error instanceof Error && error.message === "DUPLICATE_EMAIL") return { success: false, message: "This email is already registered.", fieldErrors: { email: "This email is already registered." } };
    if (error instanceof Error && error.message === "PLAN_NOT_FOUND_OR_INACTIVE") return { success: false, message: "Selected membership plan is inactive or unavailable.", fieldErrors: { planId: "Select an active membership plan." } };
    if (error instanceof Error && error.message === "INVALID_INITIAL_PAYMENT") return { success: false, message: "Payment cannot exceed the selected plan amount.", fieldErrors: { paymentAmount: "Payment cannot exceed the selected plan amount." } };
    const duplicate = duplicateMessage(error);
    return duplicate ? { success: false, message: duplicate } : { success: false, message: "Unable to add member right now." };
  }
}

export async function updateMember(input: unknown): Promise<ActionResult> {
  const user = await requireAuth();
  if (!can(user.role, "members:update")) return { success: false, message: "You do not have permission to update members." };
  const parsed = memberUpdateSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const { id, ...values } = parsed.data;
  try {
    const email = values.email?.trim().toLowerCase() ?? "";
    const duplicate = await db.member.findFirst({
      where: { organizationId: user.organizationId, NOT: { id }, OR: [{ phone: values.phone }, ...(email ? [{ email }] : [])] },
      select: { phone: true, email: true },
    });
    if (duplicate?.phone === values.phone) return { success: false, message: "This mobile number is already registered.", fieldErrors: { phone: "This mobile number is already registered." } };
    if (email && duplicate?.email === email) return { success: false, message: "This email is already registered.", fieldErrors: { email: "This email is already registered." } };
    const result = await db.member.updateMany({ where: { id, organizationId: user.organizationId }, data: memberData(values) });
    if (result.count !== 1) return { success: false, message: "Member not found." };
    revalidatePath("/members");
    revalidatePath(`/members/${id}`);
    return { success: true, message: "Member updated successfully" };
  } catch (error) {
    const duplicate = duplicateMessage(error);
    return duplicate ? { success: false, message: duplicate } : { success: false, message: "Unable to update member right now." };
  }
}

export async function deactivateMember(id: unknown): Promise<ActionResult> {
  const user = await requireAuth();
  if (!can(user.role, "members:deactivate")) return { success: false, message: "Only owners can deactivate members." };
  if (typeof id !== "string" || !id.trim()) return { success: false, message: "Member not found." };
  try {
    const result = await db.member.updateMany({ where: { id, organizationId: user.organizationId }, data: { status: "INACTIVE" } });
    if (result.count !== 1) return { success: false, message: "Member not found." };
    revalidatePath("/members");
    revalidatePath(`/members/${id}`);
    return { success: true, message: "Member deactivated successfully" };
  } catch { return { success: false, message: "Unable to deactivate member right now." }; }
}