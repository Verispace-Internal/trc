import { createSlice } from "@reduxjs/toolkit"
import {
  createJoinRequestAction,
  getJoinRequestsAction,
  deleteJoinRequestAction,
  updateJoinRequestStatusAction,
  type JoinRequest,
} from "../actions/joinCommunityActions"

interface JoinCommunityState {
  requests: JoinRequest[]
  pagination: { total: number; page: number; limit: number; totalPages: number } | null
  loading: boolean
  submitLoading: boolean  // separate loader for form submission
  error: string | null
  submitSuccess: boolean  // true after successful form submit
}

const initialState: JoinCommunityState = {
  requests: [],
  pagination: null,
  loading: false,
  submitLoading: false,
  error: null,
  submitSuccess: false,
}

const joinCommunitySlice = createSlice({
  name: "joinCommunity",
  initialState,
  reducers: {
    clearJoinError: (state) => { state.error = null },
    clearSubmitSuccess: (state) => { state.submitSuccess = false },
  },
  extraReducers: (builder) => {

    // CREATE (submit form)
    builder.addCase(createJoinRequestAction.pending, (state) => {
      state.submitLoading = true
      state.error = null
      state.submitSuccess = false
    })
    builder.addCase(createJoinRequestAction.fulfilled, (state) => {
      state.submitLoading = false
      state.submitSuccess = true
    })
    builder.addCase(createJoinRequestAction.rejected, (state, action) => {
      state.submitLoading = false
      state.error = action.payload as string
    })

    // GET ALL (admin)
    builder.addCase(getJoinRequestsAction.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getJoinRequestsAction.fulfilled, (state, action) => {
      state.loading = false
      state.requests = action.payload.data
      state.pagination = action.payload.pagination
    })
    builder.addCase(getJoinRequestsAction.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // DELETE (admin)
    builder.addCase(deleteJoinRequestAction.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteJoinRequestAction.fulfilled, (state, action) => {
      state.loading = false
      state.requests = state.requests.filter(r => r._id !== action.payload)
    })
    builder.addCase(deleteJoinRequestAction.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // UPDATE STATUS (admin)
    builder.addCase(updateJoinRequestStatusAction.pending, (state) => {
      state.error = null
    })
    builder.addCase(updateJoinRequestStatusAction.fulfilled, (state, action) => {
      state.requests = state.requests.map(r =>
        r._id === action.payload._id ? action.payload : r
      )
    })
    builder.addCase(updateJoinRequestStatusAction.rejected, (state, action) => {
      state.error = action.payload as string
    })

  },
})

export const { clearJoinError, clearSubmitSuccess } = joinCommunitySlice.actions
export default joinCommunitySlice.reducer