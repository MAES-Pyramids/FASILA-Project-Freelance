const { verifyStudent } = require("../services/student.service");
const { verifyOTP } = require("../services/otp.service");

const SK = process.env.Wasage_SecretKey;

exports.receiveOTP = async (req, res) => {
  const { OTP, Mobile, Reference, Secret, ClientID, ClientName } = req.query;
  if (Secret !== SK) res.status(403).send("Invalid Secret Key");

  const { status, message, type } = await verifyOTP(Reference, OTP);
  if (!status) res.status(403).send(message);

  switch (type) {
    case "verify":
      const { status, message } = await verifyStudent(Reference, Mobile);
      if (!status) console.log(message);
      break;

    case "reset":
      console.log("reset");
      break;

    case "Force":
      console.log("Force");
      break;
  }

  res.status(200).send("Callback received successfully");
};
