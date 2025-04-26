from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy.orm import Session
import os
import sys
from datetime import timedelta
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database import get_db, engine
from backend.models import Base, UserDB
from backend.schemas import UserCreate, User, Token, UserLogin
from backend.auth import authenticate_user, create_access_token, get_current_active_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES

# Create tables
Base.metadata.create_all(bind=engine)

# Get the directory of the current file
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "static")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Create directories if they don't exist
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(FRONTEND_DIR, exist_ok=True)

app = FastAPI(
    title="MeetHere API",
    description="API для управления пользователями и встречами",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# List of SPA routes that should return index.html
SPA_ROUTES = [
    "/",
    "/services",
    "/our-work",
    "/our-team",
    "/price-list",
    "/contact",
    "/login",
    "/register"
]

@app.get("/{full_path:path}")
async def catch_all(request: Request, full_path: str):
    # Check if it's an API route
    if request.url.path.startswith("/api/"):
        raise HTTPException(status_code=404, detail="API route not found")
        
    # Check if it's a static file
    if full_path.startswith("static/"):
        file_path = os.path.join(BASE_DIR, full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
        raise HTTPException(status_code=404, detail="Static file not found")
    
    # For SPA routes or unknown paths, return index.html
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
            return HTMLResponse(content=content)
    return HTMLResponse(content="Welcome to MeetHere API")

# API routes
@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User routes
@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_user_email = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    db_user_name = db.query(UserDB).filter(UserDB.username == user.username).first()
    if db_user_name:
        raise HTTPException(status_code=400, detail="Username already taken")
        
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    try:
        db_user = UserDB(
            email=user.email,
            username=user.username,
            password=hashed_password,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/users/", response_model=list[User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_active_user)
):
    users = db.query(UserDB).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=User)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: UserDB = Depends(get_current_active_user)
):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: UserDB = Depends(get_current_active_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable for Railway deployment
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
