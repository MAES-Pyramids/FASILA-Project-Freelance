const AppError = require("../utils/appErrorsClass");
function validation(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) return next(new AppError(error.details, 400));
    next();
  };
}

module.exports = validation;
