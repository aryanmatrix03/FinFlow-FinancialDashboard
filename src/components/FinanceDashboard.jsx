import { useState, useMemo, useCallback } from "react";

import "../styles/dashboard.css";

import Sidebar         from "./layout/Sidebar";
import TopBar          from "./layout/TopBar";
import OverviewTab     from "./tabs/OverviewTab";
import TransactionsTab from "./tabs/TransactionsTab";
import InsightsTab     from "./tabs/InsightsTab";
import TxModal         from "./modals/TxModal";
import ConfirmDialog   from "./modals/ConfirmDialog";
import ToastContainer  from "./ui/ToastContainer";

import { useTransactions } from "../hooks/useTransactions";
import { useToast }        from "../hooks/useToast";
import { useTheme }        from "../hooks/useTheme";
import { EMPTY_FORM, TODAY_ISO } from "../constants";
import { getDateSearchText } from "../utils/formatters";

const PAGE_TITLES = {
  overview:     "Financial Overview",
  transactions: "Transactions",
  insights:     "Insights & Analysis",
};

const CURRENT_USER = {
  name: "Aryan Chaudhary",
  email: "dpsary11336@gmail.com",
};

export default function FinanceDashboard() {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const { isDark, toggleTheme } = useTheme();

  // ── Data layer ────────────────────────────────────────────────────────────
  const { transactions, addTx, updateTx, deleteTx } = useTransactions();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab,   setActiveTab]   = useState("overview");
  const [role,        setRole]        = useState("viewer");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState("all");
  const [filterCat,   setFilterCat]   = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate,   setFilterToDate]   = useState("");
  const [sortKey,     setSortKey]     = useState("date-desc");

  const [showModal,   setShowModal]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [confirmTx,   setConfirmTx]   = useState(null);
  const [balanceHidden, setBalanceHidden] = useState(true);

  const { toasts, push: pushToast } = useToast();

  // ── Derived values ────────────────────────────────────────────────────────
  const totalIncome = useMemo(
    () => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.absAmt, 0),
    [transactions],
  );
  const totalExpenses = useMemo(
    () => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.absAmt, 0),
    [transactions],
  );

  const balance     = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0";

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] ?? 0) + t.absAmt;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const { freqCatName, freqCatCount } = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] ?? 0) + 1;
    });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return { freqCatName: top?.[0] ?? "—", freqCatCount: top?.[1] ?? 0 };
  }, [transactions]);

  const filteredTx = useMemo(() => {
    const [sKey, sDir] = sortKey.split("-");
    const rangeStart = filterFromDate && filterToDate
      ? (filterFromDate <= filterToDate ? filterFromDate : filterToDate)
      : filterFromDate;
    const rangeEnd = filterFromDate && filterToDate
      ? (filterFromDate <= filterToDate ? filterToDate : filterFromDate)
      : filterToDate;

    return transactions
      .filter(t => {
        const q = search.trim().toLowerCase();
        const matchS =
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          getDateSearchText(t.date).includes(q);
        const matchT = filterType === "all" || t.type === filterType;
        const matchC = filterCat  === "all" || t.category === filterCat;
        const matchFrom = !rangeStart || t.date >= rangeStart;
        const matchTo = !rangeEnd || t.date <= rangeEnd;
        return matchS && matchT && matchC && matchFrom && matchTo;
      })
      .sort((a, b) => {
        const v = sKey === "date" ? new Date(a.date) - new Date(b.date) : a.absAmt - b.absAmt;
        return sDir === "asc" ? v : -v;
      });
  }, [transactions, search, filterType, filterCat, filterFromDate, filterToDate, sortKey]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const openAdd = useCallback(() => {
    setEditTarget(null); setForm({ ...EMPTY_FORM }); setShowModal(true);
  }, []);

  const openEdit = useCallback((tx) => {
    setEditTarget(tx.id);
    setForm({ desc: tx.desc, amount: String(tx.absAmt), category: tx.category, type: tx.type, date: tx.date });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false); setEditTarget(null); setForm({ ...EMPTY_FORM });
  }, []);

  const handleSubmit = useCallback((f) => {
    if (editTarget !== null) { updateTx(editTarget, f); pushToast("Transaction updated.", "success"); }
    else                     { addTx(f);                pushToast("Transaction added.",   "success"); }
    setShowModal(false); setEditTarget(null); setForm({ ...EMPTY_FORM });
  }, [editTarget, addTx, updateTx, pushToast]);

  const requestDelete = useCallback((tx) => setConfirmTx(tx), []);
  const confirmDelete = useCallback(() => {
    if (!confirmTx) return;
    deleteTx(confirmTx.id);
    pushToast(`"${confirmTx.desc}" deleted.`, "info");
    setConfirmTx(null);
  }, [confirmTx, deleteTx, pushToast]);
  const cancelDelete  = useCallback(() => setConfirmTx(null), []);

  const handleLogout = useCallback(() => {
    setActiveTab("overview");
    setRole("viewer");
    setSidebarOpen(false);
    setSearch("");
    setFilterType("all");
    setFilterCat("all");
    setFilterFromDate("");
    setFilterToDate("");
    setSortKey("date-desc");
    setShowModal(false);
    setEditTarget(null);
    setForm({ ...EMPTY_FORM });
    setConfirmTx(null);
    setBalanceHidden(true);
    pushToast("Logged out. Viewer mode restored.", "info");
  }, [pushToast]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fd-layout">

      <Sidebar
        activeTab={activeTab}   onTabChange={setActiveTab}
        role={role}             onRoleChange={setRole}
        isDark={isDark}         onThemeToggle={toggleTheme}
        onLogout={handleLogout}
        isOpen={sidebarOpen}    onClose={() => setSidebarOpen(false)}
        userName={CURRENT_USER.name}
        userEmail={CURRENT_USER.email}
      />

      <main className="fd-main" style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>

        <TopBar
          title={PAGE_TITLES[activeTab]}
          role={role}
          showAddBtn={role === "admin" && activeTab === "transactions"}
          onAdd={openAdd}
          onMenuOpen={() => setSidebarOpen(true)}
          onToast={pushToast}
          userName={CURRENT_USER.name}
          userEmail={CURRENT_USER.email}
        />

        {/* Tab panels */}
        {activeTab === "overview" && (
          <OverviewTab
            totalIncome={totalIncome} totalExpenses={totalExpenses}
            balance={balance}         savingsRate={savingsRate}
            categoryData={categoryData} transactions={transactions}
            onViewAll={() => setActiveTab("transactions")}
            isDark={isDark}
            balanceHidden={balanceHidden} onToggleBalance={() => setBalanceHidden(!balanceHidden)}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsTab
            filteredTx={filteredTx} transactions={transactions} role={role}
            search={search}         filterType={filterType}
            filterCat={filterCat}   sortKey={sortKey}
            filterFromDate={filterFromDate} filterToDate={filterToDate}
            maxDate={TODAY_ISO}
            onSearch={setSearch}    onFilterType={setFilterType}
            onFilterCat={setFilterCat} onSortKey={setSortKey}
            onFilterFromDate={setFilterFromDate} onFilterToDate={setFilterToDate}
            onEdit={openEdit}       onDelete={requestDelete} onAdd={openAdd}
          />
        )}
        {activeTab === "insights" && (
          <InsightsTab
            balance={balance}         totalIncome={totalIncome}
            totalExpenses={totalExpenses} savingsRate={savingsRate}
            categoryData={categoryData}
            freqCatName={freqCatName} freqCatCount={freqCatCount}
            onGoToTx={() => setActiveTab("transactions")}
          />
        )}
      </main>

      {showModal && (
        <TxModal editTarget={editTarget} form={form} setForm={setForm}
                 onSubmit={handleSubmit} onClose={closeModal} />
      )}
      {confirmTx && (
        <ConfirmDialog tx={confirmTx} onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
