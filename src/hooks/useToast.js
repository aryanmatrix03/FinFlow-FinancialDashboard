import { useState, useCallback } from "react";
import { TOAST_DURATION_MS } from "../constants";

/**
 * useToast — lightweight toast notification manager.
 *
 * @returns {{ toasts: Toast[], push: (message: string, kind?: ToastKind) => void }}
 *
 * @typedef {{ id: number, message: string, kind: ToastKind }} Toast
 * @typedef {"success" | "info" | "error"} ToastKind
 *
 * Usage:
 *   const { toasts, push } = useToast();
 *   push("Transaction added.", "success");
 *   push("Something went wrong.", "error");
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, kind = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, kind }]);
    setTimeout(
      () => setToasts(prev => prev.filter(t => t.id !== id)),
      TOAST_DURATION_MS,
    );
  }, []);

  return { toasts, push };
}
