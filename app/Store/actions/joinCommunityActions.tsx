import { createAsyncThunk } from "@reduxjs/toolkit"

export interface JoinRequest {
  _id: string
  businessName: string
  ownerName: string
  email: string
  phone: string
  city: string
  message: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

// ── Submit join request (public) ──────────────────────────────────────
export const createJoinRequestAction = createAsyncThunk(
  "joinCommunity/create",
  async (
    data: {
      businessName: string
      ownerName: string
      email: string
      phone: string
      city: string
      message?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/joincommunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to submit request.")
      return json.data as JoinRequest
    } catch {
      return rejectWithValue("Network error. Please check your connection.")
    }
  }
)

// ── Get all join requests (admin) ─────────────────────────────────────
export const getJoinRequestsAction = createAsyncThunk(
  "joinCommunity/getAll",
  async (
    params: { page?: number; limit?: number; status?: string; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams()
      if (params.page)   query.set("page",   String(params.page))
      if (params.limit)  query.set("limit",  String(params.limit))
      if (params.status) query.set("status", params.status)
      if (params.search) query.set("search", params.search)

      const res = await fetch(`/api/joincommunity?${query.toString()}`, { method: "GET" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to fetch requests.")
      return { data: json.data as JoinRequest[], pagination: json.pagination }
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── Delete join request (admin) ───────────────────────────────────────
export const deleteJoinRequestAction = createAsyncThunk(
  "joinCommunity/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/joincommunity/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to delete request.")
      return id
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── Update request status (admin) ─────────────────────────────────────
export const updateJoinRequestStatusAction = createAsyncThunk(
  "joinCommunity/updateStatus",
  async (
    { id, status }: { id: string; status: "pending" | "approved" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/joincommunity/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to update status.")
      return json.data as JoinRequest
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)