# FSM Simulator - Installation & Setup Guide

## System Requirements

- **Node.js**: 16.0.0 or higher
- **npm**: 7.0.0 or higher
- **RAM**: 2GB minimum
- **Disk Space**: 500MB (with dependencies)

Verify installation:
```bash
node --version
npm --version
```

## One-Time Setup

### 1. Clone/Download the Project

```bash
cd path/to/project
cd fsm-simulator
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output:
```
added XXX packages, audited XXX packages in XXXs
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Expected output:
```
added XXX packages, audited XXX packages in XXXs
```

### 4. Verify Environment Setup

Return to project root:
```bash
cd ..
```

You should have this structure:
```
fsm-simulator/
├── backend/
│   ├── node_modules/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── node_modules/
│   ├── src/
│   └── package.json
├── README.md
└── .gitignore
```

## Running the Application

### Method 1: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
FSM Simulator Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view fsm-simulator-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://xxx.xxx.xxx.xxx:3000
```

**Then** open browser to: `http://localhost:3000`

### Method 2: Single Terminal (Sequentially)

If you prefer running both in sequence:

```bash
# Start backend first
cd backend
npm run dev &

# Wait ~3 seconds, then in another terminal:
cd frontend
npm start
```

## Verification Checklist

After starting both servers:

- [ ] Backend API responds: `curl http://localhost:5000/api/health`
  - Should return: `{"status":"Server is running"}`

- [ ] Frontend loads: Open `http://localhost:3000` in browser
  - Should show: "FSM Simulator" header with empty workspace

- [ ] Can create machine: Click "+ New Machine" button
  - Should show dialog to name and select type

- [ ] Can load examples: Check right panel "Machine Library"
  - Should show: Traffic Light, Vending Machine, Parity Checker

## Troubleshooting

### Backend fails to start

**Error**: "Port 5000 already in use"
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (get PID from above)
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

**Error**: "Cannot find module 'express'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error**: "Cannot find src/index.js"
```bash
# The entry point is src/app.js, make sure you're running from backend directory
cd backend
npm run dev
```

### Frontend fails to start

**Error**: "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm start
```

**Error**: "EACCES: permission denied"
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

### Connection issues between frontend and backend

**Error**: "Network error" or "Cannot reach API"
```bash
# 1. Verify backend is running
curl http://localhost:5000/api/health

# 2. Check .env file has correct URL
cat frontend/.env
# Should show: REACT_APP_API_URL=http://localhost:5000/api

# 3. Check CORS - backend already allows all origins
# This is configured in backend/src/index.js
```

### Blank page or "No machine selected"

```bash
# This is normal on first load
# 1. Click "+ New Machine"
# 2. Or select an example from Machine Library (right panel)
# 3. Examples load automatically if backend is running
```

## Development Notes

### File Watching & Hot Reload
- **Backend**: Nodemon watches for changes and auto-restarts
- **Frontend**: Create React App watches for changes and hot-reloads
- Just save files - changes should appear immediately

### Testing the API Manually

Using curl:
```bash
# Get all machines
curl http://localhost:5000/api/machines

# Create a machine
curl -X POST http://localhost:5000/api/machines \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","type":"moore"}'

# Get simulation result
curl -X POST http://localhost:5000/api/machines/MACHINE_ID/simulate \
  -H "Content-Type: application/json" \
  -d '{"input":"101"}'
```

Or use tools:
- **Postman**: GUI for API testing
- **Insomnia**: REST client
- **VS Code REST Client**: Install extension, create `.http` file

## Stopping the Application

### In Terminal with Backend
```bash
Press Ctrl+C
```

### In Terminal with Frontend
```bash
Press Ctrl+C
```

### Kill by Port
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

## Next Steps

1. **Create Your First FSM**: Click "+ New Machine" and build a simple state machine
2. **Explore Examples**: Load pre-built examples to understand the UI
3. **Read Documentation**: See main `README.md` for detailed guides
4. **Customize**: Modify code as needed for your use case

## Docker (Optional)

To run with Docker (if Dockerfile is provided):

```bash
# Build image
docker build -t fsm-simulator .

# Run container
docker run -p 3000:3000 -p 5000:5000 fsm-simulator
```

## Performance Tips

- Keep FSMs under 50 states for best visualization performance
- Avoid very long input strings (>1000 characters)
- Browser DevTools: Monitor memory and CPU during large simulations

## Getting Help

1. Check `README.md` in root directory
2. Check `README.md` in `backend/` and `frontend/` directories
3. Check browser console for error messages (F12)
4. Check terminal output for backend errors
5. Review code comments in relevant files

---

**Happy FSM Simulating! 🚀**
