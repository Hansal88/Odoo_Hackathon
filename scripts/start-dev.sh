#!/usr/bin/env bash

# Start both frontend and backend servers in parallel
# Usage: npm run dev (from root directory)

echo "🚀 Starting Traveloop Development Environment..."
echo "================================================"
echo ""

# Kill background jobs on script exit
trap "kill 0" EXIT

# Start backend
echo "📡 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✓ Servers are starting..."
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo "  API Docs: http://localhost:5000/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
