#!/bin/bash
# Quick Start Script for Warehouse Admin

echo "🚀 Warehouse Admin - Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to client directory
cd client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎉 Starting frontend application..."
echo "📍 Open: http://localhost:3000"
echo ""
echo "🔓 Demo Credentials:"
echo "   Email: admin@example.com"
echo "   Password: password"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start
