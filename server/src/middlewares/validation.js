const AppError = require("../utils/appErrorsClass");

const validationMiddleWare = (schema) => (req, res, next) => {
  const validationResult = schema.validate({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (validationResult.error)
    return next(
      new AppError(
        validationResult.error.details.map((err) => {
          return err.message;
        })
      )
    );

  next();
};

module.exports = validationMiddleWare;
