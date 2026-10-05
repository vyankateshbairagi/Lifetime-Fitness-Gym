import { test, expect, ownerState } from "./fixtures";

test.use({ storageState: ownerState });

test("mobile dashboard has no obvious horizontal overflow", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Total Members")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("mobile members page keeps search and primary action usable", async ({ page }) => {
  await page.goto("/members");
  await expect(page.getByLabel("Search members")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add member" })).toBeVisible();
});
