// frontend/src/pages/AlertsPage.tsx

import { useEffect, useState } from "react";
import { Bell, BellRing, RefreshCw, Trash2 } from "lucide-react";
import styles from "./AlertsPage.module.css";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";
import { checkAlerts, createAlert, deleteAlert, listAlerts } from "../services/aiService";
import { pushToast } from "../components/Toast/toastStore";
import type { AlertOut, AlertType } from "../types/aiFeatures";

const TYPE_LABELS: Record<AlertType, string> = {
  price_drop_percent: "Queda percentual (vs. preço de compra)",
  price_target_above: "Preço acima de",
  price_target_below: "Preço abaixo de",
  portfolio_value_above: "Patrimônio total acima de",
};

function describeAlert(alert: AlertOut): string {
  switch (alert.type) {
    case "price_drop_percent":
      return `${alert.ticker}: avisar se cair ${alert.thresholdPercent}% do preço de compra`;
    case "price_target_above":
      return `${alert.ticker}: avisar se passar de R$ ${alert.thresholdPrice?.toFixed(2)}`;
    case "price_target_below":
      return `${alert.ticker}: avisar se cair abaixo de R$ ${alert.thresholdPrice?.toFixed(2)}`;
    case "portfolio_value_above":
      return `Patrimônio: avisar se ultrapassar R$ ${alert.thresholdValue?.toFixed(2)}`;
    default:
      return "Alerta";
  }
}

export function AlertsPage() {
  const { stocks, totals } = useWalletContext();

  const [alerts, setAlerts] = useState<AlertOut[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const [type, setType] = useState<AlertType>("price_drop_percent");
  const [ticker, setTicker] = useState(stocks[0]?.ticker ?? "");
  const [thresholdPercent, setThresholdPercent] = useState(5);
  const [thresholdPrice, setThresholdPrice] = useState(0);
  const [thresholdValue, setThresholdValue] = useState(10000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function refreshAlerts() {
    setIsListLoading(true);
    try {
      const data = await listAlerts();
      setAlerts(data);
    } catch {
      pushToast("Não foi possível carregar os alertas. O backend Python está rodando?", "error");
    } finally {
      setIsListLoading(false);
    }
  }

  useEffect(() => {
    refreshAlerts();
  }, []);

  async function handleCreate() {
    setFormError(null);

    const needsTicker = type !== "portfolio_value_above";
    if (needsTicker && !ticker) {
      setFormError("Selecione um ativo.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAlert({
        type,
        ticker: needsTicker ? ticker : undefined,
        thresholdPercent: type === "price_drop_percent" ? thresholdPercent : undefined,
        thresholdPrice: type === "price_target_above" || type === "price_target_below" ? thresholdPrice : undefined,
        thresholdValue: type === "portfolio_value_above" ? thresholdValue : undefined,
      });
      pushToast("Alerta criado com sucesso!", "success");
      refreshAlerts();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível criar o alerta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch {
      pushToast("Não foi possível apagar o alerta.", "error");
    }
  }

  async function handleCheckNow() {
    setIsChecking(true);
    try {
      const response = await checkAlerts(stocks, totals.currentValue);
      setAlerts(response.allAlerts);
      if (response.newlyTriggered.length === 0) {
        pushToast("Nenhum alerta novo disparado no momento.", "info");
      } else {
        response.newlyTriggered.forEach((alert) => pushToast(alert.message ?? "Um alerta foi disparado!", "success"));
      }
    } catch {
      pushToast("Não foi possível verificar os alertas agora.", "error");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div>
      <PageHeader title="Alertas" subtitle="Seja avisado sobre movimentos importantes da sua carteira" />

      <Reveal delay={0}>
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <div className={styles.cardTitle}>Novo alerta</div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="alert-type">
                Tipo de alerta
              </label>
              <select id="alert-type" className={styles.select} value={type} onChange={(e) => setType(e.target.value as AlertType)}>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {type !== "portfolio_value_above" && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="alert-ticker">
                  Ativo
                </label>
                <select id="alert-ticker" className={styles.select} value={ticker} onChange={(e) => setTicker(e.target.value)}>
                  {stocks.length === 0 && <option value="">Nenhuma ação cadastrada</option>}
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.ticker}>
                      {stock.ticker} — {stock.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === "price_drop_percent" && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="alert-percent">
                  Queda de (%)
                </label>
                <input
                  id="alert-percent"
                  type="number"
                  min={1}
                  max={100}
                  className={styles.input}
                  value={thresholdPercent}
                  onChange={(e) => setThresholdPercent(Number(e.target.value))}
                />
              </div>
            )}

            {(type === "price_target_above" || type === "price_target_below") && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="alert-price">
                  Preço alvo (R$)
                </label>
                <input
                  id="alert-price"
                  type="number"
                  min={0.01}
                  step={0.01}
                  className={styles.input}
                  value={thresholdPrice}
                  onChange={(e) => setThresholdPrice(Number(e.target.value))}
                />
              </div>
            )}

            {type === "portfolio_value_above" && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="alert-value">
                  Patrimônio alvo (R$)
                </label>
                <input
                  id="alert-value"
                  type="number"
                  min={1}
                  step={100}
                  className={styles.input}
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                />
              </div>
            )}

            {formError && <div className={styles.errorMessage}>{formError}</div>}

            <button className={styles.submitButton} onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar alerta"}
            </button>
          </div>

          <div className={styles.listCard}>
            <div className={styles.listHeader}>
              <div className={styles.cardTitle} style={{ marginBottom: 0 }}>
                Meus alertas
              </div>
              <button className={styles.refreshButton} onClick={handleCheckNow} disabled={isChecking}>
                <RefreshCw size={13} />
                {isChecking ? "Verificando..." : "Verificar agora"}
              </button>
            </div>

            {isListLoading && <div className={styles.emptyState}>Carregando alertas...</div>}

            {!isListLoading && alerts.length === 0 && (
              <div className={styles.emptyState}>Nenhum alerta cadastrado ainda.</div>
            )}

            {!isListLoading && alerts.length > 0 && (
              <div className={styles.alertList}>
                {alerts.map((alert) => (
                  <div key={alert.id} className={`${styles.alertItem} ${alert.triggered ? styles.alertItemTriggered : ""}`}>
                    {alert.triggered ? (
                      <BellRing size={18} className={`${styles.alertIcon} ${styles.alertIconTriggered}`} />
                    ) : (
                      <Bell size={18} className={styles.alertIcon} />
                    )}
                    <div className={styles.alertBody}>
                      <div className={styles.alertTitle}>{describeAlert(alert)}</div>
                      <div className={styles.alertMeta}>
                        {alert.triggered ? "Disparado" : "Aguardando"} · criado em{" "}
                        {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      {alert.triggered && alert.message && <div className={styles.alertMessage}>{alert.message}</div>}
                    </div>
                    <button className={styles.deleteButton} onClick={() => handleDelete(alert.id)} aria-label="Apagar alerta">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}