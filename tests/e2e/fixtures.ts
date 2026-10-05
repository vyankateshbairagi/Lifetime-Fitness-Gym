import { test as base, expect, type Page } from "@playwright/test";

export const e2eConfigured = Boolean(
  process.env.E2E_DATABASE_URL &&
  process.env.E2E_SESSION_SECRET &&
  process.env.E2E_OWNER_EMAIL &&
  process.env.E2E_OWNER_PASSWORD &&
  process.env.E2E_STAFF_EMAIL &&
  process.env.E2E_STAFF_PASSWORD
);

export const ownerState = "tests/e2e/.auth/owner.json";
export const staffState = "tests/e2e/.auth/staff.json";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 });
}

export const test = base.extend({
  page: async ({ page }, runFixture, testInfo) => {
    testInfo.skip(!e2eConfigured, "E2E environment is not configured. See .env.test.example.");
    await runFixture(page);
  },
});

export { expect };
