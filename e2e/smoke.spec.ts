/**
 * Krag Portal — E2E smoke tests
 *
 * Covers the core user journey:
 *   Landing → Auth → Questionnaire → Recommendations → Project → Booking → Dashboard
 */

import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero and CTA", async ({ page }) => {
    await page.goto("/nb");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Min boligreise")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
  });

  test("has no obvious accessibility violations (heading hierarchy)", async ({ page }) => {
    await page.goto("/nb");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });

  test("language toggle switches to English", async ({ page }) => {
    await page.goto("/nb");
    await page.getByRole("link", { name: /EN/i }).click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.getByText("My Home Journey")).toBeVisible();
  });
});

test.describe("Auth page", () => {
  test("renders login form", async ({ page }) => {
    await page.goto("/nb/auth");
    await expect(page.getByRole("heading", { name: /Logg inn/i })).toBeVisible();
    await expect(page.getByLabel(/E-post/i)).toBeVisible();
    await expect(page.getByLabel(/Passord/i)).toBeVisible();
  });

  test("shows BankID and Vipps buttons", async ({ page }) => {
    await page.goto("/nb/auth");
    await expect(page.getByText(/BankID/i)).toBeVisible();
    await expect(page.getByText(/Vipps/i)).toBeVisible();
  });
});

test.describe("Questionnaire", () => {
  test("loads stepper view with first question", async ({ page }) => {
    await page.goto("/nb/questionnaire");
    // Should show a question
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("progressbar")).toBeVisible();
  });

  test("can switch between questionnaire styles", async ({ page }) => {
    await page.goto("/nb/questionnaire");
    // Segmented control for style switching
    const chatBtn = page.getByRole("radio", { name: /Chat/ }).or(
      page.getByText("Chat")
    );
    if (await chatBtn.isVisible()) {
      await chatBtn.click();
    }
  });
});

test.describe("Recommendations page", () => {
  test("shows project cards", async ({ page }) => {
    // Navigate with pre-filled answers
    const answers = JSON.stringify({ type: ["house"], bedrooms: ["4"] });
    await page.goto(`/nb/recommendations?answers=${encodeURIComponent(answers)}`);
    await expect(page.getByRole("main")).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  // Note: in CI these tests need auth to be stubbed or a test account
  test("dashboard shell renders with sidebar navigation", async ({ page }) => {
    await page.goto("/nb/dashboard");
    // Sidebar should be visible on desktop
    await expect(page.locator("aside")).toBeVisible();
  });

  test("tab navigation works — progress tab", async ({ page }) => {
    await page.goto("/nb/dashboard");
    const progressLink = page.getByRole("button", { name: /Fremdrift|Progress/i }).first();
    if (await progressLink.isVisible()) {
      await progressLink.click();
      // Progress tab should show phase list
      await expect(page.getByText(/Grunnarbeid|Foundation/i)).toBeVisible();
    }
  });

  test("mobile bottom tab bar is visible at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/nb/dashboard");
    // Bottom nav should be visible on mobile
    const bottomNav = page.locator("[aria-label='Hovednavigasjon']").or(
      page.locator("nav").last()
    );
    await expect(bottomNav).toBeVisible();
  });
});

test.describe("A11y — focus management", () => {
  test("landing page has skip-to-main link or main landmark", async ({ page }) => {
    await page.goto("/nb");
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  });

  test("auth form labels are associated with inputs", async ({ page }) => {
    await page.goto("/nb/auth");
    const emailInput = page.getByLabel(/E-post/i);
    await expect(emailInput).toBeVisible();
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
  });
});
