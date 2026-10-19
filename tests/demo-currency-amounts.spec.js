const { test, expect } = require("@playwright/test");

async function selectCurrency(page, currency) {
    await page.locator('[data-demo-nav="settings"]').click();
    await page.locator('[data-setting="currency"]').selectOption(currency);
}

test.describe("Demo currencies and decimal amounts", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/demo/");
    });

    test("switches EUR and USD and preserves the selection after reload", async ({ page }) => {
    
        await selectCurrency(page, "USD");
        await page.locator('[data-demo-nav="dashboard"]').click();

        await expect(page.locator("[data-balance-amount]")).toContainText("$12,480.75");
        await expect(page.locator(".amount-currency")).toHaveText("$");
        await expect(page.locator(".money-amount-currency")).toHaveText("$");
        await expect(page.locator(".request-amount-currency")).toHaveText("$");

        await page.reload();

        await expect(page.locator("[data-balance-amount]")).toContainText("$12,480.75");
        await page.locator('[data-demo-nav="settings"]').click();
        await expect(page.locator('[data-setting="currency"]')).toHaveValue("USD");

        const currencyOptions = page.locator('[data-setting="currency"] option');

        await expect(currencyOptions).toHaveCount(2);
        await expect(currencyOptions.nth(0)).toHaveAttribute("value", "EUR");
        await expect(currencyOptions.nth(1)).toHaveAttribute("value", "USD");
        await selectCurrency(page, "EUR");
        await page.locator('[data-demo-nav="dashboard"]').click();

        await expect(page.locator("[data-balance-amount]")).toContainText("€12,480.75");
        await expect(page.locator(".amount-currency")).toHaveText("€");
        await expect(page.locator(".money-amount-currency")).toHaveText("€");
        await expect(page.locator(".request-amount-currency")).toHaveText("€");
    });

    test("completes a USD transfer with a decimal comma above 999", async ({ page }) => {
    
        await selectCurrency(page, "USD");
        await page.locator('[data-demo-nav="transfer"]').click();

        const view = page.locator('[data-demo-view="transfer"]');
        const amount = view.locator("[data-amount-input]");

        await view.locator('[data-recipient-id="maria"]').click();
        await view.locator("[data-transfer-continue]").click();

        await amount.fill("1000,50");
        await amount.blur();

        await expect(amount).toHaveValue("1000.50");
        await expect(view.locator("[data-preview-amount]")).toHaveText("$1,000.50");
        await view.locator("[data-details-form] button[type='submit']").click();

        await expect(view.locator("[data-review-amount]")).toHaveText("$1,000.50");
        await expect(view.locator("[data-review-remaining]")).toHaveText("$11,480.25");
            
        await view.locator("[data-transfer-confirm]").click();
        await expect(view.locator("[data-success-amount]")).toHaveText("$1,000.50");
        await view.locator("[data-success-dashboard]").click();
        await expect(page.locator("[data-balance-amount]")).toContainText("$11,480.25");
    });

    for (const scenario of [{
        
            mode: "deposit",
            title: "Deposit completed",
            balance: "$13,481.25"
        },{
            mode: "withdraw",
            title: "Withdrawal completed",
            balance: "$11,480.25"
        }
    ]){
    
        test(`completes a USD ${scenario.mode} with a decimal comma above 999`, async ({ page }) => {
        
            await selectCurrency(page, "USD");
            await page.locator('[data-demo-nav="deposit"]').click();

            const view = page.locator('[data-demo-view="deposit"]');
            const amount = view.locator("[data-money-amount]");

            await view.locator(`[data-money-mode="${scenario.mode}"]`).click();

            await amount.fill("1000,50");
            await amount.blur();

            await expect(amount).toHaveValue("1000.50");

            await expect(view.locator("[data-money-preview-balance]")).toHaveText(scenario.balance);
            await view.locator("[data-money-submit]").click();

            await expect(view.locator("[data-money-success]")).toBeVisible();
            await expect(view.locator("[data-money-success-title]")).toHaveText(scenario.title);
            await expect(view.locator("[data-money-success-amount]")).toHaveText("$1,000.50");

            await view.locator("[data-money-dashboard]").click();
            await expect(page.locator("[data-balance-amount]")).toContainText(scenario.balance);
                
        });
    }

    test("creates a USD request with a decimal comma without changing the balance", async ({ page }) => {
    
        await selectCurrency(page, "USD");
        await page.locator('[data-demo-nav="request"]').click();

        const view = page.locator('[data-demo-view="request"]');
        const amount = view.locator("[data-request-amount]");

        await view.locator('[data-request-name="Maria Petrova"]').click();
        await amount.fill("1000,50");

        await view.locator("[data-request-reason]").fill("Shared expenses");
        await expect(view.locator("[data-request-preview-amount]")).toHaveText("$1,000.50");
        await view.locator("[data-request-submit]").click();

        await expect(view.locator("[data-request-success]")).toBeVisible();
        await expect(view.locator("[data-request-success-amount]")).toHaveText("$1,000.50");
        await view.locator("[data-request-dashboard]").click();

        await expect(page.locator("[data-balance-amount]")) .toContainText("$12,480.75");
        await page.locator('[data-demo-nav="transactions"]').click();

        const newestTransaction = page.locator('[data-demo-view="transactions"] .transaction-item').first();

        await expect(newestTransaction).toContainText("Maria Petrova");
        await expect(newestTransaction).toContainText("+ $1,000.50");
        await expect(newestTransaction).toContainText("Pending");
    });

    for (const invalidAmount of ["-10", "10.555", "abc", "10.5.2"]) {

        test(`rejects invalid deposit amount: ${invalidAmount}`, async ({ page }) => {

            await page.locator('[data-demo-nav="deposit"]').click();

            const view = page.locator('[data-demo-view="deposit"]');
            const amount = view.locator("[data-money-amount]");

            await view.locator('[data-money-mode="deposit"]').click();
            await amount.fill(invalidAmount);
            await view.locator("[data-money-submit]").click();

            await expect(view.locator("[data-money-error]")).toBeVisible();
            await expect(view.locator("[data-money-error]")).toHaveText("Enter an amount greater than zero.");
            await expect(amount).toHaveAttribute("aria-invalid", "true");
            await expect(view.locator("[data-money-success]")).not.toBeVisible();
            await expect(view.locator("[data-money-current-balance]")).toContainText("€12,480.75");

            await page.locator('[data-demo-nav="transactions"]').click();

            await expect(page.locator("[data-transactions-list] .transaction-item")).toHaveCount(4);
        });
    }
});
