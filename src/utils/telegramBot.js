const logger = require("./logger");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
//------------------------------------------//
const logMessageSent = (sent) => {
  logger.info(`message sent to ${sent.chat.first_name} ${sent.chat.last_name}`);
};
const logErrorMessage = (error) => {
  logger.error("Error sending OTP message:", error);
};

const sendWelcomeMessage = async (msg) => {
  const chatId = msg.chat.id;
  const { first_name } = msg.chat;

  const otpMessage = `Hello ${first_name}, we're glad you're here. Your Chat ID is ${chatId}, use it to complete registration.`;

  try {
    const sent = await bot.sendMessage(chatId, otpMessage);
    logMessageSent(sent);
  } catch (err) {
    logErrorMessage(err);
  }
};

const sendOTPMessage = async (chatId, OTP) => {
  const message = `Your OTP Code is ${OTP}, it's valid for ${process.env.OTP_TTL} minutes. Please don't share it with anyone.`;

  try {
    const sent = await bot.sendMessage(chatId, message);
    logMessageSent(sent);
  } catch (err) {
    logErrorMessage(err);
  }
};
//------------------------------------------//
function startTelegramBot() {
  bot.on("message", async (msg) => {
    if (msg.text === "/start") {
      await sendWelcomeMessage(msg);
    }
  });
}
//------------------------------------------//
module.exports = { sendOTPMessage, startTelegramBot, bot };
