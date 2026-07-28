"""
"Banco de dados" dos alertas, guardado em um arquivo JSON simples
(`data/alerts.json`). Isso simula persistência sem precisar de um
banco de verdade — quando o projeto tiver um banco definido para o
backend Python, basta trocar as funções abaixo.
"""

import json
import threading
import uuid
from pathlib import Path

from app.models import AlertCreate, AlertOut, now_iso

DATA_FILE = Path(__file__).resolve().parent / "data" / "alerts.json"
_lock = threading.Lock()


def _ensure_file() -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def read_alerts() -> list[AlertOut]:
    _ensure_file()
    with _lock:
        raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return [AlertOut(**item) for item in raw]


def write_alerts(alerts: list[AlertOut]) -> None:
    _ensure_file()
    with _lock:
        DATA_FILE.write_text(
            json.dumps([alert.model_dump() for alert in alerts], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )


def create_alert(data: AlertCreate) -> AlertOut:
    alerts = read_alerts()
    new_alert = AlertOut(
        id=str(uuid.uuid4())[:8],
        createdAt=now_iso(),
        triggered=False,
        triggeredAt=None,
        message=None,
        **data.model_dump(),
    )
    alerts.append(new_alert)
    write_alerts(alerts)
    return new_alert


def delete_alert(alert_id: str) -> bool:
    alerts = read_alerts()
    remaining = [alert for alert in alerts if alert.id != alert_id]
    if len(remaining) == len(alerts):
        return False
    write_alerts(remaining)
    return True