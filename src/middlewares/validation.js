const AppError = require("../utils/appErrorsClass");
function validation(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorObj = new AppError(error.details, 400);
      return next(errorObj);
    }
    next();
  };
}

module.exports = validation;
