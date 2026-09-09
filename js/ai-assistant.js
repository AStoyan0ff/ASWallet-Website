const RESPONSES = [
    {
        keywords: [
            "transaction",
            "transactions",
            "history",
            "activity",
            "транзакция",
            "транзакции",
            "история"
        ],
        answer: "Opening your transaction history.",
        action: "transactions"
    },
    {
        keywords: [
            "transfer",
            "send",
            "iban",
            "recipient",
            "превод",
            "изпрати",
            "ибан"
        ],
        answer: "Opening the Transfer area. Choose a saved recipient or create one, enter an amount, review the details and confirm.",
        action: "transfer"
    },
    {
        keywords: [
            "deposit",
            "withdraw",
            "cash",
            "тегл",
            "депозит",
            "внес"
        ],
        answer: "Opening the Deposit and Withdraw area.",
        action: "deposit"
    },
    {
        keywords: [
            "secure",
            "security",
            "safe",
            "otp",
            "fraud",
            "сигурност",
            "защита"
        ],
        answer: "ASWallet is designed around secure authentication, protected sensitive actions, validation and fraud-risk checks. The public demo uses fictional data and never processes real payments."
    },
    {
        keywords: [
            "report",
            "reports",
            "spending",
            "expense",
            "income",
            "анализ",
            "разход",
            "приход",
            "отчет"
        ],
        answer: "Opening your financial reports.",
        action: "reports"
    },
    {
        keywords: [
            "request",
            "payment link",
            "request money",
            "заявка",
            "поискам",
            "линк"
        ],
        answer: "Opening Request Money.",
        action: "request"
    },
    {
        keywords: [
            "dashboard",
            "home screen",
            "overview",
            "начало",
            "табло",
            "преглед"
        ],
        answer: "Opening your ASWallet dashboard.",
        action: "dashboard"
    },
    {
        keywords: [
            "settings",
            "preferences",
            "options",
            "настройки",
            "опции"
        ],
        answer: "Opening ASWallet settings.",
        action: "settings"
    },
    {
        keywords: [
            "demo",
            "try",
            "test",
            "проба",
            "демо"
        ],
        answer: "The interactive demo includes Dashboard, Transfer, Request Money, Deposit and Withdraw, Transactions, Reports, Notifications and Settings. Everything uses simulated data."
    },
    {
        keywords: [
            "technology",
            "stack",
            "java",
            "spring",
            "code",
            "github",
            "технология",
            "код"
        ],
        answer: "The main ASWallet application is built with Java, Spring Boot, Spring Security, JPA, MySQL and Thymeleaf. This presentation website and demo use semantic HTML, modular CSS and vanilla JavaScript."
    },
    {
        keywords: [
            "mobile",
            "phone",
            "pwa",
            "android",
            "ios",
            "мобил",
            "телефон"
        ],
        answer: "ASWallet Mobile is part of the product roadmap. The website already includes a mobile showcase, while the current interactive demo is fully responsive and works on phones."
    },
    {
        keywords: [
            "real",
            "account",
            "register",
            "login",
            "истина",
            "регистра",
            "профил"
        ],
        answer: "This website is a presentation and UI-only demo. It does not create a real account or collect banking details. The production-oriented Java application lives in the linked ASWallet repository."
    },
    {
        keywords: [
            "what's your name",
            "what is your name",
            "your name",
            "who are you",
            "как се казваш",
            "кой си ти"
        ],
        answer: "My name is ASky Assistant - your personal ASWallet guide."
    },
    {
        keywords: [
            "hello",
            "hi",
            "hey",
            "здравей",
            "привет",
            "хай"
        ],
        answer: "Hello! I'm ASky, your ASWallet demo assistant. Ask me about transfers, security, reports, the technology stack or how to explore the demo."
    }
];

const FALLBACK_RESPONSE = {
    answer: "I'm ASky Assistant, so my knowledge is focused on ASWallet. Try asking about transfers, transactions, deposits, security, reports, settings or the interactive demo.",
    action: null
};

function normalize(value) {
    return String(value)
        .toLocaleLowerCase()
        .trim();
}

function escapeRegularExpression(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeyword(question, keyword) {
    const normalizedKeyword = normalize(keyword);
    const isEnglishWord = /^[a-z0-9]+$/i.test(normalizedKeyword);

    if (isEnglishWord) {
        const escapedKeyword = escapeRegularExpression(normalizedKeyword);
        const expression = new RegExp(`\\b${escapedKeyword}\\b`, "i");

        return expression.test(question);
    }

    return question.includes(normalizedKeyword);
}

function findResponse(question) {
    const normalizedQuestion = normalize(question);

    const match = RESPONSES.find(({ keywords }) => {
        return keywords.some((keyword) => {
            return matchesKeyword(normalizedQuestion, keyword);
        });
    });

    return match || FALLBACK_RESPONSE;
}

function navigateToDemoView(viewId) {
    if (!viewId) {
        return false;
    }

    const navigationButton = document.querySelector(
        `[data-demo-nav="${viewId}"]`
    );

    if (navigationButton) {
        navigationButton.click();
        return true;
    }

    const demoUrl = new URL("/demo/", window.location.origin);

    demoUrl.searchParams.set("view", viewId);

    window.location.href = demoUrl.toString();

    return false;
}

function focusDemoView(viewId) {
    const activeView = document.querySelector(
        `[data-demo-view="${viewId}"]`
    );

    if (!activeView) {
        return;
    }

    if (!activeView.hasAttribute("tabindex")) {
        activeView.setAttribute("tabindex", "-1");
    }

    window.requestAnimationFrame(() => {
        activeView.focus({
            preventScroll: true
        });
    });
}

function openRequestedDemoView() {
    const parameters = new URLSearchParams(window.location.search);
    const requestedView = parameters.get("view");

    if (!requestedView) {
        return;
    }

    const allowedViews = [
        "dashboard",
        "transfer",
        "request",
        "deposit",
        "transactions",
        "reports",
        "settings"
    ];

    if (!allowedViews.includes(requestedView)) {
        return;
    }

    const navigationButton = document.querySelector(
        `[data-demo-nav="${requestedView}"]`
    );

    if (!navigationButton) {
        return;
    }

    navigationButton.click();

    window.history.replaceState(
        {},
        "",
        window.location.pathname
    );
}

function createMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `ai-message ${sender}`;
    message.textContent = text;
    return message;
}

export function initAiAssistant() {
    const assistant = document.querySelector("[data-ai-assistant]");

    if (!assistant) {
        return;
    }

    const launcher = assistant.querySelector("[data-ai-launcher]");
    const panel = assistant.querySelector("[data-ai-panel]");
    const closeButton = assistant.querySelector("[data-ai-close]");
    const form = assistant.querySelector("[data-ai-form]");
    const input = assistant.querySelector("[data-ai-input]");
    const messages = assistant.querySelector("[data-ai-messages]");
    const suggestions = assistant.querySelectorAll("[data-ai-question]");
    const sendButton = assistant.querySelector(".ai-assistant-send");
    const hint = assistant.querySelector(".ai-assistant-hint");

    let responseTimer = null;
    let navigationTimer = null;
    let typingIndicator = null;
    let isTyping = false;

    function scrollToLatest() {
        messages.scrollTop = messages.scrollHeight;
    }

    function setOpen(isOpen) {
        assistant.classList.toggle("is-open", isOpen);

        panel.inert = !isOpen;
        panel.setAttribute("aria-hidden", String(!isOpen));
        launcher.setAttribute("aria-expanded", String(isOpen));

        if (!isOpen) {
            cancelPendingResponse();
            return;
        }

        hint.hidden = true;

        window.setTimeout(() => {
            if (assistant.classList.contains("is-open")) {
                input.focus();
            }
        }, 230);
    }

    function setBusy(isBusy) {
        isTyping = isBusy;

        input.disabled = isBusy;
        sendButton.disabled = isBusy;

        suggestions.forEach((button) => {
            button.disabled = isBusy;
        });
    }

    function cancelPendingResponse() {
        if (responseTimer !== null) {
            window.clearTimeout(responseTimer);
            responseTimer = null;
        }

        if (navigationTimer !== null) {
            window.clearTimeout(navigationTimer);
            navigationTimer = null;
        }

        if (typingIndicator !== null) {
            typingIndicator.remove();
            typingIndicator = null;
        }

        setBusy(false);
    }

    function createTypingIndicator() {
        const typing = document.createElement("div");

        typing.className = "ai-message bot typing";
        typing.setAttribute("aria-label", "ASky is typing");

        typing.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        return typing;
    }

    function answerQuestion(question) {
        const cleanQuestion = question.trim();

        if (!cleanQuestion || isTyping) {
            return;
        }

        const userMessage = createMessage(cleanQuestion, "user");
        messages.append(userMessage);

        input.value = "";
        typingIndicator = createTypingIndicator();
        messages.append(typingIndicator);

        setBusy(true);
        scrollToLatest();

        responseTimer = window.setTimeout(() => {
            if (!assistant.classList.contains("is-open")) {
                cancelPendingResponse();
                return;
            }

            typingIndicator?.remove();
            typingIndicator = null;
            responseTimer = null;

            const response = findResponse(cleanQuestion);
            const botMessage = createMessage(response.answer, "bot");

            messages.append(botMessage);

            setBusy(false);
            scrollToLatest();

            if (response.action) {
                navigationTimer = window.setTimeout(() => {
                    navigationTimer = null;

                    const navigatedInsideDemo = navigateToDemoView(
                        response.action
                    );

                    if (navigatedInsideDemo) {
                        setOpen(false);
                        focusDemoView(response.action);
                    }
                }, 700);

                return;
            }

            input.focus();
        }, 650);
    }

    launcher.addEventListener("click", () => {
        const isOpen = assistant.classList.contains("is-open");

        setOpen(!isOpen);
    });

    closeButton.addEventListener("click", () => {
        setOpen(false);
        launcher.focus();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        answerQuestion(input.value);
    });

    suggestions.forEach((button) => {
        button.addEventListener("click", () => {
            answerQuestion(button.dataset.aiQuestion);
        });
    });

    document.addEventListener("click", (event) => {
        const isOpen = assistant.classList.contains("is-open");
        const clickedInside = assistant.contains(event.target);

        if (isOpen && !clickedInside) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && assistant.classList.contains("is-open")) {
            setOpen(false);
            launcher.focus();
        }
    });

    openRequestedDemoView();
}

initAiAssistant();
