# 🚀 Инструкции по настройке Telegram Mini App

## 📋 Что уже готово:
✅ API токен бота: `7819461914:AAHG0KojLn3yESSPunxToNYT9hyOzPOerTk`  
✅ Код игры обновлен с вашим токеном  
✅ URL настроен для GitHub Pages  

## 🔧 Шаг 1: Установка Node.js и npm

### Для Windows:
1. Скачайте Node.js с [официального сайта](https://nodejs.org/)
2. Установите LTS версию
3. Перезапустите PowerShell/командную строку

### Проверка установки:
```bash
node --version
npm --version
```

## 🌐 Шаг 2: Размещение игры на GitHub Pages

### Вариант A: GitHub Pages (рекомендуется)
1. Создайте репозиторий на GitHub: `programming-match3-game`
2. Загрузите все файлы проекта
3. В настройках репозитория включите GitHub Pages
4. URL будет: `https://ваш-username.github.io/programming-match3-game`

### Вариант B: Vercel (альтернатива)
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Автоматический деплой

### Вариант C: Netlify
1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Загрузите файлы через drag & drop
3. Получите URL вида: `https://random-name.netlify.app`

## 🤖 Шаг 3: Настройка Telegram Bot

### 3.1 Установка зависимостей:
```bash
npm install
```

### 3.2 Запуск бота:
```bash
node bot-integration-example.js
```

### 3.3 Настройка Web App в BotFather:
1. Отправьте `/newapp` в @BotFather
2. Выберите вашего бота
3. Введите название: `Programming Match-3 Game`
4. Введите описание: `Игра "три в ряд" с иконками языков программирования`
5. Загрузите фото: `images/python.svg` (или любую иконку)
6. Введите URL: `https://ваш-username.github.io/programming-match3-game`

## 🎮 Шаг 4: Тестирование

### 4.1 Запустите бота:
```bash
node bot-integration-example.js
```

### 4.2 Протестируйте в Telegram:
1. Найдите вашего бота по токену
2. Отправьте `/start`
3. Нажмите кнопку "🎮 Играть в Programming Match-3"
4. Играйте и проверьте отправку результатов

## 🔧 Альтернативный запуск без Node.js

Если не хотите устанавливать Node.js, можете использовать:

### 1. Онлайн сервисы:
- [Glitch.com](https://glitch.com) - бесплатный хостинг с Node.js
- [Replit.com](https://replit.com) - онлайн IDE с поддержкой Node.js

### 2. Локальный сервер Python:
```python
# server.py
import http.server
import socketserver

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Сервер запущен на порту {PORT}")
    httpd.serve_forever()
```

## 📱 Настройка Web App в BotFather

После размещения игры на хостинге:

1. **Откройте @BotFather в Telegram**
2. **Отправьте команду:** `/newapp`
3. **Выберите вашего бота**
4. **Заполните форму:**
   - **Название:** Programming Match-3 Game
   - **Описание:** Игра "три в ряд" с иконками языков программирования
   - **Фото:** Загрузите любую иконку из папки images/
   - **URL:** `https://ваш-username.github.io/programming-match3-game`
   - **Короткое название:** Match3

## 🎯 Готово!

После выполнения всех шагов:
- ✅ Игра доступна по URL
- ✅ Бот работает и принимает команды
- ✅ Web App интегрирован в Telegram
- ✅ Результаты игр сохраняются и отображаются

## 🆘 Возможные проблемы:

### Проблема: "npm не распознано"
**Решение:** Установите Node.js с официального сайта

### Проблема: "Ошибка подключения к боту"
**Решение:** Проверьте правильность токена

### Проблема: "Игра не загружается"
**Решение:** Проверьте URL в настройках Web App

### Проблема: "Результаты не отправляются"
**Решение:** Убедитесь, что бот запущен и слушает сообщения

## 📞 Поддержка

Если возникнут вопросы, проверьте:
1. Правильность токена
2. Доступность URL игры
3. Запущен ли бот
4. Настройки Web App в BotFather 