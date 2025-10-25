from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from app.models.schemas import DataRequest, DataResponse
from app.core import security
from app.utils.data_processor import initialMockData, process_data_with_pandas, parse_uploaded_file
import pandas as pd
import io

router = APIRouter(prefix="/data", tags=["Data Processing"])

# Simulated In-Memory Database (Replace with MongoDB in a real app)
MOCK_DB = {} # {user_id: [{file_id: '...', records: [...], columns: [...]}, ...]}
FILE_ID_COUNTER = 1

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_data(
    file: UploadFile = File(...), 
    current_user: dict = Depends(security.admin_required) # RBAC Check: Only Admins
):
    """Handles file upload (Excel/CSV), parses it, and stores it in the database."""
    
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in ['csv', 'xlsx', 'xls']:
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Parse the file based on extension
        records, columns = parse_uploaded_file(file_content, file_extension)
        
        if not records:
            raise HTTPException(status_code=400, detail="No data found in the uploaded file")
        
        global FILE_ID_COUNTER
        file_id = str(FILE_ID_COUNTER)
        FILE_ID_COUNTER += 1
        
        user_id = current_user['id']
        
        dataset_to_store = {
            "file_id": file_id,
            "file_name": file.filename,
            "records": records,
            "columns": columns,
            "uploaded_at": pd.Timestamp.now().isoformat(),
            "total_records": len(records)
        }
        
        if user_id not in MOCK_DB:
            MOCK_DB[user_id] = []
            
        MOCK_DB[user_id].append(dataset_to_store)
        
        return {
            "message": f"File '{file.filename}' uploaded and parsed successfully.", 
            "file_id": file_id,
            "total_records": len(records),
            "columns": columns
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@router.post("/process", response_model=DataResponse)
async def get_and_process_data(
    request: DataRequest,
    current_user: dict = Depends(security.get_current_user)
):
    """Fetches data, applies filters/sort/pagination, and performs server-side aggregation for charts."""
    
    user_id = current_user['id']
    
    # Find the requested file data for the current user
    user_files = MOCK_DB.get(user_id, [])
    dataset = next((f for f in user_files if f['file_id'] == request.file_id), None)
    
    if not dataset:
        # Fallback to creating a mock file if none are uploaded yet for demo ease
        if not user_files:
            mock_file_id = "1"
            MOCK_DB[user_id] = [{"file_id": mock_file_id, "file_name": "Default Data", "records": initialMockData, "columns": list(initialMockData[0].keys())}]
            dataset = MOCK_DB[user_id][0]
            request.file_id = mock_file_id # Update request to use the created mock ID
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Dataset with ID {request.file_id} not found or access denied."
            )
        
    # Process the data using the utility function (Pandas logic)
    return process_data_with_pandas(dataset['records'], request)

@router.get("/files")
async def get_user_files(current_user: dict = Depends(security.get_current_user)):
    """Get list of files uploaded by the current user."""
    user_id = current_user['id']
    user_files = MOCK_DB.get(user_id, [])
    
    # Return file metadata without the actual records for performance
    file_list = []
    for file_data in user_files:
        file_list.append({
            "file_id": file_data["file_id"],
            "file_name": file_data["file_name"],
            "uploaded_at": file_data.get("uploaded_at", "Unknown"),
            "total_records": file_data.get("total_records", len(file_data["records"])),
            "columns": file_data["columns"]
        })
    
    return {"files": file_list}