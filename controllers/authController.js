import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "../config/db";
import adminModel from "../models/adminModel";
import Otp from "../models/otpModel";
import sendOtp from "../utils/sendOtp";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const setTokenCookie = (response, token) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
};

/* ─────────────────────────────────────────
   STEP 1 — REGISTER
   Accepts all user details.
   Validates fields + duplicates.
   Internally calls sendOtp → sends email & SMS.
   Does NOT create the admin yet.
   Frontend must hold onto the form data
   until OTP is verified.
───────────────────────────────────────── */
export const registerUser = async (req) => {
  try {
    await connectDB();

    const { name, email, phone, username, password } = await req.json();

    // ── 1. Validate all fields ──────────────────────────────────────────
    if (!name || !email || !phone || !username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // ── 2. Duplicate checks ─────────────────────────────────────────────
    const [emailExists, usernameExists, phoneExists] = await Promise.all([
      adminModel.findOne({ email: normalizedEmail }),
      adminModel.findOne({ username: normalizedUsername }),
      adminModel.findOne({ phone }),
    ]);

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    if (usernameExists) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 409 }
      );
    }

    if (phoneExists) {
      return NextResponse.json(
        { success: false, message: "Phone number is already registered" },
        { status: 409 }
      );
    }

    // ── 3. Internally call sendOtp ──────────────────────────────────────
    //    Generates OTP, hashes it, stores in OTP collection,
    //    sends to email + phone. No user data stored here.
    await sendOtp(normalizedEmail, phone);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email and phone. Please verify to complete registration.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("registerUser error:", error);

    // Rate limit error thrown from sendOtp
    if (error.message.startsWith("Please wait")) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/* ─────────────────────────────────────────
   STEP 2 — VERIFY OTP
   Frontend sends all original form data
   again + the two OTPs.
   Verifies OTPs → if correct, creates admin.
   If wrong, user must try again (no re-send).
───────────────────────────────────────── */
export const verifyOtpAndRegister = async (req) => {
  try {
    await connectDB();

    const { name, email, phone, username, password, emailOtp, phoneOtp } =
      await req.json();

    // ── 1. Validate ─────────────────────────────────────────────────────
    if (!name || !email || !phone || !username || !password || !emailOtp || !phoneOtp) {
      return NextResponse.json(
        { success: false, message: "All fields and OTPs are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // ── 2. Find OTP record ──────────────────────────────────────────────
    const otpRecord = await Otp.findOne({ email: normalizedEmail, phone });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired. Please go back and request a new one.",
        },
        { status: 400 }
      );
    }

    // ── 3. Brute-force guard ────────────────────────────────────────────
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please go back and request a new OTP.",
        },
        { status: 429 }
      );
    }

    // ── 4. Verify email OTP ─────────────────────────────────────────────
    const emailOtpMatch = await bcrypt.compare(emailOtp, otpRecord.emailOtp);
    if (!emailOtpMatch) {
      await Otp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
      return NextResponse.json(
        { success: false, message: "Invalid email OTP. Please try again." },
        { status: 400 }
      );
    }

    // ── 5. Verify phone OTP ─────────────────────────────────────────────
    const phoneOtpMatch = await bcrypt.compare(phoneOtp, otpRecord.phoneOtp);
    if (!phoneOtpMatch) {
      await Otp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
      return NextResponse.json(
        { success: false, message: "Invalid phone OTP. Please try again." },
        { status: 400 }
      );
    }

    // ── 6. Final duplicate check ────────────────────────────────────────
    //    Edge case: someone registered the same email/username
    //    in the 5 minute OTP window
    const [emailExists, usernameExists, phoneExists] = await Promise.all([
      adminModel.findOne({ email: normalizedEmail }),
      adminModel.findOne({ username: normalizedUsername }),
      adminModel.findOne({ phone }),
    ]);

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    if (usernameExists) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 409 }
      );
    }

    if (phoneExists) {
      return NextResponse.json(
        { success: false, message: "Phone number is already registered" },
        { status: 409 }
      );
    }

    // ── 7. OTPs valid → hash password and create admin ──────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await adminModel.create({
      name,
      email: normalizedEmail,
      phone,
      username: normalizedUsername,
      password: hashedPassword,
    });

    // ── 8. Delete OTP record — no longer needed ─────────────────────────
    await Otp.deleteMany({ email: normalizedEmail });

    // ── 9. Issue token and respond ──────────────────────────────────────
    const token = generateToken(user._id);

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin registered successfully",
        user: sanitizeUser(user),
      },
      { status: 201 }
    );

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("verifyOtpAndRegister error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
export const loginUser = async (req) => {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── 1. Find user ────────────────────────────────────────────────────
    const user = await adminModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── 2. Verify password ──────────────────────────────────────────────
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── 3. Issue token and respond ──────────────────────────────────────
    const token = generateToken(user._id);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: sanitizeUser(user),
      },
      { status: 200 }
    );

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("loginUser error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/* ─────────────────────────────────────────
   LOGOUT
   Clears the httpOnly token cookie.
   No auth check needed — if cookie is
   already gone, clearing it is a no-op.
───────────────────────────────────────── */
export const logoutUser = async () => {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    )
 
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,   // expire immediately
      path: "/",
    })
 
    return response
 
  } catch (error) {
    console.error("logoutUser error:", error)
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    )
  }
}