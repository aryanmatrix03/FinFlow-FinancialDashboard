/**
 * useTransactions — centralises all transaction state, persistence, and CRUD.
 *
 * Extracted from FinanceDashboard so the orchestrator component only wires
 * UI state, not data logic. This also makes the CRUD layer independently
 * testable without mounting the full dashboard tree.
 *
 * Returns:
 *   transactions   — current array (persisted to localStorage)
 *   addTx          — (formValues) → void
 *   updateTx       — (id, formValues) → void
 *   deleteTx       — (id) → void
 */

import { useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { INITIAL_TRANSACTIONS } from "../data/mockData";

export function useTransactions() {
  const [transactions, setTransactions] = useState(
    () => loadFromStorage() ?? INITIAL_TRANSACTIONS,
  );

  // Sync to localStorage whenever the array changes
  useEffect(() => {
    saveToStorage(transactions);
  }, [transactions]);

  /** Add a new transaction from validated form values */
  const addTx = (form) => {
    const newTx = {
      id:       Date.now(),
      desc:     form.desc.trim(),
      absAmt:   Number(form.amount),
      category: form.category,
      type:     form.type,
      date:     form.date,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  /** Update an existing transaction by id */
  const updateTx = (id, form) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, desc: form.desc.trim(), absAmt: Number(form.amount), category: form.category, type: form.type, date: form.date }
          : t,
      ),
    );
  };

  /** Remove a transaction by id */
  const deleteTx = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return { transactions, addTx, updateTx, deleteTx };
}
