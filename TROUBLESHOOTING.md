# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Signup/Login Requests Failing

#### 1. Check if PostgreSQL is running

**Mac:**
```bash
brew services list | grep postgresql
# If not running:
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl status postgresql
# If not running:
sudo systemctl start postgresql
```

**Windows:**
```bash
# Check if PostgreSQL service is running in Services
```

#### 2. Create the database (if not exists)

```bash
# Connect to PostgreSQL
psql postgres

# Create the database
CREATE DATABASE priority_focus_manager;

# Exit
\q
```

Or use the command line:
```bash
createdb priority_focus_manager
```

#### 3. Run migrations

```bash
cd backend
npm run migrate
```

Expected output:
```
Running database migrations...
✅ Migrations completed successfully!
```

If you see errors, check:
- Is PostgreSQL running?
- Does the database exist?
- Is the DATABASE_URL correct in `.env`?

#### 4. Install dependencies (if not done)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 5. Start both servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Priority Focus Manager API running on port 3001
📍 Health check: http://localhost:3001/health
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

#### 6. Test the backend directly

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

#### 7. Check browser console for errors

Open your browser's Developer Tools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check the failed request
  - What's the status code? (500, 404, etc.)
  - What's the error message in the response?

#### 8. Check backend logs

Look at your backend terminal for error messages when you try to sign up.

Common errors:
- `ECONNREFUSED` → PostgreSQL not running or wrong port
- `database "priority_focus_manager" does not exist` → Need to create database
- `relation "managers" does not exist` → Need to run migrations
- `MODULE_NOT_FOUND` → Need to run `npm install`

### Quick Start Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `priority_focus_manager` exists
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Migrations run successfully (`npm run migrate`)
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 3000
- [ ] Backend health check returns OK

### Still Having Issues?

1. **Check the exact error message** in:
   - Browser console (F12 → Console)
   - Network tab (F12 → Network → Click failed request)
   - Backend terminal output

2. **Verify database connection:**
   ```bash
   cd backend
   node -e "import('pg').then(({default:pg})=>{const pool=new pg.Pool({connectionString:'postgresql://localhost:5432/priority_focus_manager'});pool.query('SELECT NOW()',console.log);pool.end()})"
   ```

3. **Check if tables exist:**
   ```bash
   psql priority_focus_manager -c "\dt"
   ```

   You should see: `managers`, `team_members`, `priorities`

### Railway Deployment Issues

If you're testing on Railway:

1. **Check Railway logs:**
   ```bash
   railway logs
   ```

2. **Verify environment variables are set:**
   - DATABASE_URL (auto-set by Railway)
   - JWT_SECRET (you need to set this)

3. **Make sure migrations ran:**
   ```bash
   railway run npm run migrate
   ```

4. **Check the backend URL is correct in frontend:**
   - Should be your Railway backend URL
   - Not `localhost:3001`
