const { verifyStudent } = require("../services/student.service");
const { getUserConnection } = require("../utils/redis");
const { verifyOTP } = require("../services/otp.service");
const { socketServer } = require("../utils/sockets");

const SK = process.env.Wasage_SecretKey;

exports.receiveOTP = async (req, res) => {
  const { OTP, Mobile, Reference, Secret, ClientID, ClientName } = req.query;
  if (Secret !== SK) return res.status(403).send("Invalid Secret Key");

  const { status, message, type } = await verifyOTP(Reference, OTP);
  if (!status) return res.status(403).send(message);

  const socketID = await getUserConnection(Reference);

  switch (type) {
    case "verify":
      const { status, message } = await verifyStudent(Reference, Mobile);
      if (socketID)
        socketServer.to(socketID).emit("otp-verification", { status, message });
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
