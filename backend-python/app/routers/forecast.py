from datetime import datetime, timedelta
import numpy as np
from fastapi import APIRouter

from app.models import ForecastRequest, ForecastResponse, PricePoint, ForecastPoint

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

HISTORICAL_DAYS = 90
REGRESSION_WINDOW_DAYS = 30


def generate_synthetic_history(ticker: str, current_price: float) -> list[float]:
    seed = abs(hash(ticker.strip().upper())) % (2**32)
    rng = np.random.default_rng(seed)
    daily_returns = rng.normal(loc=0.0002, scale=0.018, size=HISTORICAL_DAYS)
    walk = np.cumprod(1 + daily_returns)
    raw_series = walk * (current_price / walk[-1])
    return [max(0.01, round(float(price), 2)) for price in raw_series]


def linear_regression_forecast(history: list[float], horizon_days: int):
    window = history[-REGRESSION_WINDOW_DAYS:]
    x = np.arange(len(window))
    y = np.array(window)
    slope, intercept = np.polyfit(x, y, 1)
    fitted = slope * x + intercept
    residuals = y - fitted
    residual_std = float(np.std(residuals)) if len(residuals) > 1 else 0.0
    future_x = np.arange(len(window), len(window) + horizon_days)
    predictions = slope * future_x + intercept
    predictions = np.maximum(predictions, 0.01)
    return predictions.tolist(), residual_std, float(slope)


@router.post("", response_model=ForecastResponse)
def forecast_price(payload: ForecastRequest):
    history = generate_synthetic_history(payload.ticker, payload.currentPrice)
    predictions, residual_std, slope = linear_regression_forecast(history, payload.horizonDays)

    today = datetime.utcnow().date()

    historical_points = [
        PricePoint(date=(today - timedelta(days=HISTORICAL_DAYS - 1 - i)).isoformat(), price=price)
        for i, price in enumerate(history)
    ]

    forecast_points = []
    for day_offset, pred_price in enumerate(predictions, start=1):
        band = residual_std * np.sqrt(day_offset) * 1.2
        forecast_points.append(
            ForecastPoint(
                date=(today + timedelta(days=day_offset)).isoformat(),
                predictedPrice=round(float(pred_price), 2),
                lowerBound=round(max(0.01, float(pred_price) - band), 2),
                upperBound=round(float(pred_price) + band, 2),
            )
        )

    projected_change_percent = (predictions[-1] - payload.currentPrice) / payload.currentPrice * 100 if payload.currentPrice else 0
    if projected_change_percent > 1.5:
        trend = "alta"
    elif projected_change_percent < -1.5:
        trend = "queda"
    else:
        trend = "estável"

    return ForecastResponse(
        ticker=payload.ticker.upper(),
        horizonDays=payload.horizonDays,
        method="Regressão linear (mínimos quadrados) sobre série histórica sintética",
        generatedAt=datetime.utcnow().isoformat(),
        historical=historical_points,
        forecast=forecast_points,
        trend=trend,
    )