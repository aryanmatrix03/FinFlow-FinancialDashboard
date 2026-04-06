import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Copy, ShieldOff, Eye, EyeOff } from "../../constants/icons";
import { fmtINR } from "../../utils/formatters";

const CARDS = [
  {
    id: 1,
    holder: "Aryan Chaudhary",
    number: "4532 8821 3490 6712",
    expiry: "03/29",
    type: "Visa",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a4480 100%)",
    accentColor: "#60A5FA",
    label: "Primary Account",
    balance: 125000,
  },
  {
    id: 2,
    holder: "Aryan Chaudhary",
    number: "5218 3340 9912 4477",
    expiry: "08/27",
    type: "Mastercard",
    gradient: "linear-gradient(135deg, #1c0533 0%, #4c1d95 50%, #6d28d9 100%)",
    accentColor: "#A78BFA",
    label: "Savings Account",
    balance: 67400,
  },
];

const ACTIONS = [
  { label: "Send",    Icon: ArrowUpRight   },
  { label: "Receive", Icon: ArrowDownLeft  },
  { label: "Copy",    Icon: Copy           },
  { label: "Block",   Icon: ShieldOff      },
];

const maskNumber = (num) =>
  num.split(" ").map((p, i, a) => (i < a.length - 1 ? "••••" : p)).join("  ");

function ChipSVG({ color }) {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="40" height="30" rx="5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.1" />
      <rect x="13" y="1" width="2" height="30" fill={color} opacity="0.35" />
      <rect x="27" y="1" width="2" height="30" fill={color} opacity="0.35" />
      <rect x="1" y="10" width="40" height="2"  fill={color} opacity="0.35" />
      <rect x="1" y="20" width="40" height="2"  fill={color} opacity="0.35" />
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg width="52" height="18" viewBox="0 0 52 18" fill="none" aria-hidden="true">
      <text x="0" y="16" fontFamily="serif" fontStyle="italic" fontWeight="900" fontSize="20" fill="rgba(255,255,255,0.92)" letterSpacing="-1">VISA</text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="42" height="28" viewBox="0 0 42 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill="#EB001B" fillOpacity="0.88" />
      <circle cx="28" cy="14" r="13" fill="#F79E1B" fillOpacity="0.88" />
      <path d="M21 5.4a13 13 0 0 1 0 17.2A13 13 0 0 1 21 5.4z" fill="#FF5F00" fillOpacity="0.88" />
    </svg>
  );
}

function ContactlessWaves({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {[5, 9, 13].map((r, i) => (
        <path key={i}
          d={`M ${11 - r * 0.6} ${11 + r * 0.3} a ${r} ${r} 0 0 1 ${r * 1.2} -${r * 0.6}`}
          stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"
          opacity={1 - i * 0.25}
        />
      ))}
    </svg>
  );
}

export default function CardStack({ isDark, balance = 0, totalIncome = 0 }) {
  // Calculate card balances: 65% primary, 35% savings
  const primaryBalance = Math.round(balance * 0.65);
  const savingsBalance = balance - primaryBalance;

  const DYNAMIC_CARDS = [
    { ...CARDS[0], balance: primaryBalance },
    { ...CARDS[1], balance: savingsBalance },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [balanceHidden, setBalanceHidden] = useState(true);
  const flip = () => setActiveIdx(i => (i + 1) % DYNAMIC_CARDS.length);

  const active = DYNAMIC_CARDS[activeIdx];
  const behind = DYNAMIC_CARDS[(activeIdx + 1) % DYNAMIC_CARDS.length];

  return (
    <div className="fd-card" style={{ padding: "24px 28px 28px", marginBottom: 20 }}>
      {/* Section header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, color: "var(--fd-text-primary)" }}>
          My Cards
        </div>
        <div style={{ fontSize: 12, color: "var(--fd-text-subtle)", marginTop: 3 }}>
          Click the card to switch between accounts
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>

        {/* ── Card stack ── */}
        <div
          style={{ position: "relative", width: 310, height: 200, perspective: "1000px", flexShrink: 0, cursor: "pointer", userSelect: "none" }}
          onClick={flip}
          role="button"
          tabIndex={0}
          aria-label={`Active card: ${active.label}. Click to switch.`}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }}
        >
          {/* Back card */}
          <div style={{
            position: "absolute",
            width: 288, height: 176,
            top: 20, left: 22,
            borderRadius: 18,
            background: behind.gradient,
            transform: "rotate(5deg) translateY(6px)",
            transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
            boxShadow: "0 16px 40px rgba(0,0,0,.45)",
            opacity: 0.72,
          }} />

          {/* Active card */}
          <div style={{
            position: "absolute",
            width: 296, height: 184,
            top: 4, left: 4,
            borderRadius: 20,
            background: active.gradient,
            boxShadow: "0 20px 50px rgba(0,0,0,.55)",
            transition: "background .5s ease",
            animation: "cardFloat 3.5s ease-in-out infinite",
            overflow: "hidden",
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.03)", top: -80, right: -60, pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.04)", bottom: -50, left: -40, pointerEvents: "none" }} />

            {/* Row 1: chip + logo */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <ChipSVG color={active.accentColor} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                {active.type === "Visa" ? <VisaLogo /> : <MastercardLogo />}
                <ContactlessWaves color="rgba(255,255,255,0.6)" />
              </div>
            </div>

            {/* Row 2: card number */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 15, letterSpacing: "2.5px",
                color: "rgba(255,255,255,.82)", fontWeight: 600,
              }}>
                {maskNumber(active.number)}
              </div>
            </div>

            {/* Row 3: holder + expiry */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
              <div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 3 }}>
                  Card Holder
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.88)", fontWeight: 600, letterSpacing: "0.3px" }}>
                  {active.holder}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 3 }}>
                  Expires
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.88)", fontWeight: 600 }}>
                  {active.expiry}
                </div>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {DYNAMIC_CARDS.map((_, i) => (
              <div key={i} style={{
                width: i === activeIdx ? 20 : 6,
                height: 6, borderRadius: 999,
                background: i === activeIdx ? "var(--fd-accent)" : "var(--fd-border-input)",
                transition: "all .35s ease",
              }} />
            ))}
          </div>
        </div>

        {/* ── Account info ── */}
        <div style={{ flex: 1, minWidth: 180 }}>
        {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--fd-accent-active)", border: "1px solid var(--fd-accent-border)",
            borderRadius: 20, padding: "3px 10px", marginBottom: 12,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--fd-accent)", animation: "fdPulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--fd-accent)" }}>{active.label}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 10 }}>
            <div style={{ fontSize: 12, color: "var(--fd-text-subtle)" }}>Available Balance</div>
            <button
              onClick={() => setBalanceHidden(!balanceHidden)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--fd-accent)", padding: "4px 8px", display: "flex", alignItems: "center", gap: 4
              }}
              aria-label={balanceHidden ? "Show balance" : "Hide balance"}
            >
              {balanceHidden ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>
          <div style={{
            fontFamily: "Manrope", fontSize: 40, fontWeight: 800,
            color: "var(--fd-text-primary)", letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 20,
          }}>
            {balanceHidden ? "••••••" : fmtINR(active.balance)}
          </div>

          {/* Quick-action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {ACTIONS.map(({ label, Icon }) => (
              <button
                key={label}
                aria-label={label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                  background: "var(--fd-bg-sub)", border: "1px solid var(--fd-border-input)",
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  transition: "all .2s", fontFamily: "inherit", minWidth: 58,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--fd-accent-active)";
                  e.currentTarget.style.borderColor = "var(--fd-accent-border)";
                  e.currentTarget.style.color = "var(--fd-accent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "var(--fd-bg-sub)";
                  e.currentTarget.style.borderColor = "var(--fd-border-input)";
                  e.currentTarget.style.color = "";
                }}
              >
                <Icon size={16} strokeWidth={2} style={{ color: "var(--fd-accent)" }} aria-hidden="true" />
                <span style={{ fontSize: 11, color: "var(--fd-text-subtle)", fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
}
