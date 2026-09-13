const {
    test,
    expect
} = require("@playwright/test");

const demoViews = [
    {
        id: "dashboard",
        label: "Dashboard"
    },
    {
        id: "transfer",
        label: "Transfer"
    },
    {
        id: "request",
        label: "Request Money"
    },
    {
        id: "deposit",
        label: "Deposit / Withdraw"
    },
    {
        id: "transactions",
        label: "Transactions"
    },
    {
        id: "reports",
        label: "Reports"
    },
    {
        id: "settings",
        label: "Settings"
    }
];

test.describe("ASWallet demo navigation", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/demo/");
    });

    test("loads the Demo Dashboard by default", async ({ page }) => {

        await expect(page).toHaveTitle(
            "ASWallet Demo | Interactive Wallet Dashboard"
        );

        await expect(
            page.getByText(
                "Interactive demo - no real account or financial data"
            )
        ).toBeVisible();

        const dashboardButton = page.locator(
            '[data-demo-nav="dashboard"]'
        );

        const dashboardView = page.locator(
            '[data-demo-view="dashboard"]'
        );

        await expect(dashboardButton).toHaveClass(
            /is-active/
        );

        await expect(dashboardView).toBeVisible();

        await expect(
            page.locator("[data-demo-view]:not([hidden])")
        ).toHaveCount(1);
    });

    for (const demoView of demoViews) {

        test(`opens the ${demoView.label} view`, async ({ page }) => {

            const navigationButton = page.locator(
                `[data-demo-nav="${demoView.id}"]`
            );

            const activeView = page.locator(
                `[data-demo-view="${demoView.id}"]`
            );

            await navigationButton.click();

            await expect(navigationButton).toHaveClass(
                /is-active/
            );

            await expect(activeView).toBeVisible();

            await expect(
                page.locator(
                    "[data-demo-nav].is-active"
                )
            ).toHaveCount(1);

            await expect(
                page.locator(
                    "[data-demo-view]:not([hidden])"
                )
            ).toHaveCount(1);
        });
    }

    test("returns to the main website", async ({ page }) => {

        await page
            .getByRole("link", {
                name: "Exit Demo"
            })
            .click();

        await expect(page).toHaveURL(
            /\/index\.html$/
        );

        await expect(
            page.getByRole("heading", {
                level: 1
            })
        ).toContainText(
            "Your Wallet"
        );
    });

});
