const {
    test,
    expect
} = require("@playwright/test");

test.describe("ASWallet legal pages", () => {

    test("loads the Privacy Policy page", async ({ page }) => {

        const response = await page.goto(
            "/pages/privacy.html"
        );

        expect(response?.ok()).toBeTruthy();

        await expect(page).toHaveTitle(
            "Privacy Policy | ASWallet"
        );

        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "Privacy Policy"
            })
        ).toBeVisible();

        await expect(
            page.getByText(
                "Last updated: 13 September 2026"
            )
        ).toBeVisible();

        await expect(
            page.locator(".legal-section")
        ).toHaveCount(9);

        await expect(
            page.getByRole("link", {
                name: "Privacy Policy"
            })
        ).toHaveAttribute(
            "aria-current",
            "page"
        );
    });

    test("loads the Terms of Use page", async ({ page }) => {

        const response = await page.goto(
            "/pages/terms.html"
        );

        expect(response?.ok()).toBeTruthy();

        await expect(page).toHaveTitle(
            "Terms of Use | ASWallet"
        );

        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "Terms of Use"
            })
        ).toBeVisible();

        await expect(
            page.getByText(
                "Last updated: 13 September 2026"
            )
        ).toBeVisible();

        await expect(
            page.locator(".legal-section")
        ).toHaveCount(10);

        await expect(
            page.getByRole("link", {
                name: "Terms of Use"
            })
        ).toHaveAttribute(
            "aria-current",
            "page"
        );
    });

    test("navigates from Privacy Policy to Terms of Use", async ({ page }) => {

        await page.goto(
            "/pages/privacy.html"
        );

        const legalNavigation = page.getByRole(
            "navigation",
            {
                name: "Legal navigation"
            }
        );

        await legalNavigation
            .getByRole("link", {
                name: "Terms of Use"
            })
            .click();

        await expect(page).toHaveURL(
            /\/pages\/terms\.html$/
        );

        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "Terms of Use"
            })
        ).toBeVisible();
    });

    test("navigates from Terms of Use to Privacy Policy", async ({ page }) => {

        await page.goto(
            "/pages/terms.html"
        );

        const legalNavigation = page.getByRole(
            "navigation",
            {
                name: "Legal navigation"
            }
        );

        await legalNavigation
            .getByRole("link", {
                name: "Privacy Policy"
            })
            .click();

        await expect(page).toHaveURL(
            /\/pages\/privacy\.html$/
        );

        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "Privacy Policy"
            })
        ).toBeVisible();
    });

    test("returns from a legal page to the main website", async ({ page }) => {

        await page.goto(
            "/pages/privacy.html"
        );

        await page
            .getByRole("link", {
                name: "Back to website"
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
