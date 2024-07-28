require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.replyWithGame(process.env.GAME_SHORT_NAME);
});

bot.launch().then(() => {
  console.log('Бот запущен');
});