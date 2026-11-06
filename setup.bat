@echo off
setlocal
title MKursy Installer & Updater

echo ======================================================
echo    MKursy: Automated Installation to Drive C:\
echo ======================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-RestMethod https://raw.githubusercontent.com/LoveBitterMuffin/mkursy-platform/main/setup.ps1 | Invoke-Expression"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed.
    pause
)
endlocal
