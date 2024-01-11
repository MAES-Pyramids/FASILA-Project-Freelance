const path = require("path");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

const { mongoConnect, mongoDisconnect } = require("./utils/mongoDB");
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, "..", "config.env") });
//------------------Listener----------------//
const port = process.env.PORT || 3000;
const app = require("./app");
let server;
(async function startServer() {
  await mongoConnect();
  const bot = require("./utils/telegramBot");

  server = app.listen(port, () => {
    logger.info(
      `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`
    );
  });
})();
//------------Rejection Handling-------------//
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

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
