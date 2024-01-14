const Redis = require("ioredis");

// Replace 'your_redis_host' and 'your_redis_port' with the actual host and port of your Redis container
const redisHost = process.env.redisHost;
const redisPort = process.env.redisPort;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

async function updateUserConnection(userId, socketId, isConnected) {
  const connectionInfoString = JSON.stringify({
    socketId: socketId,
    isConnected: isConnected,
  });

  await redis.hset("user_sockets", userId, connectionInfoString);
}

async function getUserConnection(userId) {
  const connectionInfoString = await redis.hget("user_sockets", userId);

  if (connectionInfoString) return JSON.parse(connectionInfoString);
  else return null;
}

module.exports = { updateUserConnection, getUserConnection };
