import { test, expect, ownerState } from "./fixtures";

test.use({ storageState: ownerState });

test.describe("dashboard", () => {
  test("loads the dashboard and its KPI sections", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Good morning")).toBeVisible();
    await expect(page.getByText("Total Members")).toBeVisible();
    await expect(page.getByText("Revenue Overview")).toBeVisible();
    await expect(page.getByText("Today's Attendance")).toBeVisible();
  });

  test("navigates from the sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "Members", exact: true }).first().click();
    await expect(page).toHaveURL(/\/members$/);
    await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
  });
});
