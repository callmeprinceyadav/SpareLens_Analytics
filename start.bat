@echo off
REM Data Visualization Dashboard Startup Script for Windows

echo 🚀 Starting Data Visualization Dashboard...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed
echo.

REM Start Backend
echo 🔧 Starting Backend Server...
cd data-viz-backend

REM Check if virtual environment exists
if not exist "myenv" (
    echo 📦 Creating virtual environment...
    python -m venv myenv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call myenv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Start backend server
echo 🚀 Starting FastAPI server on http://localhost:8000
start "Backend Server" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo.
echo 🎨 Starting Frontend Server...
cd ..\data-viz-frontend

REM Install dependencies
echo 📥 Installing Node.js dependencies...
npm install

REM Start frontend server
echo 🚀 Starting React development server on http://localhost:5173
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🎉 Dashboard is starting up!
echo.
echo 📊 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 🌐 Frontend App: http://localhost:5173
echo.
echo 👤 Demo Accounts:
echo    Admin: admin@test.com / adminpass
echo    Member: member@test.com / memberpass
echo.
echo 📁 Sample data file: sample_data.csv
echo.
echo Press any key to exit...
pause >nul
