import { useEffect, useRef } from "react";
import { fmtINR, fmtDate } from "../../utils/formatters";

export default function ConfirmDialog({ tx, onConfirm, onCancel }) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    confirmBtnRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fd-overlay" role="alertdialog" aria-modal="true"
         aria-labelledby="cd-title" aria-describedby="cd-desc">
      <div className="fd-card fd-fade" style={{ padding: 32, width: 420, maxWidth: "92vw" }}>

        <div id="cd-title" style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, color: "var(--fd-text-primary)", marginBottom: 10 }}>
          Delete Transaction?
        </div>

        <div id="cd-desc" style={{ fontSize: 14, color: "var(--fd-text-muted)", marginBottom: 24, lineHeight: 1.7 }}>
          <strong style={{ color: "var(--fd-text-body)" }}>{tx.desc}</strong>
          {" "}— {fmtINR(tx.absAmt)} on {fmtDate(tx.date)}
          <br />
          This action cannot be undone.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="fd-btn-ghost" style={{ flex: 1 }} onClick={onCancel} aria-label="Cancel deletion">
            Cancel
          </button>
          <button ref={confirmBtnRef} className="fd-btn-danger" style={{ flex: 1 }}
                  onClick={onConfirm} aria-label={`Confirm delete "${tx.desc}"`}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
