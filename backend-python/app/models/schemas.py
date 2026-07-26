from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

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