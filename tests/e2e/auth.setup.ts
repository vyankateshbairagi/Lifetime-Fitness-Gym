import fs from "node:fs/promises";
import path from "node:path";
import { test as setup } from "@playwright/test";

import { e2eConfigured, login, ownerState, staffState } from "./fixtures";

setup("authenticate owner", async ({ page }, testInfo) => {
  await fs.mkdir(path.dirname(ownerState), { recursive: true });
  if (!e2eConfigured) {
    await fs.writeFile(ownerState, JSON.stringify({ cookies: [], origins: [] }));
    testInfo.skip(true, "E2E environment is not configured. See .env.test.example.");
  }
  await login(page, process.env.E2E_OWNER_EMAIL!, process.env.E2E_OWNER_PASSWORD!);
  await page.context().storageState({ path: ownerState });
});

setup("authenticate staff", async ({ page }, testInfo) => {
  await fs.mkdir(path.dirname(staffState), { recursive: true });
  if (!e2eConfigured) {
    await fs.writeFile(staffState, JSON.stringify({ cookies: [], origins: [] }));
    testInfo.skip(true, "E2E environment is not configured. See .env.test.example.");
  }
  await login(page, process.env.E2E_STAFF_EMAIL!, process.env.E2E_STAFF_PASSWORD!);
  await page.context().storageState({ path: staffState });
});
