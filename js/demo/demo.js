const QUICK_ACTIONS = {
    send: {
        title: "Send money",
        text: "Sample transfer form - no real money moves here.",
        primaryLabel: "Recipient",
        primaryPlaceholder: "Name or IBAN",
        noteLabel: "Note",
        notePlaceholder: "Optional",
        submitLabel: "Send",
    },
    deposit: {
        title: "Deposit funds",
        text: "Sample deposit form - demo data only.",
        primaryLabel: "From",
        primaryPlaceholder: "Card or bank account",
        noteLabel: "Reference",
        notePlaceholder: "Optional",
        submitLabel: "Deposit",
    },
    withdraw: {
        title: "Withdraw funds",
        text: "Sample withdraw form - nothing leaves this demo.",
        primaryLabel: "To account",
        primaryPlaceholder: "IBAN or card",
        noteLabel: "Reference",
        notePlaceholder: "Optional",
        submitLabel: "Withdraw",
    },
    request: {
        title: "Request money",
        text: "Sample request form - no real request is sent.",
        primaryLabel: "From",
        primaryPlaceholder: "Friend or contact",
        noteLabel: "Reason",
        notePlaceholder: "Optional",
        submitLabel: "Request",
    },
};

export function initDemo() {
    initDemoNav();
    initBalanceToggle();
    initQuickActions();
}

function initDemoNav() {
    const navLinks = [...document.querySelectorAll("[data-demo-nav]")];
    const views = [...document.querySelectorAll("[data-demo-view]")];

    if (!navLinks.length || !views.length) {
        return;
    }

    const setActiveView = (viewId) => {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.demoNav === viewId);
        });

        views.forEach((view) => {
            const isActive = view.dataset.demoView === viewId;
            
            view.classList.toggle("is-active", isActive);
            view.hidden = !isActive;
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setActiveView(link.dataset.demoNav);
        });
    });
}

function initBalanceToggle() {
    const card = document.querySelector("[data-balance-card]");
    const toggle = document.querySelector("[data-balance-toggle]");
    const amount = document.querySelector("[data-balance-amount]");

    if (!card || !toggle || !amount) {
        return;
    }

    const setHidden = (isHidden) => {
        card.classList.toggle("is-hidden", isHidden);
        amount.textContent = isHidden
            ? amount.dataset.hidden
            : amount.dataset.visible;

        toggle.setAttribute("aria-pressed", String(isHidden));
        toggle.setAttribute(
            "aria-label",
            isHidden ? "Show balance" : "Hide balance"
        );
    };

    toggle.addEventListener("click", () => {
        setHidden(!card.classList.contains("is-hidden"));
    });
}

function initQuickActions() {
    const modal = document.querySelector("[data-quick-modal]");
    const triggers = [...document.querySelectorAll("[data-quick-action]")];

    if (!modal || !triggers.length) {
        return;
    }

    const title = modal.querySelector("[data-quick-title]");
    const text = modal.querySelector("[data-quick-text]");
    const form = modal.querySelector("[data-quick-form]");
    const primaryLabel = modal.querySelector('[data-quick-field-label="primary"]');
    const noteLabel = modal.querySelector('[data-quick-field-label="note"]');
    const primaryInput = modal.querySelector('[data-quick-field="primary"]');
    const noteInput = modal.querySelector('[data-quick-field="note"]');
    const submit = modal.querySelector("[data-quick-submit]");
    const success = modal.querySelector("[data-quick-success]");
    const closeElements = [...modal.querySelectorAll("[data-quick-close]")];
    let lastFocus = null;

    const openModal = (actionId) => {
        const config = QUICK_ACTIONS[actionId];

        if (!config) {
            return;
        }

        lastFocus = document.activeElement;
        title.textContent = config.title;
        text.textContent = config.text;
        primaryLabel.textContent = config.primaryLabel;
        noteLabel.textContent = config.noteLabel;
        primaryInput.placeholder = config.primaryPlaceholder;
        noteInput.placeholder = config.notePlaceholder;
        submit.textContent = config.submitLabel;

        form.reset();
        success.hidden = true;
        modal.hidden = false;
        document.body.classList.add("demo-modal-open");
        primaryInput.focus();
    };

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove("demo-modal-open");
        success.hidden = true;

        if (lastFocus && typeof lastFocus.focus === "function") {
            lastFocus.focus();
        }
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            openModal(trigger.dataset.quickAction);
        });
    });

    closeElements.forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        success.hidden = false;
        submit.textContent = "Done";

        window.setTimeout(() => {
            closeModal();
        }, 1200);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}

initDemo();
