// Fica "ouvindo" o toastStore e desenha cada toast atual na tela.
// Renderizado uma única vez, dentro do AppShell, então funciona em
// qualquer página sem precisar ser adicionado de novo em cada uma.

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import styles from "./ToastStack.module.css";
import { dismissToast, subscribeToasts } from "./toastStore";
import type { ToastItem } from "./toastStore";

const TONE_CLASS: Record<ToastItem["tone"], string> = {
  success: styles.toastSuccess,
  error: styles.toastError,
  info: styles.toastInfo,
};

const TONE_ICON: Record<ToastItem["tone"], typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE_ICON_CLASS: Record<ToastItem["tone"], string> = {
  success: styles.iconSuccess,
  error: styles.iconError,
  info: styles.iconInfo,
};

export function ToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.stack}>
      {toasts.map((toast) => {
        const Icon = TONE_ICON[toast.tone];
        return (
          <div key={toast.id} className={`${styles.toast} ${TONE_CLASS[toast.tone]}`}>
            <Icon size={17} className={TONE_ICON_CLASS[toast.tone]} />
            <span>{toast.message}</span>
            <button className={styles.closeButton} onClick={() => dismissToast(toast.id)} aria-label="Fechar aviso">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
