from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional

# --- Authentication Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(UserBase):
    id: str
    role: str = "Member"
    
    class Config:
        from_attributes = True 

# --- Data Processing Schemas ---
class FilterCondition(BaseModel):
    column: str
    value: Any
    operator: str = "in" 

class DataRequest(BaseModel):
    file_id: str
    page: int = 1
    page_size: int = 10
    sort_column: Optional[str] = None
    sort_direction: Optional[str] = 'asc' 
    search_query: Optional[str] = None
    column_filters: List[FilterCondition] = []

class DataResponse(BaseModel):
    table_data: List[Dict[str, Any]]
    total_records: int
    chart_data: Dict[str, Any]