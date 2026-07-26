from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, reports

app = FastAPI(title="AtlasCapital API (Python)", version="1.0.0")

# Configuração CORS (ajuste as origens conforme necessário)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "AtlasCapital API - Python Backend"}