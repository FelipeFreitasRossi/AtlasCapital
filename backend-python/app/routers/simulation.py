"""
Endpoint de Simulação "E se".

Recebe a carteira ATUAL (enviada pelo frontend) mais uma operação
hipotética (comprar ou vender), e devolve duas "fotografias" da
carteira: ANTES e DEPOIS.
"""

from fastapi import APIRouter, HTTPException

from app.models import PortfolioMetrics, SimulationRequest, SimulationResponse, StockIn
from app.portfolio_logic import compute_portfolio_metrics

router = APIRouter(prefix="/api/simulate", tags=["simulation"])


def apply_operation(stocks: list[StockIn], payload: SimulationRequest) -> list[StockIn]:
    ticker = payload.ticker.strip().upper()
    market_price = payload.currentPrice if payload.currentPrice is not None else payload.price

    updated: list[StockIn] = [stock.model_copy() for stock in stocks]
    existing = next((stock for stock in updated if stock.ticker.upper() == ticker), None)

    if payload.action == "buy":
        if existing:
            total_quantity = existing.quantity + payload.quantity
            weighted_buy_price = (
                existing.quantity * existing.buyPrice + payload.quantity * payload.price
            ) / total_quantity
            existing.quantity = total_quantity
            existing.buyPrice = round(weighted_buy_price, 4)
            existing.currentPrice = market_price
        else:
            updated.append(
                StockIn(
                    ticker=ticker,
                    name=payload.name or ticker,
                    quantity=payload.quantity,
                    buyPrice=payload.price,
                    currentPrice=market_price,
                    purchaseDate="",
                )
            )
    else:  # sell
        if not existing:
            raise HTTPException(status_code=400, detail=f"Você não possui {ticker} na carteira para vender.")
        if payload.quantity > existing.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Você só possui {existing.quantity} ações de {ticker} — não é possível vender {payload.quantity}.",
            )
        existing.quantity -= payload.quantity
        existing.currentPrice = market_price
        if existing.quantity == 0:
            updated = [stock for stock in updated if stock.ticker.upper() != ticker]

    return updated


@router.post("", response_model=SimulationResponse)
def simulate_operation(payload: SimulationRequest) -> SimulationResponse:
    before = compute_portfolio_metrics(payload.stocks)
    updated_stocks = apply_operation(payload.stocks, payload)
    after = compute_portfolio_metrics(updated_stocks)

    warning = None
    if after.concentrationRisk == "alto" and before.concentrationRisk != "alto":
        warning = f"Essa operação deixaria sua carteira concentrada em {after.topSector}."

    return SimulationResponse(
        before=before,
        after=after,
        deltaCurrentValue=round(after.currentValue - before.currentValue, 2),
        deltaProfitLoss=round(after.profitLoss - before.profitLoss, 2),
        warning=warning,
    )