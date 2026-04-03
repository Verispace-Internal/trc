import bcrypt from "bcrypt";
import Otp from "../models/otpModel";

const generateOtp = () => {
  return (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
};

const sendOtp = async (email, phone) => {
  // ── Rate limiting ──────────────────────────────────────────────────
  const recentOtp = await Otp.findOne({ email });
  if (recentOtp) {
    const ageInSeconds =
      (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
    if (ageInSeconds < 60) {
      const waitSeconds = Math.ceil(60 - ageInSeconds);
      throw new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP`);
    }
  }

  // ── DEV MODE: hardcoded OTP ────────────────────────────────────────
  const isDev = process.env.NODE_ENV !== "production";
  const emailOtp = isDev ? process.env.EMAIL_PIN : generateOtp();
  const phoneOtp = isDev ? process.env.PHONE_PIN : generateOtp();


  // ── Hash and store ─────────────────────────────────────────────────
  const [hashedEmailOtp, hashedPhoneOtp] = await Promise.all([
    bcrypt.hash(emailOtp, 10),
    bcrypt.hash(phoneOtp, 10),
  ]);

  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    phone,
    emailOtp: hashedEmailOtp,
    phoneOtp: hashedPhoneOtp,
  });

  // ── Only send in production ────────────────────────────────────────
  if (!isDev) {
    const { sendEmail } = await import("./sendEmail.js");
    const { sendSms } = await import("./sendSms.js");
    await Promise.all([
      sendEmail(email, emailOtp),
      sendSms(phone, phoneOtp),
    ]);
  }
};

export default sendOtp;