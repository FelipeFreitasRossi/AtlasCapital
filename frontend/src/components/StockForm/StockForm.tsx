// Este é o formulário (dentro de um modal) usado tanto para CADASTRAR
// uma ação nova quanto para EDITAR uma que já existe. Sabemos qual dos
// dois casos estamos vivendo pela prop "initialData": se ela vier
// preenchida, estamos editando; se vier vazia, estamos criando.

import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./StockForm.module.css";
import type { StockInput, StockWithMetrics } from "../../types/stock";

interface StockFormProps {
  initialData: StockWithMetrics | null;
  onCancel: () => void;
  onSubmit: (data: StockInput) => Promise<void>;
}

// Formato dos campos enquanto o usuário está digitando (tudo texto,
// porque é assim que um <input> funciona). Só convertemos para
// número/data na hora de enviar.
interface FormState {
  ticker: string;
  name: string;
  quantity: string;
  buyPrice: string;
  currentPrice: string;
  purchaseDate: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function toFormState(stock: StockWithMetrics | null): FormState {
  if (!stock) {
    return { ticker: "", name: "", quantity: "", buyPrice: "", currentPrice: "", purchaseDate: "" };
  }
  return {
    ticker: stock.ticker,
    name: stock.name,
    quantity: String(stock.quantity),
    buyPrice: String(stock.buyPrice),
    currentPrice: String(stock.currentPrice),
    purchaseDate: stock.purchaseDate,
  };
}

export function StockForm({ initialData, onCancel, onSubmit }: StockFormProps) {
  const [form, setForm] = useState<FormState>(toFormState(initialData));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = initialData !== null;

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Confere se cada campo foi preenchido corretamente antes de enviar.
  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.ticker.trim()) nextErrors.ticker = "Informe o ticker.";
    if (!form.name.trim()) nextErrors.name = "Informe o nome da empresa.";

    const quantity = Number(form.quantity);
    if (!form.quantity || quantity <= 0) nextErrors.quantity = "Informe uma quantidade maior que zero.";

    const buyPrice = Number(form.buyPrice);
    if (!form.buyPrice || buyPrice <= 0) nextErrors.buyPrice = "Informe um preço de compra válido.";

    const currentPrice = Number(form.currentPrice);
    if (!form.currentPrice || currentPrice <= 0)
      nextErrors.currentPrice = "Informe um preço atual válido.";

    if (!form.purchaseDate) nextErrors.purchaseDate = "Informe a data da compra.";

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ticker: form.ticker.trim().toUpperCase(),
        name: form.name.trim(),
        quantity: Number(form.quantity),
        buyPrice: Number(form.buyPrice),
        currentPrice: Number(form.currentPrice),
        purchaseDate: form.purchaseDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      {/* stopPropagation evita que clicar DENTRO do modal feche ele */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{isEditing ? "Editar ação" : "Nova ação"}</div>
          <button className={styles.closeButton} onClick={onCancel} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="ticker">
                Ticker
              </label>
              <input
                id="ticker"
                className={`${styles.input} ${errors.ticker ? styles.inputError : ""}`}
                placeholder="Ex: PETR4"
                value={form.ticker}
                onChange={(e) => handleChange("ticker", e.target.value)}
              />
              {errors.ticker && <span className={styles.errorMessage}>{errors.ticker}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="quantity">
                Quantidade
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                className={`${styles.input} ${errors.quantity ? styles.inputError : ""}`}
                placeholder="Ex: 100"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
              {errors.quantity && <span className={styles.errorMessage}>{errors.quantity}</span>}
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="name">
              Nome da empresa
            </label>
            <input
              id="name"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              placeholder="Ex: Petrobras"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="buyPrice">
                Preço de compra (R$)
              </label>
              <input
                id="buyPrice"
                type="number"
                min="0"
                step="0.01"
                className={`${styles.input} ${errors.buyPrice ? styles.inputError : ""}`}
                placeholder="Ex: 28.50"
                value={form.buyPrice}
                onChange={(e) => handleChange("buyPrice", e.target.value)}
              />
              {errors.buyPrice && <span className={styles.errorMessage}>{errors.buyPrice}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="currentPrice">
                Preço atual (R$)
              </label>
              <input
                id="currentPrice"
                type="number"
                min="0"
                step="0.01"
                className={`${styles.input} ${errors.currentPrice ? styles.inputError : ""}`}
                placeholder="Ex: 35.20"
                value={form.currentPrice}
                onChange={(e) => handleChange("currentPrice", e.target.value)}
              />
              {errors.currentPrice && (
                <span className={styles.errorMessage}>{errors.currentPrice}</span>
              )}
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="purchaseDate">
              Data da compra
            </label>
            <input
              id="purchaseDate"
              type="date"
              className={`${styles.input} ${errors.purchaseDate ? styles.inputError : ""}`}
              value={form.purchaseDate}
              onChange={(e) => handleChange("purchaseDate", e.target.value)}
            />
            {errors.purchaseDate && (
              <span className={styles.errorMessage}>{errors.purchaseDate}</span>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar ação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
