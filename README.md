# Finance Tracking

Finance Tracking is a responsive personal finance dashboard for tracking income, expenses, budgets, recurring activity, and spending trends. It is built with React, Vite, Tailwind CSS, Chart.js, and Framer Motion.

## Highlights

- Protected login and registration flow with locally registered account validation
- Persistent browser session, transactions, budgets, theme, and currency preferences
- Create, edit, delete, categorize, filter, and export transactions as CSV
- Monthly budget limits with progress indicators and overspending alerts
- Recurring income and expense tracking
- Date-range filtering for spending charts
- JSON backup and restore for local data
- PHP, USD, EUR, GBP, and JPY currency formatting
- Responsive mobile navigation drawer and light/dark mode

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, then use `/login`. For testing on a phone connected to the same Wi-Fi network:

```bash
npm run dev:phone
```

Open the Network URL shown by Vite on the phone. Your computer firewall may need to allow Node.js on private networks.

## Build and deploy

```bash
npm run lint
npm run build
```

The project is configured for Vercel with `vercel.json`, including SPA rewrites for direct navigation to dashboard routes. Import the repository into Vercel, keep the default Vite settings, and deploy.

## Portfolio note

The current authentication and data storage are intentionally client-side for this portfolio demo. A production version should replace them with a backend or managed service such as Supabase, Firebase, Auth0, or a custom API with secure server-side sessions.

## Resume-ready description

**Finance Tracking | React, Vite, Tailwind CSS, Chart.js**

Built a responsive personal finance dashboard with protected routing, transaction CRUD workflows, monthly budget tracking, recurring transactions, chart date filters, overspending alerts, multi-currency formatting, CSV export, JSON backup/restore, dark mode, and mobile navigation. Persisted user preferences and finance data locally and designed the UI for both desktop and mobile use.

## Strong next upgrades

- Replace local authentication with Supabase Auth or Firebase Auth
- Move finance data to a database with per-user authorization rules
- Add automated tests with Vitest and React Testing Library
- Add end-to-end tests for login, CRUD, backup, and protected routing
- Add a CI workflow that runs lint, tests, and build on every pull request
- Add screenshots, a live demo URL, and a short architecture diagram to the portfolio case study
