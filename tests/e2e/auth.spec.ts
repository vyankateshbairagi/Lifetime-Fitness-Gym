import { test, expect, e2eConfigured, login } from "./fixtures";

test.describe("authentication", () => {
  test.skip(!e2eConfigured, "E2E environment is not configured. See .env.test.example.");

  test("logs in with valid OWNER credentials", async ({ page }) => {
    await login(page, process.env.E2E_OWNER_EMAIL!, process.env.E2E_OWNER_PASSWORD!);
    await expect(page.getByText("Total Members")).toBeVisible();
  });

  test("logs in with valid STAFF credentials", async ({ browser }) => {
    const page = await browser.newPage();
    await login(page, process.env.E2E_STAFF_EMAIL!, process.env.E2E_STAFF_PASSWORD!);
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(process.env.E2E_OWNER_EMAIL!);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator('p[role="alert"]')).toHaveText("Invalid email or password.");
  });

  test("protects dashboard access when logged out", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });

  test("keeps the session after reload and supports logout", async ({ page }) => {
    await login(page, process.env.E2E_OWNER_EMAIL!, process.env.E2E_OWNER_PASSWORD!);
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByRole("button", { name: /E2E Owner/i }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  });
});
