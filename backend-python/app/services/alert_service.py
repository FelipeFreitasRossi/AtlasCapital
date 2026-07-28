"""
Serviço de Alertas.

Gerencia o ciclo de vida dos alertas: criar, listar, deletar, verificar
condições e disparar notificações. Os alertas são salvos em um arquivo
JSON (`data/alerts.json`) para persistência entre reinicializações.

O agendador (APScheduler) roda em background a cada 30 segundos,
verificando todos os alertas ativos contra os dados atuais da carteira.
"""

import json
import os
from datetime import datetime
from typing import List, Optional
from app.models import AlertCreate, AlertOut, StockIn

ALERTS_FILE = "data/alerts.json"
_id_counter = 0


def _ensure_data_dir():
    os.makedirs(os.path.dirname(ALERTS_FILE), exist_ok=True)
    if not os.path.exists(ALERTS_FILE):
        with open(ALERTS_FILE, "w") as f:
            json.dump([], f)


def _read_alerts() -> List[dict]:
    _ensure_data_dir()
    with open(ALERTS_FILE, "r") as f:
        return json.load(f)


def _write_alerts(alerts: List[dict]):
    _ensure_data_dir()
    with open(ALERTS_FILE, "w") as f:
        json.dump(alerts, f, indent=2, default=str)


def _next_id() -> str:
    global _id_counter
    _id_counter += 1
    return str(_id_counter)


def create_alert(data: AlertCreate) -> AlertOut:
    alerts = _read_alerts()
    new_alert = {
        "id": _next_id(),
        "type": data.type,
        "ticker": data.ticker,
        "thresholdPercent": data.thresholdPercent,
        "thresholdPrice": data.thresholdPrice,
        "thresholdValue": data.thresholdValue,
        "createdAt": datetime.utcnow().isoformat(),
        "triggered": False,
        "triggeredAt": None,
        "message": None,
    }
    alerts.append(new_alert)
    _write_alerts(alerts)
    return AlertOut(**new_alert)


def list_alerts() -> List[AlertOut]:
    alerts = _read_alerts()
    return [AlertOut(**a) for a in alerts]


def delete_alert(alert_id: str) -> bool:
    alerts = _read_alerts()
    initial_len = len(alerts)
    alerts = [a for a in alerts if a["id"] != alert_id]
    if len(alerts) < initial_len:
        _write_alerts(alerts)
        return True
    return False


def check_alerts(stocks: List[StockIn], total_portfolio_value: float) -> List[AlertOut]:
    """
    Verifica todos os alertas ativos contra os dados atuais.
    Retorna os alertas que foram disparados (triggered).
    """
    alerts = _read_alerts()
    triggered = []
    updated = False

    # Mapeia ticker -> preço atual e variação simulada (mock)
    price_map = {s.ticker: s.currentPrice for s in stocks}
    # Mock: variação percentual simulada baseada no preço atual (apenas para demo)
    # Em produção, você compararia com preço histórico real.
    mock_change_map = {}
    for s in stocks:
        # Simula uma queda/alta aleatória determinística baseada no ticker
        import hashlib
        seed = int(hashlib.sha256(s.ticker.encode()).hexdigest(), 16) % 100
        mock_change_map[s.ticker] = (seed - 50) / 100  # -50% a +49%

    for alert_dict in alerts:
        if alert_dict.get("triggered", False):
            continue

        triggered_msg = None
        alert_type = alert_dict["type"]

        if alert_type == "price_drop_percent":
            ticker = alert_dict.get("ticker")
            threshold = alert_dict.get("thresholdPercent")
            if ticker and ticker in mock_change_map and threshold is not None:
                change = mock_change_map[ticker] * 100
                if change <= -threshold:
                    triggered_msg = f"{ticker} caiu {abs(change):.1f}% (limite: {threshold}%)"

        elif alert_type == "price_target_above":
            ticker = alert_dict.get("ticker")
            target = alert_dict.get("thresholdPrice")
            if ticker and ticker in price_map and target is not None:
                if price_map[ticker] >= target:
                    triggered_msg = f"{ticker} atingiu R$ {price_map[ticker]:.2f} (meta: R$ {target:.2f})"

        elif alert_type == "price_target_below":
            ticker = alert_dict.get("ticker")
            target = alert_dict.get("thresholdPrice")
            if ticker and ticker in price_map and target is not None:
                if price_map[ticker] <= target:
                    triggered_msg = f"{ticker} caiu para R$ {price_map[ticker]:.2f} (limite: R$ {target:.2f})"

        elif alert_type == "portfolio_value_above":
            target = alert_dict.get("thresholdValue")
            if target is not None and total_portfolio_value >= target:
                triggered_msg = f"Patrimônio total atingiu R$ {total_portfolio_value:,.2f} (meta: R$ {target:,.2f})"

        if triggered_msg:
            alert_dict["triggered"] = True
            alert_dict["triggeredAt"] = datetime.utcnow().isoformat()
            alert_dict["message"] = triggered_msg
            triggered.append(AlertOut(**alert_dict))
            updated = True

    if updated:
        _write_alerts(alerts)

    return triggered


# --- Agendador (APScheduler) ---
from apscheduler.schedulers.background import BackgroundScheduler

_scheduler = BackgroundScheduler()
_scheduler_running = False


def start_alert_scheduler(stock_provider, portfolio_value_provider):
    """
    Inicia o agendador em background. Deve ser chamado uma vez na inicialização do app.
    stock_provider: função que retorna lista de StockIn
    portfolio_value_provider: função que retorna o valor total do portfólio
    """
    global _scheduler_running

    if _scheduler_running:
        return

    def scheduled_check():
        try:
            stocks = stock_provider() if callable(stock_provider) else []
            total_value = portfolio_value_provider() if callable(portfolio_value_provider) else 0.0
            triggered = check_alerts(stocks, total_value)
            if triggered:
                # Aqui você pode integrar com WebSocket ou Toast no frontend
                # Por enquanto, apenas logamos
                print(f"[ALERT] {len(triggered)} alerta(s) disparado(s):")
                for alert in triggered:
                    print(f"  - {alert.message}")
        except Exception as e:
            print(f"[ALERT] Erro ao verificar alertas: {e}")

    _scheduler.add_job(scheduled_check, 'interval', seconds=30, id='alert_check')
    _scheduler.start()
    _scheduler_running = True


def stop_alert_scheduler():
    global _scheduler_running
    if _scheduler_running:
        _scheduler.shutdown()
        _scheduler_running = False