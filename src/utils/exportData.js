/**
 * exportData — client-side file export utilities.
 *
 * Both functions create a temporary anchor element, trigger a download,
 * and immediately revoke the object URL to avoid memory leaks.
 */

/**
 * Download transactions as a CSV file.
 * @param {Transaction[]} transactions
 * @param {string} [filename]
 */
export function exportCSV(transactions, filename = "finflow-transactions.csv") {
  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];

  const rows = transactions.map(t => [
    t.date,
    `"${t.desc.replace(/"/g, '""')}"`,   // escape quotes inside description
    t.category,
    t.type,
    t.absAmt,
  ]);

  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  triggerDownload(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Download transactions as a formatted JSON file.
 * @param {Transaction[]} transactions
 * @param {string} [filename]
 */
export function exportJSON(transactions, filename = "finflow-transactions.json") {
  const payload = transactions.map(({ id, date, desc, absAmt, category, type }) => ({
    id, date, description: desc, amount: absAmt, category, type,
  }));
  triggerDownload(JSON.stringify(payload, null, 2), filename, "application/json");
}

// ── Internal helper ──────────────────────────────────────────────────────────

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
