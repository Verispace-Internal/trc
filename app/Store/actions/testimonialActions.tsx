import { createAsyncThunk } from "@reduxjs/toolkit"

export interface Testimonial {
  _id: string
  name: string
  position: string
  message: string
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

// ── GET all testimonials (public) ─────────────────────────────────────
export const getTestimonialsAction = createAsyncThunk(
  "testimonials/getAll",
  async (visibleOnly: boolean = true, { rejectWithValue }) => {
    try {
      const url = visibleOnly ? "/api/testimonial" : "/api/testimonial?visible=false"
      const res = await fetch(url, { method: "GET" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to fetch testimonials.")
      return json.data as Testimonial[]
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── CREATE testimonial (admin) ────────────────────────────────────────
export const createTestimonialAction = createAsyncThunk(
  "testimonials/create",
  async (
    data: { name: string; position: string; message: string; isVisible?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to create testimonial.")
      return json.data as Testimonial
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── UPDATE testimonial (admin) ────────────────────────────────────────
export const updateTestimonialAction = createAsyncThunk(
  "testimonials/update",
  async (
    { id, data }: { id: string; data: Partial<{ name: string; position: string; message: string; isVisible: boolean }> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/testimonial/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to update testimonial.")
      return json.data as Testimonial
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── DELETE testimonial (admin) ────────────────────────────────────────
export const deleteTestimonialAction = createAsyncThunk(
  "testimonials/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/testimonial/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to delete testimonial.")
      return id
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)