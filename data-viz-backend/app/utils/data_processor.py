import pandas as pd
from typing import List, Dict, Any, Tuple
from app.models.schemas import DataRequest, DataResponse
import io

# Mock Data (Should be loaded from MongoDB in a real app)
initialMockData = [
  {"id": 1, "Region": 'North', "Sales": 12000, "Profit": 3000, "Items": 150, "Date": '2023-01-01', "Category": 'Electronics'},
  {"id": 2, "Region": 'South', "Sales": 8500, "Profit": 1200, "Items": 90, "Date": '2023-01-05', "Category": 'Apparel'},
  {"id": 3, "Region": 'East', "Sales": 15000, "Profit": 4500, "Items": 220, "Date": '2023-02-10', "Category": 'Electronics'},
  {"id": 8, "Region": 'West', "Sales": 8800, "Profit": 2500, "Items": 100, "Date": '2023-04-15', "Category": 'Apparel'},
]

def parse_uploaded_file(file_content: bytes, file_extension: str) -> Tuple[List[Dict], List[str]]:
    """Parse uploaded CSV or Excel file and return records and columns."""
    try:
        if file_extension == 'csv':
            # Parse CSV file
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8')))
        elif file_extension in ['xlsx', 'xls']:
            # Parse Excel file
            df = pd.read_excel(io.BytesIO(file_content))
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Clean the data
        df = df.dropna(how='all')  # Remove completely empty rows
        df = df.fillna('')  # Fill NaN values with empty strings
        
        # Convert to records
        records = df.to_dict('records')
        
        # Add row IDs if not present
        for i, record in enumerate(records):
            if 'id' not in record:
                record['id'] = i + 1
        
        columns = list(df.columns)
        return records, columns
        
    except Exception as e:
        raise ValueError(f"Error parsing file: {str(e)}")


def process_data_with_pandas(records: List[Dict], request: DataRequest) -> DataResponse:
    """Applies filters, sorts, paginates, and aggregates data for visualization."""
    if not records:
        return DataResponse(table_data=[], total_records=0, chart_data={})

    df = pd.DataFrame(records)
    
    # 1. Filtering Logic
    # Apply search query
    if request.search_query:
        search_mask = df.apply(lambda row: row.astype(str).str.contains(request.search_query, case=False).any(), axis=1)
        df = df[search_mask]

    # Apply column filters
    for f in request.column_filters:
        if f.operator == 'in' and isinstance(f.value, list):
            df = df[df[f.column].isin(f.value)]
        # Add 'gt', 'lt', etc. logic here

    total_records = len(df)
    
    # 2. Aggregation for Charts
    
    # Bar Chart: Sales by Region
    bar_df = df.groupby('Region')['Sales'].sum().reset_index()
    bar_chart_data = bar_df.to_dict('records')

    # Pie Chart: Items by Category
    pie_df = df.groupby('Category')['Items'].sum().reset_index()
    pie_chart_data = pie_df.to_dict('records')

    # Line Chart: Monthly Trend
    line_df = df.copy()
    line_df['Date'] = pd.to_datetime(line_df['Date'])
    line_df['month'] = line_df['Date'].dt.to_period('M').astype(str)
    line_agg_df = line_df.groupby('month')[['Sales', 'Profit']].sum().reset_index()
    line_chart_data = line_agg_df.rename(columns={'Sales': 'totalSales', 'Profit': 'totalProfit'}).to_dict('records')
    

    # 3. Sorting and Pagination for Table
    if request.sort_column:
        df = df.sort_values(
            by=request.sort_column, 
            ascending=(request.sort_direction == 'asc')
        )

    start = (request.page - 1) * request.page_size
    end = start + request.page_size
    paginated_data = df.iloc[start:end].to_dict('records')

    return DataResponse(
        table_data=paginated_data,
        total_records=total_records,
        chart_data={
            "bar": bar_chart_data,
            "pie": pie_chart_data,
            "line": line_chart_data
        }
    )