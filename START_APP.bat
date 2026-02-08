@echo off
echo ===========================================
echo   JMC-TEST PROFESSIONAL PORTAL - LAUNCHER
echo ===========================================
echo.
echo [1/3] Checking dependencies...
if not exist "backend\node_modules" (
    echo    Installing backend packages... This may take a minute.
    cd backend
    call npm install
    cd ..
) else (
    echo    Dependencies verified.
)

echo.
echo [2/3] Starting Database Server...
start "JMC-TEST Backend" /min cmd /k "cd backend && npm start"
timeout /t 5 >nul

echo.
echo [3/3] Opening Application...
start "" "index.html"

echo.
echo ===========================================
echo   SUCCESS! The portal is running.
echo   - Backend Server is running in a minimal window.
echo   - Your default browser has opened the portal.
echo   - Close this window or the minimized server window to stop.
echo ===========================================
pause
