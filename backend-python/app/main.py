from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler

from app.routers import alerts, diversification, forecast, simulation
from app.routers.alerts import evaluate_alerts, get_latest_snapshot

# Carrega variáveis do arquivo .env
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("atlascapital.scheduler")

app = FastAPI(
    title="AtlasCapital – API de Inteligência (Python)",
    description="Previsão de preço, diversificação, simulação e alertas para o AtlasCapital.",
    version="1.0.0",
)

# Libera o frontend a chamar esta API (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, substitua pela URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os routers das funcionalidades
app.include_router(forecast.router)
app.include_router(diversification.router)
app.include_router(simulation.router)
app.include_router(alerts.router)


@app.get("/api/health", tags=["health"])
def health_check() -> dict:
    """Endpoint para verificar se a API está no ar."""
    return {"status": "ok", "service": "atlascapital-python-api"}


# ---------------------------------------------------------------------------
# Agendador (APScheduler): reavalia os alertas em segundo plano a cada
# 30 segundos, usando o último "retrato" da carteira que o frontend
# enviou para /api/alerts/check. Isso simula uma verificação periódica
# do lado do servidor, sem depender só do momento exato em que o
# frontend chama a API.
# ---------------------------------------------------------------------------
scheduler = BackgroundScheduler()


def scheduled_alert_check() -> None:
    """Função executada pelo agendador para verificar alertas."""
    snapshot = get_latest_snapshot()
    if snapshot is None:
        return  # ainda não recebemos nenhum retrato da carteira nesta sessão

    triggered = evaluate_alerts(snapshot)
    if triggered:
        logger.info("Alertas disparados pelo job em segundo plano: %s", [a.id for a in triggered])


@app.on_event("startup")
def start_scheduler() -> None:
    """Inicia o agendador quando o servidor sobe."""
    scheduler.add_job(scheduled_alert_check, "interval", seconds=30, id="check_alerts")
    scheduler.start()
    logger.info("Agendador de alertas iniciado (verificação a cada 30s).")


@app.on_event("shutdown")
def stop_scheduler() -> None:
    """Para o agendador quando o servidor desliga."""
    scheduler.shutdown(wait=False)
    logger.info("Agendador de alertas finalizado.")


# Ponto de entrada para rodar diretamente (uvicorn app.main:app --reload)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)