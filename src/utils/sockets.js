const { updateUserConnection } = require("./redis");
const { Server } = require("socket.io");

const socketServer = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const listen = function (server) {
  socketServer.attach(server);
  socketServer.on("connection", async (socket) => {
    console.log("A user connected to WebSocket");
    const userId = socket.handshake.query.userId;

    await updateUserConnection(userId, socket.id, true);

    socket.on("disconnect", async () => {
      console.log("User disconnected from WebSocket");
      const userId = socket.handshake.query.userId;

      await updateUserConnection(userId, socket.id, false);
    });
  });
};
module.exports = { listen, socketServer };
