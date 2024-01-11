const AppError = require("../utils/appErrorsClass");
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return next(new AppError(error.details, 400));
  }
};

module.exports = validate;
