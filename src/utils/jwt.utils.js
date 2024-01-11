const jwt = require("jsonwebtoken");
const logger = require("./logger");

exports.signJWT = (object, configKey, options) => {
  // const signingKey = Buffer.from(configKey, "base64").toString("ascii");

  return jwt.sign(object, configKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

exports.verifyJWT = (token, configKey) => {
  // const publicKey = Buffer.from(configKey, "base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, configKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    logger.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
