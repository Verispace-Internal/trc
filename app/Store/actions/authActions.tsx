import { createAsyncThunk } from "@reduxjs/toolkit"
import { authAdmin } from "../reducers/authSlice"

// ── Register Step 1: Send OTP ─────────────────────────────────────────
export const sendOtpAction = createAsyncThunk(
  "auth/sendOtp",
  async (
    data: {
      name: string
      username: string
      email: string
      phone: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        return rejectWithValue(json.message || "Failed to send OTP.")
      }
      return json
    } catch {
      return rejectWithValue("Network error. Please check your connection.")
    }
  }
)

// ── Register Step 2: Verify OTP & Create Admin ────────────────────────
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async (
    data: {
      name: string
      username: string
      email: string
      phone: string
      password: string
      emailOtp: string
      phoneOtp: string
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        return rejectWithValue(json.message || "OTP verification failed.")
      }
      dispatch(authAdmin(json.user))
      return json
    } catch {
      return rejectWithValue("Network error. Please check your connection.")
    }
  }
)

// ── Login ─────────────────────────────────────────────────────────────
export const loginAction = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        return rejectWithValue(json.message || "Invalid email or password.")
      }
      dispatch(authAdmin(json.user))
      return json
    } catch {
      return rejectWithValue("Network error. Please check your connection.")
    }
  }
)

// ── Logout ────────────────────────────────────────────────────────────
export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Logout failed.")
      return true
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)