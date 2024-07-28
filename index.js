require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Нажмите кнопку "Play", чтобы начать игру:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Play', url: 'https://musictokenplay.github.io/pony/' }]
      ]
    }
  });
});

bot.launch().then(() => {
  console.log('Бот запущен');
});
