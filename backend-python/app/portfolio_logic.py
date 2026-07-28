"""
Funções compartilhadas para calcular métricas da carteira e a
classificação de risco de concentração por setor.
"""

from app.models import PortfolioMetrics, SectorBreakdownItem, StockIn
from app.sectors import classify_sector


def compute_sector_breakdown(stocks: list[StockIn]) -> list[SectorBreakdownItem]:
    totals_by_sector: dict[str, float] = {}
    total_value = 0.0

    for stock in stocks:
        value = stock.quantity * stock.currentPrice
        sector = classify_sector(stock.ticker)
        totals_by_sector[sector] = totals_by_sector.get(sector, 0.0) + value
        total_value += value

    if total_value == 0:
        return []

    breakdown = [
        SectorBreakdownItem(sector=sector, value=value, percent=round((value / total_value) * 100, 2))
        for sector, value in totals_by_sector.items()
    ]
    breakdown.sort(key=lambda item: item.percent, reverse=True)
    return breakdown


def classify_concentration_risk(breakdown: list[SectorBreakdownItem]) -> tuple[str, str | None]:
    if not breakdown:
        return "baixo", None

    top = breakdown[0]
    if top.percent >= 45:
        return "alto", top.sector
    if top.percent >= 28:
        return "médio", top.sector
    return "baixo", top.sector


def build_diversification_suggestions(
    breakdown: list[SectorBreakdownItem], risk: str, top_sector: str | None
) -> list[str]:
    if not breakdown:
        return ["Cadastre ações na sua carteira para receber uma análise de diversificação."]

    suggestions: list[str] = []

    if risk == "alto" and top_sector:
        suggestions.append(
            f"Sua carteira está concentrada em {top_sector} ({breakdown[0].percent:.1f}% do patrimônio). "
            "Considere reduzir essa exposição para diminuir o risco em caso de um evento específico do setor."
        )
    elif risk == "médio" and top_sector:
        suggestions.append(
            f"O setor de {top_sector} já representa {breakdown[0].percent:.1f}% da carteira. "
            "Vale acompanhar para não aumentar ainda mais essa concentração."
        )
    else:
        suggestions.append("Sua carteira está razoavelmente distribuída entre os setores atuais.")

    covered_sectors = {item.sector for item in breakdown}
    from app.sectors import KNOWN_SECTORS

    all_known_sectors = sorted(set(KNOWN_SECTORS.values()))
    missing_sectors = [sector for sector in all_known_sectors if sector not in covered_sectors]
    if missing_sectors:
        suggestion_sector = missing_sectors[0]
        suggestions.append(f"Considere aumentar exposição ao setor de {suggestion_sector} para diversificar ainda mais.")

    if len(breakdown) == 1:
        suggestions.append("Toda a carteira está em um único setor — diversificar entre setores diferentes tende a reduzir o risco geral.")

    return suggestions


def compute_portfolio_metrics(stocks: list[StockIn]) -> PortfolioMetrics:
    invested_value = sum(stock.quantity * stock.buyPrice for stock in stocks)
    current_value = sum(stock.quantity * stock.currentPrice for stock in stocks)
    profit_loss = current_value - invested_value
    profit_loss_percent = (profit_loss / invested_value * 100) if invested_value > 0 else 0.0

    breakdown = compute_sector_breakdown(stocks)
    risk, top_sector = classify_concentration_risk(breakdown)

    return PortfolioMetrics(
        investedValue=round(invested_value, 2),
        currentValue=round(current_value, 2),
        profitLoss=round(profit_loss, 2),
        profitLossPercent=round(profit_loss_percent, 2),
        concentrationRisk=risk,
        topSector=top_sector,
        sectorBreakdown=breakdown,
    )