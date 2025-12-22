@echo off
echo ========================================
echo   BookShare Server Manager
echo ========================================
echo.

:: Kill all existing node processes
echo [1/3] Stopping old server processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Stopped old processes
) else (
    echo      ℹ No old processes found
)

timeout /t 1 >nul

:: Check if port 3000 is free
echo [2/3] Checking port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo      ✗ Port 3000 is still in use!
    echo      Please wait a moment and try again.
    pause
    exit /b 1
) else (
    echo      ✓ Port 3000 is available
)

:: Start the server
echo [3/3] Starting server...
echo.
echo ========================================
echo   Server is starting...
echo   Press Ctrl+C to stop
echo ========================================
echo.

node index.js
