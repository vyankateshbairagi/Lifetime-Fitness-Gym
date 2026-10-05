import { test, expect, ownerState, staffState } from "./fixtures";

test.describe("application modules", () => {
  test.use({ storageState: ownerState });

  test("loads members, searches, and validates the add-member form", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
    await page.getByLabel("Search members").fill("E2E Test Member");
    await expect(page.getByText("E2E Test Member")).toBeVisible();
    await page.getByRole("button", { name: "Add member" }).click();
    await page.getByRole("button", { name: "Add member" }).last().click();
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test("loads plans and supports plan search", async ({ page }) => {
    await page.goto("/plans");
    await expect(page.getByRole("heading", { name: "Membership Plans" })).toBeVisible();
    await page.getByLabel("Search membership plans").fill("E2E Monthly Plan");
    await expect(page.getByText("E2E Monthly Plan")).toBeVisible();
  });

  test("opens member, plan, and subscription detail pages", async ({ page }) => {
    await page.goto("/members");
    await page.locator('a[href^="/members/"]').first().click();
    await expect(page).toHaveURL(/\/members\/[^/]+$/);
    await expect(page.getByRole("heading")).toHaveCount(1);

    await page.goto("/plans");
    await page.locator('a[href^="/plans/"]').first().click();
    await expect(page).toHaveURL(/\/plans\/[^/]+$/);

    await page.goto("/subscriptions");
    const subscriptionLink = page.locator('a[href^="/subscriptions/"]').first();
    if (await subscriptionLink.count()) {
      await subscriptionLink.click();
      await expect(page).toHaveURL(/\/subscriptions\/[^/]+$/);
    }
  });

  test("loads subscriptions and payments", async ({ page }) => {
    await page.goto("/subscriptions");
    await expect(page.getByRole("heading", { name: "Subscriptions" })).toBeVisible();
    await page.goto("/payments");
    await expect(page.getByRole("heading", { name: "Payments" })).toBeVisible();
    await page.goto("/payments/new");
    await expect(page.getByRole("heading", { name: /Record payment|New payment/i })).toBeVisible();
    await page.getByRole("button", { name: /Record payment|Create payment|Save/i }).click();
    await expect(page.getByText("Subscription is required")).toBeVisible();
  });

  test("lists, filters, validates, and opens expenses", async ({ page }) => {
    await page.goto("/expenses");
    await expect(page.getByRole("heading", { name: "Expenses" })).toBeVisible();
    await expect(page.getByText("E2E AC maintenance")).toBeVisible();
    await page.getByLabel("Search expenses").fill("E2E AC maintenance");
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page).toHaveURL(/search=E2E\+AC\+maintenance/);
    await page.getByRole("link", { name: "Record expense" }).click();
    await expect(page.getByRole("heading", { name: "Record expense" })).toBeVisible();
    await page.getByRole("button", { name: "Record expense" }).click();
    await expect(page.getByText("Description is required")).toBeVisible();
    await page.locator('input[name="amount"]').fill("1500.00");
    await page.locator('select[name="category"]').selectOption("MAINTENANCE");
    await page.locator('select[name="paymentMethod"]').selectOption("CASH");
    await page.locator('input[name="title"]').fill("E2E created expense");
    await page.getByRole("button", { name: "Record expense" }).click();
    await expect(page).toHaveURL(/\/expenses$/);
  });

  test("loads attendance and supports member search", async ({ page }) => {
    await page.goto("/attendance");
    await expect(page.getByRole("heading", { name: "Attendance" })).toBeVisible();
    await page.getByPlaceholder("Search member or phone").fill("E2E Test Member");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/search=E2E\+Test\+Member/);
  });

  test("loads reports and settings", async ({ page }) => {
    await page.goto("/reports");
    await expect(page.getByRole("heading", { name: "Reports & Analytics" })).toBeVisible();
    await page.getByRole("link", { name: "This week" }).click();
    await expect(page).toHaveURL(/\/reports\?range=this-week$/);
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("staff cannot see owner-only mutation controls", async ({ browser }) => {
    const page = await browser.newPage({ storageState: staffState });
    await page.goto("/plans");
    await expect(page.getByRole("heading", { name: "Membership Plans" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add plan" })).toHaveCount(0);
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto("/expenses");
    await expect(page.getByRole("heading", { name: "Expenses" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Record expense" })).toHaveCount(1);
  });
});
