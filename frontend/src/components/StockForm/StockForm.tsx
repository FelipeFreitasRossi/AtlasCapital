// Este é o formulário (dentro de um modal) usado tanto para CADASTRAR
// uma ação nova quanto para EDITAR uma que já existe. Sabemos qual dos
// dois casos estamos vivendo pela prop "initialData": se ela vier
// preenchida, estamos editando; se vier vazia, estamos criando.
//
// A validação é feita com react-hook-form + zod (veja
// "stockFormSchema.ts"): o zod descreve as regras, o react-hook-form
// cuida do estado dos campos e mostra os erros automaticamente.

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./StockForm.module.css";
import { stockFormSchema } from "./stockFormSchema";
import type { StockFormValues } from "./stockFormSchema";
import { DatePicker } from "../DatePicker/DatePicker";
import type { StockInput, StockWithMetrics } from "../../types/stock";

interface StockFormProps {
  initialData: StockWithMetrics | null;
  onCancel: () => void;
  onSubmit: (data: StockInput) => Promise<void>;
}

function toFormValues(stock: StockWithMetrics | null): StockFormValues {
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
  const isEditing = initialData !== null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: toFormValues(initialData),
    mode: "onBlur",
  });

  async function onValid(values: StockFormValues) {
    await onSubmit({
      ticker: values.ticker.trim().toUpperCase(),
      name: values.name.trim(),
      quantity: Number(values.quantity),
      buyPrice: Number(values.buyPrice),
      currentPrice: Number(values.currentPrice),
      purchaseDate: values.purchaseDate,
    });
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

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="ticker">
                Ticker
              </label>
              <input
                id="ticker"
                className={`${styles.input} ${errors.ticker ? styles.inputError : ""}`}
                placeholder="Ex: PETR4"
                aria-invalid={Boolean(errors.ticker)}
                aria-describedby={errors.ticker ? "ticker-error" : undefined}
                {...register("ticker")}
              />
              {errors.ticker && (
                <span id="ticker-error" className={styles.errorMessage}>
                  {errors.ticker.message}
                </span>
              )}
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
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? "quantity-error" : undefined}
                {...register("quantity")}
              />
              {errors.quantity && (
                <span id="quantity-error" className={styles.errorMessage}>
                  {errors.quantity.message}
                </span>
              )}
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
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <span id="name-error" className={styles.errorMessage}>
                {errors.name.message}
              </span>
            )}
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
                aria-invalid={Boolean(errors.buyPrice)}
                aria-describedby={errors.buyPrice ? "buyPrice-error" : undefined}
                {...register("buyPrice")}
              />
              {errors.buyPrice && (
                <span id="buyPrice-error" className={styles.errorMessage}>
                  {errors.buyPrice.message}
                </span>
              )}
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
                aria-invalid={Boolean(errors.currentPrice)}
                aria-describedby={errors.currentPrice ? "currentPrice-error" : undefined}
                {...register("currentPrice")}
              />
              {errors.currentPrice && (
                <span id="currentPrice-error" className={styles.errorMessage}>
                  {errors.currentPrice.message}
                </span>
              )}
            </div>
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="purchaseDate">
              Data da compra
            </label>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="purchaseDate"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  hasError={Boolean(errors.purchaseDate)}
                />
              )}
            />
            {errors.purchaseDate && (
              <span className={styles.errorMessage}>{errors.purchaseDate.message}</span>
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
