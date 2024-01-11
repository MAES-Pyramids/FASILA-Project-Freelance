const AppError = require("../utils/appErrorsClass");
const requireUser = (req, res, next) => {
  const user = res.locals.user;
  if (!user) return next(new AppError("user need to login", 403));
  return next();
};

module.exports = requireUser;
