/**
 * InsightCard — metric tile for Insights tab.
 * Accepts a Lucide icon component instead of an emoji.
 */
export default function InsightCard({ Icon, title, value, sub, color }) {
  return (
    <div className="fd-card" style={{ padding: 24 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, marginBottom: 14,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {Icon && <Icon size={20} strokeWidth={2} style={{ color }} aria-hidden="true" />}
      </div>
      <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--fd-text-muted)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}
