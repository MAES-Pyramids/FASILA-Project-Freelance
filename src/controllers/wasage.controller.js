const axios = require("axios");
const AppError = require("../utils/appErrorsClass");
const catchAsync = require("../utils/catchAsyncErrors");
const { storeOTP } = require("../services/otp.service");

const baseURL = process.env.Wasage_baseURL;
const Wasage_Username = process.env.Wasage_Username;
const Wasage_Password = process.env.Wasage_Password;
const welcomeMessage = process.env.Wasage_welcomeMessage;

exports.getOTP = catchAsync(async (req, res) => {
  const { id } = req.body;

  const response = await axios.post(
    `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${welcomeMessage}`
  );

  if (response.data.Code != 5500)
    return next(new AppError("Error sending OTP", 500));

  const { OTP, QR, Clickable } = response.data;
  await storeOTP(referenceId, OTP, "verify");

  res.send({
    status: "success",
    data: { QR, Clickable },
  });
});
