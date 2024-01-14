const axios = require("axios");

exports.sendOTP = async (req, res) => {
  const referenceId = "123456789";
  const baseURL = "https://wasage.com/api/otp/";
  const username =
    "294b0f2b65f4a132160ac090b894b435b87118e27b0d2968d7ba12c8cc5b0abf";
  const password =
    "6a7e11505c1f08a401aea49799b3131938f070987d589a29a3708c91e05092e2";
  const message =
    "Welcome to App name, your OTP is :{OTP} for help contact us:+201xxxxxx";

  try {
    const response = await axios.post(
      `${baseURL}?Username=${username}&Password=${password}&Reference=${referenceId}&Message=${message}`
    );

    // Handle success response
    const { Code, OTP, QR, Clickable } = response.data;
    console.log("Success Response:", { Code, OTP, QR, Clickable });

    // Implement your logic for QR code or clickable URL

    res.send(Clickable);
  } catch (error) {
    // Handle error response
    console.error("Error Response:", error.response.data);
    return { success: false, error: error.response.data };
  }
};
