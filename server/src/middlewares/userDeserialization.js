const _ = require("lodash");
const { verifyJWT } = require("../utils/jwt.utils");
const { reIssueAccessToken } = require("../services/session.service");
const {
  isPassChangedAfter,
  isForceLogoutAfter,
} = require("../services/student.service");
const {
  isAccountSuspendedOrUnVerified,
} = require("../services/student.service");

const DeserializeUser = async (req, res, next) => {
  let accessToken = _.get(req, "headers.authorization", "");
  accessToken = accessToken.replace(/^Bearer\s/, "");

  const refreshToken = _.get(req, "headers.x-refresh", "");

  if (!accessToken || accessToken == "") return next();

  const { decoded, expired } = verifyJWT(
    accessToken,
    process.env.accessTokenPublicKey
  );

  if (decoded) {
    if (decoded.role == "Student") {
      if (
        (await isPassChangedAfter(decoded._id, decoded.iat)) ||
        (await isForceLogoutAfter(decoded._id, decoded.iat)) ||
        (await isAccountSuspendedOrUnVerified(decoded._id))
      )
        return next();
    }

    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken !== "") {
    const newAccessToken = await reIssueAccessToken(refreshToken);
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.setHeader("Access-Control-Expose-Headers", "x-access-token");
    } else return next();

    const { decoded } = verifyJWT(
      newAccessToken,
      process.env.accessTokenPublicKey
    );

    res.locals.user = decoded;
    return next();
  }

  return next();
};

module.exports = DeserializeUser;
