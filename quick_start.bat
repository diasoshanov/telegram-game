@echo off
echo ========================================
echo    Programming Match-3 Telegram Bot
echo ========================================
echo.

echo Проверка Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не установлен!
    echo Скачайте Python с https://python.org
    pause
    exit /b 1
)

echo ✅ Python найден!

echo.
echo Установка зависимостей...
pip install -r requirements.txt

echo.
echo Запуск бота...
python start_bot.py

pause 