import { useState } from "react";
import {
  Bell, Settings, HelpCircle, Menu,
  UserCircle, Globe, Upload, ShieldCheck,
  BookOpen, AlertCircle, Lightbulb,
  CheckCircle, AlertTriangle, Info,
} from "../../constants/icons";
import { todayLabel } from "../../utils/formatters";
import { loadSupportSubmissions, saveSupportSubmissions } from "../../utils/storage";
import SupportRequestModal from "../modals/SupportRequestModal";

// ─── Mock notifications ───────────────────────────────────────────────────────
const INITIAL_NOTIFS = [
  { id: 1, type: "success", title: "Salary credited",      sub: "₹85,000 received · 28 Mar",    read: false },
  { id: 2, type: "warning", title: "High spending alert",  sub: "Food budget exceeded by 12%",   read: false },
  { id: 3, type: "info",    title: "Monthly report ready", sub: "Your March summary is ready",   read: true  },
  { id: 4, type: "success", title: "SIP processed",        sub: "₹10,000 debited · Mutual Fund", read: true  },
];

const NOTIF_META = {
  success: { Icon: CheckCircle,  color: "#10B981" },
  warning: { Icon: AlertTriangle, color: "#F59E0B" },
  info:    { Icon: Info,          color: "#3B82F6" },
};

// ─── Settings menu ────────────────────────────────────────────────────────────
const SETTINGS_ITEMS = [
  { label: "Account preferences", sub: "Manage your profile",    Icon: UserCircle,  color: "#6366F1" },
  { label: "Currency & region",   sub: "INR · India",            Icon: Globe,        color: "#3B82F6" },
  { label: "Export data",         sub: "CSV or JSON download",   Icon: Upload,       color: "#10B981" },
  { label: "Privacy & security",  sub: "Passwords and sessions", Icon: ShieldCheck,  color: "#F59E0B" },
];

// ─── Help menu ────────────────────────────────────────────────────────────────
const HELP_ITEMS = [
  { label: "Documentation",   sub: "Guides and references",  Icon: BookOpen,    color: "#3B82F6" },
  { label: "Report an issue", sub: "Something not working?", Icon: AlertCircle, color: "#F87171" },
  { label: "Feature request", sub: "Suggest an improvement", Icon: Lightbulb,   color: "#10B981" },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function UnreadDot() {
  return (
    <span style={{
      position: "absolute", top: 6, right: 6,
      width: 7, height: 7, borderRadius: "50%",
      background: "#EF4444",
      border: "2px solid var(--fd-bg-base)",
    }} />
  );
}

function DropdownHeader({ title, action }) {
  return (
    <div style={{
      padding: "14px 16px 10px",
      borderBottom: "1px solid var(--fd-border)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: "var(--fd-text-primary)" }}>
        {title}
      </span>
      {action}
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

/**
 * TopBar — page header with page title, date, and icon-button actions.
 *
 * Props:
 *   title      {string}
 *   role       {string}   "viewer" | "admin"
 *   showAddBtn {boolean}
 *   onAdd      {fn}
 *   onMenuOpen {fn}       opens mobile sidebar drawer
 *   onToast    {fn}
 */
export default function TopBar({
  title, role, showAddBtn, onAdd, onMenuOpen,
  onToast,
  userName = "",
  userEmail = "",
}) {
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen,     setHelpOpen]     = useState(false);
  const [notifs,       setNotifs]       = useState(INITIAL_NOTIFS);
  const [supportType,  setSupportType]  = useState(null);

  const unread = notifs.filter(n => !n.read).length;

  const closeAll    = () => { setNotifOpen(false); setSettingsOpen(false); setHelpOpen(false); };
  const togglePanel = (panel) => {
    setNotifOpen(    panel === "notif");
    setSettingsOpen( panel === "settings");
    setHelpOpen(     panel === "help");
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll    = () => { setNotifs([]); setNotifOpen(false); };
  const closeSupportModal = () => setSupportType(null);

  const openSupportModal = (type) => {
    setHelpOpen(false);
    setSupportType(type);
  };

  const handleHelpItemClick = (label) => {
    if (label === "Report an issue") {
      openSupportModal("issue");
      return;
    }
    if (label === "Feature request") {
      openSupportModal("feature");
    }
  };

  const handleSupportSubmit = (payload) => {
    const existing = loadSupportSubmissions();
    const nextEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...payload,
    };

    saveSupportSubmissions([nextEntry, ...existing]);
    setSupportType(null);
    onToast?.(
      payload.type === "issue"
        ? "Issue report submitted successfully."
        : "Feature request submitted successfully.",
      "success",
    );
  };

  // ── Shared styles ────────────────────────────────────────────────────────
  const iconBtn = (isActive) => ({
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 38, height: 38, borderRadius: 10,
    border: `1px solid ${isActive ? "var(--fd-accent-border)" : "var(--fd-border-input)"}`,
    background: isActive ? "var(--fd-accent-active)" : "var(--fd-bg-card)",
    cursor: "pointer",
    color: isActive ? "var(--fd-accent)" : "var(--fd-text-subtle)",
    transition: "all .2s", flexShrink: 0,
  });

  const dropdownWrap = (width) => ({
    position: "absolute", top: "calc(100% + 10px)", right: 0,
    width, background: "var(--fd-bg-card)",
    border: "1px solid var(--fd-border)",
    borderRadius: 14, boxShadow: "var(--fd-shadow)",
    zIndex: 300, overflow: "hidden",
    animation: "fdFade .2s ease",
  });

  const menuRowBase = {
    display: "flex", alignItems: "center", gap: 12,
    width: "100%", padding: "11px 14px",
    background: "none", border: "none",
    color: "var(--fd-text-body)", fontSize: 13,
    cursor: "pointer", fontFamily: "inherit",
    textAlign: "left", transition: "background .15s",
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global backdrop — closes any open panel */}
      {(notifOpen || settingsOpen || helpOpen) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299 }}
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      <div
        className="fd-page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, gap: 12 }}
      >
        {/* ── Left: hamburger + title ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            className="fd-hamburger"
            onClick={onMenuOpen}
            aria-label="Open navigation"
          >
            <Menu size={18} strokeWidth={2} aria-hidden="true" />
          </button>

          <div>
            <h1 style={{
              fontFamily: "Syne", fontSize: 22, fontWeight: 800,
              color: "var(--fd-text-primary)", letterSpacing: "-0.4px", lineHeight: 1.1,
            }}>
              {title}
            </h1>
            <p style={{ color: "var(--fd-text-subtle)", fontSize: 12, marginTop: 3 }}>
              {todayLabel}&nbsp;·&nbsp;{role === "admin" ? "Admin" : "Viewer"} view
            </p>
          </div>
        </div>

        {/* ── Right: action buttons ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {showAddBtn && (
            <button className="fd-btn-primary" onClick={onAdd} aria-label="Add a new transaction">
              + Add Transaction
            </button>
          )}

          {/* ── Notifications ── */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtn(notifOpen)}
              onClick={() => togglePanel(notifOpen ? null : "notif")}
              aria-label={`Notifications${unread ? ` — ${unread} unread` : ""}`}
              aria-expanded={notifOpen}
              aria-haspopup="true"
            >
              <Bell size={16} strokeWidth={2} aria-hidden="true" />
              {unread > 0 && <UnreadDot />}
            </button>

            {notifOpen && (
              <div style={dropdownWrap(340)}>
                <DropdownHeader
                  title={
                    <span>
                      Notifications
                      {unread > 0 && (
                        <span style={{ marginLeft: 8, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                          {unread}
                        </span>
                      )}
                    </span>
                  }
                  action={unread > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: 11, color: "var(--fd-accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                />

                {notifs.length === 0 ? (
                  <div style={{ padding: "36px 16px", textAlign: "center" }}>
                    <CheckCircle size={28} style={{ color: "var(--fd-text-faint)", margin: "0 auto 10px" }} />
                    <div style={{ fontSize: 13, color: "var(--fd-text-subtle)" }}>All caught up!</div>
                  </div>
                ) : (
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {notifs.map(n => {
                      const { Icon: NIcon, color } = NOTIF_META[n.type] ?? NOTIF_META.info;
                      return (
                        <div
                          key={n.id}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid var(--fd-divider)",
                            display: "flex", gap: 12, alignItems: "flex-start",
                            background: n.read ? "transparent" : "var(--fd-accent-hover)",
                            transition: "background .2s",
                          }}
                        >
                          <NIcon size={16} strokeWidth={2} style={{ color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: "var(--fd-text-body)" }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", marginTop: 2 }}>
                              {n.sub}
                            </div>
                          </div>
                          {!n.read && (
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--fd-accent)", flexShrink: 0, marginTop: 5 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {notifs.length > 0 && (
                  <div style={{ padding: "10px 16px", borderTop: "1px solid var(--fd-border)", textAlign: "center" }}>
                    <button
                      onClick={clearAll}
                      style={{ fontSize: 12, color: "var(--fd-text-faint)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Settings ── */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtn(settingsOpen)}
              onClick={() => togglePanel(settingsOpen ? null : "settings")}
              aria-label="Settings"
              aria-expanded={settingsOpen}
              aria-haspopup="true"
            >
              <Settings size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            {settingsOpen && (
              <div style={dropdownWrap(260)}>
                <DropdownHeader title="Settings" />
                <div style={{ padding: "6px 0 8px" }}>
                  {SETTINGS_ITEMS.map(({ label, sub, Icon: SIcon, color }) => (
                    <button
                      key={label}
                      style={menuRowBase}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--fd-bg-tx-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      {/* Icon badge */}
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: `${color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <SIcon size={15} strokeWidth={2} style={{ color }} aria-hidden="true" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "var(--fd-text-body)", fontWeight: 500 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", marginTop: 1 }}>{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Help ── */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtn(helpOpen)}
              onClick={() => togglePanel(helpOpen ? null : "help")}
              aria-label="Help & support"
              aria-expanded={helpOpen}
              aria-haspopup="true"
            >
              <HelpCircle size={16} strokeWidth={2} aria-hidden="true" />
            </button>

            {helpOpen && (
              <div style={dropdownWrap(272)}>
                <DropdownHeader title="Help & Support" />
                <div style={{ padding: "10px 12px 12px" }}>
                  {HELP_ITEMS.map(({ label, sub, Icon: HIcon, color }) => (
                    <button
                      key={label}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        width: "100%", padding: "11px 12px", marginBottom: 6,
                        background: "var(--fd-bg-sub)",
                        border: "1px solid var(--fd-border)",
                        borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                        textAlign: "left", transition: "border-color .2s, background .2s",
                      }}
                      onClick={() => handleHelpItemClick(label)}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = color;
                        e.currentTarget.style.background = `${color}0d`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "var(--fd-border)";
                        e.currentTarget.style.background = "var(--fd-bg-sub)";
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                        background: `${color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <HIcon size={16} strokeWidth={2} style={{ color }} aria-hidden="true" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fd-text-body)" }}>{label}</div>
                        <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", marginTop: 2 }}>{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {supportType && (
        <SupportRequestModal
          type={supportType}
          onClose={closeSupportModal}
          onSubmit={handleSupportSubmit}
          initialName={userName}
          initialEmail={userEmail}
        />
      )}
    </>
  );
}
