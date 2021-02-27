import mongoose from "mongoose";

const otpSessionSchema = mongoose.Schema({
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  session: {
    type: String,
    required: true,
  },
});

const OtpSession = mongoose.model("otp_session", otpSessionSchema);

export default OtpSession;
