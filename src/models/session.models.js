const mongoose = require("mongoose");
//------------------------------------------//
const sessionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Student", "Doctor", "Owner", "Library"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//--------------------Static Methods--------------------//
sessionsSchema.statics.invalidateSession = async function (sessionId) {
  await this.findOneAndUpdate({ _id: sessionId }, { valid: false });
};
sessionsSchema.statics.deleteSession = async function (sessionId) {
  await this.find(sessionId).deleteOne();
};
sessionsSchema.statics.checkSession = async function (sessionId) {
  const session = await this.findById(sessionId);
  return session.valid;
};
//-------------------------Export-----------------------//
const Session = mongoose.model("Session", sessionsSchema);
module.exports = Session;
