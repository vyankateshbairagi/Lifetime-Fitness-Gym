"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type SearchResult = {
  members: Array<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    memberCode: string;
    status: string;
  }>;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    durationInDays: number;
    isActive: boolean;
  }>;
  payments: Array<{
    id: string;
    receiptNumber: string;
    amount: string;
    memberName: string;
    paymentMethod: string;
    status: string;
  }>;
  expenses: Array<{
    id: string;
    title: string;
    amount: string;
    category: string;
    status: string;
  }>;
};

export async function searchGlobal(rawQuery: string): Promise<SearchResult> {
  const user = await requireAuth();
  const query = rawQuery.trim();

  if (!query) {
    return { members: [], plans: [], payments: [], expenses: [] };
  }

  const [members, plans, payments, expenses] = await Promise.all([
    db.member.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { memberCode: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        memberCode: true,
        status: true,
      },
    }),

    db.membershipPlan.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 4,
      orderBy: { isActive: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        durationInDays: true,
        isActive: true,
      },
    }),

    db.payment.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [
          { receiptNumber: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
          { member: { name: { contains: query, mode: "insensitive" } } },
          { member: { phone: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 5,
      orderBy: { paymentDate: "desc" },
      select: {
        id: true,
        receiptNumber: true,
        amount: true,
        paymentMethod: true,
        status: true,
        member: { select: { name: true } },
      },
    }),

    db.expense.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
          { referenceNumber: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 4,
      orderBy: { expenseDate: "desc" },
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        status: true,
      },
    }),
  ]);

  return {
    members,
    plans: plans.map((p) => ({ ...p, price: p.price.toString() })),
    payments: payments.map((p) => ({
      id: p.id,
      receiptNumber: p.receiptNumber,
      amount: p.amount.toString(),
      memberName: p.member.name,
      paymentMethod: p.paymentMethod,
      status: p.status,
    })),
    expenses: expenses.map((e) => ({
      id: e.id,
      title: e.title,
      amount: e.amount.toString(),
      category: e.category,
      status: e.status,
    })),
  };
}
