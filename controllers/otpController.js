import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { connectDB } from "../config/db";
import Otp from "../models/otpModel";
import adminModel from "../models/adminModel";
import { generateOtp } from "../utils/otpGenerator";
import { sendEmail } from "../utils/sendEmail";
import { sendSms } from "../utils/sendSms";

export const sendOtp = async (req) => {
  try {
    await connectDB();

    const { email, phone } = await req.json();

    // ── 1. Validate ─────────────────────────────────────────────────────
    if (!email || !phone) {
      return NextResponse.json(
        { success: false, message: "Email and phone are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── 2. Check if already registered ─────────────────────────────────
    const [emailExists, phoneExists] = await Promise.all([
      adminModel.findOne({ email: normalizedEmail }),
      adminModel.findOne({ phone }),
    ]);

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    if (phoneExists) {
      return NextResponse.json(
        { success: false, message: "Phone number is already registered" },
        { status: 409 }
      );
    }

    // ── 3. Rate limiting: 1 OTP per 60 seconds ──────────────────────────
    const recentOtp = await Otp.findOne({ email: normalizedEmail });
    if (recentOtp) {
      const ageInSeconds =
        (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
      if (ageInSeconds < 60) {
        const waitSeconds = Math.ceil(60 - ageInSeconds);
        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
          },
          { status: 429 }
        );
      }
    }

    // ── 4. Generate OTPs ────────────────────────────────────────────────
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();

    // ── 5. Hash OTPs before storing ─────────────────────────────────────
    const [hashedEmailOtp, hashedPhoneOtp] = await Promise.all([
      bcrypt.hash(emailOtp, 10),
      bcrypt.hash(phoneOtp, 10),
    ]);

    // ── 6. Delete old record, save new ──────────────────────────────────
    await Otp.deleteMany({ email: normalizedEmail });

    await Otp.create({
      email: normalizedEmail,
      phone,
      emailOtp: hashedEmailOtp,
      phoneOtp: hashedPhoneOtp,
    });

    // ── 7. Send OTPs in parallel ────────────────────────────────────────
    await Promise.all([
      sendEmail(normalizedEmail, emailOtp),
      sendSms(phone, phoneOtp),
    ]);

    return NextResponse.json(
      { success: true, message: "OTP sent successfully to your email and phone" },
      { status: 200 }
    );

  } catch (error) {
    console.error("sendOtp error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};