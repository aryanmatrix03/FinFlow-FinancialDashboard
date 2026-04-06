import { useState } from "react";
import Badge      from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { ALL_CATEGORIES } from "../../constants";
import { fmtINR, fmtDate } from "../../utils/formatters";
import { exportCSV, exportJSON } from "../../utils/exportData";
import { CreditCard, SearchX } from "../../constants/icons";

export default function TransactionsTab({
  filteredTx, transactions,
  role,
  search, filterType, filterCat, sortKey,
  onSearch, onFilterType, onFilterCat, onSortKey,
  onEdit, onDelete, onAdd,
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const hasFilters = search || filterType !== "all" || filterCat !== "all";

  const handleExport = (fmt) => {
    if (fmt === "csv")  exportCSV(transactions);
    if (fmt === "json") exportJSON(transactions);
    setExportOpen(false);
  };

  return (
    <div className="fd-fade">
      {/* Filter bar */}
      <div className="fd-filter-bar">
        <input className="fd-input" style={{ flex: 1, minWidth: 160 }}
               placeholder="🔍  Search transactions or dates…" aria-label="Search transactions"
               value={search} onChange={e => onSearch(e.target.value)} />

        <select className="fd-input" style={{ width: 140 }} aria-label="Filter by type"
                value={filterType} onChange={e => onFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="fd-input" style={{ width: 155 }} aria-label="Filter by category"
                value={filterCat} onChange={e => onFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="fd-input" style={{ width: 165 }} aria-label="Sort transactions"
                value={sortKey} onChange={e => onSortKey(e.target.value)}>
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="amount-desc">Amount (High → Low)</option>
          <option value="amount-asc">Amount (Low → High)</option>
        </select>

        {/* Export */}
        {transactions.length > 0 && (
          <div style={{ position: "relative" }}>
            <button className="fd-btn-export" onClick={() => setExportOpen(p => !p)}
                    aria-haspopup="true" aria-expanded={exportOpen} aria-label="Export transactions">
              ↓ Export
            </button>
            {exportOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => setExportOpen(false)} aria-hidden="true" />
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "var(--fd-bg-card)", border: "1px solid var(--fd-border)", borderRadius: 10, overflow: "hidden", zIndex: 10, minWidth: 150, boxShadow: "var(--fd-shadow)" }}>
                  {[
                    { fmt: "csv",  label: "Download CSV",  icon: "📄" },
                    { fmt: "json", label: "Download JSON", icon: "📦" },
                  ].map(opt => (
                    <button key={opt.fmt} onClick={() => handleExport(opt.fmt)}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "11px 16px", background: "none", border: "none", color: "var(--fd-text-body)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--fd-bg-tx-hover)"}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <span>{opt.icon}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="fd-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--fd-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, color: "var(--fd-text-primary)" }}>
            All Transactions
          </div>
          <div style={{ fontSize: 12, color: "var(--fd-text-subtle)" }}>
            {filteredTx.length} record{filteredTx.length !== 1 && "s"}
            {hasFilters && <span style={{ color: "var(--fd-text-faint)", marginLeft: 6 }}>(filtered)</span>}
          </div>
        </div>

        {transactions.length === 0 ? (
          <EmptyState Icon={CreditCard} title="No transactions yet"
            message="Add your first transaction to start tracking your finances."
            action={role === "admin" ? { label: "+ Add Transaction", onClick: onAdd } : undefined} />
        ) : filteredTx.length === 0 ? (
          <EmptyState Icon={SearchX} title="No results found" message="Try adjusting your search or filters." />
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Transactions table">
              <thead>
                <tr style={{ background: "var(--fd-bg-tx-hover)" }}>
                  {["Date","Description","Category","Type","Amount"].map(h => (
                    <th key={h} scope="col" style={{ padding: "11px 20px", textAlign: "left", fontSize: 10, color: "var(--fd-text-faint)", textTransform: "uppercase", letterSpacing: "0.9px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                  {role === "admin" && (
                    <th scope="col" style={{ padding: "11px 20px", textAlign: "center", fontSize: 10, color: "var(--fd-text-faint)", textTransform: "uppercase", letterSpacing: "0.9px" }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTx.map(tx => (
                  <tr key={tx.id} className="fd-tx-row" style={{ borderTop: "1px solid var(--fd-divider)", transition: "background .15s" }}>
                    <td style={{ padding: "13px 20px", fontSize: 12, color: "var(--fd-text-muted)", whiteSpace: "nowrap" }}>
                      {fmtDate(tx.date)}
                    </td>
                    <td style={{ padding: "13px 20px", fontSize: 14, color: "var(--fd-text-body)", fontWeight: 500, minWidth: 160 }}>
                      {tx.desc}
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge category={tx.category} />
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <span style={{ color: tx.type === "income" ? "var(--fd-income)" : "var(--fd-expense)", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "Manrope", fontSize: 14, fontWeight: 800, color: tx.type === "income" ? "var(--fd-income)" : "var(--fd-expense)", whiteSpace: "nowrap" }}>
                      {tx.type === "income" ? "+" : "−"}{fmtINR(tx.absAmt)}
                    </td>
                    {role === "admin" && (
                      <td style={{ padding: "13px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <button className="fd-act-edit" onClick={() => onEdit(tx)} aria-label={`Edit ${tx.desc}`}>Edit</button>
                        <button className="fd-act-del"  onClick={() => onDelete(tx)} aria-label={`Delete ${tx.desc}`}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
