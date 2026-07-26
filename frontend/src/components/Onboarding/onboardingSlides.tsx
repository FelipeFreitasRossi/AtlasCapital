// Conteúdo dos 3 slides da tela de boas-vindas. Fica separado do
// componente principal só para deixar o "OnboardingScreen.tsx" mais
// enxuto e focado na parte de navegação/animação.

import { BarChart3, FileSpreadsheet, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface OnboardingSlide {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    icon: BarChart3,
    title: "Acompanhe sua carteira em gráficos",
    description:
      "Veja de forma visual o desempenho de cada ação, com cards animados e gráficos que mostram ganhos e perdas em tempo real.",
  },
  {
    icon: Wallet,
    title: "Gerencie tudo em um só lugar",
    description:
      "Cadastre, edite e organize suas ações com filtros por ticker e data. Tudo pensado para ser rápido, no computador ou no celular.",
  },
  {
    icon: FileSpreadsheet,
    title: "Exporte relatórios em segundos",
    description:
      "Gere relatórios em PDF, Excel ou CSV para acompanhar sua evolução ou compartilhar com quem você confia.",
  },
];
