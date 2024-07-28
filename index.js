require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработчик команды /start для отправки игровой кнопки
bot.start((ctx) => {
  ctx.replyWithGame(process.env.GAME_SHORT_NAME);
});

// Обработчик нажатия игровой кнопки
bot.action('play', (ctx) => {
  const gameUrl = `https://musictokenplay.github.io/pony/`; // URL вашей игры
  ctx.answerCallbackQuery({
    url: gameUrl
  });
});

// Ваша текущая логика...
// Пример: обработка текстовых сообщений
bot.on('text', (ctx) => {
  ctx.reply('Вы написали: ' + ctx.message.text);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен');
});
