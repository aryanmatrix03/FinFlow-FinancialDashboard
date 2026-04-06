import InsightCard from "../ui/InsightCard";
import EmptyState  from "../ui/EmptyState";
import { PIE_COLORS, CATEGORY_META, SAVINGS_TARGET_PCT } from "../../constants";
import { fmtINR } from "../../utils/formatters";
import { Wallet, PieChart, RefreshCw, TrendingDown } from "../../constants/icons";

export default function InsightsTab({
  balance, totalIncome, totalExpenses, savingsRate,
  categoryData, freqCatName, freqCatCount, onGoToTx,
}) {
  const topCat    = categoryData[0];
  const noExpense = totalExpenses === 0;

  return (
    <div className="fd-fade">
      {/* Key insight banner */}
      <div className="fd-card" style={{ padding: 28, marginBottom: 16, borderColor: "var(--fd-accent-border)", background: "linear-gradient(135deg,var(--fd-accent-hover),transparent)" }}>
        <div style={{ fontFamily: "Syne", fontSize: 13, color: "var(--fd-accent)", marginBottom: 8 }}>
          Key Insight
        </div>
        {noExpense ? (
          <div style={{ fontSize: 17, color: "var(--fd-text-subtle)" }}>
            No expenses recorded yet. Add transactions to generate insights.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 19, fontWeight: 600, color: "var(--fd-text-primary)", lineHeight: 1.6 }}>
              Your top spending category is{" "}
              <span style={{ color: CATEGORY_META[topCat?.name]?.color ?? "#F97316", fontFamily: "Manrope", fontWeight: 800 }}>
                {topCat?.name ?? "—"}
              </span>{" "}
              at <span style={{ color: "var(--fd-text-primary)" }}>{fmtINR(topCat?.value ?? 0)}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--fd-text-subtle)", marginTop: 8 }}>
              That is {(((topCat?.value ?? 0) / totalExpenses) * 100).toFixed(1)}% of your total expenses this period.
            </div>
          </>
        )}
      </div>

      {/* Metric cards */}
      <div className="fd-grid-insights">
        <InsightCard
          Icon={Wallet} title="Net Savings"
          value={fmtINR(balance)}
          sub={totalIncome > 0 ? `${savingsRate}% of income` : "No income recorded"}
          color={balance >= 0 ? "var(--fd-income)" : "var(--fd-expense)"}
        />
        <InsightCard
          Icon={PieChart} title="Top Expense Category"
          value={topCat?.name ?? "—"}
          sub={topCat ? `${fmtINR(topCat.value)} total` : "No expenses yet"}
          color={CATEGORY_META[topCat?.name]?.color ?? "var(--fd-text-subtle)"}
        />
        <InsightCard
          Icon={RefreshCw} title="Most Active Category"
          value={freqCatName}
          sub={freqCatCount > 0 ? `${freqCatCount} transaction${freqCatCount !== 1 ? "s" : ""}` : "No data"}
          color="var(--fd-info)"
        />
      </div>

      {/* Breakdown card */}
      <div className="fd-card" style={{ padding: 28 }}>
        <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--fd-text-primary)", marginBottom: 22 }}>
          Expense Breakdown by Category
        </div>

        {categoryData.length === 0 ? (
          <EmptyState Icon={TrendingDown} title="No expense data"
            message="Add expense transactions to see a breakdown by category."
            action={{ label: "Go to Transactions", onClick: onGoToTx }} />
        ) : (
          <>
            {categoryData.map((item, i) => {
              const pct = totalExpenses > 0 ? (item.value / totalExpenses * 100).toFixed(1) : 0;
              const col = PIE_COLORS[i % PIE_COLORS.length];
              return (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fd-text-body)", fontWeight: 500 }}>
                      <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: col, flexShrink: 0 }} />
                      {item.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fd-text-muted)", fontFamily: "Manrope" }}>
                      {fmtINR(item.value)}{" "}
                      <span style={{ color: "var(--fd-text-subtle)" }}>({pct}%)</span>
                    </div>
                  </div>
                  <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                       aria-label={`${item.name}: ${pct}% of total expenses`}
                       style={{ background: "var(--fd-border)", borderRadius: 999, height: 6, overflow: "hidden" }}>
                    <div className="fd-bar-fill"
                         style={{ height: "100%", borderRadius: 999, background: col, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            {/* Monthly summary */}
            <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(99,102,241,.08)", borderRadius: 12, border: "1px solid rgba(99,102,241,.2)" }}>
              <div style={{ fontSize: 12, color: "#818CF8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
                Monthly Summary
              </div>
              <div style={{ fontSize: 14, color: "var(--fd-text-body)", lineHeight: 1.7 }}>
                Total expenses: <strong style={{ color: "var(--fd-text-primary)" }}>{fmtINR(totalExpenses)}</strong>.{" "}
                Income: <strong style={{ color: "var(--fd-income)" }}>{fmtINR(totalIncome)}</strong>.{" "}
                Savings rate <strong style={{ color: "var(--fd-purple)" }}>{savingsRate}%</strong>
                {" "}—{" "}
                {Number(savingsRate) >= SAVINGS_TARGET_PCT
                  ? "healthy, great work!"
                  : totalIncome === 0
                    ? "add income transactions to calculate."
                    : `below the recommended ${SAVINGS_TARGET_PCT}% target.`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
