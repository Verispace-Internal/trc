import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  emailOtp: {
    type: String,
    required: true,
  },

  phoneOtp: {
    type: String,
    required: true,
  },

  attempts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);