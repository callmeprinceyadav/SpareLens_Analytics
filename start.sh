#!/bin/bash

# Data Visualization Dashboard Startup Script

echo "🚀 Starting Data Visualization Dashboard..."
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python and Node.js are installed"
echo ""

# Start Backend
echo "🔧 Starting Backend Server..."
cd data-viz-backend

# Check if virtual environment exists
if [ ! -d "myenv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv myenv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    myenv/Scripts/activate
else
    # macOS/Linux
    source myenv/bin/activate
fi

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Start backend server in background
echo "🚀 Starting FastAPI server on http://localhost:8000"
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd ../data-viz-frontend

# Install dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Start frontend server
echo "🚀 Starting React development server on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Dashboard is starting up!"
echo ""
echo "📊 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🌐 Frontend App: http://localhost:5173"
echo ""
echo "👤 Demo Accounts:"
echo "   Admin: admin@test.com / adminpass"
echo "   Member: member@test.com / memberpass"
echo ""
echo "📁 Sample data file: sample_data.csv"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
