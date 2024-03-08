const path = require("path");
const pino = require("pino");
const dayjs = require("dayjs");

const fileTransport = pino.transport({
  target: "pino/file",
  options: { destination: path.join(__dirname, "..", "..", "logs", "app.log") },
});

module.exports = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transporters: [fileTransport],
});
