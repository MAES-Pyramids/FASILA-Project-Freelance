const { verifyJWT } = require("../utils/jwt.utils");
const _ = require("lodash");

const DeserializeUser = async (req, res, next) => {
  let accessToken = _.get(req, "headers.authorization", "");
  accessToken = accessToken.replace(/^Bearer\s/, "");
  const refreshToken = _.get(req, "headers.x-refresh", "");

  if (!accessToken) return next();

  const { decoded, expired } = verifyJWT(
    accessToken,
    process.env.accessTokenPublicKey
  );

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  return next();
};

module.exports = DeserializeUser;
