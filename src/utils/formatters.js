/**
 * Pure display-formatting helpers.
 * No side-effects — safe to call anywhere.
 */

/**
 * Format a number as Indian-locale rupees.
 * e.g. fmtINR(125000) → "₹1,25,000"
 */
export const fmtINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`;

/**
 * Format an ISO date string ("YYYY-MM-DD") for table display.
 * The explicit "T00:00:00" avoids off-by-one-day errors from UTC conversion.
 * e.g. fmtDate("2026-03-28") → "28 Mar"
 */
export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

/** Full date label shown in the page header, e.g. "3 April 2026" */
export const todayLabel = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
