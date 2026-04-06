/**
 * EmptyState — zero-data placeholder with a Lucide icon.
 * Props: Icon (Lucide component), title, message, action { label, onClick }
 */
export default function EmptyState({ Icon, title, message, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 24px", textAlign: "center" }}>
      {Icon && (
        <div style={{
          width: 56, height: 56, borderRadius: 16, marginBottom: 16,
          background: "var(--fd-bg-sub)", border: "1px solid var(--fd-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={26} strokeWidth={1.5} style={{ color: "var(--fd-text-faint)" }} aria-hidden="true" />
        </div>
      )}
      <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--fd-text-subtle)", marginBottom: 8 }}>
        {title}
      </div>
      {message && (
        <div style={{ fontSize: 13, color: "var(--fd-text-faint)", maxWidth: 300, lineHeight: 1.6 }}>
          {message}
        </div>
      )}
      {action && (
        <button onClick={action.onClick} className="fd-btn-primary" style={{ marginTop: 20, padding: "10px 24px" }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
