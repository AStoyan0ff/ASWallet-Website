<div align="center">

# ASWallet Website

### Your Wallet. Your Future.

Modern digital banking presentation and interactive product demo for **ASWallet**.

[![Live Website](https://img.shields.io/badge/Live_Website-aswallet.eu-d6b46a?style=for-the-badge&logo=googlechrome&logoColor=111111)](https://aswallet.eu/)
[![Interactive Demo](https://img.shields.io/badge/Interactive_Demo-Explore_ASWallet-c23b3b?style=for-the-badge&logo=javascript&logoColor=ffffff)](https://aswallet.eu/demo/)
[![Main Project](https://img.shields.io/badge/Main_Project-ASWallet--Vol.2-181818?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/AStoyan0ff/ASWallet-Vol.2)

</div>

<p align="center">
  <a href="https://aswallet.eu/">
    <img
      src="./assets/images/aswallet-website-preview.png"
      alt="ASWallet Website preview"
      width="100%"
    />
  </a>
</p>

## Overview

**ASWallet Website** is the official presentation site and interactive frontend demo for the ASWallet digital wallet ecosystem. It presents the product vision, core capabilities, security principles, development roadmap and ASWallet Mobile experience while giving visitors a safe way to explore the wallet interface without registration or real financial data.

The project is built with semantic HTML, modular CSS and vanilla JavaScript ES modules. It uses no frontend framework and makes no connection to a production banking backend. Financial activity is simulated in the browser, while supported demo preferences are stored locally and remain available after refresh.

## Highlights

- Premium black, graphite, red and champagne-gold visual identity
- Fully responsive marketing website and interactive wallet demo
- Animated Hero, Features, Security, Roadmap, About, Mobile and CTA sections
- Realistic ASWallet Mobile showcase built around the Flutter product direction
- Interactive Dashboard with balance privacy, quick actions and recent activity
- Transfer, Request Money, Deposit and Withdraw demo workflows
- Shared demo balance and transaction state across the wallet experience
- Searchable transaction timeline with direction and status filters
- Transaction details drawer and browser-based PDF statement export
- Reports dashboard with cash flow, category spending and financial insights
- Notification center connected to demo events and payment activity
- Persistent demo preferences for balance visibility, currency and layout
- Keyboard-friendly navigation, visible focus states and reduced-motion support
- Performance-aware animation lifecycle and deferred below-the-fold rendering
- SEO, canonical URL, Open Graph, structured data, sitemap and crawler configuration
- Custom domain deployment at [aswallet.eu](https://aswallet.eu/)

## Interactive Demo

The demo provides a safe, UI-only product experience:

| Area | Available functionality |
| --- | --- |
| Dashboard | Wallet balance, privacy toggle, spending overview, quick actions and recent transactions |
| Transfer | Recipient selection, custom recipient, amount validation, live preview, review and confirmation flow |
| Request Money | Payer details, request amount, generated payment request and shareable demo payment link |
| Deposit / Withdraw | Operation switcher, validation, transaction summary, balance update and success state |
| Transactions | Summary cards, grouped timeline, search, Incoming / Outgoing / Pending filters and details drawer |
| Reports | 7-day, 30-day and all-time periods, income, expenses, net flow, cash-flow chart and category breakdown |
| Notifications | Unread counter, notification panel and automatic demo events for requests, transfers and payments |
| Settings | Hide Balance, EUR / USD / BGN currency, Compact Dashboard and Show Notifications preferences |
| Payment Simulator | Safe completion of a generated payment request with transaction and notification updates |
| PDF Statement | Current balance, money in/out, net flow and transaction history in a print-ready statement |

> [!IMPORTANT]
> The demo uses simulated data only. No account is created, no real financial information is collected and no money is transferred.

## Demo State

- Balance and transaction changes are shared across the active demo session.
- Transfer, deposit, withdraw and payment actions update the related dashboard, history, reports and notifications.
- Demo preferences are stored in `localStorage` under `aswallet-demo-settings`.
- Supported currencies are `EUR`, `USD` and `BGN`.
- **Reset Demo Data** restores the original balance, transactions and default preferences.
- Reloading the page restores the initial simulated financial data while preserving saved preferences until reset.

## Website Sections

- **Hero** — product introduction and direct access to the interactive demo
- **Features** — essential ASWallet money-management capabilities
- **Security** — product principles, architecture and user-control focus
- **Roadmap** — completed milestones and future ecosystem direction
- **About** — the vision and values behind ASWallet
- **Mobile Application Showcase** — responsive Flutter-oriented ASWallet Mobile preview
- **Call to Action** — final entry point to the interactive wallet experience
- **Footer** — section navigation, system status and copyright information

## Accessibility and Performance

- Semantic landmarks and structured heading hierarchy
- Skip-to-content navigation
- Visible `:focus-visible` states
- Accessible mobile menu with Escape handling and focus management
- Decorative mobile preview removed from keyboard navigation with `inert`
- `aria-current`, `aria-live`, dialog labels and pressed-state attributes where appropriate
- Global and section-level `prefers-reduced-motion` support
- Intersection Observer fallbacks for reveal and navigation behavior
- Animation pausing outside the viewport and while the browser tab is hidden
- `content-visibility` for below-the-fold rendering optimization

## SEO and Social Sharing

- Production canonical URL: `https://aswallet.eu/`
- Search-friendly title and meta description
- Open Graph and X / Twitter large-image metadata
- JSON-LD `WebSite` structured data
- Custom ASWallet multi-size favicon package
- `robots.txt` crawler configuration
- XML sitemap at [aswallet.eu/sitemap.xml](https://aswallet.eu/sitemap.xml)
- Social preview image with explicit dimensions and alternative text

## Technology Stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Semantic marketing page and demo application structure |
| CSS3 | Modular layout, responsive design, visual system and animations |
| JavaScript ES Modules | Navigation, UI state, money flows, reports, settings and notifications |
| Web Storage API | Persistent demo preferences |
| Intersection Observer API | Scroll-aware navigation, reveal effects and performance control |
| Browser Print API | Print-ready PDF statement export |
| GitHub Pages | Static production deployment |
| Custom Domain | `aswallet.eu` |

## Project Structure

```text
ASWallet-Website/
├── assets/
│   └── images/
│       └── aswallet-website-preview.png
├── css/
│   ├── base/
│   ├── components/
│   ├── demo/
│   ├── layout/
│   └── sections/
├── demo/
│   └── index.html
├── js/
│   ├── demo/
│   │   └── demo.js
│   ├── about.js
│   ├── app.js
│   ├── cta.js
│   ├── features.js
│   ├── mobile-showcase.js
│   ├── nav.js
│   ├── roadmap.js
│   └── security.js
├── CNAME
├── favicon.ico
├── index.html
├── LICENSE
├── README.md
├── robots.txt
├── site.webmanifest
└── sitemap.xml
```

## Run Locally

Clone the repository:

```bash
git clone https://github.com/AStoyan0ff/ASWallet-Website.git
```

Open the project in VS Code, install the **Live Server** extension and start the site from `index.html` with **Open with Live Server**.

> [!NOTE]
> A local static server is recommended because the project uses JavaScript ES modules.

## Roadmap

- [x] Marketing landing page
- [x] Responsive desktop and mobile navigation
- [x] Animated Hero, Features, Security, Roadmap, About and CTA sections
- [x] Interactive Wallet Dashboard
- [x] Transfer flow connected to shared demo state
- [x] Request Money and payment simulation flow
- [x] Deposit / Withdraw interactive experience
- [x] Transaction history, search and filters
- [x] Transaction details drawer
- [x] Print-ready PDF statement export
- [x] Notification center and automatic demo events
- [x] Reports dashboard and financial insights
- [x] Demo Settings with persistent preferences
- [x] ASWallet Mobile application showcase
- [x] Responsive, semantic and accessibility audit
- [x] Performance optimization and animation lifecycle control
- [x] SEO, Open Graph, structured data, sitemap and crawler configuration
- [x] Custom ASWallet favicon package
- [ ] Publish the ASWallet Mobile repository
- [ ] Connect the Flutter development button to the public mobile repository
- [ ] Continue the ASWallet Mobile authentication and wallet experience
- [ ] Evaluate future integration with live ASWallet backend services

## Related Repositories

- [ASWallet-Vol.2](https://github.com/AStoyan0ff/ASWallet-Vol.2) — main Java and Spring Boot wallet application
- [ASWallet-Vol.2-svc](https://github.com/AStoyan0ff/ASWallet-Vol.2-svc) — supporting risk-assessment service

## License

This project is proprietary software. Copying, modification, redistribution or commercial use is not permitted without explicit written permission from the author. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

### ASWallet Website v1.0

Made with ❤️ by **Andrey Stoyanov**

Powered by coffee ☕ and persistence 💪

**ASWallet has not said its last word.**

</div>
