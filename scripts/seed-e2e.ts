import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.E2E_DATABASE_URL) {
  throw new Error("E2E_DATABASE_URL is required. Refusing to seed without a dedicated database.");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.E2E_DATABASE_URL }),
});
const ownerEmail = process.env.E2E_OWNER_EMAIL ?? "e2e-owner@gymflow.test";
const ownerPassword = process.env.E2E_OWNER_PASSWORD ?? "e2e-test-password";
const staffEmail = process.env.E2E_STAFF_EMAIL ?? "e2e-staff@gymflow.test";
const staffPassword = process.env.E2E_STAFF_PASSWORD ?? "e2e-test-password";

async function main() {
  const organization = await db.organization.upsert({
    where: { slug: "gymflow-e2e" },
    update: { name: "GymFlow E2E Test Gym" },
    create: { name: "GymFlow E2E Test Gym", slug: "gymflow-e2e", email: "e2e@gymflow.test" },
  });
  const [ownerHash, staffHash] = await Promise.all([
    bcrypt.hash(ownerPassword, 10),
    bcrypt.hash(staffPassword, 10),
  ]);
  await db.user.upsert({
    where: { organizationId_email: { organizationId: organization.id, email: ownerEmail } },
    update: { passwordHash: ownerHash, isActive: true, role: "OWNER", name: "E2E Owner" },
    create: { organizationId: organization.id, email: ownerEmail, passwordHash: ownerHash, role: "OWNER", name: "E2E Owner" },
  });
  await db.user.upsert({
    where: { organizationId_email: { organizationId: organization.id, email: staffEmail } },
    update: { passwordHash: staffHash, isActive: true, role: "STAFF", name: "E2E Staff" },
    create: { organizationId: organization.id, email: staffEmail, passwordHash: staffHash, role: "STAFF", name: "E2E Staff" },
  });

  const plan = await db.membershipPlan.findFirst({ where: { organizationId: organization.id, name: "E2E Monthly Plan" } });
  if (!plan) {
    await db.membershipPlan.create({
      data: { organizationId: organization.id, name: "E2E Monthly Plan", durationInDays: 30, price: 1000, description: "Dedicated Playwright test plan" },
    });
  }
  await db.member.upsert({
    where: { organizationId_memberCode: { organizationId: organization.id, memberCode: "E2E-0001" } },
    update: { name: "E2E Test Member", phone: "9000000001", status: "ACTIVE" },
    create: { organizationId: organization.id, memberCode: "E2E-0001", name: "E2E Test Member", phone: "9000000001", email: "member@gymflow.test" },
  });
  const existingExpense = await db.expense.findFirst({ where: { organizationId: organization.id, title: "E2E AC maintenance" } });
  if (!existingExpense) {
    await db.expense.create({
      data: {
        organizationId: organization.id,
        title: "E2E AC maintenance",
        amount: "1500.00",
        category: "MAINTENANCE",
        paymentMethod: "CASH",
        expenseDate: new Date("2026-01-15T00:00:00.000Z"),
        status: "PAID",
        notes: "Dedicated Playwright expense fixture",
        createdBy: ownerEmail ? (await db.user.findUnique({ where: { organizationId_email: { organizationId: organization.id, email: ownerEmail } }, select: { id: true } }))?.id : null,
      },
    });
  }
  console.log("Seeded dedicated GymFlow E2E organization, users, plan, and member.");
}

main().finally(() => db.$disconnect());
