// Regras de validação do formulário de ação, usando Zod. O
// react-hook-form usa esse "schema" para saber o que é válido e gerar
// as mensagens de erro — assim a lógica de validação fica descrita em
// um lugar só, em vez de espalhada em vários "if" dentro do componente.
//
// Os campos numéricos ficam como STRING no schema (é assim que um
// <input> entrega o valor) e são validados com regras próprias; a
// conversão para número acontece só na hora de montar o StockInput
// que vai para o backend (veja StockForm.tsx).

import { z } from "zod";

function isPositiveNumber(value: string): boolean {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isFinite(parsed) && parsed > 0;
}

export const stockFormSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, "Informe o ticker.")
    .max(10, "O ticker deve ter no máximo 10 caracteres."),
  name: z.string().trim().min(1, "Informe o nome da empresa."),
  quantity: z.string().refine(isPositiveNumber, "Informe uma quantidade maior que zero."),
  buyPrice: z.string().refine(isPositiveNumber, "Informe um preço de compra válido."),
  currentPrice: z.string().refine(isPositiveNumber, "Informe um preço atual válido."),
  purchaseDate: z
    .string()
    .min(1, "Informe a data da compra.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data da compra."),
});

export type StockFormValues = z.infer<typeof stockFormSchema>;
