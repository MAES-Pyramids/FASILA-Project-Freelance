const path = require("path");
const dotenv = require("dotenv");
const bot = require("./utils/telegramBot");
const { mongoConnect } = require("./utils/mongoDB");
//------------------Config------------------//
dotenv.config({ path: path.join(__dirname, "..", "config.env") });
//------------------Listener-----------------//
const port = process.env.PORT || 3000;
const app = require("./app");

(async function startServer() {
  await mongoConnect();

  app.listen(port, () => {
    console.log(
      `Server listening on port ${port} in the ${process.env.NODE_ENV} mode`
    );
  });
})();
