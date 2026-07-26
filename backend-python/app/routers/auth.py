from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.services import auth_service
from app.models.schemas import UserCreate, Token, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    try:
        created = auth_service.create_user(user)
        return UserOut(id=created["id"], email=created["email"], name=created["name"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")
    access_token = auth_service.create_access_token(data={"sub": user["email"]})
    return Token(access_token=access_token)

@router.get("/me", response_model=UserOut)
def get_me(token: str = Depends(oauth2_scheme)):
    try:
        token_data = auth_service.decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = auth_service.find_user_by_email(token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UserOut(id=user["id"], email=user["email"], name=user["name"])