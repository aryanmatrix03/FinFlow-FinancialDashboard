/**
 * Static mock data for development / demo purposes.
 *
 * Each transaction stores `absAmt` — always a positive number.
 * The sign is derived from `type` ("income" | "expense") at display time,
 * which eliminates any ambiguity around negative numbers in state.
 */

export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2026-03-28", desc: "Salary",               absAmt: 85000, category: "Income",        type: "income"  },
  { id: 2,  date: "2026-03-27", desc: "Groceries – D-Mart",   absAmt:  3200, category: "Food",          type: "expense" },
  { id: 3,  date: "2026-03-26", desc: "Netflix Subscription", absAmt:   649, category: "Entertainment", type: "expense" },
  { id: 4,  date: "2026-03-25", desc: "Electricity Bill",     absAmt:  2100, category: "Utilities",     type: "expense" },
  { id: 5,  date: "2026-03-24", desc: "Freelance Project",    absAmt: 15000, category: "Income",        type: "income"  },
  { id: 6,  date: "2026-03-23", desc: "Restaurant – Dinner",  absAmt:  1800, category: "Food",          type: "expense" },
  { id: 7,  date: "2026-03-22", desc: "Gym Membership",       absAmt:  2500, category: "Health",        type: "expense" },
  { id: 8,  date: "2026-03-20", desc: "Amazon Shopping",      absAmt:  4500, category: "Shopping",      type: "expense" },
  { id: 9,  date: "2026-03-18", desc: "Ola / Uber Rides",     absAmt:   890, category: "Transport",     type: "expense" },
  { id: 10, date: "2026-03-17", desc: "Medical Checkup",      absAmt:  1200, category: "Health",        type: "expense" },
  { id: 11, date: "2026-03-15", desc: "Dividend Payout",      absAmt:  5200, category: "Investment",    type: "income"  },
  { id: 12, date: "2026-03-14", desc: "Mobile Recharge",      absAmt:   599, category: "Utilities",     type: "expense" },
  { id: 13, date: "2026-03-12", desc: "Online Course",        absAmt:  3999, category: "Education",     type: "expense" },
  { id: 14, date: "2026-03-10", desc: "Coffee Shop",          absAmt:   420, category: "Food",          type: "expense" },
  { id: 15, date: "2026-03-08", desc: "Mutual Fund SIP",      absAmt: 10000, category: "Investment",    type: "expense" },
  { id: 16, date: "2026-03-05", desc: "Salary Bonus",         absAmt: 20000, category: "Income",        type: "income"  },
  { id: 17, date: "2026-03-03", desc: "Internet Bill",        absAmt:   999, category: "Utilities",     type: "expense" },
  { id: 18, date: "2026-03-01", desc: "Book Purchase",        absAmt:   850, category: "Education",     type: "expense" },
];

export const BALANCE_TREND = [
  { month: "Oct", balance: 145000 },
  { month: "Nov", balance: 162000 },
  { month: "Dec", balance: 148000 },
  { month: "Jan", balance: 175000 },
  { month: "Feb", balance: 168000 },
  { month: "Mar", balance: 192000 },
];
