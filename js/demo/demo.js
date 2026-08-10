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

const demoState = {
    balance: 12480.75,

    transactions: [ 
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
    ],
};

const transactionHistoryState = {
    filter: "all",
    search: "",
};

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,

    }).format(value);
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
        return `−  ${formatCurrency(Math.abs(value))}`;
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
    const incoming = demoState.transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

    const outgoing = demoState.transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce(
            (total, transaction) =>
                total + Math.abs(transaction.amount),
            0
        );

    const netFlow = incoming - outgoing;

    const generatedAt = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date());

    const statementId =
        `ASW-STMT-${Date.now().toString().slice(-10)}`;

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
                    font-family:
                        Inter,
                        "Segoe UI",
                        Arial,
                        sans-serif;
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
                    background:
                        linear-gradient(
                            135deg,
                            #c9a85e,
                            #846326
                        );
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
                    font-family:
                        "Cascadia Mono",
                        Consolas,
                        monospace;
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
                            ${escapeHtml(
                                formatCurrency(demoState.balance)
                            )}
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
                            class="summary-value incoming-value"
                        >
                            ${escapeHtml(
                                formatSignedCurrency(incoming)
                            )}
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
                            class="summary-value outgoing-value"
                        >
                            ${escapeHtml(
                                formatSignedCurrency(-outgoing)
                            )}
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
                            ${escapeHtml(
                                formatSignedCurrency(netFlow)
                            )}
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
                                        colspan="6"
                                    >
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

            frameWindow.addEventListener(
                "afterprint",
                cleanupPrintFrame,
                {
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
                            console.error(
                                "Unable to print statement:",
                                error
                            );

                            cleanupPrintFrame();

                            window.alert(
                                "The PDF statement could not be opened."
                            );
                        }
                    });
                });
            } catch (error) {
                console.error(
                    "Unable to prepare statement:",
                    error
                );

                cleanupPrintFrame();
            }
        },
        {
            once: true,
        }
    );

    cleanupTimer = window.setTimeout(
        cleanupPrintFrame,
        60000
    );

    printFrame.srcdoc = statementHtml;
}

function initTransactionExport() {
    const exportButton = document.querySelector(
        "[data-transactions-export]"
    );

    if (!exportButton) {
        return;
    }

    exportButton.addEventListener(
        "click",
        exportTransactionStatement
    );
}

function renderTransactionSummary() {
    const incomingElement = document.querySelector(
        "[data-summary-incoming]"
    );

    const outgoingElement = document.querySelector(
        "[data-summary-outgoing]"
    );

    const netElement = document.querySelector(
        "[data-summary-net]"
    );

    const incoming = demoState.transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

    const outgoing = demoState.transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce(
            (total, transaction) =>
                total + Math.abs(transaction.amount),
            0
        );

    const net = incoming - outgoing;

    if (incomingElement) {
        incomingElement.textContent = formatSignedCurrency(incoming);
    }

    if (outgoingElement) {
        outgoingElement.textContent = formatSignedCurrency(-outgoing);
    }

    if (netElement) {
        netElement.textContent = formatSignedCurrency(net);
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
            matchesFilter =
                transaction.status.toLowerCase() === "pending";
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

        const matchesSearch =
            !searchQuery ||
            searchableValues.some((value) =>
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
    const transactionList = document.querySelector(
        "[data-transactions-list]"
    );

    const emptyState = document.querySelector(
        "[data-transactions-empty]"
    );

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
            const isPending =
                transaction.status.toLowerCase() === "pending";

            button.classList.add(
                isIncoming ? "is-incoming" : "is-outgoing"
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
            avatar.textContent = getTransactionInitials(
                transaction.recipient
            );

            const copy = document.createElement("span");
            copy.className = "transaction-copy";

            const recipient = document.createElement("strong");
            recipient.className = "transaction-recipient";
            recipient.textContent = transaction.recipient;

            const meta = document.createElement("span");
            meta.className = "transaction-meta";

            const description = document.createElement("span");
            description.textContent =
                transaction.description || "Transaction";

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
            amount.textContent = formatSignedCurrency(
                transaction.amount
            );

            const status = document.createElement("span");
            status.className = "transaction-status";
            status.textContent =
                transaction.status || "Completed";

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
    const searchInput = document.querySelector(
        "[data-transactions-search]"
    );

    const filterButtons = [
        ...document.querySelectorAll(
            "[data-transaction-filter]"
        ),
    ];

    if (!searchInput || !filterButtons.length) {
        return;
    }

    searchInput.addEventListener("input", () => {
        transactionHistoryState.search = searchInput.value;

        renderFilteredTransactions();
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter =
                button.dataset.transactionFilter;

            transactionHistoryState.filter =
                selectedFilter || "all";

            filterButtons.forEach((filterButton) => {
                const isActive =
                    filterButton === button;

                filterButton.classList.toggle(
                    "is-active",
                    isActive
                );

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderFilteredTransactions();
        });
    });
}

function initTransactionDrawer() {
    const transactionList = document.querySelector(
        "[data-transactions-list]"
    );

    const drawer = document.querySelector(
        "[data-transaction-drawer]"
    );

    const drawerPanel = drawer?.querySelector(
        ".transaction-drawer-panel"
    );

    const closeButtons = [
        ...document.querySelectorAll(
            "[data-transaction-drawer-close]"
        ),
    ];

    const recipientElement = document.querySelector(
        "[data-drawer-recipient]"
    );

    const avatarElement = document.querySelector(
        "[data-drawer-avatar]"
    );

    const amountElement = document.querySelector(
        "[data-drawer-amount]"
    );

    const statusElement = document.querySelector(
        "[data-drawer-status]"
    );

    const descriptionElement = document.querySelector(
        "[data-drawer-description]"
    );

    const dateElement = document.querySelector(
        "[data-drawer-date]"
    );

    const ibanElement = document.querySelector(
        "[data-drawer-iban]"
    );

    const bankElement = document.querySelector(
        "[data-drawer-bank]"
    );

    const referenceElement = document.querySelector(
        "[data-drawer-reference]"
    );

    const idElement = document.querySelector(
        "[data-drawer-id]"
    );

    const feeElement = document.querySelector(
        "[data-drawer-fee]"
    );

    if (!transactionList || !drawer || !drawerPanel) {
        return;
    }

    let lastFocusedElement = null;

    const openDrawer = (transaction) => {
        lastFocusedElement = document.activeElement;

        if (recipientElement) {
            recipientElement.textContent =
                transaction.recipient;
        }

        if (avatarElement) {
            avatarElement.textContent =
                getTransactionInitials(
                    transaction.recipient
                );
        }

        if (amountElement) {
            amountElement.textContent =
                formatSignedCurrency(transaction.amount);

            amountElement.classList.toggle(
                "is-incoming",
                transaction.amount >= 0
            );

            amountElement.classList.toggle(
                "is-outgoing",
                transaction.amount < 0
            );
        }

        if (statusElement) {
            statusElement.textContent =
                transaction.status || "Completed";

            statusElement.classList.toggle(
                "is-pending",
                transaction.status
                    ?.toLowerCase() === "pending"
            );
        }

        if (descriptionElement) {
            descriptionElement.textContent =
                transaction.description || "Transaction";
        }

        if (dateElement) {
            dateElement.textContent =
                `${transaction.date || "—"}, ` +
                `${transaction.time || "—"}`;
        }

        if (ibanElement) {
            ibanElement.textContent =
                transaction.iban || "—";
        }

        if (bankElement) {
            bankElement.textContent =
                transaction.bank || "—";
        }

        if (referenceElement) {
            referenceElement.textContent =
                transaction.reference || "—";
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

        drawer.hidden = false;
        document.body.classList.add(
            "transaction-drawer-open"
        );

        const closeButton = drawer.querySelector(
            ".transaction-drawer-close"
        );

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

        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function"
        ) {
            lastFocusedElement.focus();
        }
    };

    transactionList.addEventListener("click", (event) => {
        const transactionButton = event.target.closest(
            "[data-transaction-id]"
        );

        if (!transactionButton) {
            return;
        }

        const transactionId =
            transactionButton.dataset.transactionId;

        const transaction = demoState.transactions.find(
            (item) => item.id === transactionId
        );

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
        const lastElement =
            focusableElements[focusableElements.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {
            event.preventDefault();
            lastElement.focus();
        }

        if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    });
}

function renderDemoBalance() {
    const balanceCard = document.querySelector("[data-balance-card]");
    const balanceAmount = document.querySelector("[data-balance-amount]");

    if (!balanceCard || !balanceAmount) {
        return;
    }

    const formattedBalance = formatCurrency(demoState.balance);

    balanceAmount.dataset.visible = formattedBalance;

    if (!balanceCard.classList.contains("is-hidden")) {
        balanceAmount.textContent = formattedBalance;
    }
}

function renderDashboardTransactions() {
    const tableBody = document.querySelector(
        "[data-dashboard-transactions]"
    );

    if (!tableBody) {
        return;
    }

    const recentTransactions = demoState.transactions.slice(0, 4);

    const rows = recentTransactions.map((transaction) => {
        const row = document.createElement("tr");

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

        amount.className = `tx-amount ${isIncoming ? "is-in" : "is-out"
            }`;

        const amountPrefix = isIncoming ? "+  " : "−  ";

        amount.textContent =
            `${amountPrefix}${formatCurrency(
                Math.abs(transaction.amount)
            )}`;

        amountCell.append(amount);

        const statusCell = document.createElement("td");
        statusCell.dataset.label = "Status";

        const status = document.createElement("span");
        status.className = "tx-status";
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

export function initDemo() {
    renderDemoBalance();
    renderDashboardTransactions();
    renderFilteredTransactions();

    initDemoNav();
    initBalanceToggle();
    initQuickActions();
    initTransferFlow();
    initTransactionFilters();
    initTransactionDrawer();
    initTransactionExport();
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
        toggle.setAttribute("aria-label",
            isHidden 
                ? "Show balance" 
                : "Hide balance"
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

function initTransferFlow() {
    const transferView = document.querySelector('[data-demo-view="transfer"]');
    const stepsRoot = document.querySelector("[data-transfer-steps]");
    const flowRoot = document.querySelector("[data-transfer-flow]");

    const transferAvailableBalance = document.querySelector(
        "[data-transfer-available-balance]"
    );

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

    document
        .querySelector('[data-demo-nav="transfer"]')
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
        createTransferTransaction();

        demoState.balance = Number((demoState.balance - transferState.amount).toFixed(2));

        renderDemoBalance();
        renderTransferBalance();
        renderDashboardTransactions();
        renderFilteredTransactions();
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

initDemo();
