@echo off
echo ========================================
echo    Programming Match-3 Admin Panel
echo ========================================
echo.

echo Поиск Python...

REM Попробуем разные команды Python
set PYTHON_CMD=

echo Попытка 1: python
python --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    goto :found_python
)

echo Попытка 2: py
py --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto :found_python
)

echo Попытка 3: python3
python3 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3
    goto :found_python
)

echo Попытка 4: python3.9
python3.9 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3.9
    goto :found_python
)

echo Попытка 5: python3.8
python3.8 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3.8
    goto :found_python
)

echo ❌ Python не найден!
echo.
echo Установите Python с https://python.org
echo Убедитесь, что Python добавлен в PATH
echo.
echo Альтернативно, можете:
echo 1. Открыть admin_panel.html в браузере напрямую
echo 2. Использовать любой веб-сервер
echo.
pause
exit /b 1

:found_python
echo ✅ Python найден: %PYTHON_CMD%

echo.
echo Проверка файлов...
if not exist "simple_server.py" (
    echo ❌ Файл simple_server.py не найден!
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

%PYTHON_CMD% simple_server.py

pause 