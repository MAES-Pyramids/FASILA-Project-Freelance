const SessionModel = require("../models/session.models");

exports.createSession = async (type, user, userAgent) => {
  const session = await SessionModel.create({ user, userAgent, type });
  return session.toJSON();
};
