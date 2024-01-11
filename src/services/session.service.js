const SessionModel = require("../models/session.models");

exports.createSession = async (type, userId, userAgent) => {
  let session;
  switch (type) {
    case "Student":
      session = await SessionModel.create({
        Student: userId,
        userAgent,
        type,
      });

    case "Doctor":
      session = await SessionModel.create({
        Doctor: userId,
        userAgent,
        type,
      });

    case "Owner":
      session = await SessionModel.create({
        Owner: userId,
        userAgent,
        type,
      });

    case "Library":
      session = await SessionModel.create({
        Library: userId,
        userAgent,
        type,
      });
  }

  return session.toJSON();
};
