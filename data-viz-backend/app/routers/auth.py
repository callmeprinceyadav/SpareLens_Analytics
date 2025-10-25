from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.models.schemas import Token, User, UserCreate
from app.core import security
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Simulated User Database (Replace with MongoDB CRUD in a real app)
# Using pre-hashed passwords to avoid bcrypt issues during module import
MOCK_USER_DB = {
    "admin@test.com": {
        "id": "1", 
        "email": "admin@test.com", 
        "password_hash": "$pbkdf2-sha256$29000$C8G4F2LM.f8/B8CYk/IeIw$OsyrGCDjEEITcEipz/EW/t8YhVs7Z2nk62SxrMsNQt0",  # adminpass
        "role": "Admin"
    },
    "member@test.com": {
        "id": "2", 
        "email": "member@test.com", 
        "password_hash": "$pbkdf2-sha256$29000$DQFgTMm5d46RshZibO1daw$4nzH2cSDegF61RVWcoCdNyIoIlXtJzOKWe70j2ZucB0",  # memberpass
        "role": "Member"
    },
}
USER_ID_COUNTER = 3

def authenticate_user(email: str, password: str):
    user_data = MOCK_USER_DB.get(email)
    if not user_data or not security.verify_password(password, user_data["password_hash"]):
        return None
    return user_data

@router.post("/register", response_model=User)
async def register_user(user_data: UserCreate):
    """Register a new user (defaults to Member role)."""
    if user_data.email in MOCK_USER_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    global USER_ID_COUNTER
    user_id = str(USER_ID_COUNTER)
    USER_ID_COUNTER += 1
    
    # Create new user (default role is Member)
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": security.get_password_hash(user_data.password),
        "role": "Member"
    }
    
    MOCK_USER_DB[user_data.email] = new_user
    
    return User(id=user_id, email=user_data.email, role="Member")

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user["id"], "email": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(security.get_current_user)):
    # The current_user dictionary contains the user data from the token payload
    return User(id=current_user["id"], email=current_user["email"], role=current_user["role"])