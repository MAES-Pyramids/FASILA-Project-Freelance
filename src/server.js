const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", "config.env") });

const http = require("http");
const logger = require("./utils/logger");

const socket = require("./utils/sockets");
const payment = require("./utils/payment");
// const { startTelegramBot } = require("./utils/telegramBot");
const { mongoConnect, mongoDisconnect } = require("./utils/mongoDB");
//------------------Listener----------------//
const port = process.env.PORT || 3000;
const app = require("./app");

const server = http.createServer(app);

(async function startServer() {
  // startTelegramBot();
  await mongoConnect();

  server.listen(port, () => {
    logger.info(
      `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`
    );
  });
  socket.listen(server);
})();
//------------Rejection Handling-------------//
// process.on("unhandledRejection", (err) => {
//   logger.fatal("UNHANDLED REJECTION! 💥 Shutting down...");
//   logger.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

process.on("SIGTERM", async () => {
  logger.error("👋 SIGTERM RECEIVED. Shutting down gracefully");
  try {
    await new Promise((resolve) => {
      // we need to roll back any ongoing transactions
      mongoDisconnect();
      server.close(() => {
        logger.error("💥 Server connections closed!");
        resolve();
      });
    });
    logger.error("💥 Process terminated gracefully!");
    process.exit(0);
  } catch (err) {
    logger.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
});
