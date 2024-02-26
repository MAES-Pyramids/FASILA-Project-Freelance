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

  const otpMessage = `Hello ${first_name}, we're glad you're here. Your Chat ID is , ${chatId} , use it to complete registration.`;

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

const sendResponseMessage = async (chatId, reply) => {
  const PublishMessage = `للدعاية و نشر الكتب يمكنك الاتصال علي رقم المكتبة

  +201029142392
  أو بوت
  @Assitant_fasilabot`;

  const SuggestMessage = `اقترح علينا شئ جديد😃

  تواصل عبر هذا البوت
  @Suggest_librarybot`;

  const ComplainMessage = `ما هي مشكلتك؟

  اكتب مشكلتك فى هذا البوت
  @Complain_fasilabot`;

  const PaymentMessage = `لتأكيد الدفع لازم تبعت البيانات دى كاملة:

  ١- سكرين شوت من رسالة التحويل (او صورة الايصال لو التحويل من ماكينة مثل فوري وامان ….)
  ٢- الرقم اللي تم التحويل منه (ضروري جدا)
  ٣- وقت التحويل
  ٤- الاسم كامل باللغة العربية (نفس الاسم فى الاكونت والفورم)
  ٥- الجامعة والسنة الدراسية (الفرقة)

  واللى مش هيبعت البيانات دى كاملة مش هنعتبر ده تأكيد للدفع

  🪧رجاءا فى رسالة واحدة☑️

  ارسل البيانات دي علي الاكونت دا👇
  @Fasila_Library`;

  let message;
  switch (reply) {
    case "payment":
      message = PaymentMessage;
      break;
    case "complain":
      message = ComplainMessage;
      break;
    case "suggest":
      message = SuggestMessage;
      break;
    case "publish":
      message = PublishMessage;
      break;
  }

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
    if (msg.text === "/payment") {
      await sendResponseMessage(msg.chat.id, "payment");
    }
    if (msg.text === "/complain") {
      await sendResponseMessage(msg.chat.id, "complain");
    }
    if (msg.text === "/suggest") {
      await sendResponseMessage(msg.chat.id, "suggest");
    }
    if (msg.text === "/publish") {
      await sendResponseMessage(msg.chat.id, "publish");
    }
  });
}
//------------------------------------------//
module.exports = { sendOTPMessage, startTelegramBot, bot };
