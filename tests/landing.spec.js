const {
    test,
    expect
} = require("@playwright/test");

test.describe("ASWallet landing page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("loads the main page successfully", async ({ page }) => {

        await expect(page).toHaveTitle(
            /ASWallet/
        );

        await expect(
            page.getByRole("heading", {
                level: 1
            })
        ).toContainText(
            "Your Wallet"
        );

        await expect(
            page.getByRole("heading", {
                level: 1
            })
        ).toContainText(
            "Your Future"
        );
    });

    test("displays the main navigation", async ({ page }) => {

        const navigation = page.getByRole(
            "navigation",
            {
                name: "Main navigation"
            }
        );

        await expect(navigation).toBeVisible();

        await expect(
            navigation.getByRole("link", {
                name: "Features"
            })
        ).toBeVisible();

        await expect(
            navigation.getByRole("link", {
                name: "Security"
            })
        ).toBeVisible();

        await expect(
            navigation.getByRole("link", {
                name: "Roadmap"
            })
        ).toBeVisible();

        await expect(
            navigation.getByRole("link", {
                name: "About"
            })
        ).toBeVisible();
    });

    test("opens the interactive demo", async ({ page }) => {

        const demoLink = page.locator(
            '.hero-buttons a[href="/demo/"]'
        );

        await expect(demoLink).toBeVisible();

        await demoLink.click();

        await expect(page).toHaveURL(
            /\/demo\/?$/
        );

        await expect(
            page.getByText(
                "Interactive demo - no real account or financial data"
            )
        ).toBeVisible();
    });

    test("contains links to the legal pages", async ({ page }) => {

        const legalNavigation = page.getByRole(
            "navigation",
            {
                name: "Legal navigation"
            }
        );

        await legalNavigation.scrollIntoViewIfNeeded();

        const privacyLink = legalNavigation.getByRole(
            "link",
            {
                name: "Privacy Policy"
            }
        );

        const termsLink = legalNavigation.getByRole(
            "link",
            {
                name: "Terms of Use"
            }
        );

        await expect(privacyLink).toBeVisible();
        await expect(termsLink).toBeVisible();

        await expect(privacyLink).toHaveAttribute(
            "href",
            "pages/privacy.html"
        );

        await expect(termsLink).toHaveAttribute(
            "href",
            "pages/terms.html"
        );
    });

});
