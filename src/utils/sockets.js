const { updateUserConnection } = require("./redis");
const listen = function (socketServer) {
  socketServer.on("connection", (socket) => {
    console.log("A user connected to WebSocket");
    const userId = socket.handshake.query.userId;
    updateUserConnection(userId, socket.id, true);

    socket.on("disconnect", async () => {
      console.log("User disconnected from WebSocket");
      await updateUserConnection(userId, socket.id, false);
    });
  });
};
module.exports = { listen };
