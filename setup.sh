#!/bin/bash

# Priority Focus Manager - Setup Script
# This script helps you get the application running locally

set -e  # Exit on error

echo "🚀 Priority Focus Manager - Setup Script"
echo "=========================================="
echo ""

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
else
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
echo ""
echo "📦 Creating database..."
if psql -lqt | cut -d \| -f 1 | grep -qw priority_focus_manager; then
    echo "✅ Database 'priority_focus_manager' already exists"
else
    echo "Creating database 'priority_focus_manager'..."
    createdb priority_focus_manager
    echo "✅ Database created"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
fi

# Run migrations
echo ""
echo "🔧 Running database migrations..."
npm run migrate
echo "✅ Migrations completed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to http://localhost:3000"
echo ""
echo "Happy prioritizing! 🎯"
