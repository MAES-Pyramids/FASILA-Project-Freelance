const _ = require("lodash");
const { verifyJWT } = require("../utils/jwt.utils");
const { reIssueAccessToken } = require("../services/session.service");

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

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) res.setHeader("x-access-token", newAccessToken);

    const result = verifyJWT(newAccessToken, process.env.accessTokenPublicKey);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

module.exports = DeserializeUser;
