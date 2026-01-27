@echo off
REM War Room - Quick Start (Windows)
REM This script installs dependencies and starts development servers

echo ================================
echo War Room - Development Start
echo ================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm is not installed!
    echo Please install pnpm: npm install -g pnpm
    echo.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Building packages...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Starting development servers...
echo.
echo Web app will be available at: http://localhost:3000
echo API server will be available at: http://localhost:3001 (if configured)
echo.
call pnpm dev

pause
