const AppError = require("../utils/appErrorsClass");
const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new AppError(`You don't have permission to perform this action!`, 403)
      );
    }
    next();
  };
};
module.exports = restrictedTo;
