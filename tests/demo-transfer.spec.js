const { test, expect } = require("@playwright/test");

test.describe("ASWallet demo transfer", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/demo/");
    });

    test("completes a transfer and updates the wallet balance", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const referenceInput = transferView.locator("[data-reference-input]");
        const reviewPanel = transferView.locator('[data-transfer-panel="3"]');
        const successPanel = transferView.locator('[data-transfer-panel="success"]');

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="maria"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();
        await expect(transferView.locator("[data-transfer-available-balance]")).toHaveText("€12,480.75");

        await amountInput.fill("150");
        await referenceInput.fill("Playwright transfer test");

        await expect(transferView.locator("[data-preview-to]")).toHaveText("Maria Petrova");
        await expect(transferView.locator("[data-preview-amount]")).toHaveText("€150.00");
        await expect(transferView.locator("[data-preview-note]")).toHaveText("Playwright transfer test");

        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(reviewPanel).toBeVisible();
        await expect(reviewPanel.locator("[data-review-name]")).toHaveText("Maria Petrova");
        await expect(reviewPanel.locator("[data-review-amount]")).toHaveText("€150.00");
        await expect(reviewPanel.locator("[data-review-reference]")).toHaveText("Playwright transfer test");
        await expect(reviewPanel.locator("[data-review-remaining]")).toHaveText("€12,330.75");

        await transferView.locator("[data-transfer-confirm]").click();

        await expect(successPanel).toBeVisible();
        await expect(successPanel.locator("[data-success-amount]")).toHaveText("€150.00");
        await expect(successPanel.locator("[data-success-name]")).toHaveText("Maria Petrova");
        await expect(successPanel.locator("[data-success-ref]")).toContainText("ASW-DEMO-");

        await transferView.locator("[data-success-dashboard]").click();

        await expect(page.locator('[data-demo-view="dashboard"]')).toBeVisible();
        await expect(page.locator("[data-balance-amount]")).toContainText("€12,330.75");
    });

    test("adds a completed transfer to transaction history", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const transactionsView = page.locator('[data-demo-view="transactions"]');

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="georgi"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await transferView.locator("[data-amount-input]").fill("250");
        await transferView.locator("[data-reference-input]").fill("Playwright transfer history test");
        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(transferView.locator('[data-transfer-panel="3"]')).toBeVisible();

        await transferView.locator("[data-transfer-confirm]").click();

        const successPanel = transferView.locator('[data-transfer-panel="success"]');

        await expect(successPanel).toBeVisible();
        await expect(successPanel.locator("[data-success-name]")).toHaveText("Georgi Stoyanov");

        await successPanel.locator("[data-success-view]").click();

        await expect(transactionsView).toBeVisible();

        const newestTransaction = transactionsView.locator(".transaction-item").first();

        await expect(newestTransaction).toContainText("Georgi Stoyanov");
        await expect(newestTransaction).toContainText("- €250.00");
        await expect(newestTransaction).toContainText("Completed");
    });

    test("rejects a transfer with a zero amount", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const amountError = transferView.locator("[data-amount-error]");

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="maria"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();

        await amountInput.fill("0");
        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(amountError).toBeVisible();
        await expect(amountError).toHaveText("Enter an amount greater than €0.00.");
        await expect(amountInput).toHaveAttribute("aria-invalid", "true");
        await expect(amountInput).toBeFocused();
        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();
        await expect(transferView.locator('[data-transfer-panel="3"]')).not.toBeVisible();
    });

    test("prevents a transfer larger than the available balance", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const amountError = transferView.locator("[data-amount-error]");

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="ivan"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();

        await amountInput.fill("20000");
        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(amountError).toBeVisible();
        await expect(amountError).toContainText("Insufficient balance");
        await expect(amountError).toContainText("€12,480.75");
        await expect(amountInput).toHaveAttribute("aria-invalid", "true");
        await expect(amountInput).toBeFocused();
        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();
        await expect(transferView.locator('[data-transfer-panel="3"]')).not.toBeVisible();
        await expect(page.locator("[data-balance-amount]")).toContainText("€12,480.75");
    });

    test("updates the transfer preview when a quick amount is selected", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const amountChip = transferView.locator('[data-amount-chip="500"]');

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="maria"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();

        await amountChip.click();

        await expect(amountChip).toHaveClass(/is-active/);
        await expect(amountInput).toHaveValue("500.00");
        await expect(transferView.locator("[data-preview-to]")).toHaveText("Maria Petrova");
        await expect(transferView.locator("[data-preview-amount]")).toHaveText("€500.00");
    });

    test("creates a transfer for a new recipient", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const nameInput = transferView.locator('[data-recipient-field="name"]');
        const ibanInput = transferView.locator('[data-recipient-field="iban"]');
        const bankInput = transferView.locator('[data-recipient-field="bank"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const reviewPanel = transferView.locator('[data-transfer-panel="3"]');

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="new"]').click();

        await nameInput.fill("Test Recipient");
        await ibanInput.fill("BG12 TEST 1234 5678 9012 34");
        await bankInput.fill("Playwright Bank");
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();

        await amountInput.fill("75");
        await amountInput.blur();
        await transferView.locator("[data-reference-input]").fill("New recipient test");

        await expect(transferView.locator("[data-preview-to]")).toHaveText("Test Recipient");
        await expect(transferView.locator("[data-preview-amount]")).toHaveText("€75.00");

        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(reviewPanel).toBeVisible();
        await expect(reviewPanel.locator("[data-review-name]")).toHaveText("Test Recipient");
        await expect(reviewPanel.locator("[data-review-iban]")).toHaveText("BG12 TEST 1234 5678 9012 34");
        await expect(reviewPanel.locator("[data-review-reference]")).toHaveText("New recipient test");
        await expect(reviewPanel.locator("[data-review-remaining]")).toHaveText("€12,405.75");
    });

    test("preserves transfer data when navigating back between steps", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const amountInput = transferView.locator("[data-amount-input]");
        const referenceInput = transferView.locator("[data-reference-input]");

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="georgi"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await amountInput.fill("300");
        await referenceInput.fill("Back navigation test");
        await transferView.locator("[data-details-form] button[type='submit']").click();

        await expect(transferView.locator('[data-transfer-panel="3"]')).toBeVisible();
        await expect(transferView.locator("[data-review-name]")).toHaveText("Georgi Stoyanov");
        await expect(transferView.locator("[data-review-amount]")).toHaveText("€300.00");

        await transferView.locator("[data-transfer-back-details]").click();

        await expect(transferView.locator('[data-transfer-panel="2"]')).toBeVisible();
        await expect(amountInput).toHaveValue("300.00");
        await expect(referenceInput).toHaveValue("Back navigation test");

        await transferView.locator("[data-transfer-back]").click();

        await expect(transferView.locator('[data-transfer-panel="1"]')).toBeVisible();
        await expect(transferView.locator('[data-recipient-field="name"]')).toHaveValue("Georgi Stoyanov");
        await expect(transferView.locator('[data-recipient-field="bank"]')).toHaveValue("Fibank");
    });

    test("requires details for a new recipient", async ({ page }) => {

        const transferView = page.locator('[data-demo-view="transfer"]');
        const nameInput = transferView.locator('[data-recipient-field="name"]');
        const ibanInput = transferView.locator('[data-recipient-field="iban"]');
        const bankInput = transferView.locator('[data-recipient-field="bank"]');

        await page.locator('[data-demo-nav="transfer"]').click();
        await transferView.locator('[data-recipient-id="new"]').click();
        await transferView.locator("[data-transfer-continue]").click();

        await expect(transferView.locator('[data-transfer-panel="1"]')).toBeVisible();
        await expect(transferView.locator('[data-transfer-panel="2"]')).not.toBeVisible();
        await expect(nameInput).toBeFocused();

        expect(await nameInput.evaluate((input) => input.checkValidity())).toBe(false);
        expect(await ibanInput.evaluate((input) => input.checkValidity())).toBe(false);
        expect(await bankInput.evaluate((input) => input.checkValidity())).toBe(false);
    });
});