"""
Classificação de ações por setor.

Isso é uma REGRA DE NEGÓCIO simples (não é IA de verdade): temos uma
lista fixa com os tickers mais comuns da bolsa brasileira e o setor de
cada um. Para tickers que não conhecemos, calculamos um "setor" de um
jeito determinístico (hash do ticker), só para a demonstração sempre
mostrar algo coerente e sempre o MESMO setor para o mesmo ticker
(nunca aleatório entre uma chamada e outra).

Quando este projeto evoluir para uma classificação de verdade, o ideal
é substituir isso por uma integração com uma base de dados de mercado
(ex: B3, Status Invest, Brapi) que já traga o setor de cada empresa.
"""

import hashlib

KNOWN_SECTORS: dict[str, str] = {
    "PETR4": "Petróleo e Gás",
    "PETR3": "Petróleo e Gás",
    "PRIO3": "Petróleo e Gás",
    "VALE3": "Mineração",
    "CSNA3": "Mineração e Siderurgia",
    "GGBR4": "Mineração e Siderurgia",
    "ITUB4": "Bancos",
    "BBDC4": "Bancos",
    "BBAS3": "Bancos",
    "SANB11": "Bancos",
    "B3SA3": "Bolsa e Serviços Financeiros",
    "MGLU3": "Varejo",
    "LREN3": "Varejo",
    "AMER3": "Varejo",
    "VVAR3": "Varejo",
    "ABEV3": "Bebidas e Consumo",
    "JBSS3": "Alimentos",
    "BRFS3": "Alimentos",
    "WEGE3": "Industrial",
    "EMBR3": "Industrial",
    "ELET3": "Energia Elétrica",
    "ELET6": "Energia Elétrica",
    "CPFE3": "Energia Elétrica",
    "EQTL3": "Energia Elétrica",
    "RENT3": "Locações",
    "RAIL3": "Logística e Transporte",
    "CCRO3": "Logística e Transporte",
    "GOLL4": "Aviação",
    "AZUL4": "Aviação",
    "TOTS3": "Tecnologia",
    "POSI3": "Tecnologia",
    "LWSA3": "Tecnologia",
    "VIVT3": "Telecomunicações",
    "TIMS3": "Telecomunicações",
    "HAPV3": "Saúde",
    "RDOR3": "Saúde",
    "FLRY3": "Saúde",
}

FALLBACK_SECTORS = [
    "Diversos",
    "Consumo",
    "Industrial",
    "Serviços Financeiros",
    "Tecnologia",
    "Energia",
    "Logística",
]


def classify_sector(ticker: str) -> str:
    """Retorna o setor de um ticker. Se desconhecido, usa fallback determinístico."""
    normalized = ticker.strip().upper()
    if normalized in KNOWN_SECTORS:
        return KNOWN_SECTORS[normalized]

    # Fallback determinístico: mesmo ticker desconhecido sempre cai no mesmo "setor"
    digest = hashlib.sha256(normalized.encode()).hexdigest()
    index = int(digest, 16) % len(FALLBACK_SECTORS)
    return FALLBACK_SECTORS[index]