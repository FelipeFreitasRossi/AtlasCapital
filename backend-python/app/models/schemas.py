from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Literal
from datetime import datetime


# ---------------------------------------------------------------------------
# Modelos existentes (renomeados para compatibilidade)
# ---------------------------------------------------------------------------
class StockInput(BaseModel):
    ticker: str
    name: str
    quantity: float
    buyPrice: float
    currentPrice: float
    purchaseDate: str  # YYYY-MM-DD


class StockOut(StockInput):
    id: str
    investedValue: float
    currentValue: float
    profitLoss: float
    profitLossPercent: float


# Alias para compatibilidade com os novos routers
StockIn = StockInput


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: str


# ---------------------------------------------------------------------------
# 1) Previsão de preço (Forecast)
# ---------------------------------------------------------------------------
HorizonDays = Literal[7, 30, 90]


class ForecastRequest(BaseModel):
    ticker: str
    currentPrice: float = Field(gt=0)
    horizonDays: HorizonDays = 30


class PricePoint(BaseModel):
    date: str
    price: float


class ForecastPoint(BaseModel):
    date: str
    predictedPrice: float
    lowerBound: float
    upperBound: float


class ForecastResponse(BaseModel):
    ticker: str
    horizonDays: int
    method: str
    generatedAt: str
    historical: list[PricePoint]
    forecast: list[ForecastPoint]
    trend: Literal["alta", "queda", "estável"]


# ---------------------------------------------------------------------------
# 2) Diversificação
# ---------------------------------------------------------------------------
class SectorBreakdownItem(BaseModel):
    sector: str
    value: float
    percent: float


class DiversificationRequest(BaseModel):
    stocks: list[StockInput]


class DiversificationResponse(BaseModel):
    sectorBreakdown: list[SectorBreakdownItem]
    concentrationRisk: Literal["baixo", "médio", "alto"]
    topSector: Optional[str]
    suggestions: list[str]


# ---------------------------------------------------------------------------
# 3) Simulação "E se"
# ---------------------------------------------------------------------------
class PortfolioMetrics(BaseModel):
    investedValue: float
    currentValue: float
    profitLoss: float
    profitLossPercent: float
    concentrationRisk: Literal["baixo", "médio", "alto"]
    topSector: Optional[str]
    sectorBreakdown: list[SectorBreakdownItem]


class SimulationRequest(BaseModel):
    stocks: list[StockInput]
    action: Literal["buy", "sell"]
    ticker: str
    name: str = ""
    quantity: float = Field(gt=0)
    price: float = Field(gt=0)
    currentPrice: Optional[float] = None


class SimulationResponse(BaseModel):
    before: PortfolioMetrics
    after: PortfolioMetrics
    deltaCurrentValue: float
    deltaProfitLoss: float
    warning: Optional[str] = None


# ---------------------------------------------------------------------------
# 4) Alertas
# ---------------------------------------------------------------------------
AlertType = Literal[
    "price_drop_percent",
    "price_target_above",
    "price_target_below",
    "portfolio_value_above"
]


class AlertCreate(BaseModel):
    type: AlertType
    ticker: Optional[str] = None
    thresholdPercent: Optional[float] = None
    thresholdPrice: Optional[float] = None
    thresholdValue: Optional[float] = None


class AlertOut(AlertCreate):
    id: str
    createdAt: str
    triggered: bool = False
    triggeredAt: Optional[str] = None
    message: Optional[str] = None


class AlertCheckRequest(BaseModel):
    stocks: list[StockInput]
    totalPortfolioValue: float


class AlertCheckResponse(BaseModel):
    checkedAt: str
    newlyTriggered: list[AlertOut]
    allAlerts: list[AlertOut]


def now_iso() -> str:
    return datetime.utcnow().isoformat()