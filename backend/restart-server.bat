@echo off
REM Restart server script for Windows

echo Stopping existing server...
taskkill //F //FI "WINDOWTITLE eq node server.js" 2>nul
taskkill //F //FI "IMAGENAME eq node.exe" //FI "WINDOWTITLE eq server.js" 2>nul
netstat -ano | findstr :3000 | findstr LISTENING
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill //F //PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo Starting server...
cd /d "%~dp0"
node server.js
