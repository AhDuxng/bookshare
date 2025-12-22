@echo off
echo ========================================
echo   Stopping All Processes...
echo ========================================
echo.

taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo ✓ All Node.js processes stopped
) else (
    echo ℹ No Node.js processes found
)

timeout /t 2 >nul

echo.
echo ========================================
echo   Starting Development Environment
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
echo Press Ctrl+C to stop all processes
echo ========================================
echo.

npm run dev
