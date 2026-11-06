@echo off
setlocal
cd /d "%~dp0"
title MKursy Platform Launcher

where powershell >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"
    if %ERRORLEVEL% EQU 0 goto :done
)

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting via Node.js fallback...
    node "%~dp0start.mjs"
    if %ERRORLEVEL% EQU 0 goto :done
)

echo.
echo [ERROR] Neither PowerShell nor Node.js could launch the project.
echo Please ensure Node.js is installed from https://nodejs.org/
echo.
pause

:done
endlocal
