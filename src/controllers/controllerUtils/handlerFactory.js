const catchAsyncError = require("../../utils/catchAsyncErrors");
const AppError = require("../../utils/appErrorsClass");
//--------------------------------------------//
exports.getAll = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.find();
    if (!doc) return next(new AppError(`No ${Model} found at all`, 404));

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

exports.getOne = (Model) => {
  return catchAsyncError(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError(`No ${Model} found with that ID`, 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};
