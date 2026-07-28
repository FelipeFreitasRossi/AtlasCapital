// frontend/src/components/StockForm/StockForm.tsx

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./StockForm.module.css";
import { DateField } from "../DateField/DateField";
import type { StockInput, StockWithMetrics } from "../../types/stock";

interface StockFormProps {
  initialData: StockWithMetrics | null;
  onCancel: () => void;
  onSubmit: (data: StockInput) => Promise<void>;
}

const stockSchema = z.object({
  ticker: z.string().trim().min(1, "Informe o ticker."),
  name: z.string().trim().min(1, "Informe o nome da empresa."),
  quantity: z.number({ error: "Informe uma quantidade válida." }).positive("A quantidade deve ser maior que zero."),
  buyPrice: z.number({ error: "Informe um preço de compra válido." }).positive("O preço de compra deve ser maior que zero."),
  currentPrice: z.number({ error: "Informe um preço atual válido." }).positive("O preço atual deve ser maior que zero."),
  purchaseDate: z.string().min(1, "Informe a data da compra."),
});

type StockFormValues = z.infer<typeof stockSchema>;

function toDefaultValues(stock: StockWithMetrics | null): Partial<StockFormValues> {
  if (!stock) return { ticker: "", name: "", purchaseDate: "" };
  return {
    ticker: stock.ticker,
    name: stock.name,
    quantity: stock.quantity,
    buyPrice: stock.buyPrice,
    currentPrice: stock.currentPrice,
    purchaseDate: stock.purchaseDate,
  };
}

export function StockForm({ initialData, onCancel, onSubmit }: StockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = initialData !== null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: toDefaultValues(initialData),
  });

  async function onValidSubmit(values: StockFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ticker: values.ticker.trim().toUpperCase(),
        name: values.name.trim(),
        quantity: values.quantity,
        buyPrice: values.buyPrice,
        currentPrice: values.currentPrice,
        purchaseDate: values.purchaseDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-form-title"
      >
        <div className={styles.header}>
          <div className={styles.title} id="stock-form-title">
            {isEditing ? "Editar ação" : "Nova ação"}
          </div>
          <button className={styles.closeButton} onClick={onCancel} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
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
                {...register("ticker")}
              />
              {errors.ticker && <span className={styles.errorMessage}>{errors.ticker.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="quantity">
                Quantidade
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                className={`${styles.input} ${errors.quantity ? styles.inputError : ""}`}
                placeholder="Ex: 100"
                aria-invalid={Boolean(errors.quantity)}
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && <span className={styles.errorMessage}>{errors.quantity.message}</span>}
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
              {...register("name")}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
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
                {...register("buyPrice", { valueAsNumber: true })}
              />
              {errors.buyPrice && <span className={styles.errorMessage}>{errors.buyPrice.message}</span>}
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
                {...register("currentPrice", { valueAsNumber: true })}
              />
              {errors.currentPrice && (
                <span className={styles.errorMessage}>{errors.currentPrice.message}</span>
              )}
            </div>
          </div>

          {/* Campo de data usando DateField - integrado com o calendário global */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="purchaseDate">
              Data da compra
            </label>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DateField
                  id="purchaseDate"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.purchaseDate?.message}
                  placeholder="Selecione a data da compra"
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