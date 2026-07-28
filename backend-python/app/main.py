"""
Ponto de entrada da API Python (FastAPI) do AtlasCapital.
"""

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import alerts, diversification, forecast, simulation
from app.routers.alerts import evaluate_alerts, get_latest_snapshot

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("atlascapital.scheduler")

app = FastAPI(
    title="AtlasCapital – API de Inteligência (Python)",
    description="Previsão de preço, diversificação, simulação e alertas para o AtlasCapital.",
    version="1.0.0",
)

# Libera o frontend (Vite) a chamar esta API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router)
app.include_router(diversification.router)
app.include_router(simulation.router)
app.include_router(alerts.router)


@app.get("/api/health", tags=["health"])
def health_check() -> dict:
    return {"status": "ok", "service": "atlascapital-python-api"}


# Agendador (APScheduler) – reavalia alertas a cada 30 segundos
scheduler = BackgroundScheduler()


def scheduled_alert_check() -> None:
    snapshot = get_latest_snapshot()
    if snapshot is None:
        return
    triggered = evaluate_alerts(snapshot)
    if triggered:
        logger.info("Alertas disparados pelo job em segundo plano: %s", [a.id for a in triggered])


@app.on_event("startup")
def start_scheduler() -> None:
    scheduler.add_job(scheduled_alert_check, "interval", seconds=30, id="check_alerts")
    scheduler.start()
    logger.info("Agendador de alertas iniciado (verificação a cada 30s).")


@app.on_event("shutdown")
def stop_scheduler() -> None:
    scheduler.shutdown(wait=False)