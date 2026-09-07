# Finance Tracking

Finance Tracking is a responsive personal finance dashboard for tracking income, expenses, budgets, recurring activity, and spending trends. It is built with React, Vite, Tailwind CSS, Chart.js, and Framer Motion.

## Highlights

- Supabase email/password authentication with persistent cross-device sessions
- Per-user transactions, budgets, and currency preferences stored in PostgreSQL
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

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. In Authentication > Providers, enable Email. Disable email confirmation for quick testing, or keep it enabled to require users to verify their email.
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from Project Settings > API.
5. Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values to the Vercel project environment variables.

The frontend only uses the Supabase anon key. Never put a Supabase service-role key in `.env.local`, Vercel, or browser code.

## Build and deploy

```bash
npm run lint
npm run build
```

The project is configured for Vercel with `vercel.json`, including SPA rewrites for direct navigation to dashboard routes. Import the repository into Vercel, keep the default Vite settings, and deploy.

## Resume-ready description

**Finance Tracking | React, Vite, Tailwind CSS, Chart.js**

Built a responsive personal finance dashboard with Supabase authentication, per-user PostgreSQL data, protected routing, transaction CRUD workflows, monthly budget tracking, recurring transactions, chart date filters, overspending alerts, multi-currency formatting, CSV export, JSON backup/restore, dark mode, and mobile navigation.

## Strong next upgrades

- Add automated tests with Vitest and React Testing Library
- Add end-to-end tests for login, CRUD, backup, and protected routing
- Add a CI workflow that runs lint, tests, and build on every pull request
- Add screenshots, a live demo URL, and a short architecture diagram to the portfolio case study
