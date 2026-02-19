# 🔧 Troubleshooting & Quick Fix Guide

## ✅ Quick Status Check

**Current Mode:** Development with Mock Data ✅
**Frontend:** Ready to run
**Backend:** Standalone (can run separately)
**Database:** Optional (mock mode works without it)

---

## 🚀 Start Frontend (Recommended)

```bash
cd client
npm install  # Only if first time
npm start
```

**Expected Output:**
```
> react-scripts start
webpack compiled successfully
Compiled successfully!
You can now view client in the browser.
  Local:  http://localhost:3000
```

**✅ Open:** http://localhost:3000

**🔓 Demo Login:**
- Email: `admin@example.com`
- Password: `password`

---

## 🐛 If Frontend Won't Start

### Error 1: "Port 3000 already in use"
```bash
# Kill existing process
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Then try again
npm start
```

### Error 2: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error 3: "Cannot find apiClient"
```bash
# Verify file exists
ls src/services/apiClient.js

# If missing, file should auto-exist from setup
# Check SETUP.md for file structure
```

---

## 🧪 Testing Checklist

### ✅ Step 1: Login
1. Visit http://localhost:3000
2. Click "Auto-fill" button
3. Click "Login"
4. Should redirect to /inventory

### ✅ Step 2: Inventory Page
1. See table with 8 items
2. Try search: "Laptop"
3. Try filter: "Electronics"
4. Try sort: Different options

### ✅ Step 3: Test Modals
1. Click "Barang Masuk" button
   - Fill warehouse, product, qty, reference
   - Submit → should appear in Movements tab
2. Click "Barang Keluar" button
   - Fill warehouse, product, qty, recipient
   - Submit → stock should decrease
3. Click "Transfer" button
   - Select from/to warehouse different
   - Submit → records transfer
4. Click "Tambah Item" button
   - Add new product
   - Should appear in table

### ✅ Step 4: Test Navigation
1. Click logo → back to inventory
2. Click profile icon → profile page
3. Click logout → redirect to login

### ✅ Step 5: Debug Page
1. Visit http://localhost:3000/debug
2. Click "Run All Tests"
3. All should show ✅ Pass

---

## 🔌 Full Backend Setup (Optional for Now)

### Prerequisites
- PostgreSQL 14+ installed and running
- Node.js 18+ on backend folder

### Steps

**1. PostgreSQL Setup**
```bash
# Create database
createdb warehouse_admin

# Or use GUI/PgAdmin
```

**2. Backend Setup**
```bash
cd backend

# Copy environment
cp .env.example .env

# Edit .env
# DATABASE_URL="postgresql://postgres:password@localhost:5432/warehouse_admin"
# JWT_SECRET="your-secret-key"

# Install dependencies
npm install

# Run migrations
npm run db:push

# Start backend
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345 - 02/18/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 02/18/2026, 10:30:01 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345 - 02/18/2026, 10:30:01 AM     LOG [RoutesResolver] AuthController
[Nest] 12345 - 02/18/2026, 10:30:01 AM     LOG [Nest] Nest application successfully started
```

**3. Enable Real API in Frontend**
```bash
cd client

# Create .env file
echo "REACT_APP_USE_REAL_API=true" > .env

# Restart npm
npm start
```

**4. Test Full Stack**
- Login should hit real database
- All data persists after refresh
- Profile shows real user from DB

---

## 📊 Debug Features

### Available at http://localhost:3000/debug

**Status Dashboard:**
- ✅ Mock Mode check
- ✅ Token verification
- ✅ User data check
- ✅ API base URL info

**API Test Suite:**
- ✅ Mock Login test
- ✅ Mock Profile test
- ✅ Mock Inventory test
- ✅ Add Item test
- ✅ Add Movement test

**Running Tests:**
1. Go to http://localhost:3000/debug
2. Click "Run All Tests" button
3. See results in real-time

---

## 📋 File Structure Check

```
✅ client/src/
  ✅ pages/
    ✅ LoginPage.js
    ✅ ProfilePage.js
    ✅ InventoryPage.js
    ✅ DebugPage.js
  ✅ components/
    ✅ Navbar.js
    ✅ AddItemModal.js
    ✅ InboundModal.js
    ✅ OutboundModal.js
    ✅ TransferModal.js
    ✅ ProtectedRoute.js
  ✅ services/
    ✅ apiClient.js
  ✅ App.js
  ✅ App.css
  ✅ index.css

⏳ backend/src/
  ⏳ modules/auth/
  ⏳ modules/inventory/
  ⏳ database/
```

---

## 🔑 Important Environment Variables

**Frontend (.env - optional):**
```env
REACT_APP_USE_REAL_API=true    # Enable real backend (default: false for mock)
```

**Backend (.env - required for real backend):**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/warehouse_admin
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

---

## 🎯 Common Workflows

### Workflow 1: Quick UI Testing (⭐ Recommended NOW)
```bash
cd client
npm start
# Go to http://localhost:3000
# Login with admin@example.com / password
# Test all UI features
```
**Time:** 2 minutes
**No backend needed:** ✅

### Workflow 2: Full Stack Development
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd client
REACT_APP_USE_REAL_API=true npm start
```
**Time:** 5 minutes
**Backend needed:** ✅
**Database needed:** ✅

### Workflow 3: Debugging
```bash
cd client
npm start
# Go to http://localhost:3000/debug
# Run tests
# Check console (F12)
# Check Network tab for API calls
```

---

## ⚡ Performance Tips

**Frontend:**
- Mock mode is instant (300ms simulated delay)
- Real API depends on backend speed
- Disable browser DevTools for faster startup

**Backend (when running):**
- First startup slower (modules initialization)
- Hot reload with `npm run start:dev`
- Check database connection if slow

---

## 🆘 Emergency Solutions

### "Everything broken, start fresh"
```bash
# Clear everything
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Reinstall
cd client && npm install && npm start
```

### "Frontend loads but shows nothing"
1. Check browser console: F12 → Console
2. Check for JavaScript errors
3. Try http://localhost:3000/debug
4. Try clearing cache: Ctrl+Shift+R or Cmd+Shift+R

### "Mock data not working"
1. Check localStorage: F12 → Storage → localStorage
2. Verify apiClient.js exists
3. Try http://localhost:3000/debug to test
4. Clear browser storage: F12 → Storage → Clear All

### "Backend won't start"
1. Check PostgreSQL: `psql --version`
2. Check Node: `node --version` (need 18+)
3. Check port 3000: `netstat -ano | findstr :3000`
4. Check .env file exists
5. Run: `npm run db:push`

---

## 📞 Getting Help

**Check These First:**
1. ✅ SETUP.md (comprehensive guide)
2. ✅ This file (troubleshooting)
3. ✅ /debug page (test API)
4. ✅ Browser console (F12)
5. ✅ Backend logs (terminal)

**Code References:**
- `apiClient.js` - All API calls
- `App.js` - Main routing
- `LoginPage.js` - Authentication flow
- `InventoryPage.js` - Main feature

---

## 🎊 You're Ready!

```bash
cd client
npm start
```

Then open: http://localhost:3000

**Demo credentials:**
- Email: admin@example.com
- Password: password

🚀 Selamat mencoba!
