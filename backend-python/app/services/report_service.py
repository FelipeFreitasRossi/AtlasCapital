import io
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
import matplotlib.pyplot as plt
import tempfile
import os
from app.models.schemas import StockInput

def build_stock_df(stocks: list[StockInput]) -> pd.DataFrame:
    df = pd.DataFrame([s.dict() for s in stocks])
    if df.empty:
        return df
    df["invested"] = df["quantity"] * df["buyPrice"]
    df["current"] = df["quantity"] * df["currentPrice"]
    df["result"] = df["current"] - df["invested"]
    df["result_%"] = (df["result"] / df["invested"]) * 100
    return df

def generate_chart_image(df: pd.DataFrame) -> str:
    plt.figure(figsize=(8, 4))
    colors_bar = ['green' if v >= 0 else 'red' for v in df['result']]
    plt.bar(df['ticker'], df['result'], color=colors_bar)
    plt.axhline(0, color='black', linewidth=0.8)
    plt.title("Resultado por Ação")
    plt.ylabel("R$")
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    temp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    plt.savefig(temp.name, dpi=100, bbox_inches='tight')
    plt.close()
    return temp.name

def generate_pdf_report(stocks: list[StockInput]):
    df = build_stock_df(stocks)
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title="Relatório AtlasCapital")
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=18, textColor=colors.darkblue)
    story = []

    story.append(Paragraph("Relatório da Carteira - AtlasCapital", title_style))
    story.append(Spacer(1, 0.5*cm))

    if df.empty:
        story.append(Paragraph("Nenhuma ação cadastrada.", styles['Normal']))
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

    data = [["Ticker", "Empresa", "Qtd", "Preço Compra", "Preço Atual", "Resultado (R$)"]]
    for _, row in df.iterrows():
        data.append([
            row['ticker'],
            row['name'],
            f"{row['quantity']:.2f}",
            f"{row['buyPrice']:.2f}",
            f"{row['currentPrice']:.2f}",
            f"{row['result']:.2f}"
        ])
    table = Table(data, colWidths=[2*cm, 3*cm, 1.5*cm, 2*cm, 2*cm, 2.5*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTSIZE', (0,1), (-1,-1), 8),
    ]))
    story.append(table)
    story.append(Spacer(1, 0.5*cm))

    chart_path = generate_chart_image(df)
    if chart_path:
        img = Image(chart_path, width=14*cm, height=8*cm)
        story.append(img)
        os.unlink(chart_path)  # remove o arquivo temporário

    from datetime import datetime
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph(f"Gerado em {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['Normal']))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

def generate_excel_report(stocks: list[StockInput]):
    df = build_stock_df(stocks)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        if not df.empty:
            df.to_excel(writer, sheet_name='Detalhamento', index=False)
            summary = pd.DataFrame({
                'Métrica': ['Total Investido', 'Valor Atual', 'Resultado Total', 'Rentabilidade %'],
                'Valor': [
                    df['invested'].sum(),
                    df['current'].sum(),
                    df['result'].sum(),
                    (df['result'].sum() / df['invested'].sum()) * 100 if df['invested'].sum() else 0
                ]
            })
            summary.to_excel(writer, sheet_name='Resumo', index=False)
        else:
            pd.DataFrame({'Mensagem': ['Nenhuma ação cadastrada']}).to_excel(writer, sheet_name='Vazio', index=False)
    output.seek(0)
    return output.getvalue()

def generate_csv_report(stocks: list[StockInput]):
    df = build_stock_df(stocks)
    output = io.StringIO()
    df.to_csv(output, index=False)
    return output.getvalue().encode('utf-8')