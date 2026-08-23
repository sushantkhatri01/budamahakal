@echo off
title BudaMahakal Driving School - Local Server
color 0A

echo.
echo  ==========================================
echo   BudaMahakal Driving School - Web Server
echo  ==========================================
echo.

:: Change to the website directory
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo.
    echo [INFO] Installing dependencies for the first time...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
)

:: Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
set LOCAL_IP=%LOCAL_IP: =%

echo.
echo [INFO] Starting server...
echo.

:: Start the server in background and open browser
start "" /B node server.js

:: Wait a moment for server to start
timeout /t 2 /nobreak >nul

:: Open browser
start "" "http://localhost:3000"

echo  ==========================================
echo   Server is running!
echo.
echo   Local:    http://localhost:3000
echo   Network:  http://%LOCAL_IP%:3000
echo.
echo   Admin:    http://localhost:3000/admin.html
echo.
echo   Press Ctrl+C to stop the server
echo  ==========================================
echo.

:: Keep window open and show server output
node server.js
