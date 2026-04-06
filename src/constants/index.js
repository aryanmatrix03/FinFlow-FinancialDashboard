// ─── App-wide constants ────────────────────────────────────────────────────

export const LS_KEY             = "finflow_transactions";
export const LS_SUPPORT_KEY     = "finflow_support_submissions";
export const SAVINGS_TARGET_PCT = 20;          // recommended savings rate %
export const RECENT_TX_COUNT    = 5;           // rows shown on Overview tab
export const TOAST_DURATION_MS  = 3200;
export const TODAY_ISO          = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

// ─── Category appearance ───────────────────────────────────────────────────

export const CATEGORY_META = {
  Food:          { color: "#F97316", bg: "#F9731618" },
  Entertainment: { color: "#A855F7", bg: "#A855F718" },
  Utilities:     { color: "#3B82F6", bg: "#3B82F618" },
  Health:        { color: "#EC4899", bg: "#EC489918" },
  Shopping:      { color: "#EAB308", bg: "#EAB30818" },
  Transport:     { color: "#14B8A6", bg: "#14B8A618" },
  Investment:    { color: "#6366F1", bg: "#6366F118" },
  Education:     { color: "#8B5CF6", bg: "#8B5CF618" },
  Income:        { color: "#34D399", bg: "#34D39918" },
};

export const PIE_COLORS = [
  "#F97316", "#A855F7", "#3B82F6", "#EC4899",
  "#EAB308", "#14B8A6", "#6366F1", "#8B5CF6",
];

/** All expense categories (Income excluded — it's a type, not a spend bucket) */
export const ALL_CATEGORIES = Object.keys(CATEGORY_META).filter(c => c !== "Income");

/** Blank form used when opening the Add Transaction modal */
export const EMPTY_FORM = {
  desc: "", amount: "", category: "Food", type: "expense", date: "",
};

/** Shared label style for modal form fields */
export const LABEL_STYLE = {
  fontSize: 11,
  color: "#6B7280",
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};
