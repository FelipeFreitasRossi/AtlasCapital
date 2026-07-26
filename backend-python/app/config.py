import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkeychangeinprod")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    # Banco de dados simulado (em produção, use um banco real)
    FAKE_DB = {
        "users": [
            {
                "id": "1",
                "email": "admin@atlascapital.com",
                "name": "Admin",
                "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # "admin123"
            }
        ],
        "stocks": []
    }

settings = Settings()