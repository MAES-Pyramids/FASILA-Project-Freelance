const path = require("path");
const dotenv = require("dotenv");
const bot = require("./utils/telegramBot");
const { mongoConnect, mongoDisconnect } = require("./utils/mongoDB");
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, "..", "config.env") });
//------------------Listener-----------------//
const port = process.env.PORT || 3000;
const app = require("./app");
let server;
(async function startServer() {
  await mongoConnect();

  server = app.listen(port, () => {
    console.log(
      `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`
    );
  });
})();
//------------Rejection Handling-------------//
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", async () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");

  try {
    await new Promise((resolve) => {
      // we need to roll back any ongoing transactions
      mongoDisconnect();
      server.close(() => {
        console.log("💥 Server connections closed!");
        resolve();
      });
    });
    console.log("💥 Process terminated gracefully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
});
