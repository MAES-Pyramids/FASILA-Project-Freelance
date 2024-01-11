const SessionModel = require("../models/session.models");

exports.createSession = async (type, user, userAgent) => {
  const session = await SessionModel.create({ user, userAgent, type });
  return session.toJSON();
};

exports.invalidateSession = async function (sessionId) {
  await SessionModel.findOneAndUpdate({ _id: sessionId }, { valid: false });
};

exports.deleteSession = async function (sessionId) {
  await SessionModel.find(sessionId).deleteOne();
};

exports.checkExistingSession = async function (userId) {
  const session = await SessionModel.findOne({ user: userId, valid: true });
  return !!session;
};
