"""
Endpoints de Alertas e Notificações.
"""

from fastapi import APIRouter, HTTPException

from app.alerts_store import create_alert, delete_alert, read_alerts, write_alerts
from app.models import AlertCheckRequest, AlertCheckResponse, AlertCreate, AlertOut, now_iso

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

_latest_snapshot: AlertCheckRequest | None = None


@router.get("", response_model=list[AlertOut])
def list_alerts() -> list[AlertOut]:
    return read_alerts()


@router.post("", response_model=AlertOut, status_code=201)
def add_alert(payload: AlertCreate) -> AlertOut:
    if payload.type in ("price_drop_percent", "price_target_above", "price_target_below") and not payload.ticker:
        raise HTTPException(status_code=400, detail="Este tipo de alerta exige um ticker.")
    if payload.type == "price_drop_percent" and not payload.thresholdPercent:
        raise HTTPException(status_code=400, detail="Informe o percentual de queda.")
    if payload.type in ("price_target_above", "price_target_below") and not payload.thresholdPrice:
        raise HTTPException(status_code=400, detail="Informe o preço alvo.")
    if payload.type == "portfolio_value_above" and not payload.thresholdValue:
        raise HTTPException(status_code=400, detail="Informe o valor de patrimônio alvo.")
    return create_alert(payload)


@router.delete("/{alert_id}", status_code=204)
def remove_alert(alert_id: str) -> None:
    if not delete_alert(alert_id):
        raise HTTPException(status_code=404, detail="Alerta não encontrado.")


def evaluate_alerts(snapshot: AlertCheckRequest) -> list[AlertOut]:
    alerts = read_alerts()
    newly_triggered: list[AlertOut] = []
    stocks_by_ticker = {stock.ticker.upper(): stock for stock in snapshot.stocks}

    for alert in alerts:
        if alert.triggered:
            continue
        is_triggered = False
        message = None

        if alert.type == "price_drop_percent" and alert.ticker:
            stock = stocks_by_ticker.get(alert.ticker.upper())
            if stock and stock.buyPrice > 0:
                percent_change = (stock.currentPrice - stock.buyPrice) / stock.buyPrice * 100
                if percent_change <= -(alert.thresholdPercent or 0):
                    is_triggered = True
                    message = f"{alert.ticker} caiu {abs(percent_change):.1f}% em relação ao preço de compra."

        elif alert.type == "price_target_above" and alert.ticker:
            stock = stocks_by_ticker.get(alert.ticker.upper())
            if stock and stock.currentPrice >= (alert.thresholdPrice or float("inf")):
                is_triggered = True
                message = f"{alert.ticker} atingiu R$ {stock.currentPrice:.2f}, acima do alvo de R$ {alert.thresholdPrice:.2f}."

        elif alert.type == "price_target_below" and alert.ticker:
            stock = stocks_by_ticker.get(alert.ticker.upper())
            if stock and stock.currentPrice <= (alert.thresholdPrice or float("-inf")):
                is_triggered = True
                message = f"{alert.ticker} caiu para R$ {stock.currentPrice:.2f}, abaixo do alvo de R$ {alert.thresholdPrice:.2f}."

        elif alert.type == "portfolio_value_above":
            if snapshot.totalPortfolioValue >= (alert.thresholdValue or float("inf")):
                is_triggered = True
                message = f"Seu patrimônio atingiu R$ {snapshot.totalPortfolioValue:.2f}."

        if is_triggered:
            alert.triggered = True
            alert.triggeredAt = now_iso()
            alert.message = message
            newly_triggered.append(alert)

    if newly_triggered:
        write_alerts(alerts)
    return newly_triggered


@router.post("/check", response_model=AlertCheckResponse)
def check_alerts(payload: AlertCheckRequest) -> AlertCheckResponse:
    global _latest_snapshot
    _latest_snapshot = payload
    newly_triggered = evaluate_alerts(payload)
    return AlertCheckResponse(
        checkedAt=now_iso(),
        newlyTriggered=newly_triggered,
        allAlerts=read_alerts(),
    )


def get_latest_snapshot() -> AlertCheckRequest | None:
    return _latest_snapshot