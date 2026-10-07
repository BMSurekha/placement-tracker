@echo off
title Launch Placement Portal Full Stack
echo ========================================================
echo   Launching Student Placement Management Portal
echo ========================================================
echo.
echo 1. Starting MySQL Database...
start "MySQL Server" cmd /k "C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini --console"
timeout /t 3 /nobreak >nul

echo 2. Starting Spring Boot Backend (Port 8080)...
start "Backend - Spring Boot" cmd /k "cd /d C:\Users\surek\.gemini\antigravity\scratch\placement-portal\backend && C:\Users\surek\.m2\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"
timeout /t 5 /nobreak >nul

echo 3. Starting React Vite Frontend (Port 5173)...
start "Frontend - React Vite" cmd /k "cd /d C:\Users\surek\.gemini\antigravity\scratch\placement-portal\frontend && npm run dev"

echo.
echo All services launched!
echo Access the portal at: http://localhost:5173
echo.
pause
