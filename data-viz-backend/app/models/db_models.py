from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50), default="member")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    datasets = relationship("Dataset", back_populates="user", cascade="all, delete-orphan")

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String(255))
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="datasets")
    data_rows = relationship("DataRow", back_populates="dataset", cascade="all, delete-orphan")

class DataRow(Base):
    __tablename__ = "data_rows"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    region = Column(String(100), index=True)
    category = Column(String(100), index=True)
    sales = Column(Float)
    profit = Column(Float)
    items = Column(Integer)
    date = Column(Date, nullable=True)
    
    dataset = relationship("Dataset", back_populates="data_rows")