const { Telegraf } = require("telegraf");
const cron = require("node-cron");

// === Настройки бота ===
const BOT_TOKEN = process.env.BOT_TOKEN || "7978283866:AAGdNP0c6xZD8yVE8cpJh-c7Vuxrq3muEXQ";
const CHAT_ID = process.env.CHAT_ID || "143993786"; // можно удалить, если не нужна рассылка в группу

const bot = new Telegraf(BOT_TOKEN);

// === Список пользователей, нажавших /start ===
let users = [];

// === Дни рождения (берутся из файла birthdays.json) ===
let birthdays = require("./birthdays.json");

// === Команда /start ===
bot.start((ctx) => {
  const userId = ctx.from.id;
  if (!users.includes(userId)) {
    users.push(userId);
    ctx.replyWithSticker('CAACAgIAAxkBAAEDJGhkqUOv6FhPzXsVxQbMjZDlSfLW-wACBQADwDZPEzTovF6zJEHHLgQ');
    ctx.reply(`🎂✨ SweetiePieDay Bot ✨🎂\n👼 Я был создан, чтобы День рождения ни одного сладкого пирожочка не пролетел незамеченным 🍰💖`);
  } else {
    ctx.reply("Вы уже подписаны на напоминания! 🎉");
  }
});

// === Запуск бота ===
bot.launch();
console.log("SweetiePieDay Bot запущен...");

// === Ежедневная проверка дней рождения (в 9:00 по Москве) ===
cron.schedule("0 9 * * *", () => {
  const today = new Date().toISOString().slice(5, 10); // формат "дд-мм"
  const todayBirthdays = birthdays.filter(b => b.date === today);

  if (todayBirthdays.length > 0) {
    todayBirthdays.forEach(person => {
      const message = `🎉🎂 С Днём Рождения, ${person.name}! 🎈🍰\nПусть твой день будет таким же сладким, как ты сам(а)! 🥳`;
      users.forEach(userId => {
        bot.telegram.sendMessage(userId, message).catch(() => {});
      });
    });
  }
});
