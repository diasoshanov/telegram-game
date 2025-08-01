#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой Python скрипт для запуска Telegram бота
Требует установки: pip install python-telegram-bot
"""

import json
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Конфигурация
BOT_TOKEN = "7819461914:AAHG0KojLn3yESSPunxToNYT9hyOzPOerTk"
GAME_URL = "https://t.me/kolesa_game_bot/Diasgame"  # URL вашего Web App

# Хранилище результатов (в памяти)
game_results = []

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка команды /start"""
    keyboard = [
        [InlineKeyboardButton("🎮 Играть в Programming Match-3", web_app={"url": GAME_URL})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    message = (
        "Добро пожаловать в игру Programming Match-3! 🚀\n\n"
        "🎯 Цель: Соберите как можно больше очков за 2 минуты\n"
        "🎮 Механика: Составляйте линии из 3+ одинаковых иконок языков программирования\n"
        "🏆 Победители: Топ-10 игроков с наивысшими очками\n\n"
        "Нажмите кнопку ниже, чтобы начать игру!"
    )
    
    await update.message.reply_text(message, reply_markup=reply_markup)

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка данных от Web App"""
    try:
        # Получаем данные от игры
        web_app_data = update.message.web_app_data.data
        game_result = json.loads(web_app_data)
        
        # Информация о пользователе
        user_id = update.effective_user.id
        user_name = update.effective_user.first_name or update.effective_user.username or 'Неизвестный игрок'
        
        # Сохраняем результат
        result = {
            "user_id": user_id,
            "user_name": user_name,
            "score": game_result.get("score", 0),
            "time": game_result.get("time", "00:00"),
            "timestamp": str(update.message.date)
        }
        
        # Добавляем в список результатов
        game_results.append(result)
        
        # Сортируем по очкам
        game_results.sort(key=lambda x: x["score"], reverse=True)
        
        # Находим позицию игрока
        player_position = next((i + 1 for i, r in enumerate(game_results) if r["user_id"] == user_id), len(game_results))
        
        # Формируем сообщение
        message = f"🎮 Результат игры: {user_name}\n\n"
        message += f"🏆 Очки: {result['score']}\n"
        message += f"⏱️ Время: {result['time']}\n"
        message += f"🏅 Позиция: {player_position}\n\n"
        
        # Показываем топ-10
        message += "🏆 Топ-10 игроков:\n"
        top_10 = game_results[:10]
        for i, player in enumerate(top_10):
            medal = "🥇" if i == 0 else "🥈" if i == 1 else "🥉" if i == 2 else f"{i + 1}."
            message += f"{medal} {player['user_name']}: {player['score']} очков\n"
        
        # Дополнительные сообщения
        if player_position <= 3:
            message += "\n🎉 Поздравляем! Вы в топ-3!"
        elif player_position <= 10:
            message += "\n👍 Отличный результат! Вы в топ-10!"
        else:
            message += "\n💪 Попробуйте еще раз, чтобы попасть в топ-10!"
        
        # Кнопка для новой игры
        keyboard = [
            [InlineKeyboardButton("🎮 Играть снова", web_app={"url": GAME_URL})]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(message, reply_markup=reply_markup)
        
    except Exception as e:
        print(f"Ошибка при обработке результата: {e}")
        await update.message.reply_text("❌ Произошла ошибка при обработке результата игры. Попробуйте еще раз.")

async def top_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда для просмотра топ-10"""
    if not game_results:
        await update.message.reply_text("📊 Пока нет результатов игр. Будьте первым! 🚀")
        return
    
    message = "🏆 Топ-10 игроков:\n\n"
    top_10 = game_results[:10]
    
    for i, player in enumerate(top_10):
        medal = "🥇" if i == 0 else "🥈" if i == 1 else "🥉" if i == 2 else f"{i + 1}."
        message += f"{medal} {player['user_name']}\n"
        message += f"   Очки: {player['score']} | Время: {player['time']}\n\n"
    
    keyboard = [
        [InlineKeyboardButton("🎮 Играть", web_app={"url": GAME_URL})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(message, reply_markup=reply_markup)

async def reset_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда для сброса результатов"""
    global game_results
    game_results.clear()
    await update.message.reply_text("🗑️ Все результаты игр сброшены.")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда помощи"""
    help_text = (
        "🤖 Команды бота:\n\n"
        "/start - Начать игру\n"
        "/top - Показать топ-10 игроков\n"
        "/reset - Сбросить все результаты\n"
        "/help - Показать эту справку\n\n"
        "🎮 Игра: Programming Match-3\n"
        "Собирайте линии из иконок языков программирования!"
    )
    await update.message.reply_text(help_text)

def main():
    """Основная функция"""
    print("🚀 Запуск Telegram бота...")
    print(f"🤖 Токен: {BOT_TOKEN[:10]}...")
    print(f"🎮 URL игры: {GAME_URL}")
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("top", top_command))
    application.add_handler(CommandHandler("reset", reset_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Запускаем бота
    print("✅ Бот запущен! Нажмите Ctrl+C для остановки.")
    application.run_polling()

if __name__ == "__main__":
    main() 