export default function ToastContainer({ toasts }) {
  return (
    <div className="fd-toast-wrap" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <div key={t.id} className={`fd-toast ${t.kind}`}>
          <span aria-hidden="true">{t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
