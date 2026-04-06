import { LS_KEY, LS_SUPPORT_KEY } from "../constants";

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // Storage unavailable (private browsing, quota exceeded, etc.)
  }
  return null;
}

function saveJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore — quota exceeded or storage blocked
  }
}

/**
 * Load persisted transactions from localStorage.
 * Returns `null` when nothing is stored or on parse errors,
 * so callers can safely fall back to INITIAL_TRANSACTIONS.
 */
export function loadFromStorage() {
  return loadJson(LS_KEY);
}

/**
 * Persist the transactions array to localStorage.
 * Silently swallows errors so write failures never crash the UI.
 */
export function saveToStorage(data) {
  saveJson(LS_KEY, data);
}

/**
 * Load stored help/support submissions.
 * Falls back to an empty array when nothing has been saved yet.
 */
export function loadSupportSubmissions() {
  return loadJson(LS_SUPPORT_KEY) ?? [];
}

/**
 * Persist the help/support submission list.
 */
export function saveSupportSubmissions(data) {
  saveJson(LS_SUPPORT_KEY, data);
}
