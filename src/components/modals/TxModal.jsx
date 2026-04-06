import { useState, useEffect, useRef } from "react";
import { ALL_CATEGORIES, TODAY_ISO, LABEL_STYLE } from "../../constants";
import { validateForm } from "../../utils/validation";

export default function TxModal({ editTarget, form, setForm, onSubmit, onClose }) {
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);
  const modalRef      = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const focusable = () =>
      [...el.querySelectorAll("button,input,select,[tabindex]")].filter(n => !n.disabled);
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);

  const handleSubmit = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onSubmit(form);
  };

  const fieldProps = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm(p => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n; });
    },
    className: `fd-input${errors[key] ? " error" : ""}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `err-${key}` : undefined,
  });

  // Compute label style using CSS vars (overrides the constant for dynamic theming)
  const labelSt = { ...LABEL_STYLE, color: "var(--fd-text-subtle)" };

  return (
    <div className="fd-overlay" role="dialog" aria-modal="true"
         aria-labelledby="tx-modal-title" onClick={onClose}>
      <div ref={modalRef} className="fd-card fd-fade"
           style={{ padding: 32, width: 460, maxWidth: "92vw" }}
           onClick={e => e.stopPropagation()}>

        <div id="tx-modal-title"
             style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800, color: "var(--fd-text-primary)", marginBottom: 22 }}>
          {editTarget ? "Edit Transaction" : "New Transaction"}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="tx-desc" style={labelSt}>Description</label>
          <input id="tx-desc" ref={firstFieldRef} type="text"
                 placeholder="e.g., Grocery shopping" {...fieldProps("desc")} />
          {errors.desc && <div id="err-desc" className="fd-field-err" role="alert">{errors.desc}</div>}
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="tx-amount" style={labelSt}>Amount (₹)</label>
          <input id="tx-amount" type="number" min="1" step="1" placeholder="0" {...fieldProps("amount")} />
          {errors.amount && <div id="err-amount" className="fd-field-err" role="alert">{errors.amount}</div>}
        </div>

        {/* Date */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="tx-date" style={labelSt}>Date</label>
          <input id="tx-date" type="date" max={TODAY_ISO} {...fieldProps("date")} />
          {errors.date && <div id="err-date" className="fd-field-err" role="alert">{errors.date}</div>}
        </div>

        {/* Type + Category */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div>
            <label htmlFor="tx-type" style={labelSt}>Type</label>
            <select id="tx-type" {...fieldProps("type")}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label htmlFor="tx-cat" style={labelSt}>Category</label>
            <select id="tx-cat" {...fieldProps("category")}>
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="fd-btn-ghost" style={{ flex: 1 }} onClick={onClose}
                  aria-label="Cancel and close modal">Cancel</button>
          <button className="fd-btn-primary" style={{ flex: 1, padding: 12, fontSize: 14 }}
                  onClick={handleSubmit}
                  aria-label={editTarget ? "Save changes to transaction" : "Add new transaction"}>
            {editTarget ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
