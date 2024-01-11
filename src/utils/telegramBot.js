const logger = require("./logger");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
//------------------------------------------//
function logMessageSent(sent) {
  logger.info(
    `message sent successfully to ${sent.chat.first_name} ${sent.chat.last_name}`
  );
}

function logErrorMessage(error) {
  logger.error("Error sending OTP message:", error);
}
//------------------------------------------//
bot.on("message", handleMessage);

function handleMessage(msg) {
  if (msg.text === "/start") {
    sendWelcomeMessage(msg);
  }
}
//------------------------------------------//
sendWelcomeMessage = (msg) => {
  const chatId = msg.chat.id;
  const { first_name } = msg.chat;

  const otpMessage = `Hello ${first_name}, we're glad you're here. Your Chat ID is ${chatId}, use it to complete registration.`;

  bot
    .sendMessage(chatId, otpMessage)
    .then((sent) => {
      logMessageSent(sent);
    })
    .catch((error) => {
      logErrorMessage(error);
    });
};

sendOTPMessage = (chatId, OTP) => {
  const message = `Your OTP Code is ${OTP}, it's valid for 5 minutes. Please don't share it with anyone.`;
  bot
    .sendMessage(chatId, message)
    .then((sent) => {
      logMessageSent(sent);
    })
    .catch((error) => {
      logErrorMessage(error);
    });
};

module.exports = { sendOTPMessage, bot };
