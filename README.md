# Data Visualization Dashboard

A full-stack web application for uploading, processing, and visualizing data with interactive charts and tables.

## Features

### ✅ User Authentication & Authorization
- **User Registration & Login** with secure JWT authentication
- **Role-based Access Control** (Admin/Member roles)
- **Protected Routes** and API endpoints

### ✅ Data Management
- **File Upload** (CSV, Excel) - Admin only
- **Data Parsing** and validation
- **Database Storage** with proper schema
- **File Management** - view uploaded files

### ✅ Data Visualization
- **Interactive Charts**: Bar, Line, and Pie charts
- **Real-time Data Processing** on the backend
- **Responsive Design** for all screen sizes

### ✅ Data Table Features
- **Paginated Tables** with customizable page size
- **Sortable Columns** (ascending/descending)
- **Search Functionality** across all columns
- **Column Filtering** (e.g., by category)

### ✅ UI/UX Features
- **Light/Dark Theme Toggle** with persistent settings
- **Modern, Clean Interface** with smooth animations
- **Error Handling** with user-friendly messages
- **Loading States** for better user experience

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data processing and analysis
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation and serialization
- **OpenPyXL** - Excel file processing

### Frontend
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Interactive chart library
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Database
- **In-memory storage** (easily replaceable with MongoDB/PostgreSQL)

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd data-viz-backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv myenv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   myenv\Scripts\activate
   
   # macOS/Linux
   source myenv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd data-viz-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Demo Accounts

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `adminpass`
- **Permissions:** Upload files, view all data

### Member Account
- **Email:** `member@test.com`
- **Password:** `memberpass`
- **Permissions:** View data, use filters and charts

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Data Management
- `POST /data/upload` - Upload CSV/Excel file (Admin only)
- `GET /data/files` - Get user's uploaded files
- `POST /data/process` - Process data with filters/pagination

## Sample Data

The application comes with sample sales data including:
- **Regions:** North, South, East, West
- **Categories:** Electronics, Apparel, Home Goods
- **Metrics:** Sales, Profit, Items, Date

## File Upload Requirements

### Supported Formats
- **CSV files** (.csv)
- **Excel files** (.xlsx, .xls)

### Data Requirements
- First row should contain column headers
- Data should be in tabular format
- Empty rows will be automatically filtered out

## Architecture

### Backend Architecture
```
data-viz-backend/
├── main.py                 # FastAPI app entry point
├── app/
│   ├── core/
│   │   └── security.py     # JWT authentication & RBAC
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── routers/
│   │   ├── auth.py         # Authentication endpoints
│   │   └── data.py         # Data processing endpoints
│   └── utils/
│       └── data_processor.py # Data processing logic
└── requirements.txt
```

### Frontend Architecture
```
data-viz-frontend/
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── Dashboard/
│   │   │   ├── Header.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── FiltersComponent.jsx
│   │   ├── Charts/
│   │   │   └── ChartSection.jsx
│   │   └── TabButton.jsx
│   ├── hooks/
│   │   └── useTheme.js
│   ├── services/
│   │   └── api.js          # API service layer
│   └── App.jsx
└── package.json
```

## Key Features Explained

### 1. Role-Based Access Control (RBAC)
- **Admin users** can upload files and manage data
- **Member users** can only view and interact with data
- Protected API endpoints ensure proper access control

### 2. Real-time Data Processing
- All filtering, sorting, and aggregation happens on the backend
- Frontend receives processed data for optimal performance
- Server-side pagination for large datasets

### 3. Interactive Visualizations
- **Bar Charts:** Sales by region
- **Line Charts:** Monthly trends (Sales & Profit)
- **Pie Charts:** Category distribution
- Charts update automatically when filters change

### 4. Responsive Design
- Mobile-first approach with Tailwind CSS
- Dark/light theme support
- Smooth animations and transitions

## Development Notes

### Backend Development
- Uses FastAPI's automatic API documentation
- Comprehensive error handling
- Type hints throughout the codebase
- Modular architecture for easy maintenance

### Frontend Development
- Modern React patterns with hooks
- Component-based architecture
- Centralized API service layer
- Responsive design with Tailwind CSS

## Future Enhancements

- **Database Integration:** Replace in-memory storage with MongoDB/PostgreSQL
- **Advanced Charts:** Add more chart types (scatter, heatmap, etc.)
- **Data Export:** Export filtered data to CSV/Excel
- **User Management:** Admin panel for user management
- **Real-time Updates:** WebSocket support for live data updates
- **Data Validation:** More sophisticated data validation rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
