const {
    test,
    expect
} = require("@playwright/test");

test.describe("ASky Assistant", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("opens and closes the assistant panel", async ({ page }) => {

        const assistant = page.locator("[data-ai-assistant]");
        const launcher = assistant.locator("[data-ai-launcher]");
        const panel = assistant.locator("[data-ai-panel]");

        await expect(panel).not.toBeVisible();
        await launcher.click();
        await expect(assistant).toHaveClass(/is-open/);
        await expect(launcher).toHaveAttribute("aria-expanded", "true");
        await expect(panel).toHaveAttribute("aria-hidden", "false");
        await expect(panel).toBeVisible();
        await assistant.locator("[data-ai-close]").click();
        await expect(assistant).not.toHaveClass(/is-open/);
        await expect(launcher).toHaveAttribute("aria-expanded",  "false");
        await expect(panel).toHaveAttribute("aria-hidden", "true");
        await expect(panel).not.toBeVisible();
    });

    test("closes the assistant with Escape", async ({ page }) => {

        const assistant = page.locator("[data-ai-assistant]");
        const launcher = assistant.locator("[data-ai-launcher]");
        const panel = assistant.locator("[data-ai-panel]");

        await launcher.click();
        await expect(panel).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(panel).not.toBeVisible();
        await expect(launcher).toHaveAttribute("aria-expanded", "false");
        await expect(launcher).toBeFocused();
    });

    test("answers a question about its name", async ({ page }) => {

        const assistant = page.locator("[data-ai-assistant]");
        const input = assistant.locator("[data-ai-input]");
        const messages = assistant.locator("[data-ai-messages]");

        await assistant.locator("[data-ai-launcher]").click();
        await input.fill("What's your name?");
        await input.press("Enter");
        await expect( messages.locator(".ai-message.user")).toContainText("What's your name?");
        await expect( messages.getByText("My name is ASky Assistant - your personal ASWallet guide.")).toBeVisible();
        await expect(input).toBeEnabled();
    });

    test("cancels a pending response when closed", async ({ page }) => {

        const assistant = page.locator("[data-ai-assistant]");
        const input = assistant.locator("[data-ai-input]");
        const launcher = assistant.locator( "[data-ai-launcher]");

        await launcher.click();
        await input.fill( "How secure is ASWallet?");
        await input.press("Enter");

        await expect(assistant.locator(".ai-message.typing")).toBeVisible();
        await assistant.locator("[data-ai-close]").click();
        await expect(assistant.locator(".ai-message.typing")).toHaveCount(0);
        await expect(input).toBeEnabled();
        await launcher.click();

        await expect( assistant.locator("[data-ai-panel]")).toBeVisible();
        await expect(assistant.locator(".ai-message.typing")).toHaveCount(0);
        
    });

    test("restores the conversation after a reload", async ({ page }) => {
        const assistant = page.locator( "[data-ai-assistant]");

        await assistant.locator("[data-ai-launcher]").click();
        await assistant.locator("[data-ai-input]").fill("What's your name?");
        await assistant.locator("[data-ai-input]").press("Enter");
        await expect(assistant.getByText("My name is ASky Assistant - your personal ASWallet guide.")).toBeVisible();

        await page.reload();

        const restoredAssistant = page.locator("[data-ai-assistant]");

        await restoredAssistant.locator("[data-ai-launcher]") .click();
        await expect( restoredAssistant.locator(".ai-message.user")).toContainText( "What's your name?");
        await expect( restoredAssistant.getByText("My name is ASky Assistant - your personal ASWallet guide.")).toBeVisible();
        
    });

    test("clears the conversation after confirmation", async ({ page }) => {

        const assistant = page.locator("[data-ai-assistant]");
        const input = assistant.locator("[data-ai-input]");
        const messages = assistant.locator("[data-ai-messages]");

        await assistant.locator("[data-ai-launcher]").click();
        await input.fill("What's your name?");
        await input.press("Enter");
        await expect( messages.getByText("My name is ASky Assistant - your personal ASWallet guide.")).toBeVisible();

        const clearButton = assistant.locator("[data-ai-clear]");

        await clearButton.click();
        await expect(clearButton).toHaveAttribute( "aria-label", "Confirm clear conversation");
        await clearButton.click();
        await expect(messages.locator(".ai-message")).toHaveCount(1);
        await expect(messages.getByText("Hi! I'm ASky Assistant. How can I help you?")).toBeVisible();
        await expect(clearButton).toHaveAttribute("aria-label", "Clear conversation");
        
    });

    test("navigates to Reports from inside the Demo", async ({ page }) => {

        await page.goto("/demo/");

        const assistant = page.locator("[data-ai-assistant]");

        await assistant.locator("[data-ai-launcher]").click();

        const input = assistant.locator("[data-ai-input]");

        await input.fill("Open reports");
        await input.press("Enter");

        const reportsAction = assistant.getByRole( "button", { name: "Open Reports" });

        await expect(reportsAction).toBeVisible();
        await reportsAction.click();
        await expect(page.locator('[data-demo-nav="reports"]')).toHaveClass(/is-active/);
        await expect(page.locator('[data-demo-view="reports"]')).toBeVisible();
        await expect( assistant.locator("[data-ai-panel]")).not.toBeVisible();
        
    });

});
