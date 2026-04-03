import { createSlice } from "@reduxjs/toolkit"
import { sendOtpAction, verifyOtpAction, loginAction, logoutAction } from "../actions/authActions"

const initialState = {
  admin: null as object | null,
  loading: false,
  error: null as string | null,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    authAdmin: (state, action) => {
      state.admin = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // sendOtp
    builder.addCase(sendOtpAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(sendOtpAction.fulfilled, (state) => { state.loading = false })
    builder.addCase(sendOtpAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // verifyOtp
    builder.addCase(verifyOtpAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(verifyOtpAction.fulfilled, (state) => { state.loading = false })
    builder.addCase(verifyOtpAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // login
    builder.addCase(loginAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(loginAction.fulfilled, (state) => { state.loading = false })
    builder.addCase(loginAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

       // LOGOUT
    builder.addCase(logoutAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(logoutAction.fulfilled, (state) => { state.loading = false; state.admin = null })
    builder.addCase(logoutAction.rejected, (state, action) => {
      // Even if API fails, clear admin from store
      state.loading = false
      state.admin = null
      state.error = action.payload as string
    })
    },
})

export const { authAdmin, clearError } = adminSlice.actions
export default adminSlice.reducer