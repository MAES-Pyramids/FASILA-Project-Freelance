const _ = require("lodash");
const { findUser } = require("./user.service");
const SessionModel = require("../models/session.models");
const { signJWT, verifyJWT } = require("../utils/jwt.utils");

exports.createSession = async (type, user, userAgent) => {
  const session = await SessionModel.create({ user, userAgent, type });
  return session.toJSON();
};

exports.invalidateSession = async function (sessionId) {
  await SessionModel.findOneAndUpdate({ _id: sessionId }, { valid: false });
};

exports.deleteSession = async function (sessionId) {
  await SessionModel.findById(sessionId).deleteOne();
};

exports.checkExistingSession = async function (userId) {
  const session = await SessionModel.findOne({ user: userId, valid: true });
  return !!session;
};

exports.reIssueAccessToken = async function (refreshToken) {
  const { decoded } = verifyJWT(
    refreshToken,
    process.env.refreshTokenPublicKey
  );

  if (!decoded || !_.get(decoded, "session")) return false;

  const session = await SessionModel.findById(_.get(decoded, "session"));
  if (!session || !session.valid) return false;

  const user = await findUser(decoded.role, { _id: session.user });
  if (!user) return false;

  const accessToken = signJWT(
    {
      ...{ ...user, refreshTokenPublicKey: session.role },
      session: session._id,
    },
    process.env.accessTokenPrivateKey,
    { expiresIn: process.env.accessTokenTtl }
  );

  return accessToken;
};
