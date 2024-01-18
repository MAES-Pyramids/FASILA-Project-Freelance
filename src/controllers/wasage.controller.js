const { storeOTP } = require("../services/otp.service");
const axios = require("axios");

const catchAsync = require("../utils/catchAsyncErrors");
const AppError = require("../utils/appErrorsClass");

const baseURL = process.env.Wasage_baseURL;
const Wasage_Username = process.env.Wasage_Username;
const Wasage_Password = process.env.Wasage_Password;
const welcomeMessage = process.env.Wasage_welcomeMessage;
const RestPassMessage = ` كود استعادة كلمة المرور الخاصة بك هو `;

exports.getOTP = catchAsync(async (req, res) => {
  const { type } = req.query;
  const { id } = req.body;

  const URl =
    type == "verify"
      ? `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${welcomeMessage}`
      : `${baseURL}?Username=${Wasage_Username}&Password=${Wasage_Password}&Reference=${id}&Message=${RestPassMessage}`;

  const response = await axios.post(URl);

  if (response.data.Code != 5500)
    return next(new AppError("Error sending OTP", 500));

  const { OTP, QR, Clickable } = response.data;
  await storeOTP(id, OTP, type);

  res.send({
    status: "success",
    data: { QR, Clickable },
  });
});
