@echo off
REM War Room - Start Web App Only (Windows)

echo ================================
echo War Room - Web App Only
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
echo Starting Next.js web application...
echo Available at: http://localhost:3000
echo.
call pnpm --filter web dev

pause
