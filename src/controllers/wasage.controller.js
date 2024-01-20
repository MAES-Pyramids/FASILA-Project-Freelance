const { storeOTP } = require("../services/otp.service");
const axios = require("axios");

const catchAsync = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

const baseURL = process.env.Wasage_baseURL;
const Wasage_Username = process.env.Wasage_Username;
const Wasage_Password = process.env.Wasage_Password;
const FLMessage = process.env.Wasage_forceLogoutMessage;
const RPMessage = process.env.Wasage_changePassMessage;
const WMessage = process.env.Wasage_welcomeMessage;

exports.getOTP = catchAsync(async (req, res) => {
  const { type } = req.query;
  const { id } = req.body;

  let URl;
  switch (type) {
    case "verify":
      URl = `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${WMessage}`;
      break;
    case "reset":
      URl = `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${RPMessage}`;
      break;
    case "force":
      URl = `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${FLMessage}`;
      break;
  }

  const response = await axios.post(URl);

  if (response.data.Code != 5500)
    return next(new AppError("Error sending OTP", 500));

  const { OTP, QR, Clickable } = response.data;
  const { status, message } = await storeOTP(id, OTP, type);
  if (!status) return next(new AppError(message, 500));

  res.send({
    status: "success",
    data: { QR, Clickable },
  });
});
