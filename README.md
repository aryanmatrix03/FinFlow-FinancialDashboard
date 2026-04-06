# FinFlow

FinFlow is a frontend-only financial dashboard built with React and Vite for tracking income, expenses, savings, and category-wise spending behavior.

It is designed as a polished single-page experience with interactive charts, transaction management, role-based UI states, persistent browser storage, light and dark themes, and a strong accessibility baseline. No backend, login flow, or API setup is required to run it locally.

## Table of Contents

- [Overview](#overview)
- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [How the Dashboard Is Structured](#how-the-dashboard-is-structured)
- [Feature Walkthrough](#feature-walkthrough)
- [Approach and Architecture](#approach-and-architecture)
- [Data Model and Persistence](#data-model-and-persistence)
- [Accessibility](#accessibility)
- [Responsive Behavior](#responsive-behavior)
- [Project Structure](#project-structure)
- [Edge Cases Handled](#edge-cases-handled)
- [Future Enhancements](#future-enhancements)

## Overview

FinFlow simulates a modern personal finance dashboard. It ships with realistic seeded transactions dated March 2026, then persists any changes in the browser using `localStorage`. The application is intentionally frontend-only, which makes it useful for demos, UI assignments, portfolio projects, and local experimentation.

The product centers around three core workflows:

1. Understand your financial position through high-level KPIs and charts.
2. Manage transaction records through search, filters, sorting, create, edit, delete, and export flows.
3. Interpret spending behavior through insights derived from the underlying transaction set.

## Highlights

- Clean dashboard UI with a sidebar, top bar, cards, charts, tables, and modal workflows
- Overview, Transactions, and Insights tabs with shared derived financial data
- Admin and Viewer role simulation with UI-level permission changes
- Light and dark theme toggle with persisted theme preference
- Local persistence for transactions with automatic fallback to seeded mock data
- CSV and JSON export from the browser
- Responsive layouts for desktop, tablet, and mobile
- Accessible dialogs, alerts, toasts, navigation states, and progress indicators

## Tech Stack

| Layer | Choice | Why it fits this project |
| --- | --- | --- |
| UI | React 18 | Small, composable component model with hooks |
| Build Tool | Vite | Fast local development and simple production build setup |
| Charts | Recharts | Declarative charting for the balance trend and spending breakdown |
| Styling | Plain CSS | Lightweight, transparent, and easy to inspect or extend |
| Icons | Lucide React | Consistent iconography across navigation and UI actions |
| Persistence | `localStorage` | Makes the dashboard stateful without a backend |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will start the app locally, usually at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Notes

- No `.env` file is required
- No backend service is required
- All transaction changes are stored in the browser, not on a server

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production bundle in `dist/` |
| `npm run preview` | Serves the built app locally for verification |

## How the Dashboard Is Structured

The application is organized around a single orchestration component, `FinanceDashboard`, which wires together the layout, data hooks, derived metrics, and modal states.

The UI is split into three main tabs:

- `Overview`: summary metrics, cards, charts, and recent activity
- `Transactions`: search, filter, sort, export, and transaction CRUD
- `Insights`: category-level analysis and spending summaries

Supporting systems handle persistence, theme preference, exports, validation, and toast notifications.

## Feature Walkthrough

### 1. Sidebar Navigation

The sidebar is the primary app shell. It includes:

- The FinFlow brand mark
- Navigation between Overview, Transactions, and Insights
- Theme toggle for switching between light and dark mode
- Role switcher for moving between `viewer` and `admin`
- Mobile drawer behavior on smaller screens

The active tab is visually highlighted, and navigation uses `aria-current` to expose current-page state to assistive technologies.

### 2. Top Bar

The top bar changes title based on the current tab and displays:

- The current date
- The active role label
- A mobile hamburger button for opening the sidebar
- A contextual `+ Add Transaction` action when the user is an admin and is viewing the Transactions tab
- Three utility panels: Notifications, Settings, and Help

These utility panels are frontend-only demo interactions, but they give the dashboard a more complete product feel:

- Notifications include unread state, mark-all-read, and clear-all actions
- Settings presents account, region, export, and privacy options
- Help provides documentation, issue-report, and feature-request entries

### 3. Overview Tab

The Overview tab is the high-level financial snapshot of the app.

#### Interactive Card Stack

The top section includes a stylized card stack that:

- Shows two mock accounts
- Lets the user click to switch the active card
- Masks sensitive card numbers
- Displays a balance for the selected account
- Supports hiding and revealing that balance

This section is decorative and illustrative, but it reinforces the dashboard’s financial product feel.

#### KPI Cards

The KPI section presents four summary metrics:

- Total Balance
- Total Income
- Total Expenses
- Savings Rate

These values are derived live from the current transaction array. The total balance card also supports hiding or revealing the visible number.

#### Balance Trend Chart

The area chart visualizes a six-month balance trend using seeded monthly data from October 2025 through March 2026. It includes:

- Responsive resizing
- Themed tooltip styling
- Human-readable rupee formatting
- Light and dark mode chart color adjustments

#### Spending Breakdown Chart

The donut chart groups expense transactions by category and displays:

- Category-wise expense totals
- Color-coded chart slices
- Legend chips
- Tooltip values formatted in Indian currency

If there are no expense transactions, the chart is replaced with a clear empty state.

#### Recent Activity

The recent activity section shows the most recent five transactions. Each row includes:

- Direction indicator for income vs expense
- Description
- Date
- Amount with contextual color

If there are transactions available, a `View all` action sends the user straight to the Transactions tab.

### 4. Transactions Tab

The Transactions tab is the operational workspace of the dashboard.

#### Search

Users can search transactions by:

- Description
- Dates
- Category name

The filtering is case-insensitive and updates the table immediately.

#### Filters

Users can narrow the dataset using:

- Type filter: all, income, expense or custom dates filter
- Category filter: all or a specific category

#### Sorting

Transactions can be sorted by:

- Date, newest first
- Date, oldest first
- Amount, high to low
- Amount, low to high

#### Export

If transactions exist, the tab shows an export menu with:

- CSV download
- JSON download

Exports are generated completely client-side by creating a temporary file blob and triggering a browser download.

#### Transactions Table

The main table displays:

- Date
- Description
- Category
- Type
- Amount
- Actions, when the active role is `admin`

Viewer mode removes mutation controls entirely, while Admin mode exposes `Edit` and `Delete`.

#### Empty States

Two distinct empty states are supported:

- No transactions exist at all
- Transactions exist, but the current search or filters return no results

This avoids the common confusion where “empty dataset” and “empty filtered result” are treated as the same situation.

### 5. Add and Edit Transaction Modal

Admins can create or update transactions through a modal form.

The form includes:

- Description
- Amount
- Date
- Type
- Category

Validation rules:

- Description is required
- Amount must be a positive number greater than zero
- Date is required
- Date cannot be in the future

Behavior details:

- The first field is auto-focused when the modal opens
- Escape closes the modal
- Focus is trapped inside the modal while it is open
- The modal switches labels automatically between add and edit mode

### 6. Delete Confirmation Dialog

Before a transaction is deleted, the app opens a confirmation dialog that:

- Shows the transaction description, amount, and date
- Auto-focuses the destructive action
- Supports Escape to cancel
- Uses `role="alertdialog"` for a more explicit accessible warning

### 7. Toast Notifications

The app shows temporary toast messages for key actions such as:

- Transaction added
- Transaction updated
- Transaction deleted

These toasts are announced through an `aria-live` region so they are communicated to assistive technology without interrupting the user’s flow.

### 8. Insights Tab

The Insights tab translates the transaction data into more interpretive summaries.

#### Key Insight Banner

This banner identifies the top spending category and explains how much of the total expense pool it represents. If no expenses exist, it gracefully switches to an instructional empty state message.

#### Insight Cards

Three insight cards are calculated from the live data:

- Net Savings
- Top Expense Category
- Most Active Category

These values update automatically whenever transactions change.

#### Expense Breakdown by Category

Each expense category is rendered with:

- A color marker
- Absolute spend value
- Percentage of total expenses
- A progress bar with accessible `progressbar` semantics

#### Monthly Summary

The summary callout compares the current savings rate against the configured recommendation target of `20%`. It changes its message depending on whether the user:

- Is above the target
- Is below the target
- Has not recorded any income yet

### 9. Theme System

FinFlow supports both dark and light mode.

The theme system:

- Reads the stored user preference if one exists
- Falls back to the operating system preference on first visit
- Applies theme variables globally through a `data-theme` attribute on the root document element
- Persists the chosen theme in `localStorage`

This keeps the implementation simple while allowing the entire dashboard to inherit the active design tokens.

### 10. Role-Based UI Simulation

The role switcher is a UI simulation of permissions.

| Role | Behavior |
| --- | --- |
| `viewer` | Read-only access to the dashboard, charts, tables, and insights |
| `admin` | Full transaction management, including add, edit, and delete actions |

This is not an authentication system. It is a frontend-only interaction model meant to demonstrate how the interface adapts to different permission states.

### 11. Persistence

Transactions are persisted under the browser storage key `finflow_transactions`.

Persistence behavior:

- If stored transactions exist, they are loaded on startup
- If nothing is stored, seeded mock data is used
- If storage fails or is unavailable, the UI still works with in-memory state

Theme preference is stored separately under `finflow_theme`.

## Approach and Architecture

### 1. Single Orchestrator, Focused Helpers

`FinanceDashboard` acts as the composition root for the feature. It owns UI-only state such as:

- Active tab
- Current role
- Sidebar visibility
- Search and filter inputs
- Modal and confirmation visibility
- Balance visibility state

Business-like data behavior is pushed into dedicated hooks and utilities.

### 2. Custom Hooks for Concerns That Repeat

The app separates recurring concerns into focused hooks:

- `useTransactions` manages CRUD and persistence
- `useTheme` manages theme selection and persistence
- `useToast` manages ephemeral feedback messages

This keeps the top-level component understandable while avoiding overengineering.

### 3. Derived Data Instead of Duplicated State

Rather than storing redundant aggregates, the dashboard computes values such as:

- Total income
- Total expenses
- Net balance
- Savings rate
- Category breakdown
- Most active category
- Filtered and sorted transaction lists

This reduces synchronization bugs and keeps the source of truth small.

### 4. Presentation Components Stay Focused

UI pieces like KPI cards, empty states, insight cards, toasts, and layout components are kept intentionally focused so they can receive prepared props and render cleanly.

### 5. Frontend-Only by Design

The project deliberately avoids backend dependencies. That keeps setup friction extremely low, makes the repository easy to evaluate locally, and keeps the focus on product UI, state flow, and component architecture.

## Data Model and Persistence

Each transaction follows this shape:

```js
{
  id: 1,
  date: "2026-03-28",
  desc: "Salary",
  absAmt: 85000,
  category: "Income",
  type: "income"
}
```

A few implementation choices are worth calling out:

- `absAmt` is always stored as a positive number
- The visual sign is derived from `type`, not from negative values in state
- Dates are stored in ISO format for reliable sorting and filtering
- Currency is formatted in the Indian locale using `en-IN`

## Accessibility

Accessibility is treated as a product feature, not an afterthought.

Included behaviors:

- `role="dialog"` and `aria-modal="true"` for the transaction modal
- `role="alertdialog"` for the delete confirmation dialog
- Focus trap inside the transaction modal
- Auto-focus for first actionable controls when dialogs open
- Escape-to-close support for modal and confirmation flows
- `aria-live="polite"` notifications for toast updates
- `aria-pressed` on toggle-like controls such as role pills
- `aria-current="page"` on active navigation items
- `role="progressbar"` for the insight progress bars
- Clear `aria-label` values on icon and action buttons

## Responsive Behavior

FinFlow is designed to remain usable across large and small viewports.

Responsive behaviors include:

- Sidebar collapses into a mobile drawer
- Filter controls stack more naturally on narrow screens
- Grid sections reduce from multi-column layouts to fewer columns
- Tables remain horizontally scrollable rather than breaking layout
- Chart and card containers scale with available space

The visual system is driven by CSS variables and layout utility classes inside `src/styles/dashboard.css`.

## Project Structure

```text
finflow/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon-v2.svg
│   └── favicon.svg
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── FinanceDashboard.jsx
    │   ├── layout/
    │   │   ├── Sidebar.jsx
    │   │   └── TopBar.jsx
    │   ├── modals/
    │   │   ├── ConfirmDialog.jsx
    │   │   └── TxModal.jsx
    │   ├── tabs/
    │   │   ├── InsightsTab.jsx
    │   │   ├── OverviewTab.jsx
    │   │   └── TransactionsTab.jsx
    │   └── ui/
    │       ├── Badge.jsx
    │       ├── CardStack.jsx
    │       ├── EmptyState.jsx
    │       ├── InsightCard.jsx
    │       ├── KpiCard.jsx
    │       └── ToastContainer.jsx
    ├── constants/
    │   ├── icons.js
    │   └── index.js
    ├── data/
    │   └── mockData.js
    ├── hooks/
    │   ├── useTheme.js
    │   ├── useToast.js
    │   └── useTransactions.js
    ├── styles/
    │   └── dashboard.css
    └── utils/
        ├── exportData.js
        ├── formatters.js
        ├── storage.js
        └── validation.js
```

## Edge Cases Handled

| Scenario | Behavior |
| --- | --- |
| No stored transactions | Falls back to seeded mock data |
| `localStorage` unavailable | Fails gracefully without crashing the UI |
| No transactions at all | Shows empty states across relevant sections |
| No expense transactions | Replaces expense visuals with clear empty states |
| No income transactions | Savings messaging adapts accordingly |
| Search or filters return nothing | Shows a no-results state instead of an empty table |
| Invalid modal input | Field-level validation messages appear inline |
| Future date entered | Date validation blocks submission |
| Zero or negative amount | Amount validation blocks submission |
| Mobile viewport | Sidebar becomes an off-canvas drawer |

## Future Enhancements

Some natural next steps if you want to keep evolving the project:

- Connect transactions to a real backend or mock API layer
- Add date-range filtering and richer analytics controls
- Add pagination or virtualization for larger datasets
- Introduce authentication-backed roles instead of UI simulation
- Add automated tests for hooks, modal behavior, and derived calculations
- Add transaction import support alongside export

## Summary

FinFlow is a compact but feature-rich finance dashboard that demonstrates thoughtful UI composition, strong frontend state handling, real user workflows, and careful polish without requiring any backend infrastructure. It is easy to run, easy to inspect, and structured to support further growth.
