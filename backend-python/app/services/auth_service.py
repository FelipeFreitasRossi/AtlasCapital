from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings
from app.models.schemas import UserCreate, UserLogin, TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise JWTError
        return TokenData(sub=email)
    except JWTError:
        raise ValueError("Token inválido")

# --- Simulação de banco de dados ---
def find_user_by_email(email: str):
    for user in settings.FAKE_DB["users"]:
        if user["email"] == email:
            return user
    return None

def create_user(user: UserCreate):
    if find_user_by_email(user.email):
        raise ValueError("Email já registrado")
    new_user = {
        "id": str(len(settings.FAKE_DB["users"]) + 1),
        "email": user.email,
        "name": user.name,
        "password": get_password_hash(user.password)
    }
    settings.FAKE_DB["users"].append(new_user)
    return new_user

def authenticate_user(email: str, password: str):
    user = find_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None
    return user