const RESPONSES = [
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
        answer: "Open the Transfer area in the interactive demo. Choose a saved recipient or create one, enter an amount, review the details and confirm. Everything is simulated — no real money is moved."
    },
    {
        keywords: [
            "deposit",
            "withdraw",
            "cash",
            "теглене",
            "депозит",
            "внеси"
        ],
        answer: "The Deposit and Withdraw area lets you test both money flows. Select the operation, enter an amount and method, then confirm to see the demo balance and reports update instantly."
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
            "spending",
            "expense",
            "income",
            "анализ",
            "разход",
            "приход",
            "отчет"
        ],
        answer: "Reports visualizes income, expenses, net flow and spending categories for 7 days, 30 days or all time. Demo transactions update these insights automatically."
    },
    {
        keywords: [
            "request",
            "payment link",
            "заявка",
            "поискам",
            "линк"
        ],
        answer: "Request Money creates a safe demo payment request and shareable link. You can then open the Payment Simulator to see how completing that request updates the wallet."
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

const FALLBACK_RESPONSE = "I'm a demo assistant, so my knowledge is focused on ASWallet. Try asking about transfers, deposits, security, reports, the technology stack or the interactive demo.";

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

    return match?.answer || FALLBACK_RESPONSE;
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
            const botMessage = createMessage(response, "bot");

            messages.append(botMessage);

            setBusy(false);
            scrollToLatest();

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

    window.setTimeout(() => {
        if (!assistant.classList.contains("is-open")) {
            hint.hidden = true;
        }
    }, 8000);
}

initAiAssistant();
