"""
Endpoint de Dica de Diversificação.

Também é uma REGRA DE NEGÓCIO (não é um modelo de IA "de verdade"):
1. Classificamos cada ação da carteira em um setor (app/sectors.py).
2. Somamos quanto do patrimônio está em cada setor.
3. Se um setor ultrapassa um limite (45% = alto risco, 28% = risco
   médio), sinalizamos concentração e sugerimos setores que ainda não
   estão representados na carteira.
"""

from fastapi import APIRouter

from app.models import DiversificationRequest, DiversificationResponse
from app.portfolio_logic import (
    build_diversification_suggestions,
    classify_concentration_risk,
    compute_sector_breakdown,
)

router = APIRouter(prefix="/api/diversification", tags=["diversification"])


@router.post("", response_model=DiversificationResponse)
def get_diversification_tip(payload: DiversificationRequest) -> DiversificationResponse:
    breakdown = compute_sector_breakdown(payload.stocks)
    risk, top_sector = classify_concentration_risk(breakdown)
    suggestions = build_diversification_suggestions(breakdown, risk, top_sector)

    return DiversificationResponse(
        sectorBreakdown=breakdown,
        concentrationRisk=risk,
        topSector=top_sector,
        suggestions=suggestions,
    )