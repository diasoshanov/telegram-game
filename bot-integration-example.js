// Пример интеграции игры "Programming Match-3" с Telegram Bot
// Используйте этот код в вашем Telegram Bot для обработки результатов игры

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

// Хранилище результатов (в реальном проекте используйте базу данных)
const gameResults = [];

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        inline_keyboard: [[
            {
                text: "🎮 Играть в Programming Match-3",
                web_app: { url: "https://your-domain.com/programming-match3-game" }
            }
        ]]
    };
    
    bot.sendMessage(chatId, 
        "Добро пожаловать в игру Programming Match-3! 🚀\n\n" +
        "🎯 Цель: Соберите как можно больше очков за 2 минуты\n" +
        "🎮 Механика: Составляйте линии из 3+ одинаковых иконок языков программирования\n" +
        "🏆 Победители: Топ-10 игроков с наивысшими очками\n\n" +
        "Нажмите кнопку ниже, чтобы начать игру!",
        { reply_markup: keyboard }
    );
});

// Обработка результатов игры
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name || msg.from.username || 'Неизвестный игрок';
    
    try {
        const gameResult = JSON.parse(msg.web_app_data.data);
        
        // Сохранение результата
        const result = {
            userId: userId,
            userName: userName,
            score: gameResult.score,
            time: gameResult.time,
            level: gameResult.level,
            timestamp: new Date()
        };
        
        gameResults.push(result);
        
        // Сортировка по очкам (по убыванию)
        gameResults.sort((a, b) => b.score - a.score);
        
        // Определение позиции игрока
        const playerPosition = gameResults.findIndex(r => r.userId === userId) + 1;
        
        // Формирование сообщения с результатом
        let message = `🎮 Результат игры: ${userName}\n\n`;
        message += `🏆 Очки: ${gameResult.score}\n`;
        message += `⏱️ Время: ${gameResult.time}\n`;
        message += `📈 Уровень: ${gameResult.level}\n`;
        message += `🏅 Позиция: ${playerPosition}\n\n`;
        
        // Показ топ-10 игроков
        message += "🏆 Топ-10 игроков:\n";
        const top10 = gameResults.slice(0, 10);
        top10.forEach((player, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
            message += `${medal} ${player.userName}: ${player.score} очков\n`;
        });
        
        // Дополнительные сообщения для топ-3
        if (playerPosition <= 3) {
            message += "\n🎉 Поздравляем! Вы в топ-3!";
        } else if (playerPosition <= 10) {
            message += "\n👍 Отличный результат! Вы в топ-10!";
        } else {
            message += "\n💪 Попробуйте еще раз, чтобы попасть в топ-10!";
        }
        
        // Кнопка для новой игры
        const keyboard = {
            inline_keyboard: [[
                {
                    text: "🎮 Играть снова",
                    web_app: { url: "https://your-domain.com/programming-match3-game" }
                }
            ]]
        };
        
        bot.sendMessage(chatId, message, { reply_markup: keyboard });
        
    } catch (error) {
        console.error('Ошибка при обработке результата игры:', error);
        bot.sendMessage(chatId, "❌ Произошла ошибка при обработке результата игры. Попробуйте еще раз.");
    }
});

// Команда для просмотра топ-10
bot.onText(/\/top/, (msg) => {
    const chatId = msg.chat.id;
    
    if (gameResults.length === 0) {
        bot.sendMessage(chatId, "📊 Пока нет результатов игр. Будьте первым! 🚀");
        return;
    }
    
    let message = "🏆 Топ-10 игроков:\n\n";
    const top10 = gameResults.slice(0, 10);
    
    top10.forEach((player, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
        const time = player.time || "N/A";
        message += `${medal} ${player.userName}\n`;
        message += `   Очки: ${player.score} | Время: ${time} | Уровень: ${player.level}\n\n`;
    });
    
    const keyboard = {
        inline_keyboard: [[
            {
                text: "🎮 Играть",
                web_app: { url: "https://your-domain.com/programming-match3-game" }
            }
        ]]
    };
    
    bot.sendMessage(chatId, message, { reply_markup: keyboard });
});

// Команда для сброса результатов (только для администраторов)
bot.onText(/\/reset/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Здесь можно добавить проверку на администратора
    // const isAdmin = ADMIN_IDS.includes(userId);
    
    gameResults.length = 0; // Очистка результатов
    bot.sendMessage(chatId, "🗑️ Все результаты игр сброшены.");
});

// Обработка ошибок
bot.on('error', (error) => {
    console.error('Ошибка Telegram Bot:', error);
});

bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

console.log('Telegram Bot запущен...');

// Пример интеграции с базой данных MongoDB
/*
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function saveGameResult(result) {
    try {
        await client.connect();
        const database = client.db('gameDB');
        const collection = database.collection('gameResults');
        
        await collection.insertOne(result);
        console.log('Результат сохранен в базу данных');
    } catch (error) {
        console.error('Ошибка сохранения в БД:', error);
    } finally {
        await client.close();
    }
}

async function getTopPlayers(limit = 10) {
    try {
        await client.connect();
        const database = client.db('gameDB');
        const collection = database.collection('gameResults');
        
        const topPlayers = await collection
            .find()
            .sort({ score: -1 })
            .limit(limit)
            .toArray();
            
        return topPlayers;
    } catch (error) {
        console.error('Ошибка получения топ игроков:', error);
        return [];
    } finally {
        await client.close();
    }
}
*/

module.exports = bot; 