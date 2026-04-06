import {
  LayoutDashboard, ArrowLeftRight, BarChart3,
  Sun, Moon, LogOut,
} from "../../constants/icons";

const NAV_ITEMS = [
  { id: "overview",     label: "Overview",      Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions",  Icon: ArrowLeftRight  },
  { id: "insights",     label: "Insights",      Icon: BarChart3       },
];

/**
 * Sidebar
 * Props: activeTab, onTabChange, role, onRoleChange,
 *        isDark, onThemeToggle, onLogout, isOpen, onClose,
 *        userName, userEmail
 */
export default function Sidebar({
  activeTab, onTabChange, role, onRoleChange,
  isDark, onThemeToggle,
  onLogout,
  isOpen, onClose,
  userName = "Aryan Chaudhary",
  userEmail = "dpsary11336@gmail.com",
}) {
  const handleNav = (id) => { onTabChange(id); onClose(); };
  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  // User initials avatar
  const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fd-sidebar-backdrop${isOpen ? " open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`fd-sidebar${isOpen ? " open" : ""}`} aria-label="Main navigation">

        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--fd-border-side)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, var(--fd-accent-solid), var(--fd-accent-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 18px rgba(16, 185, 129, 0.25)",
            }}>
              <span style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "Syne",
                lineHeight: 1,
                transform: "translateY(-0.5px)",
              }}>
                F
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, color: "var(--fd-accent)", letterSpacing: "-0.5px", lineHeight: 1 }}>
                FinFlow
              </div>
              <div style={{ fontSize: 10, color: "var(--fd-text-xfaint)", marginTop: 2, letterSpacing: "0.5px" }}>
                Financial Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* User profile */}
        <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid var(--fd-border-side)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fd-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </div>
              <div style={{ fontSize: 11, color: "var(--fd-text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }} aria-label="Dashboard sections">
          <div style={{ fontSize: 10, color: "var(--fd-text-xfaint)", textTransform: "uppercase", letterSpacing: "1.2px", padding: "4px 8px 8px" }}>
            Menu
          </div>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`fd-nav-btn${activeTab === id ? " active" : ""}`}
              onClick={() => handleNav(id)}
              aria-current={activeTab === id ? "page" : undefined}
              style={{ marginBottom: 2 }}
            >
              <Icon size={16} strokeWidth={activeTab === id ? 2.5 : 2} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: "0 12px 12px" }}>
          <button
            className="fd-theme-toggle"
            onClick={onThemeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={!isDark}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isDark
                ? <Moon size={14} strokeWidth={2} aria-hidden="true" />
                : <Sun  size={14} strokeWidth={2} aria-hidden="true" />
              }
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fd-text-subtle)" }}>
                {isDark ? "Dark mode" : "Light mode"}
              </span>
            </span>
            <div className={`fd-theme-toggle-track${!isDark ? " on" : ""}`}>
              <div className="fd-theme-toggle-thumb" />
            </div>
          </button>
          <button
            className="fd-sidebar-logout"
            onClick={handleLogout}
            aria-label="Log out"
            style={{ marginTop: 10 }}
          >
            <LogOut size={14} strokeWidth={2} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>

        {/* Role switcher */}
        <div style={{ padding: "12px 14px 20px", borderTop: "1px solid var(--fd-border-side)" }}>
          <div style={{ fontSize: 10, color: "var(--fd-text-xfaint)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>
            Active Role
          </div>
          <div
            role="group" aria-label="Switch active role"
            style={{ display: "flex", background: "var(--fd-bg-sub)", borderRadius: 9, padding: 3, gap: 3 }}
          >
            {["viewer", "admin"].map(r => (
              <button
                key={r} className="fd-role-pill"
                onClick={() => onRoleChange(r)}
                aria-pressed={role === r}
                aria-label={`Switch to ${r} role`}
                style={{
                  background: role === r ? (r === "admin" ? "#10B981" : "#2563EB") : "transparent",
                  color: role === r ? "#fff" : "var(--fd-text-subtle)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 5,
                        color: role === "admin" ? "var(--fd-accent)" : "#3B82F6" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor",
                           animation: role === "admin" ? "fdPulse 2s infinite" : "none" }} />
            {role === "admin" ? "Full access enabled" : "View-only mode"}
          </div>
        </div>
      </aside>
    </>
  );
}
