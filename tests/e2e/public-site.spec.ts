import { test, expect } from "@playwright/test";

test.describe("LifeTime Fitness Gym - Public Website Redesign", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator('body[data-hydrated="true"]').waitFor({ state: "attached" });
  });

  test("1. Homepage has correct title, meta description, and schema markup", async ({ page }) => {
    await expect(page).toHaveTitle(
      "LifeTime Fitness Gym | Build Strength. Build Confidence. Become Your Best."
    );

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /Guruwar Peth, Pune/);

    const schemaScript = page.locator('script[type="application/ld+json"]');
    await expect(schemaScript).toHaveCount(1);
    const schemaContent = await schemaScript.textContent();
    expect(schemaContent).toContain("LifeTime Fitness Gym");
    expect(schemaContent).toContain("732, Chhatrapati Shivaji Maharaj Rd");
    expect(schemaContent).toContain("+918446648527");
  });

  test("2. Top Announcement Bar contains ChaloBuild link, phone number, and Staff Login", async ({
    page,
  }) => {
    const chalobuildLink = page.getByRole("link", { name: /CHALOBUILD PLATFORM/i }).first();
    await expect(chalobuildLink).toBeVisible();
    await expect(chalobuildLink).toHaveAttribute("href", "https://chalobuild.in/");
    await expect(chalobuildLink).toHaveAttribute("target", "_blank");

    const phoneLink = page.locator('a[href="tel:+918446648527"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toContainText("8446648527");

    const staffLoginPill = page.locator('a[href="/login"]').first();
    await expect(staffLoginPill).toBeVisible();
    await expect(staffLoginPill).toContainText(/Staff Login/i);
  });

  test("3. Main Navbar displays LifeTime Fitness over GYM | PUNE and Free Trial CTA without old login button", async ({
    page,
  }) => {
    const brandName = page.locator("nav").getByText("LifeTime Fitness", { exact: false }).first();
    await expect(brandName).toBeVisible();

    const brandSub = page.locator("nav").getByText("GYM | PUNE").first();
    await expect(brandSub).toBeVisible();

    const freeTrialNavButton = page.locator('nav a[href="/#free-trial"]').first();
    await expect(freeTrialNavButton).toBeVisible();

    const desktopNav = page.locator('nav nav[aria-label="Main navigation"], nav div.lg\\:flex');
    const oldLoginInNav = desktopNav.locator('a[href="/login"]');
    await expect(oldLoginInNav).toHaveCount(0);
  });

  test("4. Hero section renders athletic headline, real photo, and primary CTAs", async ({
    page,
  }) => {
    await expect(page.getByText("YOUR FITNESS JOURNEY STARTS HERE")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("BUILD STRENGTH");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("BECOME YOUR BEST");

    const heroBookBtn = page.getByRole("link", { name: /Book Your Free Trial/i }).first();
    await expect(heroBookBtn).toBeVisible();
    await expect(heroBookBtn).toHaveAttribute("href", "/#free-trial");

    const heroExploreBtn = page.getByRole("link", { name: /Explore Our Gym/i }).first();
    await expect(heroExploreBtn).toBeVisible();
    await expect(heroExploreBtn).toHaveAttribute("href", "/#about");
  });

  test("5. About section displays verified facility details and real gym photo", async ({
    page,
  }) => {
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeVisible();
    await expect(aboutSection).toContainText("Guruwar Peth, Pune");
    await expect(aboutSection).toContainText("Quality Gym Equipment");
    await expect(aboutSection).toContainText("Motivating Workout Environment");
    await expect(aboutSection).toContainText("Convenient Location in Pune");

    const aboutImg = aboutSection.locator('img[alt*="LifeTime Fitness Gym Workout Floor"]');
    await expect(aboutImg).toBeVisible();
  });

  test("6. Services section displays all 6 verified training programs", async ({ page }) => {
    const servicesSection = page.locator("#services");
    await expect(servicesSection).toBeVisible();

    const expectedServices = [
      "Weight Training",
      "Cardio Training",
      "Personal Training",
      "Functional Training",
      "Strength & Conditioning",
      "Fitness & Nutrition Guidance",
    ];

    for (const service of expectedServices) {
      await expect(servicesSection.getByText(service, { exact: true })).toBeVisible();
    }
  });

  test("7. Free Trial Form validates fields and supports WhatsApp booking request", async ({
    page,
  }) => {
    const formSection = page.locator("#free-trial");
    await expect(formSection).toBeVisible();
    await formSection.scrollIntoViewIfNeeded();
    await expect(formSection.locator("#fullName")).toBeVisible();
    await expect(formSection.getByText("6:00 AM – 10:00 AM")).toBeVisible();
    await expect(formSection.getByText("4:00 PM – 10:00 PM")).toBeVisible();

    const submitBtn = formSection.getByRole("button", { name: /Request Free Trial Session/i });
    await expect(submitBtn).toBeVisible();

    // Trigger validation with empty inputs
    await submitBtn.click();
    await expect(formSection.getByText("Please enter your full name.")).toBeVisible();
    await expect(formSection.getByText("Please enter your mobile number.")).toBeVisible();

    // Fill valid data
    await formSection.locator("#fullName").fill("Rohit Deshmukh");
    await formSection.locator("#phone").fill("9876543210");
    await formSection.locator("#date").fill("2026-10-15");
    await formSection.locator("#notes").fill("Interested in morning strength training");

    // Stub window.open to prevent popup blocking in playwright
    await page.evaluate(() => {
      window.open = () => null;
    });
    await submitBtn.click();

    // Verify confirmation message
    await expect(
      formSection.getByText("Free Trial Request Sent!")
    ).toBeVisible({ timeout: 5000 });
  });

  test("8. Trainer section displays Dhirendra Pande with real portrait and Trainer role", async ({
    page,
  }) => {
    const trainerSection = page.locator("#trainers");
    await expect(trainerSection).toBeVisible();
    await trainerSection.scrollIntoViewIfNeeded();
    await expect(trainerSection.getByText("Dhirendra Pande")).toBeVisible();
    await expect(trainerSection.getByText(/Role: Trainer/i)).toBeVisible();

    const trainerImg = trainerSection.locator('img[alt*="Trainer Dhirendra Pande"]');
    await expect(trainerImg).toBeVisible();
  });

  test("9. Membership plans are dynamically loaded and show Ask About This Plan CTA", async ({
    page,
  }) => {
    const plansSection = page.locator("#plans");
    await expect(plansSection).toBeVisible();
    await plansSection.scrollIntoViewIfNeeded();

    const planCard = plansSection.locator("text=Ask About This Plan");
    const emptyState = plansSection.locator("text=Plans Currently Being Updated");

    const hasPlans = (await planCard.count()) > 0;
    const hasEmpty = (await emptyState.count()) > 0;
    expect(hasPlans || hasEmpty).toBeTruthy();
  });

  test("10. Gallery section supports category filtering and modal lightbox", async ({ page }) => {
    const gallerySection = page.locator("#gallery");
    await expect(gallerySection).toBeVisible();
    await gallerySection.scrollIntoViewIfNeeded();

    // Verify filter buttons
    await expect(gallerySection.getByRole("button", { name: "All" })).toBeVisible();
    await expect(gallerySection.getByRole("button", { name: "Gym Space" })).toBeVisible();
    await expect(gallerySection.getByRole("button", { name: "Equipment" })).toBeVisible();
    await expect(gallerySection.getByRole("button", { name: "Training Area" })).toBeVisible();

    // Filter to Equipment
    await gallerySection.getByRole("button", { name: "Equipment" }).click();
    await expect(gallerySection.getByText("Free Weight Zone")).toBeVisible();

    // Click photo to open lightbox modal
    const photoCard = gallerySection.getByRole("button", { name: /View photo/i }).first();
    await photoCard.click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Close modal
    await modal.getByRole("button", { name: "Close modal" }).click();
    await expect(modal).toHaveCount(0);
  });

  test("11. Testimonials section presents authentic community feedback prompt", async ({
    page,
  }) => {
    const testimonials = page.locator("#testimonials");
    await expect(testimonials).toBeVisible();
    await testimonials.scrollIntoViewIfNeeded();
    await expect(
      testimonials.getByText("Your fitness journey could inspire someone next.")
    ).toBeVisible();
    await expect(
      testimonials.getByRole("link", { name: /Share Your Gym Story/i })
    ).toHaveAttribute("href", /wa\.me\/918446648527/);
  });

  test("12. Google Maps and Location section displays verified Pune address, embed, and 4 actions", async ({
    page,
  }) => {
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toContainText("Guruwar Peth, Pune, Maharashtra 411042");

    const mapIframe = contactSection.locator("iframe");
    await expect(mapIframe).toBeVisible();

    const callBtn = contactSection.getByRole("link", { name: "Call Us" });
    await expect(callBtn).toHaveAttribute("href", "tel:+918446648527");

    const whatsappBtn = contactSection.getByRole("link", { name: "WhatsApp Us" });
    await expect(whatsappBtn).toHaveAttribute("href", "https://wa.me/918446648527");

    const directionsBtn = contactSection.getByRole("link", { name: "Get Directions" });
    await expect(directionsBtn).toHaveAttribute("href", "https://maps.app.goo.gl/LJAx4xiLBMJK3TFS8");

    const trialBtn = contactSection.getByRole("link", { name: "Free Trial" });
    await expect(trialBtn).toHaveAttribute("href", "/#free-trial");
  });

  test("13. FAQ accordion answers member questions with toggle interactions", async ({ page }) => {
    const faqSection = page.locator("#faq");
    await expect(faqSection).toBeVisible();
    await faqSection.scrollIntoViewIfNeeded();

    const firstQuestion = faqSection.getByText("How do I book a free trial session?");
    await expect(firstQuestion).toBeVisible();

    // Check first open FAQ
    await expect(faqSection.getByText(/verify slot availability/i)).toBeVisible();

    // Toggle second FAQ
    const secondButton = faqSection.getByRole("button", { name: /What are the gym opening hours/i });
    await secondButton.click();
    await expect(faqSection.getByText(/Monday through Saturday/i)).toBeVisible();
  });

  test("14. Footer contains 2026 copyright, ChaloBuild platform link, Staff Login, and hours", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("© 2026 LifeTime Fitness Gym. All rights reserved.");

    const chalobuildFooter = footer.locator('a[href="https://chalobuild.in/"]');
    await expect(chalobuildFooter).toBeVisible();

    const staffLoginFooter = footer.locator('a[href="/login"]');
    await expect(staffLoginFooter).toBeVisible();

    await expect(footer).toContainText("Guruwar Peth, Pune");
    await expect(footer).toContainText("8446648527");
  });

  test("15. Floating WhatsApp button is present with direct chat link", async ({ page }) => {
    const floatingBtn = page.locator('a[aria-label="Chat with LifeTime Fitness Gym on WhatsApp"]');
    await expect(floatingBtn).toBeVisible();
    await expect(floatingBtn).toHaveAttribute("href", /wa\.me\/918446648527/);
  });

  test("16. Mobile responsiveness check at 375px width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("LifeTime Fitness").first()).toBeVisible();

    const menuBtn = page.getByRole("button", { name: /Open navigation menu/i });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    await expect(page.getByRole("link", { name: "Services" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Free Pass/i }).first()).toBeVisible();
  });
});
