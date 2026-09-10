const RESPONSES = [
    {
        id: "transactions",
        keywords: [
            "transaction",
            "transactions",
            "history",
            "activity",
            "транзакция",
            "транзакции",
            "история"
        ],
        answer: "The Transactions area contains your complete demo activity, including incoming, outgoing and pending transactions. You can search, filter and inspect transaction details.",
        navigationAnswer: "Opening your transaction history.",
        action: "transactions"
    },
    {
        id: "transfer",
        keywords: [
            "transfer",
            "send",
            "iban",
            "recipient",
            "превод",
            "изпрат",
            "ибан"
        ],
        answer: "The Transfer area lets you choose a saved recipient or create one, enter an amount, review the details and confirm the simulated transfer.",
        navigationAnswer: "Opening the Transfer area.",
        action: "transfer"
    },
    {
        id: "money",
        keywords: [
            "deposit",
            "withdraw",
            "cash",
            "тегл",
            "депозит",
            "внес"
        ],
        answer: "The Deposit and Withdraw area lets you simulate adding or withdrawing funds. Confirmed operations update the demo balance, transactions and reports.",
        navigationAnswer: "Opening the Deposit and Withdraw area.",
        action: "deposit"
    },
    {
        id: "security",
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
        id: "reports",
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
        answer: "Reports visualizes income, expenses, net flow and spending categories for 7 days, 30 days or all time.",
        navigationAnswer: "Opening your financial reports.",
        action: "reports"
    },
    {
        id: "request",
        keywords: [
            "request",
            "payment link",
            "request money",
            "заявка",
            "поискам",
            "линк"
        ],
        answer: "Request Money creates a simulated payment request and a shareable demo payment link.",
        navigationAnswer: "Opening Request Money.",
        action: "request"
    },
    {
        id: "dashboard",
        keywords: [
            "dashboard",
            "home screen",
            "overview",
            "начало",
            "табло",
            "преглед"
        ],
        answer: "The Dashboard provides an overview of your demo balance, recent activity, spending and quick actions.",
        navigationAnswer: "Opening your ASWallet dashboard.",
        action: "dashboard"
    },
    {
        id: "settings",
        keywords: [
            "settings",
            "preferences",
            "options",
            "настройки",
            "опции"
        ],
        answer: "Settings lets you hide the balance, change the displayed currency, enable compact mode and manage demo notifications.",
        navigationAnswer: "Opening ASWallet settings.",
        action: "settings"
    },
    {
        id: "demo",
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
        id: "technology",
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
        id: "mobile",
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
        id: "account",
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
        id: "name",
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
        id: "greeting",
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

const BG_RESPONSES = {
    transactions: {
        answer: "Секцията Transactions съдържа цялата Demo активност, включително входящи, изходящи и чакащи транзакции. Можеш да търсиш, филтрираш и разглеждаш подробностите за всяка транзакция.",
        navigationAnswer: "Отварям историята на транзакциите."
    },

    transfer: {
        answer: "Секцията Transfer ти позволява да избереш запазен получател или да създадеш нов, да въведеш сума, да прегледаш данните и да потвърдиш симулирания превод.",
        navigationAnswer: "Отварям секцията за парични преводи."
    },

    money: {
        answer: "Секцията Deposit and Withdraw ти позволява да симулираш внасяне и теглене на средства. Потвърдените операции обновяват Demo баланса, транзакциите и отчетите.",
        navigationAnswer: "Отварям секцията за внасяне и теглене."
    },

    security: {
        answer: "ASWallet е проектиран със защитена автентикация, проверки на чувствителните операции, валидация и оценка на риска от измами. Публичното Demo използва измислени данни и не обработва реални плащания."
    },

    reports: {
        answer: "Reports визуализира приходите, разходите, нетния паричен поток и категориите разходи за 7 дни, 30 дни или за целия период.",
        navigationAnswer: "Отварям финансовите отчети."
    },

    request: {
        answer: "Request Money създава симулирана заявка за плащане и споделяем Demo линк.",
        navigationAnswer: "Отварям секцията Request Money."
    },

    demo: {
        answer: "Интерактивното Demo включва Dashboard, Transfer, Request Money, Deposit and Withdraw, Transactions, Reports, Notifications и Settings. Всички данни и операции са симулирани."
    },

    technology: {
        answer: "Основното приложение ASWallet е създадено с Java, Spring Boot, Spring Security, JPA, MySQL и Thymeleaf. Представителният сайт и интерактивното Demo използват HTML, модулен CSS и JavaScript."
    },

    mobile: {
        answer: "ASWallet Mobile е част от продуктовия план. Сайтът вече съдържа Mobile Showcase, а интерактивното Demo е responsive и работи на телефон."
    },

    account: {
        answer: "Този сайт е презентация и UI Demo. Той не създава реален банков акаунт и не събира банкови данни."
    },

    name: {
        answer: "Казвам се ASky Assistant — твоят личен помощник в ASWallet."
    },

    greeting: {
        answer: "Здравей! Аз съм ASky Assistant. Можеш да ме попиташ за преводи, сигурност, отчети, технологии или за интерактивното Demo."
    },

    dashboard: {
        answer: "Dashboard показва общ преглед на Demo баланса, последните транзакции, разходите и бързите действия.",
        navigationAnswer: "Отварям ASWallet Dashboard."
    },

    settings: {
        answer: "Settings ти позволява да скриеш баланса, да промениш показваната валута, да активираш компактен режим и да управляваш Demo известията.",
        navigationAnswer: "Отварям настройките на ASWallet."
    },

    fallback: {
        answer: "Аз съм ASky Assistant и знанията ми са насочени към ASWallet. Попитай ме за преводи, транзакции, депозити, сигурност, отчети, настройки или интерактивното Demo."
    }
};

const FALLBACK_RESPONSE = {
    id: "fallback",
    answer: "I'm ASky Assistant, so my knowledge is focused on ASWallet. Try asking about transfers, transactions, deposits, security, reports, settings or the interactive demo.",
    action: null
};

const NAVIGATION_PATTERNS = [
    /^(open|show|visit|navigate to|go to|take me to)(?:\s|$)/i,
    /^(can you|could you|please)\s+(open|show|navigate to|take me to)(?:\s|$)/i,
    /^(отвори|покажи|посети|премини|отиди)(?:\s|$)/i,
    /^(може ли|моля)\s+(да\s+)?(отвориш|покажеш|преминеш)(?:\s|$)/i
];

const CONTEXTUAL_SUGGESTIONS = {
    default: [
        {
            label: "Explore demo",
            question: "What can I try in the demo?"
        },
        {
            label: "Security",
            question: "How secure is ASWallet?"
        },
        {
            label: "Technology",
            question: "What technology is ASWallet built with?"
        }
    ],

    dashboard: [
        {
            label: "Make transfer",
            question: "Open transfer"
        },
        {
            label: "Deposit funds",
            question: "Open deposit"
        },
        {
            label: "View reports",
            question: "Open reports"
        }
    ],

    transfer: [
        {
            label: "Transactions",
            question: "Open transactions"
        },
        {
            label: "Security",
            question: "How secure are ASWallet transfers?"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        }
    ],

    request: [
        {
            label: "Payment links",
            question: "How do payment links work?"
        },
        {
            label: "Transactions",
            question: "Open transactions"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        }
    ],

    deposit: [
        {
            label: "Withdraw funds",
            question: "How do withdrawals work?"
        },
        {
            label: "Transactions",
            question: "Open transactions"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        }
    ],

    transactions: [
        {
            label: "Reports",
            question: "Open reports"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        },
        {
            label: "Settings",
            question: "Open settings"
        }
    ],

    reports: [
        {
            label: "Transactions",
            question: "Open transactions"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        },
        {
            label: "Spending",
            question: "How does spending analysis work?"
        }
    ],

    settings: [
        {
            label: "Hide balance",
            question: "How does hide balance work?"
        },
        {
            label: "Dashboard",
            question: "Open dashboard"
        },
        {
            label: "Security",
            question: "How secure is ASWallet?"
        }
    ]
};

const CONTEXTUAL_SUGGESTIONS_BG = {
    default: [
        {
            label: "Разгледай Demo",
            question: "Какво мога да изпробвам в Demo?"
        },
        {
            label: "Сигурност",
            question: "Колко сигурен е ASWallet?"
        },
        {
            label: "Технологии",
            question: "С какви технологии е създаден ASWallet?"
        }
    ],

    dashboard: [
        {
            label: "Направи превод",
            question: "Отвори преводите"
        },
        {
            label: "Добави средства",
            question: "Отвори депозитите"
        },
        {
            label: "Виж отчетите",
            question: "Отвори отчетите"
        }
    ],

    transfer: [
        {
            label: "Транзакции",
            question: "Отвори транзакциите"
        },
        {
            label: "Сигурност",
            question: "Колко сигурни са преводите в ASWallet?"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        }
    ],

    request: [
        {
            label: "Payment Links",
            question: "Как работят линковете за плащане?"
        },
        {
            label: "Транзакции",
            question: "Отвори транзакциите"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        }
    ],

    deposit: [
        {
            label: "Теглене",
            question: "Как работи тегленето на средства?"
        },
        {
            label: "Транзакции",
            question: "Отвори транзакциите"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        }
    ],

    transactions: [
        {
            label: "Отчети",
            question: "Отвори отчетите"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        },
        {
            label: "Настройки",
            question: "Отвори настройките"
        }
    ],

    reports: [
        {
            label: "Транзакции",
            question: "Отвори транзакциите"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        },
        {
            label: "Разходи",
            question: "Как работи анализът на разходите?"
        }
    ],

    settings: [
        {
            label: "Скриване",
            question: "Как работи скриването на баланса?"
        },
        {
            label: "Табло",
            question: "Отвори таблото"
        },
        {
            label: "Сигурност",
            question: "Колко сигурен е ASWallet?"
        }
    ]
};

const ACTION_LABELS = {
    dashboard: {
        en: "Open Dashboard",
        bg: "Отвори Dashboard"
    },

    transfer: {
        en: "Open Transfer",
        bg: "Отвори Transfer"
    },

    request: {
        en: "Open Request Money",
        bg: "Отвори Request Money"
    },

    deposit: {
        en: "Open Deposit / Withdraw",
        bg: "Отвори Deposit / Withdraw"
    },

    transactions: {
        en: "Open Transactions",
        bg: "Отвори Transactions"
    },

    reports: {
        en: "Open Reports",
        bg: "Отвори Reports"
    },

    settings: {
        en: "Open Settings",
        bg: "Отвори Settings"
    }
};

const CHAT_HISTORY_STORAGE_KEY = "aswallet-asky-history";
const CHAT_HISTORY_LIMIT = 20;

function normalize(value) {
    return String(value).toLocaleLowerCase().trim();
}

function detectLanguage(question) {
    const containsCyrillic = /[а-яё]/i.test(question);

    return containsCyrillic
        ? "bg"
        : "en";
}

function getResponseText(response, language, navigationRequested) {
    const responseType = navigationRequested
        ? "navigationAnswer"
        : "answer";

    if (language === "bg") {
        const bulgarianResponse = BG_RESPONSES[response.id];

        if (bulgarianResponse?.[responseType]) {
            return bulgarianResponse[responseType];
        }
    }

    return response[responseType] || response.answer || FALLBACK_RESPONSE.answer;
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

function isDirectNavigationCommand(question, response) {
    const normalizedQuestion = normalize(question);

    return response.keywords.some((keyword) => {
        return normalizedQuestion === normalize(keyword);
    });
}

function hasNavigationIntent(question) {
    const normalizedQuestion = normalize(question);

    return NAVIGATION_PATTERNS.some((pattern) => {
        return pattern.test(normalizedQuestion);
    });
}

function shouldNavigate(question, response) {
    if (!response.action) {
        return false;
    }

    const directCommand = isDirectNavigationCommand(question, response);
    const navigationIntent = hasNavigationIntent(question);

    return directCommand || navigationIntent;
}

function navigateToDemoView(viewId) {
    if (!viewId) {
        return false;
    }

    const navigationButton = document.querySelector( `[data-demo-nav="${viewId}"]`);

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
    const activeView = document.querySelector(`[data-demo-view="${viewId}"]`);

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

function updateContextualSuggestions(
    viewId,
    buttons,
    language = "en"
) {
    const suggestionCollection = language === "bg"
        ? CONTEXTUAL_SUGGESTIONS_BG
        : CONTEXTUAL_SUGGESTIONS;

    const contextualSuggestions =
        suggestionCollection[viewId]
        || suggestionCollection.default;

    buttons.forEach((button, index) => {
        const suggestion = contextualSuggestions[index];

        if (!suggestion) {
            button.hidden = true;
            return;
        }

        button.hidden = false;
        button.textContent = suggestion.label;
        button.dataset.aiQuestion = suggestion.question;
    });
}

function getActiveDemoView() {
    const activeNavigationButton = document.querySelector(
        "[data-demo-nav].is-active"
    );

    return activeNavigationButton
        ? activeNavigationButton.dataset.demoNav
        : "default";
}

function getStoredChatLanguage() {
    const history = loadChatHistory();

    for (let index = history.length - 1; index >= 0; index--) {
        const language = history[index].language;

        if (language === "bg" || language === "en") {
            return language;
        }
    }

    return "en";
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
    window.history.replaceState({}, "", window.location.pathname);
}

function createMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `ai-message ${sender}`;
    message.textContent = text;

    return message;
}

function createActionButton(action, language) {
    const labels = ACTION_LABELS[action];

    if (!labels) {
        return null;
    }

    const button = document.createElement("button");

    button.className = "ai-message-action";
    button.type = "button";
    button.dataset.aiAction = action;
    button.textContent = labels[language] || labels.en;

    return button;
}

function createBotMessage(text, action = null, language = "en") {
    const message = createMessage(text, "bot");

    if (!action) {
        return message;
    }

    const actionButton = createActionButton(
        action,
        language
    );

    if (actionButton) {
        message.append(actionButton);
    }

    return message;
}

function loadChatHistory() {
    try {
        const storedHistory = sessionStorage.getItem(CHAT_HISTORY_STORAGE_KEY);

        if (!storedHistory) {
            return [];
        }

        const parsedHistory = JSON.parse(storedHistory);

        if (!Array.isArray(parsedHistory)) {
            return [];
        }

        return parsedHistory.filter((message) => {
            const validSender = message.sender === "user"
                || message.sender === "bot";

            const validText = typeof message.text === "string"
                && message.text.trim().length > 0;

            const validAction = message.action === null
                || message.action === undefined
                || Object.hasOwn(ACTION_LABELS, message.action);

            const validLanguage = message.language === "en"
                || message.language === "bg"
                || message.language === undefined;

            return validSender
                && validText
                && validAction
                && validLanguage;

        }).slice(-CHAT_HISTORY_LIMIT);

    } catch (error) {
        console.warn("ASky chat history could not be loaded.", error);
        return [];
    }
}

function saveChatHistory(history) {
    try {
        const limitedHistory = history.slice( -CHAT_HISTORY_LIMIT);
        sessionStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
        
    } catch (error) {
        console.warn("ASky chat history could not be saved.", error);
    }
}

function saveChatMessage(text, sender, action = null, language = "en") {
    const history = loadChatHistory();

    history.push({
        text,
        sender,
        action,
        language
    });

    saveChatHistory(history);
}

function restoreChatHistory(messagesContainer) {
    const history = loadChatHistory();

    if (!history.length) {
        return false;
    }

    messagesContainer.replaceChildren();

    history.forEach((historyMessage) => {
        const {
            text,
            sender,
            action = null,
            language = "en"
        } = historyMessage;

        const message = sender === "bot"
            ? createBotMessage(text, action, language)
            : createMessage(text, sender);

        messagesContainer.append(message);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return true;
}

function saveInitialGreeting(messagesContainer) {
    const existingHistory = loadChatHistory();

    if (existingHistory.length) {
        return;
    }

    const greeting = messagesContainer.querySelector(".ai-message.bot");

    if (!greeting) {
        return;
    }

    saveChatMessage(greeting.textContent.trim(), "bot");
}

export function initAiAssistant() {
    const assistant = document.querySelector("[data-ai-assistant]");

    if (!assistant) {
        return;
    }

    const launcher = assistant.querySelector("[data-ai-launcher]");
    const panel = assistant.querySelector("[data-ai-panel]");
    const closeButton = assistant.querySelector("[data-ai-close]");
    const clearButton = assistant.querySelector("[data-ai-clear]");
    const form = assistant.querySelector("[data-ai-form]");
    const input = assistant.querySelector("[data-ai-input]");
    const messages = assistant.querySelector("[data-ai-messages]");
    const suggestions = assistant.querySelectorAll("[data-ai-question]");
    const sendButton = assistant.querySelector(".ai-assistant-send");
    const hint = assistant.querySelector(".ai-assistant-hint");

    const demoNavigationButtons = document.querySelectorAll("[data-demo-nav]");

    let responseTimer = null;
    let clearConfirmationTimer = null;
    let typingIndicator = null;
    let isTyping = false;
    let currentLanguage = getStoredChatLanguage();

    assistant.setAttribute(
        "lang",
        currentLanguage
    );

    clearButton.dataset.confirming = "false";

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
            resetClearConfirmation();
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

    function resetClearConfirmation() {
        if (clearConfirmationTimer !== null) {
            window.clearTimeout(clearConfirmationTimer);
            clearConfirmationTimer = null;
        }

        clearButton.classList.remove("is-confirming");
        clearButton.textContent = "↻";
        clearButton.setAttribute(
            "aria-label",
            "Clear conversation"
        );

        clearButton.title = "Clear conversation";
        clearButton.dataset.confirming = "false";
    }

    function requestClearConversation() {
        const isConfirming =
            clearButton.dataset.confirming === "true";

        if (isConfirming) {
            clearConversation();
            return;
        }

        clearButton.classList.add("is-confirming");
        clearButton.textContent = "✓";
        clearButton.setAttribute(
            "aria-label",
            "Confirm clear conversation"
        );

        clearButton.title = "Click again to confirm";
        clearButton.dataset.confirming = "true";

        clearConfirmationTimer = window.setTimeout(() => {
            resetClearConfirmation();
        }, 3000);
    }

    function clearConversation() {
        cancelPendingResponse();
        resetClearConfirmation();

        try {
            sessionStorage.removeItem(
                CHAT_HISTORY_STORAGE_KEY
            );
        } catch (error) {
            console.warn(
                "ASky chat history could not be cleared.",
                error
            );
        }

        const greeting = currentLanguage === "bg"
            ? "Здравей! Аз съм ASky Assistant. С какво мога да ти помогна?"
            : "Hi! I’m ASky Assistant. How can I help you?";

        const greetingMessage = createMessage(
            greeting,
            "bot"
        );

        messages.replaceChildren(greetingMessage);

        saveChatMessage(
            greeting,
            "bot",
            null,
            currentLanguage
        );

        updateContextualSuggestions(
            getActiveDemoView(),
            suggestions,
            currentLanguage
        );

        scrollToLatest();
        input.focus();
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
        saveChatMessage(cleanQuestion, "user");

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

            const language = detectLanguage(cleanQuestion);

            currentLanguage = language;

            assistant.setAttribute(
                "lang",
                currentLanguage
            );

            updateContextualSuggestions(
                getActiveDemoView(),
                suggestions,
                currentLanguage
            );

            const response = findResponse(cleanQuestion);
            const navigationRequested = shouldNavigate(cleanQuestion, response);
            const responseText = getResponseText(response, language, navigationRequested);

            const messageAction = navigationRequested
                ? response.action
                : null;

            const botMessage = createBotMessage(responseText, messageAction, language);

            messages.append(botMessage);
            saveChatMessage(responseText, "bot", messageAction, language);
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

    clearButton.addEventListener("click", () => {
        requestClearConversation();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        answerQuestion(input.value);
    });

    messages.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-ai-action]");

        if (!actionButton || !messages.contains(actionButton)) {
            return;
        }

        const action = actionButton.dataset.aiAction;
        const navigatedInsideDemo = navigateToDemoView(action);

        if (navigatedInsideDemo) {
            setOpen(false);
            focusDemoView(action);
        }
    });

    suggestions.forEach((button) => {
        button.addEventListener("click", () => {
            answerQuestion(button.dataset.aiQuestion);
        });
    });

    demoNavigationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const viewId = button.dataset.demoNav;

            updateContextualSuggestions(
                viewId,
                suggestions,
                currentLanguage
            );
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

    const historyRestored = restoreChatHistory(messages);

    if (!historyRestored) {
        saveInitialGreeting(messages);
    }

    const initialView = getActiveDemoView();

    updateContextualSuggestions(
        initialView,
        suggestions,
        currentLanguage
    );

    openRequestedDemoView();
}

initAiAssistant();
