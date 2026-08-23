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

const initialDemoTransactions = [
    {
        id: "tx-netflix",
        recipient: "Netflix",
        description: "Subscription",
        date: "Today",
        time: "10:42",
        amount: -15.99,
        direction: "outgoing",
        status: "Completed",
        reference: "Monthly subscription",
        iban: "—",
    },
    {
        id: "tx-salary",
        recipient: "Salary",
        description: "Incoming transfer",
        date: "8 Aug",
        time: "09:15",
        amount: 2450.00,
        direction: "incoming",
        status: "Completed",
        reference: "August salary",
        iban: "BG•• •••• •••• 2048",
    },
    {
        id: "tx-maria",
        recipient: "Maria Petrova",
        description: "Money transfer",
        date: "7 Aug",
        time: "18:30",
        amount: -120.00,
        direction: "outgoing",
        status: "Completed",
        reference: "Dinner",
        iban: "BG•• •••• •••• 5678",
    },
    {
        id: "tx-electricity",
        recipient: "Electricity",
        description: "Utility bill",
        date: "6 Aug",
        time: "12:05",
        amount: -84.20,
        direction: "outgoing",
        status: "Completed",
        reference: "August electricity",
        iban: "—",
    },
];

const demoState = {
    balance: 12480.75,

    transactions: initialDemoTransactions.map(
        (transaction) => ({ ...transaction })
    ),

    settings: {
        hideBalance: false,
        currency: "EUR",
        compactDashboard: false,
        showNotifications: true,
    },
};

const transactionHistoryState = {
    filter: "all",
    search: "",
};

const reportsState = {
    period: "30d",
};

const REPORT_CATEGORIES = [
    {
        id: "food",
        label: "Food & Dining",
        color: "#d6b46a",
        keywords: [
            "food",
            "dinner",
            "restaurant",
            "cafe",
            "coffee",
            "groceries",
            "supermarket",
        ],
    },
    {
        id: "subscriptions",
        label: "Subscriptions",
        color: "#6e82c7",
        keywords: [
            "subscription",
            "netflix",
            "spotify",
            "youtube",
            "disney",
        ],
    },
    {
        id: "bills",
        label: "Bills & Utilities",
        color: "#c23b3b",
        keywords: [
            "bill",
            "utility",
            "electricity",
            "internet",
            "water",
            "rent",
            "mobile",
        ],
    },
    {
        id: "transport",
        label: "Transport",
        color: "#a873d1",
        keywords: [
            "transport",
            "taxi",
            "uber",
            "fuel",
            "parking",
            "metro",
        ],
    },
    {
        id: "shopping",
        label: "Shopping",
        color: "#d9825b",
        keywords: [
            "shopping",
            "shop",
            "amazon",
            "clothing",
            "store",
        ],
    },
    {
        id: "withdrawals",
        label: "Withdrawals",
        color: "#d85c68",
        keywords: [
            "withdraw",
            "withdrawal",
            "cash",
            "atm",
        ],
    },
    {
        id: "transfers",
        label: "Transfers",
        color: "#5ca9a1",
        keywords: [
            "transfer",
            "sent to",
        ],
    },
    {
        id: "other",
        label: "Other",
        color: "#77736b",
        keywords: [],
    },
];

function formatCurrency(amount) {
    const currency = demoState.settings?.currency || "EUR";

    const locale = currency === "BGN"
        ? "bg-BG"
        : "en-GB";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
}

function getTransactionInitials(name) {

    const parts = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!parts.length) {
        return "AS";
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}

function formatSignedCurrency(value) {
    if (value > 0) {
        return `+  ${formatCurrency(value)}`;
    }

    if (value < 0) {
        return `-  ${formatCurrency(Math.abs(value))}`;
    }

    return formatCurrency(0);
}

function escapeHtml(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) => characters[character]
    );
}

function exportTransactionStatement() {
    const completedTransactions = demoState.transactions.filter((transaction) => 
        transaction.status?.toLowerCase() === "completed"
    );

    const incoming = completedTransactions
        .filter((transaction) => transaction.direction === "incoming")
        .reduce((total, transaction) => total + Number(transaction.amount), 0
    );

    const outgoing = completedTransactions
        .filter((transaction) => transaction.direction === "outgoing")
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0
    );

    const netFlow = incoming - outgoing;

    const generatedAt = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",

    }).format(new Date());

    const statementId = `ASW-STMT-${Date.now().toString().slice(-10)}`;

    const transactionRows = demoState.transactions
        .map((transaction) => {
            const isIncoming = transaction.amount >= 0;

            const type = isIncoming
                ? "Incoming"
                : "Outgoing";

            const reference =
                transaction.reference || "—";

            const transactionId =
                transaction.transactionRef ||
                transaction.id ||
                "—";

            return `
                <tr>
                    <td>
                        <strong>
                            ${escapeHtml(transaction.date)}
                        </strong>

                        <span>
                            ${escapeHtml(transaction.time || "—")}
                        </span>
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(transaction.recipient)}
                        </strong>

                        <span>
                            ${escapeHtml(
                                transaction.description ||
                                "Transaction"
                            )}
                        </span>
                    </td>

                    <td>
                        <strong>${escapeHtml(type)}</strong>

                        <span>
                            ${escapeHtml(reference)}
                        </span>
                    </td>

                    <td class="amount ${
                        isIncoming ? "incoming" : "outgoing"
                    }">
                        ${escapeHtml(
                            formatSignedCurrency(
                                transaction.amount
                            )
                        )}
                    </td>

                    <td>
                        <span class="status">
                            ${escapeHtml(
                                transaction.status ||
                                "Completed"
                            )}
                        </span>
                    </td>

                    <td class="transaction-id">
                        ${escapeHtml(transactionId)}
                    </td>
                </tr>
            `;
        })
        .join("");

    const statementHtml = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">

            <title>ASWallet Demo Statement</title>

            <style>
                @page {
                    size: A4 landscape;
                    margin: 14mm;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    color: #181818;
                    background: #ffffff;
                    font-family: Inter, "Segoe UI", Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.5;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .statement {
                    width: 100%;
                    max-width: 1120px;
                    margin: 0 auto;
                }

                .statement-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 30px;
                    padding-bottom: 22px;
                    border-bottom: 2px solid #d6b46a;
                }

                .brand {
                    display: inline-flex;
                    align-items: baseline;
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -1.5px;
                }

                .brand-mark {
                    color: #b88c37;
                }

                .brand-name {
                    color: #181818;
                }

                .statement-label {
                    margin-top: 7px;
                    color: #6d675e;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                }

                .statement-meta {
                    display: grid;
                    gap: 5px;
                    min-width: 270px;
                    margin: 0;
                }

                .statement-meta div {
                    display: grid;
                    grid-template-columns: 95px 1fr;
                    gap: 14px;
                }

                .statement-meta dt {
                    color: #817a70;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.7px;
                    text-transform: uppercase;
                }

                .statement-meta dd {
                    margin: 0;
                    color: #242424;
                    font-weight: 600;
                    text-align: right;
                }

                .account-section {
                    display: grid;
                    grid-template-columns:
                        minmax(240px, 1.3fr)
                        repeat(3, minmax(150px, 1fr));
                    gap: 12px;
                    margin-top: 22px;
                }

                .summary-card {
                    min-height: 96px;
                    padding: 16px;
                    border: 1px solid #e3ded4;
                    border-radius: 12px;
                    background: #faf8f3;
                }

                .summary-card.balance {
                    color: #fff;
                    border-color: #aa843f;
                    background: linear-gradient(135deg, #c9a85e, #846326);
                }

                .summary-label {
                    display: block;
                    color: #817a70;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .balance .summary-label {
                    color: rgba(255, 255, 255, 0.76);
                }

                .summary-value {
                    display: block;
                    margin-top: 9px;
                    font-size: 21px;
                    font-weight: 800;
                    letter-spacing: -0.8px;
                }

                .summary-note {
                    display: block;
                    margin-top: 5px;
                    color: #817a70;
                    font-size: 10px;
                }

                .balance .summary-note {
                    color: rgba(255, 255, 255, 0.72);
                }

                .incoming-value {
                    color: #277a52;
                }

                .outgoing-value {
                    color: #a94747;
                }

                .transactions-heading {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                    margin: 25px 0 10px;
                }

                .transactions-heading h1 {
                    margin: 0;
                    font-size: 18px;
                    letter-spacing: -0.4px;
                }

                .transactions-heading p {
                    margin: 0;
                    color: #817a70;
                    font-size: 10px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                thead {
                    display: table-header-group;
                }

                th {
                    padding: 10px;
                    color: #6e675d;
                    background: #f2eee5;
                    border-bottom: 1px solid #d8d1c5;
                    font-size: 9px;
                    letter-spacing: 0.8px;
                    text-align: left;
                    text-transform: uppercase;
                }

                td {
                    padding: 11px 10px;
                    border-bottom: 1px solid #ece8e0;
                    vertical-align: top;
                    overflow-wrap: anywhere;
                }

                tr {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }

                td strong {
                    display: block;
                    font-size: 11px;
                }

                td span {
                    display: block;
                    margin-top: 3px;
                    color: #827b71;
                    font-size: 9px;
                }

                td.amount {
                    font-size: 11px;
                    font-weight: 800;
                    white-space: nowrap;
                }

                td.amount.incoming {
                    color: #277a52;
                }

                td.amount.outgoing {
                    color: #a94747;
                }

                .status {
                    display: inline-block;
                    margin: 0;
                    padding: 4px 7px;
                    border-radius: 999px;
                    color: #277a52;
                    background: #e8f5ed;
                    font-size: 8px;
                    font-weight: 700;
                }

                .transaction-id {
                    color: #6e675d;
                    font-family: "Cascadia Mono", Consolas, monospace;
                    font-size: 8px;
                }

                th:nth-child(1) {
                    width: 12%;
                }

                th:nth-child(2) {
                    width: 20%;
                }

                th:nth-child(3) {
                    width: 18%;
                }

                th:nth-child(4) {
                    width: 13%;
                }

                th:nth-child(5) {
                    width: 12%;
                }

                th:nth-child(6) {
                    width: 25%;
                }

                .empty-row {
                    padding: 30px;
                    color: #817a70;
                    text-align: center;
                }

                .statement-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 24px;
                    padding-top: 14px;
                    border-top: 1px solid #d8d1c5;
                    color: #817a70;
                    font-size: 9px;
                }

                .demo-warning {
                    color: #a94747;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                @media print {
                    body {
                        background: #fff;
                    }

                    .statement {
                        max-width: none;
                    }
                }
            </style>
        </head>

        <body>
            <main class="statement">
                <header class="statement-header">
                    <div>
                        <div class="brand">
                            <span class="brand-mark">AS</span>
                            <span class="brand-name">Wallet</span>
                        </div>

                        <p class="statement-label">
                            Demo Transaction Statement
                        </p>
                    </div>

                    <dl class="statement-meta">
                        <div>
                            <dt>Account</dt>
                            <dd>Alex · Demo user</dd>
                        </div>

                        <div>
                            <dt>Statement ID</dt>
                            <dd>${escapeHtml(statementId)}</dd>
                        </div>

                        <div>
                            <dt>Generated</dt>
                            <dd>${escapeHtml(generatedAt)}</dd>
                        </div>

                        <div>
                            <dt>Currency</dt>
                            <dd>EUR</dd>
                        </div>
                    </dl>
                </header>

                <section class="account-section">
                    <article class="summary-card balance">
                        <span class="summary-label">
                            Current balance
                        </span>

                        <strong class="summary-value">
                            ${escapeHtml(formatCurrency(demoState.balance))}
                        </strong>

                        <span class="summary-note">
                            Demo account balance
                        </span>
                    </article>

                    <article class="summary-card">
                        <span class="summary-label">
                            Money in
                        </span>

                        <strong
                            class="summary-value incoming-value">
                            ${escapeHtml(formatSignedCurrency(incoming))}
                        </strong>

                        <span class="summary-note">
                            Incoming transfers
                        </span>
                    </article>

                    <article class="summary-card">
                        <span class="summary-label">
                            Money out
                        </span>

                        <strong
                            class="summary-value outgoing-value">
                            ${escapeHtml(formatSignedCurrency(-outgoing))}
                        </strong>

                        <span class="summary-note">
                            Payments and transfers
                        </span>
                    </article>

                    <article class="summary-card">
                        <span class="summary-label">
                            Net flow
                        </span>

                        <strong class="summary-value">
                            ${escapeHtml(formatSignedCurrency(netFlow))}
                            
                        </strong>

                        <span class="summary-note">
                            Current demo period
                        </span>
                    </article>
                </section>

                <div class="transactions-heading">
                    <h1>Transaction history</h1>

                    <p>
                        ${demoState.transactions.length}
                        recorded transactions
                    </p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Recipient</th>
                            <th>Type / Reference</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            transactionRows ||
                            `
                                <tr>
                                    <td
                                        class="empty-row"
                                        colspan="6">
                                    
                                        No transactions available.
                                    </td>
                                </tr>
                            `
                        }
                    </tbody>
                </table>

                <footer class="statement-footer">
                    <span>
                        © 2026 ASWallet · Banking Reimagined.
                    </span>

                    <strong class="demo-warning">
                        Interactive demo — no real financial data
                    </strong>
                </footer>
            </main>
        </body>

        </html>
    `;

    const printFrame = document.createElement("iframe");

    printFrame.setAttribute(
        "title",
        "ASWallet PDF statement"
    );

    printFrame.setAttribute(
        "aria-hidden",
        "true"
    );

    Object.assign(printFrame.style, {
        position: "fixed",
        right: "0",
        bottom: "0",
        width: "1px",
        height: "1px",
        border: "0",
        opacity: "0",
        pointerEvents: "none",
    });

    document.body.append(printFrame);

    let isCleanedUp = false;
    let cleanupTimer = null;

    const cleanupPrintFrame = () => {
        if (isCleanedUp) {
            return;
        }

        isCleanedUp = true;

        window.clearTimeout(cleanupTimer);
        printFrame.remove();
    };

    printFrame.addEventListener(
        "load",
        async () => {
            const frameWindow = printFrame.contentWindow;
            const frameDocument = printFrame.contentDocument;

            if (!frameWindow || !frameDocument) {
                cleanupPrintFrame();

                window.alert(
                    "The PDF statement could not be opened."
                );

                return;
            }

            frameWindow.addEventListener("afterprint",
                cleanupPrintFrame, {
                    once: true,
                }
            );

            try {
                if (frameDocument.fonts?.ready) {
                    await frameDocument.fonts.ready;
                }

                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {

                        try {
                            frameWindow.focus();
                            frameWindow.print();

                        } catch (error) {
                            console.error("Unable to print statement:", error);

                            cleanupPrintFrame();
                            window.alert("The PDF statement could not be opened.");
                        }
                    });
                });

            } catch (error) {
                console.error("Unable to prepare statement:", error);
                cleanupPrintFrame();
            }
        }, 
        {
            once: true,
        }
    );

    cleanupTimer = window.setTimeout(cleanupPrintFrame, 60000);
    printFrame.srcdoc = statementHtml;
}

function initTransactionExport() {
    const exportButton = document.querySelector("[data-transactions-export]");

    if (!exportButton) {
        return;
    }

    exportButton.addEventListener("click", exportTransactionStatement);
}

function renderTransactionSummary() {

    const incomingElement = document.querySelector("[data-summary-incoming]");
    const outgoingElement = document.querySelector("[data-summary-outgoing]");
    const netElement = document.querySelector("[data-summary-net]");
    const completedTransactions = demoState.transactions.filter((transaction) => 
        transaction.status?.toLowerCase() === "completed"
    );

    const moneyIn = completedTransactions
        .filter((transaction) => transaction.direction === "incoming")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const moneyOut = completedTransactions
        .filter((transaction) => transaction.direction === "outgoing")
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount)), 0);

    const netFlow = moneyIn - moneyOut;

    if (incomingElement) {
        incomingElement.textContent = formatSignedCurrency(moneyIn);
    }

    if (outgoingElement) {
        outgoingElement.textContent = formatSignedCurrency(-moneyOut);
    }

    if (netElement) {
        netElement.textContent = formatSignedCurrency(netFlow);
    }
}

function getFilteredTransactions() {
    const activeFilter = transactionHistoryState.filter;
    const searchQuery = transactionHistoryState.search
        .trim()
        .toLowerCase();

    return demoState.transactions.filter((transaction) => {
        let matchesFilter = true;

        if (activeFilter === "incoming") {
            matchesFilter = transaction.amount > 0;
        }

        if (activeFilter === "outgoing") {
            matchesFilter = transaction.amount < 0;
        }

        if (activeFilter === "pending") {
            matchesFilter = transaction.status.toLowerCase() === "pending";
        }

        const searchableValues = [
            transaction.recipient,
            transaction.description,
            transaction.reference,
            transaction.transactionRef,
            transaction.iban,
            transaction.bank,
            transaction.status,
            transaction.date,
            transaction.time,
        ];

        const matchesSearch = !searchQuery || searchableValues.some((value) =>
            String(value || "")
                .toLowerCase()
                .includes(searchQuery)
            );

        return matchesFilter && matchesSearch;
    });
}

function renderFilteredTransactions() {
    const filteredTransactions = getFilteredTransactions();

    renderTransactions(filteredTransactions);
}

function renderTransactions(transactions = demoState.transactions) {
    const transactionList = document.querySelector("[data-transactions-list]");
    const emptyState = document.querySelector("[data-transactions-empty]");

    if (!transactionList || !emptyState) {
        return;
    }

    transactionList.replaceChildren();
    renderTransactionSummary();

    if (!transactions.length) {

        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    const groupedTransactions = new Map();

    transactions.forEach((transaction) => {
        const date = transaction.date || "Unknown date";

        if (!groupedTransactions.has(date)) {
            groupedTransactions.set(date, []);
        }

        groupedTransactions.get(date).push(transaction);
    });

    groupedTransactions.forEach((dateTransactions, date) => {
        const group = document.createElement("section");
        group.className = "transaction-date-group";

        const dateLabel = document.createElement("h2");
        dateLabel.className = "transaction-date-label";
        dateLabel.textContent = date;

        const list = document.createElement("ul");
        list.className = "transaction-list";

        dateTransactions.forEach((transaction) => {
            const listItem = document.createElement("li");

            const button = document.createElement("button");
            button.className = "transaction-item";
            button.type = "button";
            button.dataset.transactionId = transaction.id;

            const isIncoming = transaction.amount >= 0;
            const isPending =  transaction.status.toLowerCase() === "pending";

            button.classList.add(isIncoming 
                ? "is-incoming" 
                : "is-outgoing"
            );

            if (isPending) {
                button.classList.add("is-pending");
            }

            button.setAttribute(
                "aria-label",
                `View transaction with ${transaction.recipient}, ` +
                `${formatSignedCurrency(transaction.amount)}`
            );

            const avatar = document.createElement("span");
            avatar.className = "transaction-avatar";
            avatar.setAttribute("aria-hidden", "true");
            avatar.textContent = getTransactionInitials(transaction.recipient);

            const copy = document.createElement("span");
            copy.className = "transaction-copy";

            const recipient = document.createElement("strong");
            recipient.className = "transaction-recipient";
            recipient.textContent = transaction.recipient;

            const meta = document.createElement("span");
            meta.className = "transaction-meta";

            const description = document.createElement("span");
            description.textContent = transaction.description || "Transaction";

            const separator = document.createElement("span");
            separator.className = "transaction-meta-separator";
            separator.setAttribute("aria-hidden", "true");
            separator.textContent = "•";

            const time = document.createElement("span");
            time.textContent = transaction.time || "—";

            meta.append(description, separator, time);
            copy.append(recipient, meta);

            const right = document.createElement("span");
            right.className = "transaction-item-right";

            const amount = document.createElement("strong");
            amount.className = "transaction-amount";
            amount.textContent = formatSignedCurrency(transaction.amount);

            const status = document.createElement("span");
            status.className = "transaction-status";
            status.textContent = transaction.status || "Completed";

            right.append(amount, status);
            button.append(avatar, copy, right);

            listItem.append(button);
            list.append(listItem);
        });

        group.append(dateLabel, list);
        transactionList.append(group);
    });
}

function initTransactionFilters() {
    const searchInput = document.querySelector("[data-transactions-search]");

    const filterButtons = [...document.querySelectorAll("[data-transaction-filter]"),];

    if (!searchInput || !filterButtons.length) {
        return;
    }

    searchInput.addEventListener("input", () => {
        transactionHistoryState.search = searchInput.value;

        renderFilteredTransactions();
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.transactionFilter;

            transactionHistoryState.filter = selectedFilter || "all";
               

            filterButtons.forEach((filterButton) => {
                const isActive =  filterButton === button;

                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            renderFilteredTransactions();
        });
    });
}

let activeTransactionId = null;
let transactionDrawerApi = null;

function initTransactionDrawer() {
    const transactionList = document.querySelector("[data-transactions-list]");
    const drawer = document.querySelector("[data-transaction-drawer]");
    const drawerPanel = drawer?.querySelector(".transaction-drawer-panel");

    const closeButtons = [...document.querySelectorAll("[data-transaction-drawer-close]"),];

    const recipientElement = document.querySelector("[data-drawer-recipient]");
    const avatarElement = document.querySelector("[data-drawer-avatar]");
    const amountElement = document.querySelector("[data-drawer-amount]");
    const statusElement = document.querySelector("[data-drawer-status]");
    const descriptionElement = document.querySelector("[data-drawer-description]");
    const dateElement = document.querySelector("[data-drawer-date]");
    const ibanElement = document.querySelector("[data-drawer-iban]");
    const bankElement = document.querySelector("[data-drawer-bank]");
    const referenceElement = document.querySelector("[data-drawer-reference]");
    const idElement = document.querySelector("[data-drawer-id]");
    const feeElement = document.querySelector("[data-drawer-fee]");

    const requestSection = document.querySelector("[data-detail-request-section]");
    const requestStatus = document.querySelector("[data-detail-request-status]");
    const requestPerson = document.querySelector("[data-detail-request-person]");
    const requestReason = document.querySelector("[data-detail-request-reason]");
    const requestDue = document.querySelector("[data-detail-request-due]");
    const requestReference = document.querySelector("[data-detail-request-reference]");
    const requestLink = document.querySelector("[data-detail-request-link]");
    const requestCopyButton = document.querySelector("[data-detail-request-copy]");
    const requestCopyStatus = document.querySelector("[data-detail-request-copy-status]");

    const simulatePaymentButton = document.querySelector("[data-detail-request-pay]");

    if (!transactionList || !drawer || !drawerPanel) {
        return;
    }

    let lastFocusedElement = null;

    const openDrawer = (transaction) => {
        lastFocusedElement = document.activeElement;
        activeTransactionId = transaction.id;

        if (recipientElement) {
            recipientElement.textContent = transaction.recipient;
        }

        if (avatarElement) {
            avatarElement.textContent = getTransactionInitials(transaction.recipient);
        }

        if (amountElement) {
            const isIncoming = transaction.direction === "incoming" ||  transaction.amount >= 0;
            const isPending = transaction.status?.toLowerCase() === "pending";

            amountElement.textContent = formatSignedCurrency(transaction.amount);
            amountElement.classList.remove(
                "is-incoming",
                "is-outgoing",
                "is-pending"
            );

            if (isPending) {
                amountElement.classList.add("is-pending");

            } else if (isIncoming) {
                amountElement.classList.add("is-incoming");

            } else {
                amountElement.classList.add("is-outgoing");
            }
        }

        if (statusElement) {
            const normalizedStatus = transaction.status?.toLowerCase() ?? "completed";
            statusElement.classList.remove(
                "is-completed",
                "is-pending",
                "is-declined",
                "is-failed"
            );

            statusElement.classList.add(`is-${normalizedStatus}`);
            statusElement.textContent = transaction.status || "Completed";
        }

        if (descriptionElement) {
            descriptionElement.textContent = transaction.description || "Transaction";
        }

        if (dateElement) {
            dateElement.textContent =
                `${transaction.date || "—"}, ` +
                `${transaction.time || "—"}`;
        }

        if (ibanElement) {
            ibanElement.textContent = transaction.iban || "—";
        }

        if (bankElement) {
            bankElement.textContent = transaction.bank || "—";
        }

        if (referenceElement) {
            referenceElement.textContent = transaction.reference || "—";
        }

        if (idElement) {
            idElement.textContent =
                transaction.transactionRef ||
                transaction.id ||
                "—";
        }

        if (feeElement) {
            feeElement.textContent = formatCurrency(0);
        }

        const isPaymentRequest =
            transaction.description?.toLowerCase() === "money request" ||
            transaction.bank?.toLowerCase() === "payment request";

        drawer.classList.toggle(
            "is-payment-request",
            isPaymentRequest
        );

        if (requestSection) {
            requestSection.hidden = !isPaymentRequest;
        }

        if (isPaymentRequest) {
            const transactionReference = transaction.transactionRef ?? transaction.id;
            const paymentUrl = `https://aswallet.eu/pay/${transactionReference}`;

            if (requestStatus) {
                requestStatus.textContent = transaction.status ?? "Pending";
            }

            if (requestPerson) {
                requestPerson.textContent = transaction.recipient ?? "—";
            }

            if (requestReason) {
                requestReason.textContent = transaction.reference || "No reason added";
            }

            if (requestDue) {
                requestDue.textContent = transaction.dueDate || "Today";
            }

            if (requestReference) {
                requestReference.textContent = transactionReference;
            }

            if (requestLink) {
                requestLink.value = paymentUrl;
            }

            if (requestCopyButton) {
                requestCopyButton.dataset.paymentUrl = paymentUrl;
                requestCopyButton.textContent = "Copy";
                requestCopyButton.classList.remove("is-copied");
            }

            if (requestCopyStatus) {
                requestCopyStatus.textContent = "";
            }

        } else {
        
        
            if (requestLink) {
                requestLink.value = "";
            }

            if (requestCopyButton) {
                delete requestCopyButton.dataset.paymentUrl;
                requestCopyButton.textContent = "Copy";
                requestCopyButton.classList.remove("is-copied");
            }

            if (requestCopyStatus) {
                requestCopyStatus.textContent = "";
            }
        }

        const isPendingRequest = isPaymentRequest &&
            transaction.status?.toLowerCase() === "pending";

        if (simulatePaymentButton) {

            simulatePaymentButton.hidden = !isPendingRequest;
            simulatePaymentButton.dataset.transactionId = isPendingRequest
                ? transaction.id 
                : "";
        }

        drawer.hidden = false;
        document.body.classList.add("transaction-drawer-open");

        const closeButton = drawer.querySelector(".transaction-drawer-close");

        window.requestAnimationFrame(() => {
            closeButton?.focus();
        });
    };

    const closeDrawer = () => {
        if (drawer.hidden) {
            return;
        }

        drawer.hidden = true;

        document.body.classList.remove(
            "transaction-drawer-open"
        );

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") { 
            lastFocusedElement.focus();
        }
    };

    transactionDrawerApi = {
        openById(transactionId) {

            const transaction = demoState.transactions.find((item) => 
                item.id === transactionId);

            if (!transaction) {
                return false;
            }

            openDrawer(transaction);
            return true;
        },
    };

    requestCopyButton?.addEventListener("click", async () => {
    
        const paymentUrl = requestCopyButton.dataset.paymentUrl;

        if (!paymentUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(paymentUrl);

        } catch {
            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = paymentUrl;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            document.execCommand("copy");
            temporaryInput.remove();
        }

        requestCopyButton.textContent = "Copied";
        requestCopyButton.classList.add("is-copied");

        if (requestCopyStatus) {
            requestCopyStatus.textContent = "Payment link copied.";
        }

        window.setTimeout(() => {
            requestCopyButton.textContent = "Copy";
            requestCopyButton.classList.remove("is-copied");

            if (requestCopyStatus) {
                requestCopyStatus.textContent = "";
            }

        }, 2200);
    });

    transactionList.addEventListener("click", (event) => {
        const transactionButton = event.target.closest( "[data-transaction-id]");

        if (!transactionButton) {
            return;
        }

        const transactionId = transactionButton.dataset.transactionId;
        const transaction = demoState.transactions.find((item) => item.id === transactionId);

        if (!transaction) {
            return;
        }

        openDrawer(transaction);
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", (event) => {
        if (drawer.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeDrawer();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = [
            ...drawerPanel.querySelectorAll(
                'button:not([disabled]), ' +
                'a[href], ' +
                'input:not([disabled]), ' +
                'select:not([disabled]), ' +
                'textarea:not([disabled]), ' +
                '[tabindex]:not([tabindex="-1"])'
            ),
        ];

        if (!focusableElements.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement =  focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

        if (!event.shiftKey &&  document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });
}

function renderDemoBalance() {
    const balanceCard = document.querySelector("[data-balance-card]");
    const balanceAmount = document.querySelector("[data-balance-amount]");
    const balanceToggle = document.querySelector("[data-balance-toggle]");

    if (!balanceCard || !balanceAmount) {
        return;
    }

    const formattedBalance = formatCurrency(demoState.balance);

    balanceAmount.dataset.visible = formattedBalance;
    balanceAmount.dataset.hidden = "••••••";

    const isHidden = Boolean(demoState.settings.hideBalance);

    balanceCard.classList.toggle(
        "is-hidden",
        isHidden
    );

    balanceAmount.textContent = isHidden
        ? balanceAmount.dataset.hidden
        : formattedBalance;

    if (balanceToggle) {
        balanceToggle.setAttribute(
            "aria-pressed",
            String(isHidden)
        );

        balanceToggle.setAttribute(
            "aria-label",
            isHidden
                ? "Show balance"
                : "Hide balance"
        );
    }

    const hideBalanceInput = document.querySelector(
        '[data-setting="hideBalance"]'
    );

    if (hideBalanceInput) {
        hideBalanceInput.checked = isHidden;
    }
}

function renderDashboardTransactions() {
    const tableBody = document.querySelector( "[data-dashboard-transactions]");

    if (!tableBody) {
        return;
    }

    const recentTransactions = demoState.transactions.slice(0, 4);

    const rows = recentTransactions.map((transaction) => {
        const normalizedStatus = transaction.status?.toLowerCase() ?? "completed";
        const statusClass = `is-${normalizedStatus}`;
        const row = document.createElement("tr");

        row.classList.add(statusClass);

        if (transaction.isNew) {
            row.classList.add("is-new");

            window.setTimeout(() => {
                row.classList.remove("is-new");
                transaction.isNew = false;

            }, 1800);
        }

        const transactionCell = document.createElement("td");
        transactionCell.dataset.label = "Transaction";

        const transactionName = document.createElement("span");
        transactionName.className = "tx-name";
        transactionName.textContent = transaction.recipient;

        transactionCell.append(transactionName);

        const dateCell = document.createElement("td");
        dateCell.dataset.label = "Date";
        dateCell.textContent = transaction.date;

        const amountCell = document.createElement("td");
        amountCell.dataset.label = "Amount";

        const amount = document.createElement("span");
        const isIncoming =
            transaction.direction === "incoming" ||
            transaction.amount >= 0;

        const amountStatusClass = normalizedStatus === "pending"
            ? "is-pending"
            : isIncoming
                ? "is-in"
                : "is-out";

        amount.className = `tx-amount ${amountStatusClass}`;

        const amountPrefix = isIncoming ? "+  " : "-  ";

        amount.textContent =
            `${amountPrefix}${formatCurrency(Math.abs(transaction.amount)
        )}`;

        amountCell.append(amount);

        const statusCell = document.createElement("td");
        statusCell.dataset.label = "Status";

        const status = document.createElement("span");
        status.className = `tx-status ${statusClass}`;
        status.setAttribute("aria-live", "polite");
        status.textContent = transaction.status;

        statusCell.append(status);

        row.append(
            transactionCell,
            dateCell,
            amountCell,
            statusCell
        );

        return row;
    });

    tableBody.replaceChildren(...rows);
}

let notificationCenterApi = null;

function initNotificationCenter() {

    const notificationCenter = document.querySelector("[data-notification-center]");
    const toggleButton = notificationCenter?.querySelector( "[data-notification-toggle]");
    const panel = notificationCenter?.querySelector("[data-notification-panel]");
    const badge = notificationCenter?.querySelector("[data-notification-badge]");
    const markAllReadButton = notificationCenter?.querySelector("[data-notification-read-all]");
    const notificationList = notificationCenter?.querySelector("[data-notification-list]");
    const emptyState = notificationCenter?.querySelector("[data-notification-empty]");
    const viewAllButton = notificationCenter?.querySelector("[data-notification-view-all]");

    if (!notificationCenter || !toggleButton || !panel) {
        return;
    }

    const MAX_NOTIFICATIONS = 6;

    function getNotificationItems() {
        return [...notificationCenter.querySelectorAll("[data-notification-id]"),];
    }

    function getUnreadItems() {
        return getNotificationItems().filter((item) =>
            item.classList.contains("is-unread")
        );
    }

    function formatNotificationTime(dateValue) {
        const timestamp = new Date(dateValue).getTime();

        if (Number.isNaN(timestamp)) {
            return "Just now";
        }

        const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

        if (elapsedSeconds < 60) {
            return "Just now";
        }

        const elapsedMinutes = Math.floor(elapsedSeconds / 60);

        if (elapsedMinutes < 60) {
            return `${elapsedMinutes} min ago`;
        }

        const elapsedHours = Math.floor( elapsedMinutes / 60);

        if (elapsedHours < 24) {

            return elapsedHours === 1
                ? "1 hr ago"
                : `${elapsedHours} hrs ago`;
        }

        const elapsedDays = Math.floor(elapsedHours / 24);

        return elapsedDays === 1
            ? "1 day ago"
            : `${elapsedDays} days ago`;
    }

    function initializeNotificationTimes() {
        const timeElements = notificationCenter.querySelectorAll("[data-notification-time]");

        timeElements.forEach((timeElement) => {

            if (!timeElement.dateTime) {
                const offsetMinutes = Number(timeElement.dataset.offsetMinutes || 0);
                const createdAt = new Date( Date.now() - offsetMinutes * 60_000);

                timeElement.dateTime = createdAt.toISOString();
            }
        });
    }

    function updateNotificationTimes() {
        const timeElements = notificationCenter.querySelectorAll("[data-notification-time]");

        timeElements.forEach((timeElement) => {
            timeElement.textContent = formatNotificationTime(
                timeElement.dateTime
            );
        });
    }

    function trimNotificationList() {
        const notificationItems = getNotificationItems();

        notificationItems
            .slice(MAX_NOTIFICATIONS)
            .forEach((item) => {
                item.remove();
            });
    }

    function isPanelOpen() {
        return !panel.hidden;
    }

    function updateNotificationState() {
        
        const notificationItems = getNotificationItems();
        const unreadItems = getUnreadItems();
        const unreadCount = unreadItems.length;
        const hasNotifications = notificationItems.length > 0;

        if (badge) {
            badge.textContent = String(unreadCount);
            badge.hidden = unreadCount === 0;

            badge.setAttribute("aria-label",
                `${unreadCount} unread ${
                    unreadCount === 1
                        ? "notification"
                        : "notifications"
                }`
            );
        }

        if (markAllReadButton) {
            markAllReadButton.disabled = unreadCount === 0;
        }

        if (notificationList) {
            notificationList.hidden = !hasNotifications;
        }

        if (emptyState) {
            emptyState.hidden = hasNotifications;
        }

        if (!isPanelOpen()) {
            toggleButton.setAttribute("aria-label", unreadCount > 0
                ? `Open notifications, ${unreadCount} unread`
                : "Open notifications"
            );
        }
    }

    function markNotificationAsRead(notificationItem) {
        if (!notificationItem) {
            return;
        }

        notificationItem.classList.remove("is-unread");
        updateNotificationState();
    }

    function markAllNotificationsAsRead() {
        const unreadItems = getUnreadItems();

        unreadItems.forEach((item) => {
            item.classList.remove("is-unread");
        });

        updateNotificationState();
    }

    function addNotification({
        id,
        title,
        message,
        time = "Just now",
        icon = "AS",
        type = "default",
        transactionId = null,
    }) {
        if (!notificationList) {
            return;
        }

        const notificationItem = document.createElement("button");

        notificationItem.type = "button";
        notificationItem.className = "notification-item is-unread";
        notificationItem.dataset.notificationId = id || `notification-${Date.now()}`;

        if (transactionId) {
            notificationItem.dataset.notificationTransactionId = transactionId;
        }

        let iconClass = "notification-item-icon";

        if (type === "request") {
            iconClass += " notification-item-icon--request";
        }

        if (type === "success") {
            iconClass += " notification-item-icon--success";
        }

        if (type === "transfer") {
            iconClass += " notification-item-icon--transfer";
        }

        if (type === "deposit") {
            iconClass += " notification-item-icon--deposit";
        }

        if (type === "withdraw") {
            iconClass += " notification-item-icon--withdraw";
        }

        notificationItem.innerHTML = `
        <span
            class="${iconClass}"
            aria-hidden="true">
        
            ${escapeHtml(icon)}
        </span>

        <span class="notification-item-content">
            <strong>${escapeHtml(title)}</strong>

            <span>
                ${escapeHtml(message)}
            </span>

            <time
                datetime="${new Date().toISOString()}"
                data-notification-time>

                ${escapeHtml(time)}
            </time>
        </span>

        <span
            class="notification-unread-dot"
            aria-hidden="true">
        </span>
    `;

        notificationList.prepend(notificationItem);

        trimNotificationList();
        updateNotificationTimes();
        updateNotificationState();

        notificationItem.classList.add("is-new");

        window.setTimeout(() => {
            notificationItem.classList.remove("is-new");
        }, 600);
    }

    function openPanel() {
        panel.hidden = false;

        toggleButton.setAttribute("aria-expanded", "true");
        toggleButton.setAttribute("aria-label", "Close notifications");
    }

    function closePanel({ restoreFocus = false } = {}) {
        if (!isPanelOpen()) {
            return;
        }

        panel.hidden = true;
        toggleButton.setAttribute("aria-expanded", "false");
        updateNotificationState();

        if (restoreFocus) {
            toggleButton.focus();
        }
    }

    function togglePanel() {
        if (isPanelOpen()) {
            closePanel();

            return;
        }

        openPanel();
    }

    toggleButton.addEventListener("click", togglePanel);

    notificationCenter.addEventListener("click", (event) => {
        const notificationItem = event.target.closest("[data-notification-id]");

        if (!notificationItem) {
            return;
        }

        markNotificationAsRead(notificationItem);
        const transactionId = notificationItem.dataset.notificationTransactionId;

        if (!transactionId) {
            return;
        }

        closePanel();

        document.querySelector('[data-demo-nav="transactions"]')
            ?.click();

        window.requestAnimationFrame(() => {
            transactionDrawerApi?.openById(transactionId);
        });
    });

    markAllReadButton?.addEventListener("click",
        markAllNotificationsAsRead
    );

    viewAllButton?.addEventListener("click", () => {
        closePanel();

        document.querySelector('[data-demo-nav="transactions"]')
            ?.click();
    });

    document.addEventListener("click", (event) => {
        if (isPanelOpen() && !notificationCenter.contains(event.target)) {
            closePanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isPanelOpen()) {
            closePanel({ restoreFocus: true });
        }
    });

    notificationCenterApi = {
        add: addNotification,
    };

    initializeNotificationTimes();
    updateNotificationTimes();

    window.setInterval(() => {
        updateNotificationTimes();

    }, 30_000);

    updateNotificationState();
}

function getReportTransactionDate(transaction) {
    if (transaction.completedAt) {
        return new Date(transaction.completedAt);
    }

    if (transaction.createdAt) {
        return new Date(transaction.createdAt);
    }

    const dateLabel = String(transaction.date || "").trim();

    if (dateLabel.toLowerCase() === "today") {
        return new Date();
    }

    const monthIndexes = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
    };

    const dateParts = dateLabel.match(
        /^(\d{1,2})\s+([a-z]{3})$/i
    );

    if (!dateParts) {
        return null;
    }

    const day = Number(dateParts[1]);
    const month = monthIndexes[
        dateParts[2].toLowerCase()
    ];

    if (month === undefined) {
        return null;
    }

    const now = new Date();

    const parsedDate = new Date(
        now.getFullYear(),
        month,
        day
    );

    if (parsedDate > now) {
        parsedDate.setFullYear(
            parsedDate.getFullYear() - 1
        );
    }

    return parsedDate;
}

function getReportTransactions() {
    const completedTransactions =
        demoState.transactions.filter((transaction) =>
            transaction.status?.toLowerCase() === "completed"
        );

    if (reportsState.period === "all") {
        return completedTransactions;
    }

    const periodDays = reportsState.period === "7d"
        ? 7
        : 30;

    const periodStart = new Date();

    periodStart.setHours(0, 0, 0, 0);
    periodStart.setDate(
        periodStart.getDate() - periodDays + 1
    );

    return completedTransactions.filter((transaction) => {
        const transactionDate =
            getReportTransactionDate(transaction);

        if (!transactionDate) {
            return false;
        }

        return transactionDate >= periodStart;
    });
}

function calculateReportsSummary(transactions) {
    const income = transactions
        .filter((transaction) =>
            Number(transaction.amount) > 0
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const expenses = transactions
        .filter((transaction) =>
            Number(transaction.amount) < 0
        )
        .reduce(
            (total, transaction) =>
                total + Math.abs(Number(transaction.amount)),
            0
        );

    return {
        income,
        expenses,
        netFlow: income - expenses,
        transactionCount: transactions.length,
    };
}

function createReportChartGroup(
    label,
    startDate,
    endDate
) {
    return {
        label,
        startDate,
        endDate,
        income: 0,
        expenses: 0,
    };
}

function getStartOfDay(dateValue) {
    const date = new Date(dateValue);

    date.setHours(0, 0, 0, 0);

    return date;
}

function getEndOfDay(dateValue) {
    const date = new Date(dateValue);

    date.setHours(23, 59, 59, 999);

    return date;
}

function formatReportChartDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
    }).format(date);
}

function createSevenDayChartGroups() {
    const groups = [];
    const today = getStartOfDay(new Date());

    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        const date = new Date(today);

        date.setDate(
            date.getDate() - daysAgo
        );

        const label = new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
        }).format(date);

        groups.push(
            createReportChartGroup(
                label,
                getStartOfDay(date),
                getEndOfDay(date)
            )
        );
    }

    return groups;
}

function createThirtyDayChartGroups() {
    const groups = [];
    const today = getStartOfDay(new Date());
    const periodStart = new Date(today);

    periodStart.setDate(
        periodStart.getDate() - 29
    );

    for (let index = 0; index < 5; index++) {
        const startDate = new Date(periodStart);

        startDate.setDate(
            startDate.getDate() + index * 6
        );

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() + 5
        );

        const limitedEndDate = endDate > today
            ? today
            : endDate;

        const label =
            `${formatReportChartDate(startDate)}–` +
            `${formatReportChartDate(limitedEndDate)}`;

        groups.push(
            createReportChartGroup(
                label,
                getStartOfDay(startDate),
                getEndOfDay(limitedEndDate)
            )
        );
    }

    return groups;
}

function createAllTimeChartGroups(transactions) {
    const monthGroups = new Map();

    transactions.forEach((transaction) => {
        const transactionDate =
            getReportTransactionDate(transaction);

        if (!transactionDate) {
            return;
        }

        const monthKey =
            `${transactionDate.getFullYear()}-` +
            `${String(
                transactionDate.getMonth() + 1
            ).padStart(2, "0")}`;

        if (!monthGroups.has(monthKey)) {
            const startDate = new Date(
                transactionDate.getFullYear(),
                transactionDate.getMonth(),
                1
            );

            const endDate = new Date(
                transactionDate.getFullYear(),
                transactionDate.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            const label = new Intl.DateTimeFormat(
                "en-GB",
                {
                    month: "short",
                    year: "2-digit",
                }
            ).format(transactionDate);

            monthGroups.set(
                monthKey,
                createReportChartGroup(
                    label,
                    startDate,
                    endDate
                )
            );
        }
    });

    const groups = [...monthGroups.entries()]
        .sort(([firstKey], [secondKey]) =>
            firstKey.localeCompare(secondKey)
        )
        .map(([, group]) => group)
        .slice(-6);

    if (!groups.length) {
        const now = new Date();

        groups.push(
            createReportChartGroup(
                new Intl.DateTimeFormat("en-GB", {
                    month: "short",
                    year: "2-digit",
                }).format(now),
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                ),
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                )
            )
        );
    }

    return groups;
}

function getReportChartGroups(transactions) {
    let groups;

    if (reportsState.period === "7d") {
        groups = createSevenDayChartGroups();

    } else if (reportsState.period === "all") {
        groups = createAllTimeChartGroups(
            transactions
        );

    } else {
        groups = createThirtyDayChartGroups();
    }

    transactions.forEach((transaction) => {
        const transactionDate =
            getReportTransactionDate(transaction);

        if (!transactionDate) {
            return;
        }

        const group = groups.find((item) =>
            transactionDate >= item.startDate &&
            transactionDate <= item.endDate
        );

        if (!group) {
            return;
        }

        const amount = Number(transaction.amount);

        if (amount > 0) {
            group.income += amount;
        }

        if (amount < 0) {
            group.expenses += Math.abs(amount);
        }
    });

    return groups;
}

function renderReportsCashFlow(transactions) {
    const barsContainer = document.querySelector(
        "[data-report-chart-bars]"
    );

    const labelsContainer = document.querySelector(
        "[data-report-chart-labels]"
    );

    const chart = document.querySelector(
        "[data-report-chart]"
    );

    if (!barsContainer || !labelsContainer) {
        return;
    }

    const groups = getReportChartGroups(transactions);

    const maximumValue = Math.max(
        1,
        ...groups.flatMap((group) => [
            group.income,
            group.expenses,
        ])
    );

    const groupElements = groups.map((group) => {
        const incomeHeight = group.income > 0
            ? Math.max(
                4,
                (group.income / maximumValue) * 100
            )
            : 0;

        const expenseHeight = group.expenses > 0
            ? Math.max(
                4,
                (group.expenses / maximumValue) * 100
            )
            : 0;

        const groupElement =
            document.createElement("div");

        groupElement.className =
            "reports-chart-group";

        groupElement.innerHTML = `
            <span
                class="reports-chart-bar reports-chart-bar--income"
                style="height: ${incomeHeight}%"
                title="Income: ${formatCurrency(group.income)}"
            ></span>

            <span
                class="reports-chart-bar reports-chart-bar--expense"
                style="height: ${expenseHeight}%"
                title="Expenses: ${formatCurrency(group.expenses)}"
            ></span>
        `;

        return groupElement;
    });

    const labelElements = groups.map((group) => {
        const labelElement =
            document.createElement("span");

        labelElement.textContent = group.label;

        return labelElement;
    });

    barsContainer.replaceChildren(
        ...groupElements
    );

    labelsContainer.replaceChildren(
        ...labelElements
    );

    if (chart) {
        const totalIncome = groups.reduce(
            (total, group) =>
                total + group.income,
            0
        );

        const totalExpenses = groups.reduce(
            (total, group) =>
                total + group.expenses,
            0
        );

        chart.setAttribute(
            "aria-label",
            `Cash flow chart. Income ${formatCurrency(
                totalIncome
            )}. Expenses ${formatCurrency(
                totalExpenses
            )}.`
        );
    }
}

function getTransactionCategory(transaction) {
    const searchableText = [
        transaction.recipient,
        transaction.description,
        transaction.reference,
        transaction.bank,
    ]
        .map((value) =>
            String(value || "").toLowerCase()
        )
        .join(" ");

    return REPORT_CATEGORIES.find((category) =>
        category.id !== "other" &&
        category.keywords.some((keyword) =>
            searchableText.includes(keyword)
        )
    ) || REPORT_CATEGORIES.find(
        (category) => category.id === "other"
    );
}

function calculateSpendingCategories(transactions) {
    const categoryTotals = new Map();

    transactions
        .filter((transaction) =>
            Number(transaction.amount) < 0
        )
        .forEach((transaction) => {
            const category =
                getTransactionCategory(transaction);

            const currentAmount =
                categoryTotals.get(category.id) || 0;

            categoryTotals.set(
                category.id,
                currentAmount +
                    Math.abs(Number(transaction.amount))
            );
        });

    const totalExpenses = [
        ...categoryTotals.values(),
    ].reduce(
        (total, amount) => total + amount,
        0
    );

    return REPORT_CATEGORIES
        .filter((category) =>
            categoryTotals.has(category.id)
        )
        .map((category) => {
            const amount =
                categoryTotals.get(category.id);

            const percentage = totalExpenses > 0
                ? (amount / totalExpenses) * 100
                : 0;

            return {
                ...category,
                amount,
                percentage,
            };
        })
        .sort(
            (firstCategory, secondCategory) =>
                secondCategory.amount -
                firstCategory.amount
        );
}

function createReportsDonutGradient(categories) {
    if (!categories.length) {
        return (
            "conic-gradient(" +
            "rgba(214, 180, 106, 0.12) " +
            "0deg 360deg)"
        );
    }

    let currentAngle = 0;

    const segments = categories.map((category) => {
        const startAngle = currentAngle;

        const categoryAngle =
            (category.percentage / 100) * 360;

        const endAngle =
            startAngle + categoryAngle;

        currentAngle = endAngle;

        return (
            `${category.color} ` +
            `${startAngle}deg ${endAngle}deg`
        );
    });

    return `conic-gradient(${segments.join(", ")})`;
}

function renderReportsSpending(transactions) {
    const donut = document.querySelector(
        "[data-report-donut]"
    );

    const donutTotal = document.querySelector(
        "[data-report-donut-total]"
    );

    const categoryList = document.querySelector(
        "[data-report-category-list]"
    );

    if (!donut || !donutTotal || !categoryList) {
        return [];
    }

    const categories =
        calculateSpendingCategories(transactions);

    const totalExpenses = categories.reduce(
        (total, category) =>
            total + category.amount,
        0
    );

    donutTotal.textContent =
        formatCurrency(totalExpenses);

    donut.style.background =
        createReportsDonutGradient(categories);

    donut.setAttribute(
        "aria-label",
        categories.length
            ? `Spending distribution. Total ${formatCurrency(
                totalExpenses
            )}.`
            : "No spending data for this period."
    );

    if (!categories.length) {
        categoryList.innerHTML = `
            <div class="reports-empty-state">
                <span aria-hidden="true">◎</span>

                <strong>No spending data</strong>

                <p>
                    Completed outgoing transactions
                    will appear here.
                </p>
            </div>
        `;

        return [];
    }

    const categoryElements = categories.map(
        (category) => {
            const categoryElement =
                document.createElement("div");

            categoryElement.className =
                "reports-category-item";

            categoryElement.innerHTML = `
                <div class="reports-category-heading">
                    <span
                        class="reports-category-dot"
                        style="background: ${category.color}"
                        aria-hidden="true"
                    ></span>

                    <span class="reports-category-name">
                        ${category.label}
                    </span>

                    <strong class="reports-category-amount">
                        ${formatCurrency(category.amount)}
                    </strong>
                </div>

                <div class="reports-category-progress">
                    <span
                        style="
                            width: ${category.percentage}%;
                            background: ${category.color};
                        "
                    ></span>
                </div>

                <span class="reports-category-percentage">
                    ${category.percentage.toFixed(1)}%
                </span>
            `;

            return categoryElement;
        }
    );

    categoryList.replaceChildren(
        ...categoryElements
    );

    return categories;
}

function renderReportsInsight(
    summary,
    categories
) {
    const insightTitle = document.querySelector(
        "[data-report-insight-title]"
    );

    const insightText = document.querySelector(
        "[data-report-insight-text]"
    );

    if (!insightTitle || !insightText) {
        return;
    }

    if (summary.transactionCount === 0) {
        insightTitle.textContent =
            "No completed activity yet";

        insightText.textContent =
            "Complete a wallet operation to generate " +
            "your financial insight.";

        return;
    }

    const topCategory = categories[0];

    if (summary.netFlow < 0) {
        insightTitle.textContent =
            "Your expenses are above your income";

        insightText.textContent = topCategory
            ? `${topCategory.label} is your largest ` +
              `spending category at ` +
              `${topCategory.percentage.toFixed(1)}%.`
            : "Review your outgoing transactions " +
              "for this period.";

        return;
    }

    if (topCategory) {
        insightTitle.textContent =
            `${topCategory.label} leads your spending`;

        insightText.textContent =
            `${topCategory.percentage.toFixed(1)}% of ` +
            `your expenses belong to this category. ` +
            `Your net flow remains positive at ` +
            `${formatCurrency(summary.netFlow)}.`;

        return;
    }

    insightTitle.textContent =
        "Your cash flow is positive";

    insightText.textContent =
        `You finished this period with a net flow of ` +
        `${formatCurrency(summary.netFlow)}.`;
}

function renderReportsDashboard() {
    const incomeElement = document.querySelector(
        "[data-report-income]"
    );

    const expensesElement = document.querySelector(
        "[data-report-expenses]"
    );

    const netFlowElement = document.querySelector(
        "[data-report-net-flow]"
    );

    const transactionCountElement = document.querySelector(
        "[data-report-transaction-count]"
    );

    const netLabelElement = document.querySelector(
        "[data-report-net-label]"
    );

    if (
        !incomeElement ||
        !expensesElement ||
        !netFlowElement ||
        !transactionCountElement
    ) {
        return;
    }

    const transactions = getReportTransactions();
    const summary = calculateReportsSummary(transactions);

    incomeElement.textContent =
        formatCurrency(summary.income);

    expensesElement.textContent =
        formatCurrency(summary.expenses);

    netFlowElement.textContent =
        formatSignedCurrency(summary.netFlow);

    transactionCountElement.textContent =
        String(summary.transactionCount);

    netFlowElement.classList.toggle(
        "is-positive",
        summary.netFlow > 0
    );

    netFlowElement.classList.toggle(
        "is-negative",
        summary.netFlow < 0
    );

    if (netLabelElement) {
        if (summary.netFlow > 0) {
            netLabelElement.textContent =
                "Positive balance for this period";

        } else if (summary.netFlow < 0) {
            netLabelElement.textContent =
                "Expenses exceeded income";

        } else {
            netLabelElement.textContent =
                "Income and expenses are balanced";
        }
    }

    renderReportsCashFlow(transactions);

    const categories =
        renderReportsSpending(transactions);

    renderReportsInsight(
        summary,
        categories
    );
}

function initReportsDashboard() {
    const periodButtons = [
        ...document.querySelectorAll(
            "[data-report-period]"
        ),
    ];

    if (!periodButtons.length) {
        return;
    }

    function selectReportPeriod(button) {
        reportsState.period =
            button.dataset.reportPeriod || "30d";

        periodButtons.forEach((periodButton) => {
            const isActive =
                periodButton === button;

            periodButton.classList.toggle(
                "is-active",
                isActive
            );

            periodButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderReportsDashboard();
    }

    periodButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            selectReportPeriod(button);
        });

        button.addEventListener("keydown", (event) => {
            let nextIndex = index;

            if (
                event.key === "ArrowRight" ||
                event.key === "ArrowDown"
            ) {
                nextIndex =
                    (index + 1) % periodButtons.length;

            } else if (
                event.key === "ArrowLeft" ||
                event.key === "ArrowUp"
            ) {
                nextIndex =
                    (index - 1 + periodButtons.length) %
                    periodButtons.length;

            } else if (event.key === "Home") {
                nextIndex = 0;

            } else if (event.key === "End") {
                nextIndex =
                    periodButtons.length - 1;

            } else {
                return;
            }

            event.preventDefault();

            const nextButton =
                periodButtons[nextIndex];

            nextButton.focus();
            selectReportPeriod(nextButton);
        });
    });

    renderReportsDashboard();
}

function initDemoSettings() {
    const settingsPage = document.querySelector(
        '[data-demo-page="settings"]'
    );

    if (!settingsPage) {
        return;
    }

    const settingInputs = settingsPage.querySelectorAll(
        "[data-setting]"
    );

    const resetButton = settingsPage.querySelector(
        "[data-reset-demo]"
    );

    function syncSettingInput(input) {
        const settingName = input.dataset.setting;
        const settingValue = demoState.settings[settingName];

        if (input.type === "checkbox") {
            input.checked = Boolean(settingValue);

            return;
        }

        input.value = settingValue;
    }

    function syncSettingsUI() {
        settingInputs.forEach((input) => {
            syncSettingInput(input);
        });

        Object.entries(demoState.settings).forEach(
            ([settingName, settingValue]) => {
                applyDemoSetting(
                    settingName,
                    settingValue
                );
            }
        );
    }

    function updateSetting(settingName, settingValue) {
        if (!(settingName in demoState.settings)) {
            return;
        }

        demoState.settings[settingName] = settingValue;

        applyDemoSetting(
            settingName,
            settingValue
        );
    }

    settingInputs.forEach((input) => {
        input.addEventListener("change", () => {
            const settingName = input.dataset.setting;

            const settingValue =
                input.type === "checkbox"
                    ? input.checked
                    : input.value;

            updateSetting(
                settingName,
                settingValue
            );
        });
    });

    resetButton?.addEventListener("click", () => {
        resetDemoData();
        syncSettingsUI();
    });

    syncSettingsUI();
}

function applyDemoSetting(settingName, settingValue) {
    switch (settingName) {
        case "hideBalance":
            demoState.settings.hideBalance = Boolean(
                settingValue
            );

            renderDemoBalance();

            break;

        case "compactDashboard":
            document.body.classList.toggle(
                "demo-compact-dashboard",
                settingValue
            );

            break;

        case "showNotifications":
            document.body.classList.toggle(
                "demo-hide-notifications",
                !settingValue
            );

            break;

        case "currency":
            renderDemoBalance();
            renderDashboardTransactions();
            renderFilteredTransactions();

            break;

        default:
            break;
    }
}

function resetDemoData() {
    const confirmed = window.confirm(
        "Reset the ASWallet demo data?\n\n" +
        "Your balance, transactions and settings " +
        "will be restored to their initial state."
    );

    if (!confirmed) {
        return;
    }

    demoState.balance = 12480.75;

    demoState.transactions = initialDemoTransactions.map(
        (transaction) => ({ ...transaction })
    );

    demoState.settings = {
        hideBalance: false,
        currency: "EUR",
        compactDashboard: false,
        showNotifications: true,
    };

    document.body.classList.remove(
        "demo-compact-dashboard",
        "demo-hide-notifications"
    );

    renderDemoBalance();
    renderDashboardTransactions();
    renderFilteredTransactions();

    notificationCenterApi?.reset?.();

    window.dispatchEvent(
        new CustomEvent("demo:reset")
    );
}

export function initDemo() {

    renderDemoBalance();
    renderDashboardTransactions();
    renderFilteredTransactions();

    initDemoNav();
    initBalanceToggle();
    initQuickActions();
    initTransferFlow();
    initMoneyFlow();
    initRequestMoneyFlow();
    initTransactionFilters();
    initTransactionDrawer();
    initTransactionExport();
    initPaymentSimulator();
    initNotificationCenter();
    initDemoSettings();
    initReportsDashboard();
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
        demoState.settings.hideBalance = isHidden;

        renderDemoBalance();
    };

    toggle.addEventListener("click", () => {
        setHidden(
            !demoState.settings.hideBalance
        );
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
            const action =
                trigger.dataset.quickAction;

            if (action === "send") {
                const transferNav = document.querySelector('[data-demo-nav="transfer"]');

                transferNav?.click();

                window.requestAnimationFrame(() => {
                    const selectedRecipient = document.querySelector( "[data-recipient].is-selected");
                    const firstRecipient = document.querySelector("[data-recipient]");

                    (selectedRecipient || firstRecipient)?.focus();
                });

                return;
            }

            if (action === "request") {
                const requestNavigationButton = document.querySelector('[data-demo-nav="request"]');

                requestNavigationButton?.click();

                const requestView = document.querySelector('[data-demo-view="request"]');
                const successPanel = requestView?.querySelector( "[data-request-success]");
                const newRequestButton = requestView?.querySelector("[data-request-new]");

                if (successPanel && !successPanel.hidden) {
                    newRequestButton?.click();
                }

                window.requestAnimationFrame(() => {
                    requestView
                        ?.querySelector("[data-request-contact].is-selected")
                        ?.focus();
                });

                return;
            }

            const isMoneyFlowAction =
                action === "deposit" ||
                action === "withdraw";

            if (isMoneyFlowAction) {
                const moneyFlowNav = document.querySelector('[data-demo-nav="deposit"]');
                const moneyModeButton = document.querySelector(`[data-money-mode="${action}"]`);

                moneyFlowNav?.click();

                window.requestAnimationFrame(() => {
                    moneyModeButton?.click();

                    window.requestAnimationFrame(() => {
                        const amountInput = document.querySelector("[data-money-amount]");

                        amountInput?.focus();
                        amountInput?.select();
                    });
                });

                return;
            }

            openModal(action);
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

function initTransferFlow() {
    const transferView = document.querySelector('[data-demo-view="transfer"]');
    const stepsRoot = document.querySelector("[data-transfer-steps]");
    const flowRoot = document.querySelector("[data-transfer-flow]");

    const transferAvailableBalance = document.querySelector("[data-transfer-available-balance]");

    const recipients = [...document.querySelectorAll("[data-recipient]")];
    const form = document.querySelector("[data-recipient-form]");
    const detailsForm = document.querySelector("[data-details-form]");
    const amountInput = document.querySelector("[data-amount-input]");
    const amountError = document.querySelector("[data-amount-error]");
    const chips = [...document.querySelectorAll("[data-amount-chip]")];
    const previewTo = document.querySelector("[data-preview-to]");
    const previewAmount = document.querySelector("[data-preview-amount]");
    const previewNote = document.querySelector("[data-preview-note]");
    const referenceInput = document.querySelector("[data-reference-input]");
    const backToRecipient = document.querySelector("[data-transfer-back]");
    const backToDetails = document.querySelector("[data-transfer-back-details]");
    const confirmButton = document.querySelector("[data-transfer-confirm]");
    const successView = document.querySelector("[data-success-view]");
    const successDashboard = document.querySelector("[data-success-dashboard]");

    const reviewAvatar = document.querySelector("[data-review-avatar]");
    const reviewAmount = document.querySelector("[data-review-amount]");
    const reviewName = document.querySelector("[data-review-name]");
    const reviewIban = document.querySelector("[data-review-iban]");
    const reviewReference = document.querySelector("[data-review-reference]");
    const reviewRemaining = document.querySelector("[data-review-remaining]");
    const successAmount = document.querySelector("[data-success-amount]");
    const successName = document.querySelector("[data-success-name]");
    const successRef = document.querySelector("[data-success-ref]");

    if (!stepsRoot || !flowRoot) {
        return;
    }

    const steps = [...stepsRoot.querySelectorAll("[data-transfer-step]")];
    const panels = [...flowRoot.querySelectorAll("[data-transfer-panel]")];
    const nameField = form?.querySelector('[data-recipient-field="name"]');
    const ibanField = form?.querySelector('[data-recipient-field="iban"]');
    const bankField = form?.querySelector('[data-recipient-field="bank"]');

    const transferState = {
        name: "Maria Petrova",
        iban: "",
        bank: "",
        amount: 0,
        reference: "",
        demoRef: "",
    };

    let bridgeTimer = 0;
    let isTransferConfirmed = false;

    const formatAmount = (value) =>
        value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const renderTransferBalance = () => {
        if (!transferAvailableBalance) {
            return;
        }

        transferAvailableBalance.textContent = formatCurrency(
            demoState.balance
        );
    };

    const parseAmount = (raw) => {
        const cleaned = String(raw).replace(/[^\d.]/g, "");
        const value = Number.parseFloat(cleaned);
        return Number.isFinite(value) ? value : 0;
    };

    const showAmountError = (message) => {
        if (amountError) {
            amountError.textContent = message;
            amountError.hidden = false;
        }

        amountInput?.setAttribute("aria-invalid", "true");
        amountInput
            ?.closest(".amount-display")
            ?.classList.add("has-error");
    };

    const clearAmountError = () => {
        if (amountError) {
            amountError.textContent = "";
            amountError.hidden = true;
        }

        amountInput?.removeAttribute("aria-invalid");
        amountInput
            ?.closest(".amount-display")
            ?.classList.remove("has-error");
    };

    const validateTransferAmount = () => {

        if (transferState.amount <= 0) {
            showAmountError("Enter an amount greater than €0.00.");
            amountInput?.focus();

            return false;
        }

        if (transferState.amount > demoState.balance) {
            showAmountError(
                `Insufficient balance. You can send up to ${formatCurrency(
                    demoState.balance
                )}.`
            );

            amountInput?.focus();

            return false;
        }

        clearAmountError();

        return true;
    };

    const getInitials = (name) => {
        const parts = String(name).trim().split(/\s+/).filter(Boolean);

        if (!parts.length) {
            return "AS";
        }

        return parts
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("");
    };

    const generateDemoReference = () => {
        const now = new Date();

        const datePart = now
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "");

        const timePart = now
            .toTimeString()
            .slice(0, 8)
            .replaceAll(":", "");

        return `ASW-DEMO-${datePart}-${timePart}`;
    };

    const createTransferTransaction = () => {
        const now = new Date();
        const demoReference = generateDemoReference();

        transferState.demoRef = demoReference;

        const transaction = {

            id: `tx-${Date.now()}`,
            recipient: transferState.name,
            description: "Money transfer",
            date: "Today",
            time: now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            }),

            amount: -transferState.amount,
            direction: "outgoing",
            status: "Completed",
            reference: transferState.reference || "Money transfer",
            transactionRef: demoReference,
            iban: transferState.iban,
            bank: transferState.bank,
            isNew: true,
        };

        demoState.transactions.unshift(transaction);

        return transaction;
    };

    const playBridge = () => {
        stepsRoot.classList.remove("is-bridging");
        
        void stepsRoot.offsetWidth;
        stepsRoot.classList.add("is-bridging");
        window.clearTimeout(bridgeTimer);

        bridgeTimer = window.setTimeout(() => {
            stepsRoot.classList.remove("is-bridging");
        }, 700);
    };

    const setTransferStep = (stepNumber, { animate = true } = {}) => {
        const current = stepNumber;

        transferView?.classList.toggle("is-success", current === "success");

        steps.forEach((step) => {

            const value = Number(step.dataset.transferStep);
            const numericCurrent = Number(current);
            const isActive = current !== "success" && value === numericCurrent;
            const isDone =
                current === "success" ||
                (Number.isFinite(numericCurrent) && value < numericCurrent);

            step.classList.toggle("is-active", isActive);
            step.classList.toggle("is-done", isDone);
            step.setAttribute("aria-current", isActive ? "step" : "false");
        });

        panels.forEach((panel) => {

            const isActive = panel.dataset.transferPanel === String(current);
            panel.classList.toggle("is-active", isActive);
            panel.hidden = !isActive;
        });

        if (animate && current !== "success") {
            playBridge();
        }
    };

    const syncRecipientFromForm = () => {
        transferState.name = nameField?.value.trim() || "";
        transferState.iban = ibanField?.value.trim() || "";
        transferState.bank = bankField?.value.trim() || "";
        updatePreview();
    };

    const canOpenDetails = () =>
        Boolean(
            nameField?.value.trim() &&
            ibanField?.value.trim() &&
            bankField?.value.trim()
        );

    const updatePreview = () => {
        if (previewTo) {
            previewTo.textContent = transferState.name || "New recipient";
        }

        if (previewAmount) {
            previewAmount.textContent = `€${formatAmount(transferState.amount)}`;
        }

        if (previewNote) {
            previewNote.textContent = transferState.reference
                ? transferState.reference
                : "Add a reference to personalize this transfer.";
        }
    };

    const updateReview = () => {
        const remaining = Math.max(0, demoState.balance - transferState.amount);

        if (reviewAvatar) {
            reviewAvatar.textContent = getInitials(transferState.name);
        }

        if (reviewAmount) {
            reviewAmount.textContent = `€${formatAmount(transferState.amount)}`;
        }

        if (reviewName) {
            reviewName.textContent = transferState.name || "New recipient";
        }

        if (reviewIban) {
            reviewIban.textContent = transferState.iban || "—";
        }

        if (reviewReference) {
            reviewReference.textContent = transferState.reference || "—";
        }

        if (reviewRemaining) {
            reviewRemaining.textContent = `€${formatAmount(remaining)}`;
        }
    };

    const updateSuccess = () => {

        if (successAmount) {
            successAmount.textContent = `€${formatAmount(transferState.amount)}`;
        }

        if (successName) {
            successName.textContent = transferState.name || "New recipient";
        }

        if (successRef) {
            successRef.textContent = transferState.demoRef;
        }
    };

    const setAmount = (value, { syncInput = true } = {}) => {
        transferState.amount = Math.max(0, value);

        if (syncInput && amountInput) {
            amountInput.value = formatAmount(transferState.amount);
        }

        chips.forEach((chip) => {

            const chipValue = Number(chip.dataset.amountChip);
            chip.classList.toggle("is-active", chipValue === transferState.amount);
        });

        updatePreview();
    };

    const goToDashboard = () => {

        document.querySelector('[data-demo-nav="dashboard"]')?.click();
        setTransferStep(1, { animate: false });
    };

    const goToTransactions = () => {

        document.querySelector('[data-demo-nav="transactions"]')?.click();
        setTransferStep(1, { animate: false });
    };

    const fillRecipient = (recipient) => {

        if (!nameField || !ibanField || !bankField) {
            return;
        }

        nameField.value = recipient.dataset.name || "";
        ibanField.value = recipient.dataset.iban || "";
        bankField.value = recipient.dataset.bank || "";

        transferState.name = nameField.value;
        transferState.iban = ibanField.value;
        transferState.bank = bankField.value;
        updatePreview();

        if (recipient.dataset.recipientId === "new") {
            nameField.focus();
        }
    };

    const selectRecipient = (recipient) => {

        recipients.forEach((card) => {
            card.classList.toggle("is-selected", card === recipient);
        });

        fillRecipient(recipient);
    };

    recipients.forEach((recipient) => {

        recipient.addEventListener("click", () => {
            selectRecipient(recipient);
        });
    });

    form?.addEventListener("submit", (event) => {

        event.preventDefault();
        syncRecipientFromForm();

        if (!canOpenDetails()) {
            return;
        }

        setTransferStep(2);

        window.requestAnimationFrame(() => {

            amountInput?.focus();
            amountInput?.select();
        });
    });

    steps.forEach((step) => {

        step.addEventListener("click", () => {
            if (transferView?.classList.contains("is-success")) {
                return;
            }

            const target = Number(step.dataset.transferStep);

            if (target === 1) {
                setTransferStep(1);
                return;
            }

            if (target === 2 && canOpenDetails()) {

                syncRecipientFromForm();
                setTransferStep(2);
                return;
            }

            if (target === 3 && canOpenDetails()) {
                setAmount(parseAmount(amountInput?.value));

                if (!validateTransferAmount()) {
                    setTransferStep(2, { animate: false });

                    return;
                }

                updateReview();
                setTransferStep(3);
            }
        });
    });

    document.querySelector('[data-demo-nav="transfer"]')
        ?.addEventListener("click", () => {

            isTransferConfirmed = false;

            transferView?.classList.remove("is-success");
            setTransferStep(1, { animate: false });
        });

    amountInput?.addEventListener("input", () => {
        const value = parseAmount(amountInput.value);

        transferState.amount = value;
        chips.forEach((chip) => chip.classList.remove("is-active"));

        clearAmountError();
        updatePreview();
    });

    amountInput?.addEventListener("blur", () => {
        setAmount(parseAmount(amountInput.value));
    });

    chips.forEach((chip) => {

        chip.addEventListener("click", () => {
            setAmount(Number(chip.dataset.amountChip));
        });
    });

    referenceInput?.addEventListener("input", () => {

        transferState.reference = referenceInput.value.trim();
        updatePreview();
    });

    detailsForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        setAmount(parseAmount(amountInput?.value));

        if (!validateTransferAmount()) {
            return;
        }

        updateReview();
        setTransferStep(3);
    });

    backToRecipient?.addEventListener("click", () => {
        setTransferStep(1);
    });

    backToDetails?.addEventListener("click", () => {
        setTransferStep(2);
    });

    confirmButton?.addEventListener("click", () => {

        if (isTransferConfirmed) {
            return;
        }

        if (!validateTransferAmount()) {
            setTransferStep(2, { animate: false });

            return;
        }

        isTransferConfirmed = true;

        const transaction = createTransferTransaction();

        demoState.balance = Number((demoState.balance - transferState.amount).toFixed(2));

        notificationCenterApi?.add({
            id: `notification-transfer-${transaction.id}`,
            title: "Transfer completed",
            message:
                `${formatCurrency(transferState.amount)} sent ` +
                `to ${transferState.name}.`,
            time: "Just now",
            icon: "↗",
            type: "transfer",
            transactionId: transaction.id,
        });

        renderDemoBalance();
        renderTransferBalance();
        renderDashboardTransactions();
        renderFilteredTransactions();
        renderReportsDashboard();
        updateSuccess();

        setTransferStep("success", { animate: false });
        playBridge();
    });

    successView?.addEventListener("click", goToTransactions);
    successDashboard?.addEventListener("click", goToDashboard);

    const selected = recipients.find((card) => card.classList.contains("is-selected"));

    if (selected) {
        fillRecipient(selected);
    }

    renderTransferBalance();
    setAmount(0);
    setTransferStep(1, { animate: false });
}

function initMoneyFlow() {
    const view = document.querySelector('[data-demo-view="deposit"]');
    const modeSwitch = view?.querySelector(".money-mode-switch");

    const modeButtons = [...(view?.querySelectorAll("[data-money-mode]") || []),];

    const flowGrid = view?.querySelector("[data-money-flow]");
    const form = view?.querySelector("[data-money-form]");
    const amountInput = view?.querySelector("[data-money-amount]");
    const amountDisplay = amountInput?.closest(".money-amount-display");

    const amountChips = [...(view?.querySelectorAll("[data-money-chip]") || []),];

    const methodLabel = view?.querySelector("[data-money-method-label]");
    const methodSelect = view?.querySelector("[data-money-method]");
    const referenceInput = view?.querySelector("[data-money-reference]");
    const errorElement = view?.querySelector("[data-money-error]");
    const titleElement = view?.querySelector("[data-money-title]");
    const typeBadge = view?.querySelector("[data-money-type-badge]");
    const submitButton = view?.querySelector("[data-money-submit]");
    const currentBalanceElement = view?.querySelector("[data-money-current-balance]");

    const previewType = view?.querySelector("[data-money-preview-type]");
    const previewAmount = view?.querySelector("[data-money-preview-amount]");
    const previewMethod = view?.querySelector("[data-money-preview-method]");
    const previewMethodIcon = view?.querySelector("[data-money-preview-method-icon]");
    const previewBalance = view?.querySelector("[data-money-preview-balance]");

    const successPanel = view?.querySelector("[data-money-success]");
    const successTitle = view?.querySelector("[data-money-success-title]");
    const successAmount = view?.querySelector("[data-money-success-amount]");
    const successMessage = view?.querySelector("[data-money-success-message]");
    const successReference = view?.querySelector("[data-money-success-reference]");

    const newTransactionButton = view?.querySelector("[data-money-new]");
    const dashboardButton = view?.querySelector("[data-money-dashboard]");

    if (!view || !form || !amountInput || !methodSelect || !flowGrid) {
        return;
    }

    const moneyState = {
        mode: "deposit",
        amount: 0,
        reference: "",
        method: "visa",
    };

    const methodOptions = {
        deposit: [
            {
                value: "visa",
                label: "Visa •••• 4582",
                icon: "VC",
            },
            {
                value: "bank",
                label: "Linked bank account",
                icon: "BA",
            },
            {
                value: "apple-pay",
                label: "Apple Pay",
                icon: "AP",
            },
        ],

        withdraw: [
            {
                value: "bank",
                label: "Bank account •••• 2048",
                icon: "BA",
            },
            {
                value: "visa",
                label: "Visa •••• 4582",
                icon: "VC",
            },
        ],
    };

    const parseMoneyAmount = (rawValue) => {
        const cleanedValue = String(rawValue)
            .replace(/[^\d.]/g, "");

        const parsedValue = Number.parseFloat(cleanedValue);

        return Number.isFinite(parsedValue)
            ? parsedValue
            : 0;
    };

    const formatMoneyAmount = (value) =>
        Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const generateMoneyReference = () => {
        const now = new Date();

        const datePart = now
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "");

        const timePart = now
            .toTimeString()
            .slice(0, 8)
            .replaceAll(":", "");

        return `ASW-DEMO-${datePart}-${timePart}`;
    };

    const getSelectedMethod = () => {
        const options = methodOptions[moneyState.mode] || [];

        return (options.find((option) => 
            option.value === methodSelect.value) || options[0]);
    };

    const clearMoneyError = () => {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.hidden = true;
        }

        amountInput.removeAttribute("aria-invalid");
        amountDisplay?.classList.remove("has-error");
    };

    const showMoneyError = (message) => {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.hidden = false;
        }

        amountInput.setAttribute("aria-invalid", "true");
        amountDisplay?.classList.add("has-error");
        amountInput.focus();
    };

    const calculateNewBalance = () => {
        if (moneyState.mode === "deposit") {
            return demoState.balance + moneyState.amount;
        }

        return demoState.balance - moneyState.amount;
    };

    const renderMoneyBalance = () => {
        if (currentBalanceElement) {
            currentBalanceElement.textContent = formatCurrency(demoState.balance);
        }
    };

    const renderMoneyMethods = () => {
        const options = methodOptions[moneyState.mode] || [];

        const optionElements = options.map((method) => {
            const option = document.createElement("option");

            option.value = method.value;
            option.textContent = method.label;

            return option;
        });

        methodSelect.replaceChildren(...optionElements);

        moneyState.method = options[0]?.value || "";
        methodSelect.value = moneyState.method;
    };

    const renderMoneyPreview = () => {
        const selectedMethod = getSelectedMethod();
        const isDeposit = moneyState.mode === "deposit";
        const signedAmount = isDeposit
            ? moneyState.amount
            : -moneyState.amount;

        const newBalance = calculateNewBalance();

        if (previewType) {
            previewType.textContent = isDeposit
                ? "Deposit"
                : "Withdraw";
        }

        if (previewAmount) {
            previewAmount.textContent = formatSignedCurrency(signedAmount);
        }

        if (previewMethod) {
            previewMethod.textContent = selectedMethod?.label || "—";
        }

        if (previewMethodIcon) {
            previewMethodIcon.textContent = selectedMethod?.icon || "AS";
        }

        if (previewBalance) {
            previewBalance.textContent = formatCurrency(Math.max(0, newBalance));
        }

        renderMoneyBalance();
    };

    const setMoneyAmount = (amount, { updateInput = true } = {} ) => {
    
        moneyState.amount = Math.max(0, amount);

        if (updateInput) {
            amountInput.value = formatMoneyAmount(moneyState.amount);
        }

        amountChips.forEach((chip) => {
            const chipAmount = Number(chip.dataset.moneyChip);

            chip.classList.toggle("is-active", chipAmount === moneyState.amount);
        });

        clearMoneyError();
        renderMoneyPreview();
    };

    const validateMoneyTransaction = () => {
        if (moneyState.amount <= 0) {
            showMoneyError("Enter an amount greater than €0.00.");

            return false;
        }

        if (moneyState.mode === "withdraw" && moneyState.amount > demoState.balance) {
        
            showMoneyError(`Insufficient balance. You can withdraw up to ${formatCurrency(demoState.balance)}.`);
            return false;
        }

        clearMoneyError();
        return true;
    };

    const resetMoneyForm = () => {
        form.reset();

        moneyState.amount = 0;
        moneyState.reference = "";

        referenceInput.value = "";

        successPanel.hidden = true;
        flowGrid.hidden = false;
        modeSwitch.hidden = false;

        renderMoneyMethods();
        setMoneyAmount(0);
    };

    const setMoneyMode = (mode) => {
        moneyState.mode = mode === "withdraw"
            ? "withdraw"
            : "deposit";

        const isWithdraw = moneyState.mode === "withdraw";

        view.classList.toggle("is-withdraw", isWithdraw);

        modeButtons.forEach((button) => {
            const isActive =  button.dataset.moneyMode === moneyState.mode;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (titleElement) {
            titleElement.textContent = isWithdraw
                ? "Withdraw funds"
                : "Deposit funds";
        }

        if (typeBadge) {
            typeBadge.textContent = isWithdraw
                ? "Money out"
                : "Money in";
        }

        if (methodLabel) {
            methodLabel.textContent = isWithdraw
                ? "Withdraw to"
                : "Deposit from";
        }

        if (submitButton) {
            submitButton.textContent = isWithdraw
                ? "Confirm Withdrawal"
                : "Confirm Deposit";
        }

        successPanel.hidden = true;
        flowGrid.hidden = false;
        modeSwitch.hidden = false;

        renderMoneyMethods();
        setMoneyAmount(0);

        referenceInput.value = "";
        moneyState.reference = "";
    };

    const createMoneyTransaction = (transactionReference) => {
    
        const now = new Date();
        const isDeposit = moneyState.mode === "deposit";
        const selectedMethod = getSelectedMethod();

        const transactionAmount = isDeposit
            ? moneyState.amount
            : -moneyState.amount;

        const transaction = {id: `tx-${Date.now()}`,
            
            recipient: isDeposit
                ? "Wallet Deposit"
                : "Wallet Withdrawal",

            description: isDeposit
                ? `Deposit via ${selectedMethod?.label || "payment method"}`
                : `Withdrawal to ${selectedMethod?.label || "bank account"}`,
                
            date: "Today",

            time: now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            }),
            amount: transactionAmount,

            direction: isDeposit
                ? "incoming"
                : "outgoing",

            status: "Completed",

            reference:
                moneyState.reference ||
                (isDeposit
                    ? "Wallet deposit"
                    : "Wallet withdrawal"),

            transactionRef: transactionReference,
            iban: "—",
            bank:
                selectedMethod?.label || "—",
            isNew: true,
        };

        demoState.transactions.unshift(transaction);

        return transaction;
    };

    const completeMoneyTransaction = () => {

        const isDeposit = moneyState.mode === "deposit";
        const transactionReference = generateMoneyReference();
        const transaction = createMoneyTransaction(transactionReference);

        demoState.balance = Number(calculateNewBalance().toFixed(2));

        notificationCenterApi?.add({
            id:
                `notification-${moneyState.mode}-` +
                `${transaction.id}`,

            title: isDeposit
                ? "Deposit completed"
                : "Withdrawal completed",

            message: isDeposit
                ? `${formatCurrency(moneyState.amount)} added ` + "to your ASWallet balance."
                : `${formatCurrency(moneyState.amount)} withdrawn ` + "from your ASWallet balance.",

            time: "Just now",

            icon: isDeposit
                ? "+"
                : "-",

            type: isDeposit
                ? "deposit"
                : "withdraw",

            transactionId: transaction.id,
        });

        renderDemoBalance();
        renderDashboardTransactions();
        renderFilteredTransactions();
        renderReportsDashboard();
        renderMoneyBalance();

        if (successTitle) {
            successTitle.textContent = isDeposit
                ? "Deposit completed"
                : "Withdrawal completed";
        }

        if (successAmount) {
            successAmount.textContent = formatCurrency(moneyState.amount);
        }

        if (successMessage) {
            successMessage.textContent = isDeposit
                ? "was added to your ASWallet balance."
                : "was withdrawn from your ASWallet balance.";
        }

        if (successReference) {
            successReference.textContent = transactionReference;
        }

        flowGrid.hidden = true;
        modeSwitch.hidden = true;
        successPanel.hidden = false;
    };

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setMoneyMode(button.dataset.moneyMode);
        });
    });

    amountInput.addEventListener("input", () => {
        moneyState.amount = parseMoneyAmount(amountInput.value);

        amountChips.forEach((chip) => {
            chip.classList.remove("is-active");
        });

        clearMoneyError();
        renderMoneyPreview();
    });

    amountInput.addEventListener("blur", () => {
        setMoneyAmount(parseMoneyAmount(amountInput.value));
    });

    amountChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            setMoneyAmount(Number(chip.dataset.moneyChip));
        });
    });

    methodSelect.addEventListener("change", () => {
        moneyState.method = methodSelect.value;
        renderMoneyPreview();
    });

    referenceInput.addEventListener("input", () => {
        moneyState.reference = referenceInput.value.trim();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        setMoneyAmount(parseMoneyAmount(amountInput.value));
        moneyState.reference = referenceInput.value.trim();
            
        if (!validateMoneyTransaction()) {
            return;
        }

        completeMoneyTransaction();
    });

    newTransactionButton?.addEventListener(
        "click",
        resetMoneyForm
    );

    dashboardButton?.addEventListener("click", () => {
        
            document.querySelector('[data-demo-nav="dashboard"]') 
                ?.click();

            resetMoneyForm();
        }
    );

    setMoneyMode("deposit");
}

function initRequestMoneyFlow()
{
    const view = document.querySelector('[data-demo-view="request"]');

    if (!view) {
        return;
    }

    const flow = view.querySelector("[data-request-flow]");
    const form = view.querySelector("[data-request-form]");
    const contacts = [...view.querySelectorAll("[data-request-contact]")];
    const amountInput = view.querySelector("[data-request-amount]");
    const amountDisplay = amountInput?.closest(".request-amount-display");
    const amountChips = [...view.querySelectorAll("[data-request-chip]")];
    const reasonInput = view.querySelector("[data-request-reason]");
    const dueSelect = view.querySelector("[data-request-due]");
    const errorElement = view.querySelector("[data-request-error]");

    const previewAvatar = view.querySelector("[data-request-preview-avatar]");
    const previewPerson = view.querySelector("[data-request-preview-name]");
    const previewAmount = view.querySelector("[data-request-preview-amount]");
    const previewReason = view.querySelector("[data-request-preview-reason]");
    const previewDue = view.querySelector("[data-request-preview-due]");

    const successPanel = view.querySelector("[data-request-success]");
    const successAmount = view.querySelector("[data-request-success-amount]");
    const successPerson = view.querySelector("[data-request-success-name]");
    const paymentLink = view.querySelector("[data-request-payment-link]");
    const copyButton = view.querySelector("[data-request-copy]");
    const copyStatus = view.querySelector("[data-request-copy-status]");
    const newRequestButton = view.querySelector("[data-request-new]");
    const dashboardButton = view.querySelector("[data-request-dashboard]");

    if (!flow || !form || !amountInput || !reasonInput || !dueSelect || !errorElement || !successPanel) {
        return;
    }

    const requestState = {
        name: "",
        initials: "",
        amount: 0,
        reason: "",
        dueValue: dueSelect.value,
        dueLabel: getSelectedOptionLabel(dueSelect),
        paymentUrl: ""
    };

    function parseAmount(value) {
        const normalizedValue = String(value).replace(/[^\d.]/g, "");
        const amount = Number.parseFloat(normalizedValue);

        return Number.isFinite(amount) ? amount : 0;
    }

    function formatAmount(amount) {
    
        return new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2

        }).format(amount);
    }

    function getSelectedOptionLabel(selectElement) {
        return selectElement.options[selectElement.selectedIndex]?.text ?? "Today";
    }

    function clearError() {
        errorElement.textContent = "";
        errorElement.hidden = true;

        amountDisplay?.classList.remove("has-error");
        amountInput.removeAttribute("aria-invalid");
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.hidden = false;

        amountDisplay?.classList.add("has-error");
        amountInput.setAttribute("aria-invalid", "true");
        amountInput.focus();
    }

    function renderPreview() {
    
        if (previewAvatar) {
            previewAvatar.textContent = requestState.initials || "—";
        }

        if (previewPerson) {
            previewPerson.textContent = requestState.name || "Select a contact";
        }

        if (previewAmount) {
            previewAmount.textContent = formatAmount(requestState.amount);
        }

        if (previewReason) {
            previewReason.textContent = requestState.reason || "No reason added";
        }

        if (previewDue) {
            previewDue.textContent = requestState.dueLabel;
        }
    }

    function selectContact(contact) {
    
        contacts.forEach((item) => {
        
            const isSelected = item === contact;

            item.classList.toggle("is-selected", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
        });

        requestState.name = contact.dataset.requestName ?? "";
        requestState.initials = contact.dataset.requestInitials ?? "";

        renderPreview();
    }

    function setAmount(value) {
    
        const amount = parseAmount(value);
        requestState.amount = amount;

        amountInput.value = amount > 0
            ? amount.toFixed(2)
            : "";

        amountChips.forEach((chip) => {
        
            const chipAmount = parseAmount(chip.dataset.requestChip);
            chip.classList.toggle("is-active", amount > 0 && chipAmount === amount);
        });

        clearError();
        renderPreview();
    }

    function validateRequest() {
        clearError();

        if (!requestState.name) {
            errorElement.textContent = "Please select a contact.";
            errorElement.hidden = false;

            contacts[0]?.focus();
            return false;
        }

        if (requestState.amount <= 0) {
            showError("Please enter an amount greater than €0.00.");
            return false;
        }

        return true;
    }

    function createRequestReference() {
        const timestamp = Date.now().toString().slice(-10);
        return `ASW-REQ-${timestamp}`;
    }

    function getCurrentTime() {
    
        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit"

        }).format(new Date());
    }

    function showSuccess() {
    
        flow.hidden = true;
        successPanel.hidden = false;

        if (successAmount) {
            successAmount.textContent = formatAmount(requestState.amount);
        }

        if (successPerson) {
            successPerson.textContent = requestState.name;
        }

        if (paymentLink) {
            paymentLink.value = requestState.paymentUrl;
        }

        successPanel.focus?.();
    }

    function resetRequest() {
    
        form.reset();

        requestState.name = "";
        requestState.initials = "";
        requestState.amount = 0;
        requestState.reason = "";
        requestState.dueValue = dueSelect.value;
        requestState.dueLabel = getSelectedOptionLabel(dueSelect);
        requestState.paymentUrl = "";

        amountInput.value = "";

        amountChips.forEach((chip) => {
            chip.classList.remove("is-active");
        });

        clearError();

        copyButton?.classList.remove("is-copied");
        copyStatus?.classList.remove("is-copied");

        if (copyStatus) {
            copyStatus.textContent = "Share this demo link with the selected contact.";
        }

        if (copyButton) {
            copyButton.textContent = "Copy";
        }

        successPanel.hidden = true;
        flow.hidden = false;

        if (contacts[0]) {
            selectContact(contacts[0]);

        } else {
            renderPreview();
        }
    }

    async function copyPaymentLink() {
    
        if (!requestState.paymentUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(requestState.paymentUrl);

        } catch {
            const temporaryInput = document.createElement("textarea");

            temporaryInput.value = requestState.paymentUrl;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";

            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            document.execCommand("copy");
            temporaryInput.remove();
        }

        copyButton?.classList.add("is-copied");
        copyStatus?.classList.add("is-copied");

        if (copyButton) {
            copyButton.textContent = "Copied";
        }

        if (copyStatus) {
            copyStatus.textContent = "Payment link copied.";
        }

        window.setTimeout(() => {
        
            copyButton?.classList.remove("is-copied");
            copyStatus?.classList.remove("is-copied");

            if (copyButton) {
                copyButton.textContent = "Copy";
            }

            if (copyStatus) {
                copyStatus.textContent = "Share this demo link with the selected contact.";
            }

        }, 2200);
    }

    contacts.forEach((contact) => {
    
        contact.addEventListener("click", () => {
            selectContact(contact);
        });
    });

    amountChips.forEach((chip) => {
    
        chip.addEventListener("click", () => {
            setAmount(chip.dataset.requestChip);
            amountInput.focus();
        });
    });

    amountInput.addEventListener("input", () => {
        requestState.amount = parseAmount(amountInput.value);

        amountChips.forEach((chip) => {
            const chipAmount = parseAmount(chip.dataset.requestChip);

            chip.classList.toggle("is-active",
                
                requestState.amount > 0 &&
                chipAmount === requestState.amount
            );
        });

        clearError();
        renderPreview();
    });

    amountInput.addEventListener("blur", () => {

        if (requestState.amount > 0) {
            amountInput.value = requestState.amount.toFixed(2);
        }
    });

    reasonInput.addEventListener("input", () => {
        requestState.reason = reasonInput.value.trim();
        renderPreview();
    });

    dueSelect.addEventListener("change", () => {
        requestState.dueValue = dueSelect.value;
        requestState.dueLabel = getSelectedOptionLabel(dueSelect);

        renderPreview();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        requestState.amount = parseAmount(amountInput.value);
        requestState.reason = reasonInput.value.trim();
        requestState.dueValue = dueSelect.value;
        requestState.dueLabel = getSelectedOptionLabel(dueSelect);

        if (!validateRequest()) {
            return;
        }

        const transactionReference = createRequestReference();
        requestState.paymentUrl = `https://aswallet.eu/pay/${transactionReference}`;

        const requestTransaction = {
            id: `tx-${Date.now()}`,
            recipient: requestState.name,
            description: "Money request",
            date: "Today",
            time: getCurrentTime(),
            amount: requestState.amount,
            direction: "incoming",
            status: "Pending",
            reference: requestState.reason || "Money request",
            transactionRef: transactionReference,
            iban: "—",
            bank: "Payment request",
            dueDate: requestState.dueLabel,
            isNew: true
        };

        demoState.transactions.unshift(requestTransaction);

        notificationCenterApi?.add({
            id: `notification-${requestTransaction.id}`,
            title: "Payment request created",
            message:
                `${formatCurrency(requestTransaction.amount)} requested ` +
                `from ${requestTransaction.recipient}.`,
            time: "Just now",
            icon: "€",
            type: "request",
            transactionId: requestTransaction.id,
        });

        renderDashboardTransactions();
        renderFilteredTransactions();
        renderReportsDashboard();
        showSuccess();
    });

    copyButton?.addEventListener("click", copyPaymentLink);

    newRequestButton?.addEventListener("click", () => {
        resetRequest();
        contacts[0]?.focus();
    });

    dashboardButton?.addEventListener("click", () => {
        document.querySelector('[data-demo-nav="dashboard"]')
            ?.click();
    });

    resetRequest();
}

function initPaymentSimulator() {

    const simulator = document.querySelector("[data-payment-simulator]");

    if (!simulator) {
        return;
    }

    const dialog = simulator.querySelector("[data-payment-simulator-dialog]");
    const content = simulator.querySelector("[data-payment-simulator-content]");
    const success = simulator.querySelector("[data-payment-simulator-success]");
    const person = simulator.querySelector("[data-payment-simulator-person]");
    const amount = simulator.querySelector("[data-payment-simulator-amount]");
    const reference = simulator.querySelector("[data-payment-simulator-reference]");
    const successAmount = simulator.querySelector("[data-payment-simulator-success-amount]");
    const confirmButton = simulator.querySelector("[data-payment-simulator-confirm]");
    const doneButton = simulator.querySelector("[data-payment-simulator-done]");
    const closeButtons = simulator.querySelectorAll("[data-payment-simulator-close]");
    const drawerPaymentButton = document.querySelector("[data-detail-request-pay]");

    let transactionId = null;
    let previousFocus = null;

    function formatPaymentAmount(value) {
    
        return new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2

        }).format(Number(value));
    }

    function findTransaction() {
        return demoState.transactions.find((transaction) => transaction.id === transactionId);
    }

    function openSimulator(selectedTransactionId) {
        const transaction = demoState.transactions.find((item) => item.id === selectedTransactionId);

        if (!transaction || transaction.status?.toLowerCase() !== "pending") {
            return;
        }

        transactionId = transaction.id;
        previousFocus = document.activeElement;

        if (person) {
            person.textContent = transaction.recipient ?? "—";
        }

        if (amount) {
            amount.textContent = formatPaymentAmount(transaction.amount);
        }

        if (reference) {
            reference.textContent = transaction.transactionRef ?? transaction.id;
        }

        content.hidden = false;
        success.hidden = true;
        simulator.hidden = false;

        document.body.classList.add("has-payment-simulator");

        window.requestAnimationFrame(() => {
            dialog?.focus();
        });
    }

    function closeSimulator() {
    
        simulator.hidden = true;
        document.body.classList.remove("has-payment-simulator");

        transactionId = null;
        previousFocus?.focus();
    }

    drawerPaymentButton?.addEventListener("click", () => {
    
        const selectedTransactionId = drawerPaymentButton.dataset.transactionId || activeTransactionId;
        openSimulator(selectedTransactionId);
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeSimulator);
    });

    confirmButton?.addEventListener("click", () => {
        const transaction = findTransaction();

        if (!transaction || transaction.status?.toLowerCase() !== "pending") {
            return;
        }
        
        if (!transaction.balanceApplied) {
            demoState.balance += Number(transaction.amount);
            transaction.balanceApplied = true;
        }

        transaction.status = "Completed";
        transaction.completedAt = new Date().toISOString();

        transaction.time = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            
        }).format(new Date());

        notificationCenterApi?.add({
            id: `notification-completed-${transaction.id}`,
            title: "Payment request completed",
            message:
                `${formatCurrency(transaction.amount)} received ` +
                `from ${transaction.recipient}.`,
            time: "Just now",
            icon: "✓",
            type: "success",
            transactionId: transaction.id,
        });

        content.hidden = true;
        success.hidden = false;

        if (successAmount) {
            successAmount.textContent = `+ ${formatPaymentAmount(transaction.amount)}`;
        }
        
        renderDemoBalance();
        renderDashboardTransactions();
        renderFilteredTransactions();
        renderReportsDashboard();
        renderTransactionSummary();

        window.requestAnimationFrame(() => {
            doneButton?.focus();
        });
    });

    doneButton?.addEventListener("click", () => {
        closeSimulator();

        document.querySelector("[data-transaction-drawer-close]")
            ?.click();

        document.querySelector('[data-demo-nav="transactions"]')
            ?.click();
    });

    document.addEventListener("keydown", (event) => {
    
        if (event.key === "Escape" && !simulator.hidden) {
            closeSimulator();
        }
    });
}

initDemo();
