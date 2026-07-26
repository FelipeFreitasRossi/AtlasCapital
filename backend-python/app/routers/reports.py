from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
from app.models.schemas import StockInput
from app.services import report_service
from app.routers.auth import oauth2_scheme

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/pdf", dependencies=[Depends(oauth2_scheme)])
def generate_pdf(stocks: List[StockInput]):
    if not stocks:
        raise HTTPException(status_code=400, detail="Lista de ações vazia")
    pdf_content = report_service.generate_pdf_report(stocks)
    return Response(content=pdf_content, media_type="application/pdf",
                    headers={"Content-Disposition": "attachment; filename=relatorio.pdf"})

@router.post("/excel", dependencies=[Depends(oauth2_scheme)])
def generate_excel(stocks: List[StockInput]):
    if not stocks:
        raise HTTPException(status_code=400, detail="Lista de ações vazia")
    excel_content = report_service.generate_excel_report(stocks)
    return Response(content=excel_content,
                    media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-Disposition": "attachment; filename=relatorio.xlsx"})

@router.post("/csv", dependencies=[Depends(oauth2_scheme)])
def generate_csv(stocks: List[StockInput]):
    if not stocks:
        raise HTTPException(status_code=400, detail="Lista de ações vazia")
    csv_content = report_service.generate_csv_report(stocks)
    return Response(content=csv_content,
                    media_type="text/csv",
                    headers={"Content-Disposition": "attachment; filename=relatorio.csv"})