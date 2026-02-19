@echo off
REM Quick Start Script for Warehouse Admin - Windows

echo.
echo ==================================
echo   Warehouse Admin - Quick Start
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ^❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo ^✅ Node.js version: %NODE_VER%
echo ^✅ npm version: %NPM_VER%
echo.

REM Navigate to client directory
cd client

REM Check if node_modules exists
if not exist "node_modules\" (
    echo ^📦 Installing dependencies...
    call npm install
    echo.
)

echo ^🎉 Starting frontend application...
echo ^📍 Open: http://localhost:3000
echo.
echo ^🔓 Demo Credentials:
echo    Email: admin@example.com
echo    Password: password
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the application
call npm start

pause
