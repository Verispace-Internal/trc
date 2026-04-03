import { createAsyncThunk } from "@reduxjs/toolkit"

export interface Company {
  createdAt: string | number | Date
  _id: string
  companyName: string
  companyInfo: string
  about: string
  companyLogo?: { url: string; fileId: string } | null
  categoriesServed: string[]
  citiesCovered: string[]
  assetsHandled: string[]
  websiteSocials: string[]
  status?: "active" | "pending"
}

// ── GET all companies ─────────────────────────────────────────────────
export const getCompaniesAction = createAsyncThunk(
  "company/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/company", { method: "GET" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to fetch companies.")
      return json.data as Company[]
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── ADD company ───────────────────────────────────────────────────────
export const addCompanyAction = createAsyncThunk(
  "company/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/company", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to add company.")
      return json.data as Company
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── UPDATE company ────────────────────────────────────────────────────
export const updateCompanyAction = createAsyncThunk(
  "company/update",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/company/${id}`, { method: "PUT", body: formData })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to update company.")
      return json.data as Company
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)

// ── DELETE company ────────────────────────────────────────────────────
export const deleteCompanyAction = createAsyncThunk(
  "company/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/company/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok || !json.success) return rejectWithValue(json.message || "Failed to delete company.")
      return id
    } catch {
      return rejectWithValue("Network error.")
    }
  }
)