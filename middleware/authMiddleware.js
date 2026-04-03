import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel";
import { connectDB } from "../config/db";

// ============================
// PROTECT (internal helper)
// Returns the user document or throws.
// Never returns a Response — callers handle that.
// ============================

export const protect = async (req) => {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  if (!decoded?.id) {
    throw new Error("Invalid token payload");
  }

  const user = await adminModel.findById(decoded.id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ============================
// CURRENT USER (internal helper)
// Returns the user document directly, or null on failure.
// Controllers check for null and return their own 401 response.
// ============================

export const currentUser = async (req) => {
  try {
    return await protect(req);
  } catch {
    return null;
  }
};