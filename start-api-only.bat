@echo off
REM War Room - Start API Only (Windows)

echo ================================
echo War Room - API Server Only
echo ================================
echo.

where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm is not installed!
    echo Please install pnpm: npm install -g pnpm
    pause
    exit /b 1
)

echo Installing dependencies...
call pnpm install

echo.
echo Starting Express API server...
echo Available at: http://localhost:3001 (if configured)
echo.
call pnpm --filter api dev

pause
