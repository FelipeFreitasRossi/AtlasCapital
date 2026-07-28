// frontend/src/pages/Documentacao/DocumentacaoPage.tsx

import { PageHeader } from "../../components/PageHeader/PageHeader";
import { Reveal } from "../../components/Reveal/Reveal";
import {
  BookOpen,
  List,
  PlusCircle,
  LayoutDashboard,
  Wallet,
  FileText,
  TrendingUp,
  Wand2,
  Bell,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import styles from "./DocumentacaoPage.module.css";

export function DocumentacaoPage() {
  return (
    <div>
      <PageHeader
        title="Documentação"
        subtitle="Guia completo para usar o AtlasCapital"
      />

      <Reveal delay={0}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <List size={20} className={styles.icon} />
            Índice
          </h2>
          <ul className={styles.indexList}>
            <li><a href="#primeiros-passos"><ChevronRight size={14} /> 1. Primeiros Passos</a></li>
            <li><a href="#cadastrar-acao"><ChevronRight size={14} /> 2. Cadastrar uma Ação</a></li>
            <li><a href="#dashboard"><ChevronRight size={14} /> 3. Dashboard</a></li>
            <li><a href="#carteira"><ChevronRight size={14} /> 4. Minha Carteira</a></li>
            <li><a href="#relatorios"><ChevronRight size={14} /> 5. Relatórios</a></li>
            <li><a href="#previsao"><ChevronRight size={14} /> 6. Previsão</a></li>
            <li><a href="#simulacao"><ChevronRight size={14} /> 7. Simulação</a></li>
            <li><a href="#alertas"><ChevronRight size={14} /> 8. Alertas</a></li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className={styles.card} id="primeiros-passos">
          <h2 className={styles.title}>
            <BookOpen size={20} className={styles.icon} />
            1. Primeiros Passos
          </h2>
          <p className={styles.text}>
            Para começar a usar o AtlasCapital, você precisa criar uma conta ou fazer login
            com suas credenciais. Após o login, você será direcionado ao Dashboard, onde
            poderá visualizar um resumo da sua carteira.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div className={styles.card} id="cadastrar-acao">
          <h2 className={styles.title}>
            <PlusCircle size={20} className={styles.icon} />
            2. Cadastrar uma Ação
          </h2>
          <p className={styles.text}>
            Para adicionar uma nova ação à sua carteira, clique no botão <strong>"Nova Ação"</strong>
            localizado na barra lateral. Preencha os campos obrigatórios:
          </p>
          <ul className={styles.list}>
            <li><strong>Ticker:</strong> O código da ação (ex: PETR4, VALE3).</li>
            <li><strong>Nome da empresa:</strong> Nome completo da empresa.</li>
            <li><strong>Quantidade:</strong> Número de ações adquiridas.</li>
            <li><strong>Preço de compra:</strong> Valor pago por ação no momento da compra.</li>
            <li><strong>Preço atual:</strong> Valor atual da ação no mercado.</li>
            <li><strong>Data da compra:</strong> Data em que a ação foi adquirida.</li>
          </ul>
          <p className={styles.text}>
            Após preencher todos os campos, clique em <strong>"Cadastrar ação"</strong>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className={styles.card} id="dashboard">
          <h2 className={styles.title}>
            <LayoutDashboard size={20} className={styles.icon} />
            3. Dashboard
          </h2>
          <p className={styles.text}>
            O Dashboard é a página inicial do AtlasCapital. Ela exibe:
          </p>
          <ul className={styles.list}>
            <li><strong>Cards de resumo:</strong> Valor investido, patrimônio atual e resultado consolidado.</li>
            <li><strong>Gráfico de desempenho:</strong> Barras coloridas mostrando o lucro ou prejuízo de cada ação.</li>
            <li><strong>Dica de diversificação:</strong> Análise da distribuição da sua carteira por setor.</li>
            <li><strong>Exportação rápida:</strong> Botões para baixar relatórios em PDF, Excel ou CSV.</li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className={styles.card} id="carteira">
          <h2 className={styles.title}>
            <Wallet size={20} className={styles.icon} />
            4. Minha Carteira
          </h2>
          <p className={styles.text}>
            A página <strong>"Minha Carteira"</strong> exibe uma tabela completa com todas as suas ações.
            Você pode:
          </p>
          <ul className={styles.list}>
            <li><strong>Filtrar</strong> por ticker, nome da empresa ou período de compra.</li>
            <li><strong>Editar</strong> uma ação clicando no ícone de lápis.</li>
            <li><strong>Excluir</strong> uma ação clicando no ícone de lixeira.</li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.24}>
        <div className={styles.card} id="relatorios">
          <h2 className={styles.title}>
            <FileText size={20} className={styles.icon} />
            5. Relatórios
          </h2>
          <p className={styles.text}>
            Na página <strong>"Relatórios"</strong>, você pode baixar um resumo completo da sua carteira
            nos formatos:
          </p>
          <ul className={styles.list}>
            <li><strong>PDF:</strong> Relatório formatado com gráficos e tabelas.</li>
            <li><strong>Excel:</strong> Planilha com dados detalhados para análises avançadas.</li>
            <li><strong>CSV:</strong> Arquivo compatível com a maioria das ferramentas de planilha.</li>
          </ul>
          <p className={styles.text}>
            Antes de exportar, você pode visualizar uma prévia dos dados que serão incluídos.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.28}>
        <div className={styles.card} id="previsao">
          <h2 className={styles.title}>
            <TrendingUp size={20} className={styles.icon} />
            6. Previsão
          </h2>
          <p className={styles.text}>
            A ferramenta de <strong>Previsão</strong> utiliza um modelo estatístico (regressão linear)
            para projetar o preço futuro de uma ação com base em dados históricos sintéticos.
          </p>
          <p className={styles.text}>
            Para usar, selecione uma ação da sua carteira, escolha o horizonte de dias (7, 30 ou 90)
            e clique em <strong>"Prever"</strong>. O gráfico exibirá a projeção com um intervalo de confiança.
          </p>
          <div className={styles.note}>
            <AlertTriangle size={16} />
            Esta ferramenta é ilustrativa e não constitui recomendação de investimento.
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.32}>
        <div className={styles.card} id="simulacao">
          <h2 className={styles.title}>
            <Wand2 size={20} className={styles.icon} />
            7. Simulação
          </h2>
          <p className={styles.text}>
            A ferramenta de <strong>Simulação</strong> permite que você visualize o impacto de uma
            compra ou venda hipotética na sua carteira.
          </p>
          <p className={styles.text}>
            Configure a operação (comprar ou vender), selecione o ativo, defina a quantidade e o preço,
            e clique em <strong>"Simular"</strong>. O sistema recalculará o patrimônio, o resultado e a
            diversificação da sua carteira.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.36}>
        <div className={styles.card} id="alertas">
          <h2 className={styles.title}>
            <Bell size={20} className={styles.icon} />
            8. Alertas
          </h2>
          <p className={styles.text}>
            Na página <strong>"Alertas"</strong>, você pode criar notificações personalizadas para
            monitorar sua carteira.
          </p>
          <p className={styles.text}>
            Tipos de alerta disponíveis:
          </p>
          <ul className={styles.list}>
            <li><strong>Queda percentual:</strong> Avisa quando uma ação cai X% em relação ao preço de compra.</li>
            <li><strong>Preço acima de:</strong> Avisa quando uma ação ultrapassa um valor definido.</li>
            <li><strong>Preço abaixo de:</strong> Avisa quando uma ação cai abaixo de um valor definido.</li>
            <li><strong>Patrimônio total:</strong> Avisa quando o valor total da carteira ultrapassa um limite.</li>
          </ul>
          <p className={styles.text}>
            Os alertas são verificados automaticamente a cada 30 segundos pelo backend.
          </p>
        </div>
      </Reveal>
    </div>
  );
}