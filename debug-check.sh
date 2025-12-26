#!/bin/bash

echo "🔍 Priority Focus Manager - Debug Checker"
echo "=========================================="
echo ""

# Check PostgreSQL
echo "1. Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "   ✅ PostgreSQL is installed"
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw priority_focus_manager; then
        echo "   ✅ Database 'priority_focus_manager' exists"
        
        # Check if tables exist
        echo ""
        echo "2. Checking database tables..."
        TABLES=$(psql -d priority_focus_manager -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('managers', 'team_members', 'priorities');")
        if [ "$TABLES" -eq 3 ]; then
            echo "   ✅ All tables exist (managers, team_members, priorities)"
        else
            echo "   ❌ Tables missing! Found $TABLES/3 tables"
            echo "   → Run: cd backend && npm run migrate"
        fi
    else
        echo "   ❌ Database 'priority_focus_manager' does NOT exist"
        echo "   → Run: createdb priority_focus_manager"
    fi
else
    echo "   ❌ PostgreSQL is NOT installed"
fi

echo ""
echo "3. Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend dependencies NOT installed"
    echo "   → Run: cd backend && npm install"
fi

echo ""
echo "4. Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ❌ Frontend dependencies NOT installed"
    echo "   → Run: cd frontend && npm install"
fi

echo ""
echo "5. Checking if backend is running..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 3001"
else
    echo "   ❌ Backend is NOT running"
    echo "   → Run: cd backend && npm run dev"
fi

echo ""
echo "6. Checking if frontend is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ❌ Frontend is NOT running"
    echo "   → Run: cd frontend && npm run dev"
fi

echo ""
echo "=========================================="
echo "Debug check complete!"
