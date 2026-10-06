import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { loginSchema } from "../src/lib/validations/auth";

function requiredEnvironment(name: string) {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`${name} is required for production bootstrap.`);
  }
  return value;
}

async function main() {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      "Production bootstrap is disabled unless NODE_ENV=production."
    );
  }

  if (process.env.BOOTSTRAP_PRODUCTION !== "true") {
    throw new Error(
      "Production bootstrap requires BOOTSTRAP_PRODUCTION=true."
    );
  }

  const databaseUrl = requiredEnvironment("DATABASE_URL");
  const organizationName = requiredEnvironment("BOOTSTRAP_ORG_NAME").trim();
  const organizationSlug = requiredEnvironment("BOOTSTRAP_ORG_SLUG")
    .trim()
    .toLowerCase();
  const ownerName = requiredEnvironment("BOOTSTRAP_OWNER_NAME").trim();
  const ownerEmail = requiredEnvironment("BOOTSTRAP_OWNER_EMAIL")
    .trim()
    .toLowerCase();
  const ownerPassword = requiredEnvironment("BOOTSTRAP_OWNER_PASSWORD");

  if (!loginSchema.shape.email.safeParse(ownerEmail).success) {
    throw new Error("BOOTSTRAP_OWNER_EMAIL must be a valid email address.");
  }

  if (ownerPassword.length < 8) {
    throw new Error(
      "BOOTSTRAP_OWNER_PASSWORD must be at least 8 characters long."
    );
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const passwordHash = await bcrypt.hash(ownerPassword, 10);

    await db.$transaction(async (tx) => {
      const existingOrganization = await tx.organization.findUnique({
        where: { slug: organizationSlug },
        select: { id: true },
      });

      if (existingOrganization) {
        throw new Error(
          "Bootstrap aborted: an organization with the requested slug already exists."
        );
      }

      const existingOwner = await tx.user.findFirst({
        where: { email: ownerEmail },
        select: { id: true },
      });

      if (existingOwner) {
        throw new Error(
          "Bootstrap aborted: a user with the requested owner email already exists."
        );
      }

      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug,
        },
        select: { id: true },
      });

      await tx.user.create({
        data: {
          organizationId: organization.id,
          name: ownerName,
          email: ownerEmail,
          passwordHash,
          role: "OWNER",
          isActive: true,
        },
        select: { id: true },
      });
    });

    console.log("Production bootstrap completed.");
    console.log("");
    console.log("Organization:");
    console.log(organizationName);
    console.log("");
    console.log("Owner:");
    console.log(ownerName);
    console.log("");
    console.log("Email:");
    console.log(ownerEmail);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const rawMessage = error instanceof Error ? error.message : "";
  const isSafeMessage =
    rawMessage.startsWith("Production bootstrap is disabled") ||
    rawMessage.startsWith("Production bootstrap requires") ||
    rawMessage.startsWith("BOOTSTRAP_") ||
    rawMessage.startsWith("DATABASE_URL") ||
    rawMessage.startsWith("Bootstrap aborted:");
  const message = isSafeMessage
    ? rawMessage
    : "Production bootstrap failed without creating the requested records.";
  console.error(message);
  process.exitCode = 1;
});
