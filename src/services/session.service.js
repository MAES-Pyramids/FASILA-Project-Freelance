const _ = require("lodash");
const { findUser } = require("./user.service");
const SessionModel = require("../models/session.models");
const { signJWT, verifyJWT } = require("../utils/jwt.utils");

exports.createSession = async function (type, user, userAgent) {
  try {
    const session = await SessionModel.create({ user, userAgent, type });
    return { status: true, data: session.toJSON() };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.invalidateUserSessions = async function (userId) {
  try {
    await SessionModel.updateMany({ user: userId }, { valid: false });
    return { status: true, message: "Sessions invalidated successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.deleteSession = async function (sessionId) {
  try {
    await SessionModel.findById(sessionId).deleteOne();
    return { status: true, message: "Session deleted successfully" };
  } catch (err) {
    return { status: false, message: err.message };
  }
};

exports.checkExistingSession = async function (userId) {
  try {
    const session = await SessionModel.findOne({ user: userId, valid: true });
    return !!session;
  } catch (err) {
    return { status: "error", message: err.message };
  }
};

exports.reIssueAccessToken = async function (refreshToken) {
  const { decoded } = verifyJWT(
    refreshToken,
    process.env.refreshTokenPublicKey
  );

  if (!decoded || !_.get(decoded, "session")) return false;

  const session = await SessionModel.findById(_.get(decoded, "session"));
  if (!session || !session.valid) return false;

  let { status, data } = await findUser(decoded.role, { _id: session.user });
  if (!status) return false;

  const accessToken = signJWT(
    {
      ...data,
      role: decoded.role,
      session: session._id,
    },
    process.env.accessTokenPrivateKey,
    { expiresIn: process.env.accessTokenTtl }
  );

  return accessToken;
};
