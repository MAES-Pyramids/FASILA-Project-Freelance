const Redis = require("ioredis");

const redisHost = process.env.redisHost;
const redisPort = process.env.redisPort;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

async function updateUserConnection(userId, socketId) {
  if (isConnected) await redis.hset("user_sockets", userId, socketId);
  else await redis.hdel("UserConnections", userId);
}

async function getUserConnection(userId) {
  const connectionInfoString = await redis.hget("user_sockets", userId);

  if (connectionInfoString) return JSON.parse(connectionInfoString);
  else return null;
}

module.exports = { updateUserConnection, getUserConnection };
