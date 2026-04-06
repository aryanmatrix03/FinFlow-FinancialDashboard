import { useEffect, useMemo, useRef, useState } from "react";
import { LABEL_STYLE } from "../../constants";
import { validateSupportForm } from "../../utils/validation";

const EMPTY_SUPPORT_FORM = {
  name: "",
  email: "",
  subject: "",
  details: "",
};

const SUPPORT_META = {
  issue: {
    title: "Report an Issue",
    subtitle: "Tell us what went wrong and we will look into it.",
    subjectLabel: "Issue Title",
    subjectPlaceholder: "e.g., Transactions page is not loading",
    detailsLabel: "What Happened?",
    detailsPlaceholder: "Describe the problem, what you expected, and any steps to reproduce it.",
    submitLabel: "Submit Issue",
  },
  feature: {
    title: "Feature Request",
    subtitle: "Share an idea that would make FinFlow better for you.",
    subjectLabel: "Feature Title",
    subjectPlaceholder: "e.g., Budget goal alerts",
    detailsLabel: "Why Would This Help?",
    detailsPlaceholder: "Describe the feature, the problem it solves, and how you would use it.",
    submitLabel: "Submit Request",
  },
};

export default function SupportRequestModal({
  type,
  onClose,
  onSubmit,
  initialName = "",
  initialEmail = "",
}) {
  const meta = SUPPORT_META[type] ?? SUPPORT_META.issue;
  const [form, setForm] = useState({
    ...EMPTY_SUPPORT_FORM,
    name: initialName,
    email: initialEmail,
  });
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);
  const modalRef = useRef(null);

  const labelSt = useMemo(
    () => ({ ...LABEL_STYLE, color: "var(--fd-text-subtle)" }),
    [],
  );

  useEffect(() => {
    setForm({
      ...EMPTY_SUPPORT_FORM,
      name: initialName,
      email: initialEmail,
    });
    setErrors({});
  }, [initialEmail, initialName, type]);

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
      [...el.querySelectorAll("button,input,textarea,[tabindex]")].filter(n => !n.disabled);

    const trap = (e) => {
      if (e.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateSupportForm(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({
      type,
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      details: form.details.trim(),
    });
  };

  return (
    <div
      className="fd-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="fd-card fd-fade"
        style={{ padding: 32, width: 520, maxWidth: "92vw" }}
        onClick={e => e.stopPropagation()}
      >
        <div id="support-modal-title" style={{ fontFamily: "Syne", fontSize: 19, fontWeight: 800, color: "var(--fd-text-primary)" }}>
          {meta.title}
        </div>
        <p style={{ fontSize: 13, color: "var(--fd-text-subtle)", lineHeight: 1.6, marginTop: 8, marginBottom: 22 }}>
          {meta.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label htmlFor="support-name" style={labelSt}>Name</label>
            <input
              id="support-name"
              ref={firstFieldRef}
              type="text"
              value={form.name}
              onChange={e => updateField("name", e.target.value)}
              className={`fd-input${errors.name ? " error" : ""}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-support-name" : undefined}
              placeholder="Your name"
            />
            {errors.name && <div id="err-support-name" className="fd-field-err" role="alert">{errors.name}</div>}
          </div>

          <div>
            <label htmlFor="support-email" style={labelSt}>Email</label>
            <input
              id="support-email"
              type="email"
              value={form.email}
              onChange={e => updateField("email", e.target.value)}
              className={`fd-input${errors.email ? " error" : ""}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-support-email" : undefined}
              placeholder="you@example.com"
            />
            {errors.email && <div id="err-support-email" className="fd-field-err" role="alert">{errors.email}</div>}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="support-subject" style={labelSt}>{meta.subjectLabel}</label>
          <input
            id="support-subject"
            type="text"
            value={form.subject}
            onChange={e => updateField("subject", e.target.value)}
            className={`fd-input${errors.subject ? " error" : ""}`}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "err-support-subject" : undefined}
            placeholder={meta.subjectPlaceholder}
          />
          {errors.subject && <div id="err-support-subject" className="fd-field-err" role="alert">{errors.subject}</div>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="support-details" style={labelSt}>{meta.detailsLabel}</label>
          <textarea
            id="support-details"
            value={form.details}
            onChange={e => updateField("details", e.target.value)}
            className={`fd-input${errors.details ? " error" : ""}`}
            aria-invalid={!!errors.details}
            aria-describedby={errors.details ? "err-support-details" : undefined}
            placeholder={meta.detailsPlaceholder}
            rows={5}
            style={{ minHeight: 128, resize: "vertical" }}
          />
          {errors.details && <div id="err-support-details" className="fd-field-err" role="alert">{errors.details}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="fd-btn-ghost"
            style={{ flex: 1 }}
            onClick={onClose}
            aria-label="Cancel and close support form"
          >
            Cancel
          </button>
          <button
            className="fd-btn-primary"
            style={{ flex: 1, padding: 12, fontSize: 14 }}
            onClick={handleSubmit}
            aria-label={meta.submitLabel}
          >
            {meta.submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
