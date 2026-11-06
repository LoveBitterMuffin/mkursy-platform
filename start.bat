@echo off
chcp 65001 >nul
title МКурсы — Запуск платформы

echo ======================================================
echo    МКурсы: Проверка зависимостей и запуск сервера
echo ======================================================
echo.

:: Попытка запуска через PowerShell (с богатым цветным выводом и проверкой)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"
if %ERRORLEVEL% EQU 0 goto :eof

:: Резервный запуск через Node.js, если PowerShell недоступен
echo.
echo [INFO] Запуск через Node.js (резервный режим)...
node "%~dp0start.mjs"
if %ERRORLEVEL% EQU 0 goto :eof

echo.
echo [ОШИБКА] Не удалось запустить сервер. Убедитесь, что Node.js установлен: https://nodejs.org/
pause
