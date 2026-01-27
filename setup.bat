@echo off
echo.
echo ========================================
echo   WAR ROOM - Setup Script
echo ========================================
echo.

echo [1/5] Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm not found! Installing pnpm...
    npm install -g pnpm
)

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker not found! Please install Docker Desktop
    echo You can continue setup, but Docker is required to run exploits
)

echo [OK] Prerequisites check complete
echo.

echo [2/5] Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

echo [3/5] Setting up API environment...
if not exist "apps\api\.env" (
    copy "apps\api\.env.example" "apps\api\.env"
    echo [WARNING] Created apps\api\.env - Please add your GEMINI_API_KEY
) else (
    echo [OK] API .env already exists
)
echo.

echo [4/5] Setting up Web environment...
if not exist "apps\web\.env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > apps\web\.env.local
    echo [OK] Created apps\web\.env.local
) else (
    echo [OK] Web .env.local already exists
)
echo.

echo [5/5] Pulling Docker images...
docker pull python:3.11-slim 2>nul
docker pull alpine:latest 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Could not pull Docker images. Make sure Docker is running.
) else (
    echo [OK] Docker images ready
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Edit apps\api\.env and add your Gemini API key:
echo   GEMINI_API_KEY=your_key_here
echo.
echo Then run: pnpm dev
echo.
echo The app will be available at:
echo   - Web: http://localhost:3000
echo   - API: http://localhost:3001
echo.
pause
