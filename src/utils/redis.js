const Redis = require("ioredis");

const redisHost = process.env.redisHost;
const redisPort = process.env.redisPort;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
}); // remember to edit host based on environment so if we are using docker container for both server and redis we will use my-redis-container name as host

// const redis = new Redis(
//   "redis://default:6e50bbc933ee4249b18aab3cb8793fd0@us1-robust-whale-41582.upstash.io:41582"
// );

async function updateUserConnection(userId, socketId, isConnected) {
  if (isConnected)
    await redis.hset("user_sockets", userId, JSON.stringify(socketId));
  else await redis.hdel("user_sockets", userId);
}

async function getUserConnection(userId) {
  const socketId = await redis.hget("user_sockets", userId);

  if (socketId) return JSON.parse(socketId);
  else return null;
}

module.exports = { updateUserConnection, getUserConnection };
