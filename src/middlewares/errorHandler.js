const AppError = require("../utils/appErrorsClass");
const logger = require("../utils/logger");
const multer = require("multer");
//-------------------------------------------//
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleMulterError = (err, res) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "file is too large",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      message: "File limit Exceeded",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "File must be an image",
    });
  }
};
//-------------------------------------------//
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  } else {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const sendErrorTesting = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

//-------------------------------------------//
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  if (process.env.NODE_ENV.trim() === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err instanceof multer.MulterError) handleMulterError(err, res);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV.trim() === "development") {
    if (err instanceof multer.MulterError) handleMulterError(err, res);
    sendErrorDev(err, req, res);
    if (err instanceof multer.MulterError) handleMulterError(err, res);
  } else if (process.env.NODE_ENV.trim() === "test") {
    sendErrorTesting(err, req, res);
  } else {
    logger.error("Something went wrong on error handling middleware");
  }
};
