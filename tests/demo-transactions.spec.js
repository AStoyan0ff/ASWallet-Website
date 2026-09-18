const { test, expect } = require("@playwright/test");

test.describe("ASWallet demo transactions", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/demo/");
    });

    test("completes a deposit and updates the wallet balance", async ({ page }) => {

        const depositView = page.locator('[data-demo-view="deposit"]');
        const amountInput = depositView.locator("[data-money-amount]");
        const referenceInput = depositView.locator("[data-money-reference]");
        const currentBalance = depositView.locator("[data-money-current-balance]");
        const previewAmount = depositView.locator("[data-money-preview-amount]");
        const previewBalance = depositView.locator("[data-money-preview-balance]");
        const successPanel = depositView.locator("[data-money-success]");

        await page.locator('[data-demo-nav="deposit"]').click();

        await expect(depositView).toBeVisible();
        await expect(currentBalance).toContainText("€12,480.75");

        await amountInput.fill("100");
        await referenceInput.fill("Playwright deposit test");

        await expect(previewAmount).toContainText("+ €100.00");
        await expect(previewBalance).toContainText("€12,580.75");

        await depositView.locator("[data-money-submit]").click();

        await expect(successPanel).toBeVisible();
        await expect(successPanel.locator("[data-money-success-title]")).toHaveText("Deposit completed");
        await expect(successPanel.locator("[data-money-success-amount]")).toHaveText("€100.00");
        await expect(successPanel.locator("[data-money-success-message]")).toContainText("was added to your ASWallet balance");
        await depositView.locator("[data-money-dashboard]").click();

        await expect(page.locator('[data-demo-view="dashboard"]')).toBeVisible();
        await expect(page.locator("[data-balance-amount]")).toContainText("€12,580.75");
    });

    test("completes a withdrawal and updates the wallet balance", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const amountInput = moneyView.locator("[data-money-amount]");
        const referenceInput = moneyView.locator("[data-money-reference]");
        const currentBalance = moneyView.locator("[data-money-current-balance]");
        const previewAmount = moneyView.locator("[data-money-preview-amount]");
        const previewBalance = moneyView.locator("[data-money-preview-balance]");
        const successPanel = moneyView.locator("[data-money-success]");

        await page.locator('[data-demo-nav="deposit"]').click();
        await moneyView.locator('[data-money-mode="withdraw"]').click();

        await expect(moneyView).toBeVisible();
        await expect(currentBalance).toContainText("€12,480.75");
        await expect(moneyView.locator("[data-money-title]")).toHaveText("Withdraw funds");

        await amountInput.fill("200");
        await referenceInput.fill("Playwright withdrawal test");

        await expect(previewAmount).toContainText("- €200.00");
        await expect(previewBalance).toContainText("€12,280.75");

        await moneyView.locator("[data-money-submit]").click();

        await expect(successPanel).toBeVisible();
        await expect(successPanel.locator("[data-money-success-title]")).toHaveText("Withdrawal completed");
        await expect(successPanel.locator("[data-money-success-amount]")).toHaveText("€200.00");
        await expect(successPanel.locator("[data-money-success-message]")).toContainText("was withdrawn from your ASWallet balance");

        await moneyView.locator("[data-money-dashboard]").click();

        await expect(page.locator('[data-demo-view="dashboard"]')).toBeVisible();
        await expect(page.locator("[data-balance-amount]")).toContainText("€12,280.75");
    });

    test("adds a completed deposit to transaction history", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const transactionsView = page.locator('[data-demo-view="transactions"]');
        const transactionList = transactionsView.locator("[data-transactions-list]");

        await page.locator('[data-demo-nav="deposit"]').click();
        await moneyView.locator("[data-money-amount]").fill("100");
        await moneyView.locator("[data-money-reference]").fill("Playwright deposit history test");
        await moneyView.locator("[data-money-submit]").click();
        await expect(moneyView.locator("[data-money-success]")).toBeVisible();

        await page.locator('[data-demo-nav="transactions"]').click();
        await expect(transactionsView).toBeVisible();

        const newestTransaction = transactionList.locator(".transaction-item").first();

        await expect(newestTransaction).toContainText("Wallet Deposit");
        await expect(newestTransaction).toContainText("+ €100.00");
        await expect(newestTransaction).toContainText("Completed");
    });

    test("prevents a withdrawal larger than the available balance", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const amountInput = moneyView.locator("[data-money-amount]");
        const errorMessage = moneyView.locator("[data-money-error]");

        await page.locator('[data-demo-nav="deposit"]').click();
        await moneyView.locator('[data-money-mode="withdraw"]').click();

        await amountInput.fill("20000");
        await moneyView.locator("[data-money-submit]").click();

        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText("Insufficient balance");
        await expect(amountInput).toHaveAttribute("aria-invalid", "true");
        await expect(moneyView.locator("[data-money-success]")).not.toBeVisible();
        await expect(moneyView.locator("[data-money-current-balance]")).toContainText("€12,480.75");
    });

    test("rejects a transaction with a zero amount", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const amountInput = moneyView.locator("[data-money-amount]");
        const errorMessage = moneyView.locator("[data-money-error]");

        await page.locator('[data-demo-nav="deposit"]').click();

        await amountInput.fill("0");
        await moneyView.locator("[data-money-submit]").click();

        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText("Enter an amount greater than €0.00.");
        await expect(amountInput).toHaveAttribute("aria-invalid", "true");
        await expect(amountInput).toBeFocused();
        await expect(moneyView.locator("[data-money-success]")).not.toBeVisible();
        await expect(moneyView.locator("[data-money-current-balance]")).toContainText("€12,480.75");
    });

    test("updates the deposit preview when a quick amount is selected", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const amountInput = moneyView.locator("[data-money-amount]");
        const amountChip = moneyView.locator('[data-money-chip="250"]');
        const previewAmount = moneyView.locator("[data-money-preview-amount]");
        const previewBalance = moneyView.locator("[data-money-preview-balance]");

        await page.locator('[data-demo-nav="deposit"]').click();
        await amountChip.click();

        await expect(amountChip).toHaveClass(/is-active/);
        await expect(amountInput).toHaveValue("250.00");
        await expect(previewAmount).toContainText("+ €250.00");
        await expect(previewBalance).toContainText("€12,730.75");
    });

    test("adds a completed withdrawal to transaction history", async ({ page }) => {

        const moneyView = page.locator('[data-demo-view="deposit"]');
        const transactionsView = page.locator('[data-demo-view="transactions"]');
        const transactionList = transactionsView.locator("[data-transactions-list]");

        await page.locator('[data-demo-nav="deposit"]').click();
        await moneyView.locator('[data-money-mode="withdraw"]').click();
        await moneyView.locator("[data-money-amount]").fill("200");
        await moneyView.locator("[data-money-reference]").fill("Playwright withdrawal history test");
        await moneyView.locator("[data-money-submit]").click();

        await expect(moneyView.locator("[data-money-success]")).toBeVisible();

        await page.locator('[data-demo-nav="transactions"]').click();

        await expect(transactionsView).toBeVisible();

        const newestTransaction = transactionList.locator(".transaction-item").first();

        await expect(newestTransaction).toContainText("Wallet Withdrawal");
        await expect(newestTransaction).toContainText("- €200.00");
        await expect(newestTransaction).toContainText("Completed");
    });

});

