import { Eye, EyeOff } from "../../constants/icons";

export default function KpiCard({ label, value, change, positive, accent, balanceHidden, onToggleBalance }) {
  return (
    <div className="fd-card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
        <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", textTransform: "uppercase", letterSpacing: "0.9px" }}>
          {label}
        </div>
        {onToggleBalance && (
          <button
            onClick={onToggleBalance}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--fd-text-subtle)", padding: "2px 4px", display: "flex", alignItems: "center"
            }}
            aria-label={balanceHidden ? "Show balance" : "Hide balance"}
          >
            {balanceHidden ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
          </button>
        )}
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: 32, fontWeight: 800, color: accent, letterSpacing: "-0.5px" }}>
        {balanceHidden ? "••••••" : value}
      </div>
      <div style={{ fontSize: 12, color: positive ? "var(--fd-income)" : "var(--fd-expense)", marginTop: 6 }}>
        {change} <span style={{ color: "var(--fd-text-subtle)" }}>vs last month</span>
      </div>
    </div>
  );
}
