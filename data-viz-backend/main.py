from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, data
from app.core.database import engine  # NEW: Import database engine
from app.models import db_models  # NEW: Import models to register them

app = FastAPI(title="DataViz Dashboard API", version="1.0.0")

# Add CORS Middleware for connecting Frontend (Vite runs on 5173 by default)
origins = [
    "http://localhost",
    "http://localhost:5173",  # Frontend URL
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NEW: Create database tables on startup (optional - you can also use init_db.py)
@app.on_event("startup")
async def startup():
    # This creates tables if they don't exist
    db_models.Base.metadata.create_all(bind=engine)
    print("Database tables ready!")

# Include Routers
app.include_router(auth.router)
app.include_router(data.router)

@app.get("/")
def read_root():
    return {"message": "DataViz Dashboard FastAPI is running!", "version": "1.0.0"}