@echo off
echo ========================================
echo    Programming Match-3 Admin Panel
echo ========================================
echo.

echo Проверка Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден!
    echo Установите Python с https://python.org
    echo Убедитесь, что Python добавлен в PATH
    pause
    exit /b 1
)

echo ✅ Python найден!

echo.
echo Проверка файлов...
if not exist "results_server.py" (
    echo ❌ Файл results_server.py не найден!
    pause
    exit /b 1
)

if not exist "admin_panel.html" (
    echo ❌ Файл admin_panel.html не найден!
    pause
    exit /b 1
)

echo ✅ Все файлы найдены!

echo.
echo Запуск сервера на порту 8000...
echo.
echo После запуска сервера откройте:
echo http://localhost:8000
echo.
echo Нажмите Ctrl+C для остановки сервера
echo.

python results_server.py

pause 