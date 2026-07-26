// Um "store" bem simples para os toasts (avisos rápidos tipo "Ação
// salva com sucesso!"). Não usamos Context API nem biblioteca externa
// aqui de propósito: como qualquer parte do app pode precisar
// disparar um toast (o formulário, o botão de apagar, etc.), é mais
// simples ter uma "caixinha global" com a lista de toasts atuais, e
// qualquer componente pode chamar "pushToast(...)" para adicionar um
// novo. O componente <ToastStack /> (renderizado uma única vez, no
// AppShell) fica "escutando" essa caixinha e desenha os toasts na tela.

export interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}

export function pushToast(message: string, tone: ToastItem["tone"] = "success") {
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  toasts = [...toasts, { id, message, tone }];
  emit();

  // Cada toast some sozinho depois de alguns segundos
  setTimeout(() => dismissToast(id), 3200);
}

export function dismissToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}
