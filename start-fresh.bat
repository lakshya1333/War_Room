@echo off
REM War Room - Fresh Start (Windows)
REM Cleans all dependencies and rebuilds from scratch

echo ================================
echo War Room - Fresh Installation
echo ================================
echo.
echo WARNING: This will delete all node_modules and build artifacts!
echo.
pause

echo [1/4] Removing node_modules...
for /d /r . %%d in (node_modules) do @if exist "%%d" rd /s /q "%%d"

echo [2/4] Removing build artifacts...
if exist "apps\web\.next" rd /s /q "apps\web\.next"
if exist "apps\web\out" rd /s /q "apps\web\out"

echo [3/4] Installing dependencies...
call pnpm install

echo [4/4] Building packages...
call pnpm build

echo.
echo ================================
echo Fresh installation complete!
echo Run start.bat to begin development
echo ================================
pause
