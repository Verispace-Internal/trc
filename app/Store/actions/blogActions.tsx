import { createAsyncThunk } from "@reduxjs/toolkit"

export interface Blog {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverImageId: string
  category: string
  tags: string[]
  status: "published" | "draft"
  isFeatured: boolean
  readTime: number
  views: number
  publishedAt: string | null
  createdAt: string
  seo: { metaTitle: string; metaDescription: string }
  author?: { name: string; email: string }
  relatedCompany?: string | null
}

// ── GET all blogs ─────────────────────────────────────────────────────
export const getBlogsAction = createAsyncThunk(
  "blogs/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/blog", { method: "GET" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to fetch blogs.")
      return json.data as Blog[]
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── CREATE blog ───────────────────────────────────────────────────────
export const createBlogAction = createAsyncThunk(
  "blogs/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/blog", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to create blog.")
      return json.data as Blog
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── UPDATE blog ───────────────────────────────────────────────────────
export const updateBlogAction = createAsyncThunk(
  "blogs/update",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/blog/admin/${id}`, { method: "PUT", body: formData })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to update blog.")
      return json.data as Blog
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── DELETE blog ───────────────────────────────────────────────────────
export const deleteBlogAction = createAsyncThunk(
  "blogs/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to delete blog.")
      return id
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── TOGGLE status ─────────────────────────────────────────────────────
export const toggleBlogStatusAction = createAsyncThunk(
  "blogs/toggleStatus",
  async ({ id, currentStatus }: { id: string; currentStatus: string }, { rejectWithValue }) => {
    try {
      const fd = new FormData()
      fd.append("status", currentStatus === "published" ? "draft" : "published")
      const res = await fetch(`/api/blog/admin/${id}`, { method: "PUT", body: fd })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to update status.")
      return json.data as Blog
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)