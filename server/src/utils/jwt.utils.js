const jwt = require("jsonwebtoken");
const logger = require("./logger");

exports.signJWT = (object, privateSignedKey, options) => {
  return jwt.sign(object, privateSignedKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

exports.verifyJWT = (token, publicSignedKey) => {
  try {
    const decoded = jwt.verify(token, publicSignedKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
