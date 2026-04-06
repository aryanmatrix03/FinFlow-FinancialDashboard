import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

import KpiCard    from "../ui/KpiCard";
import EmptyState from "../ui/EmptyState";
import CardStack  from "../ui/CardStack";
import { ClipboardList, PieChart as PieIcon } from "../../constants/icons";
import { PIE_COLORS, CATEGORY_META, RECENT_TX_COUNT } from "../../constants";
import { BALANCE_TREND } from "../../data/mockData";
import { fmtINR, fmtDate } from "../../utils/formatters";

/**
 * OverviewTab
 * Props: totalIncome, totalExpenses, balance, savingsRate,
 *        categoryData, transactions, onViewAll, isDark,
 *        balanceHidden, onToggleBalance
 */
export default function OverviewTab({
  totalIncome, totalExpenses, balance, savingsRate,
  categoryData, transactions, onViewAll, isDark,
  balanceHidden, onToggleBalance,
}) {
  // Chart colours derived from theme so they work in both modes
  const C = {
    tick:          isDark ? "#6B7280" : "#64748B",
    grid:          isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.06)",
    tooltipBg:     isDark ? "#111827" : "#ffffff",
    tooltipBorder: isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)",
    tooltipText:   isDark ? "#E2E8F0" : "#1E293B",
    areaStroke:    isDark ? "#10B981" : "#059669",
    areaFill:      isDark ? "rgba(16,185,129,.2)" : "rgba(5,150,105,.12)",
    activeDot:     isDark ? "#34D399" : "#047857",
  };

  const tooltipStyle = {
    background: C.tooltipBg,
    border: `1px solid ${C.tooltipBorder}`,
    borderRadius: 8,
    fontSize: 13,
    color: C.tooltipText,
    boxShadow: "0 4px 16px rgba(0,0,0,.15)",
  };

  const hasTransactions = transactions.length > 0;

  return (
    <div className="fd-fade">
      {/* Card stack */}
      <CardStack isDark={isDark} balance={balance} totalIncome={totalIncome} />

      {/* KPI row */}
      <div className="fd-grid-kpi">
        <KpiCard label="Total Balance"  value={fmtINR(balance)}       change="+12.4%" positive accent="var(--fd-income)" balanceHidden={balanceHidden} onToggleBalance={onToggleBalance} />
        <KpiCard label="Total Income"   value={fmtINR(totalIncome)}   change="+8.2%"  positive accent="var(--fd-info)" />
        <KpiCard label="Total Expenses" value={fmtINR(totalExpenses)} change="+3.1%"  accent="var(--fd-expense)" />
        <KpiCard label="Savings Rate"   value={`${savingsRate}%`}     change="+2.1%"  positive={Number(savingsRate) > 0} accent="var(--fd-purple)" />
      </div>

      {/* Charts row */}
      <div className="fd-grid-charts">

        {/* Balance Trend */}
        <div className="fd-card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--fd-text-primary)" }}>
            Balance Trend
          </div>
          <div style={{ fontSize: 12, color: "var(--fd-text-subtle)", marginBottom: 20, marginTop: 3 }}>
            Oct 2025 – Mar 2026
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={BALANCE_TREND} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.areaStroke} stopOpacity={isDark ? 0.25 : 0.18} />
                  <stop offset="95%" stopColor={C.areaStroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="month" tick={{ fill: C.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [fmtINR(v), "Balance"]} />
              <Area type="monotone" dataKey="balance" stroke={C.areaStroke} strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ fill: C.areaStroke, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: C.activeDot }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="fd-card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--fd-text-primary)" }}>
            Spending Breakdown
          </div>
          <div style={{ fontSize: 12, color: "var(--fd-text-subtle)", marginBottom: 4, marginTop: 3 }}>
            By category
          </div>

          {categoryData.length === 0 ? (
            <EmptyState Icon={PieIcon} title="No expense data" message="Add expense transactions to see the breakdown." />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={175}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={48} outerRadius={78}
                       dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ ...tooltipStyle, fontSize: 12 }}
                    itemStyle={{ color: "inherit" }}
                    formatter={(value, name, props) => {
                      const color = props.payload?.fill ?? C.tooltipText;
                      return [
                        <span style={{ color, fontWeight: 700 }}>{fmtINR(value)}</span>,
                        <span style={{ color: C.tick }}>{name}</span>,
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 8 }}>
                {categoryData.slice(0, 5).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fd-text-muted)" }}>
                    <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="fd-card" style={{ marginTop: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700, color: "var(--fd-text-primary)" }}>
            Recent Activity
          </div>
          {hasTransactions && (
            <button onClick={onViewAll} aria-label="View all transactions"
                    style={{ background: "none", border: "none", color: "var(--fd-accent)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              View all →
            </button>
          )}
        </div>

        {!hasTransactions ? (
          <EmptyState Icon={ClipboardList} title="No transactions yet" message="Switch to Admin role and add your first transaction." />
        ) : (
          transactions.slice(0, RECENT_TX_COUNT).map(tx => (
            <div key={tx.id} className="fd-tx-row"
                 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 4px", borderTop: "1px solid var(--fd-divider)", transition: "background .15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div aria-hidden="true"
                     style={{ width: 36, height: 36, borderRadius: 10, background: (CATEGORY_META[tx.category] ?? CATEGORY_META.Food).bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                  {tx.type === "income" ? "↑" : "↓"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fd-text-body)" }}>{tx.desc}</div>
                  <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", marginTop: 1 }}>{fmtDate(tx.date)}</div>
                </div>
              </div>
              <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 14, color: tx.type === "income" ? "var(--fd-income)" : "var(--fd-expense)", flexShrink: 0, marginLeft: 12 }}>
                {tx.type === "income" ? "+" : "−"}{fmtINR(tx.absAmt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
