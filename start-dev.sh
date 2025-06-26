#!/bin/bash

# Online Shop Development Server Starter
echo "🚀 Starting Online Shop Development Environment..."

# Kill existing processes
echo "🛑 Stopping existing processes..."
lsof -ti:8080 | xargs kill 2>/dev/null
lsof -ti:5173 | xargs kill 2>/dev/null
sleep 2

# Clear Vite cache
echo "🧹 Clearing Vite cache..."
rm -rf frontend/node_modules/.vite frontend/.vite

# Start backend
echo "🔧 Starting PHP Backend (port 8080)..."
cd backend
php -S localhost:8080 -t public &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting React Frontend (port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    lsof -ti:8080 | xargs kill 2>/dev/null
    lsof -ti:5173 | xargs kill 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

echo ""
echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8080"
echo "🩺 Health:   http://localhost:8080/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait 