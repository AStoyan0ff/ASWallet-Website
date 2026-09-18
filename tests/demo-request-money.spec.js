const { test, expect } = require("@playwright/test");

test.describe("ASWallet demo request money", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/demo/");
    });

    test("creates a money request without changing the wallet balance", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const amountInput = requestView.locator("[data-request-amount]");
        const reasonInput = requestView.locator("[data-request-reason]");
        const dueSelect = requestView.locator("[data-request-due]");
        const successPanel = requestView.locator("[data-request-success]");

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Maria Petrova"]').click();

        await amountInput.fill("100");
        await reasonInput.fill("Playwright dinner request");
        await dueSelect.selectOption("3-days");

        await expect(requestView.locator("[data-request-preview-name]")).toHaveText("Maria Petrova");
        await expect(requestView.locator("[data-request-preview-amount]")).toHaveText("€100.00");
        await expect(requestView.locator("[data-request-preview-reason]")).toHaveText("Playwright dinner request");
        await expect(requestView.locator("[data-request-preview-due]")).toHaveText("In 3 days");

        await requestView.locator("[data-request-submit]").click();

        await expect(successPanel).toBeVisible();
        await expect(successPanel.locator("[data-request-success-amount]")).toHaveText("€100.00");
        await expect(successPanel.locator("[data-request-success-name]")).toHaveText("Maria Petrova");
        await expect(successPanel.locator("[data-request-payment-link]")).toHaveValue(/https:\/\/aswallet\.eu\/pay\/ASW-REQ-\d+/);

        await successPanel.locator("[data-request-dashboard]").click();

        await expect(page.locator('[data-demo-view="dashboard"]')).toBeVisible();
        await expect(page.locator("[data-balance-amount]")).toContainText("€12,480.75");
    });

    test("adds a pending money request to transaction history", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const transactionsView = page.locator('[data-demo-view="transactions"]');

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Georgi Stoyanov"]').click();

        await requestView.locator("[data-request-amount]").fill("75");
        await requestView.locator("[data-request-reason]").fill("Playwright shared bill");
        await requestView.locator("[data-request-due]").selectOption("7-days");
        await requestView.locator("[data-request-submit]").click();

        await expect(requestView.locator("[data-request-success]")).toBeVisible();

        await page.locator('[data-demo-nav="transactions"]').click();

        await expect(transactionsView).toBeVisible();

        const newestTransaction = transactionsView.locator(".transaction-item").first();

        await expect(newestTransaction).toContainText("Georgi Stoyanov");
        await expect(newestTransaction).toContainText("+ €75.00");
        await expect(newestTransaction).toContainText("Pending");
    });

    test("rejects a money request with a zero amount", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const amountInput = requestView.locator("[data-request-amount]");
        const errorMessage = requestView.locator("[data-request-error]");

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Ivan Kolev"]').click();

        await amountInput.fill("0");
        await requestView.locator("[data-request-submit]").click();

        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText("Please enter an amount greater than €0.00.");
        await expect(amountInput).toHaveAttribute("aria-invalid", "true");
        await expect(amountInput).toBeFocused();
        await expect(requestView.locator("[data-request-flow]")).toBeVisible();
        await expect(requestView.locator("[data-request-success]")).not.toBeVisible();
    });

    test("updates the request preview when a quick amount is selected", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const amountInput = requestView.locator("[data-request-amount]");
        const amountChip = requestView.locator('[data-request-chip="250"]');

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Maria Petrova"]').click();
        await amountChip.click();

        await expect(amountChip).toHaveClass(/is-active/);
        await expect(amountInput).toHaveValue("250.00");
        await expect(requestView.locator("[data-request-preview-name]")).toHaveText("Maria Petrova");
        await expect(requestView.locator("[data-request-preview-amount]")).toHaveText("€250.00");
        await expect(amountInput).toBeFocused();
    });

    test("resets the form when starting a new money request", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const amountInput = requestView.locator("[data-request-amount]");
        const reasonInput = requestView.locator("[data-request-reason]");
        const dueSelect = requestView.locator("[data-request-due]");
        const successPanel = requestView.locator("[data-request-success]");

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Ivan Kolev"]').click();

        await amountInput.fill("50");
        await reasonInput.fill("Playwright reset test");
        await dueSelect.selectOption("7-days");
        await requestView.locator("[data-request-submit]").click();

        await expect(successPanel).toBeVisible();

        await successPanel.locator("[data-request-new]").dispatchEvent("click");

        await expect(successPanel).not.toBeVisible();
        await expect(requestView.locator("[data-request-flow]")).toBeVisible();
        await expect(amountInput).toHaveValue("");
        await expect(reasonInput).toHaveValue("");
        await expect(dueSelect).toHaveValue("today");
        await expect(requestView.locator('[data-request-name="Maria Petrova"]')).toHaveClass(/is-selected/);
        await expect(requestView.locator("[data-request-preview-name]")).toHaveText("Maria Petrova");
        await expect(requestView.locator("[data-request-preview-amount]")).toHaveText("€0.00");
    });

    test("copies the generated payment link", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const successPanel = requestView.locator("[data-request-success]");
        const copyButton = successPanel.locator("[data-request-copy]");
        const copyStatus = successPanel.locator("[data-request-copy-status]");
        const paymentLink = successPanel.locator("[data-request-payment-link]");

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Maria Petrova"]').click();

        await requestView.locator("[data-request-amount]").fill("125");
        await requestView.locator("[data-request-reason]").fill("Playwright copy link test");
        await requestView.locator("[data-request-submit]").click();

        await expect(successPanel).toBeVisible();
        await expect(paymentLink).toHaveValue(/https:\/\/aswallet\.eu\/pay\/ASW-REQ-\d+/);

        await copyButton.click();

        await expect(copyButton).toHaveText("Copied");
        await expect(copyButton).toHaveClass(/is-copied/);
        await expect(copyStatus).toHaveText("Payment link copied.");
        await expect(copyStatus).toHaveClass(/is-copied/);
    });

    test("creates a notification for a new money request", async ({ page }) => {

        const requestView = page.locator('[data-demo-view="request"]');
        const notificationToggle = page.locator("[data-notification-toggle]");
        const notificationBadge = page.locator("[data-notification-badge]");
        const notificationPanel = page.locator("[data-notification-panel]");
        const notificationList = page.locator("[data-notification-list]");

        await expect(notificationBadge).toHaveText("2");

        await page.locator('[data-demo-nav="request"]').click();
        await requestView.locator('[data-request-name="Ivan Kolev"]').click();

        await requestView.locator("[data-request-amount]").fill("80");
        await requestView.locator("[data-request-reason]").fill("Playwright notification test");
        await requestView.locator("[data-request-submit]").click();

        await expect(requestView.locator("[data-request-success]")).toBeVisible();
        await expect(notificationBadge).toHaveText("3");

        await notificationToggle.click();

        await expect(notificationPanel).toBeVisible();

        const newestNotification = notificationList.locator("[data-notification-id]").first();

        await expect(newestNotification).toHaveClass(/is-unread/);
        await expect(newestNotification).toContainText("Payment request created");
        await expect(newestNotification).toContainText("€80.00 requested from Ivan Kolev");
        await expect(newestNotification).toContainText("Just now");
    });

    test("marks all notifications as read", async ({ page }) => {

        const notificationToggle = page.locator("[data-notification-toggle]");
        const notificationBadge = page.locator("[data-notification-badge]");
        const notificationPanel = page.locator("[data-notification-panel]");
        const notificationList = page.locator("[data-notification-list]");
        const markAllReadButton = page.locator("[data-notification-read-all]");

        await expect(notificationBadge).toHaveText("2");

        await notificationToggle.click();

        await expect(notificationPanel).toBeVisible();
        await expect(notificationList.locator(".is-unread")).toHaveCount(2);
        await expect(markAllReadButton).toBeEnabled();
        await expect(notificationToggle).toHaveAttribute("aria-label", "Close notifications");

        await markAllReadButton.click();

        await expect(notificationList.locator(".is-unread")).toHaveCount(0);
        await expect(notificationBadge).toBeHidden();
        await expect(markAllReadButton).toBeDisabled();
        await expect(notificationToggle).toHaveAttribute("aria-label", "Close notifications");

        await notificationToggle.click();

        await expect(notificationPanel).not.toBeVisible();
        await expect(notificationToggle).toHaveAttribute("aria-expanded", "false");
        await expect(notificationToggle).toHaveAttribute("aria-label", "Open notifications");
    });
});