@echo off
echo ========================================
echo    Programming Match-3 Admin Panel
echo ========================================
echo.

echo Открытие автономной админ панели...
echo.

if exist "admin_panel_standalone.html" (
    start admin_panel_standalone.html
    echo ✅ Админ панель открыта в браузере!
    echo.
    echo Используйте кнопку "Загрузить файл" для загрузки результатов
    echo или "Тестовые данные" для демонстрации
) else (
    echo ❌ Файл admin_panel_standalone.html не найден!
    echo Убедитесь, что файл находится в той же папке
)

echo.
pause 