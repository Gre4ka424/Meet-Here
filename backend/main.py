from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from datetime import timedelta
from pathlib import Path

from database import get_db, engine
from models import Base, UserDB
from schemas import UserCreate, User, Token, UserLogin
from auth import authenticate_user, create_access_token, get_current_active_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES

# Create tables
Base.metadata.create_all(bind=engine)

# Get the directory of the current file
BASE_DIR = Path(__file__).resolve().parent.parent

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
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "frontend", "static")), name="static")

# Serve frontend files
@app.get("/")
async def read_root():
    return FileResponse(os.path.join(BASE_DIR, "frontend", "index.html"))

@app.get("/{filename:path}")
async def serve_frontend(filename: str):
    filepath = os.path.join(BASE_DIR, "frontend", filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return FileResponse(os.path.join(BASE_DIR, "frontend", "index.html"))

# Authentication routes
@app.post("/token", response_model=Token)
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

@app.post("/login", response_model=Token)
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