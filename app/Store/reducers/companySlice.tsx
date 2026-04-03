import { createSlice } from "@reduxjs/toolkit"
import {
  getCompaniesAction,
  addCompanyAction,
  updateCompanyAction,
  deleteCompanyAction,
  type Company,
} from "../actions/companyActions"

interface CompanyState {
  companies: Company[]
  loading: boolean
  error: string | null
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
}

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    // GET ALL
    builder.addCase(getCompaniesAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(getCompaniesAction.fulfilled, (state, action) => { state.loading = false; state.companies = action.payload })
    builder.addCase(getCompaniesAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // ADD
    builder.addCase(addCompanyAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(addCompanyAction.fulfilled, (state, action) => { state.loading = false; state.companies.unshift(action.payload) })
    builder.addCase(addCompanyAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // UPDATE
    builder.addCase(updateCompanyAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(updateCompanyAction.fulfilled, (state, action) => {
      state.loading = false
      state.companies = state.companies.map(c => c._id === action.payload._id ? action.payload : c)
    })
    builder.addCase(updateCompanyAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // DELETE
    builder.addCase(deleteCompanyAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(deleteCompanyAction.fulfilled, (state, action) => {
      state.loading = false
      state.companies = state.companies.filter(c => c._id !== action.payload)
    })
    builder.addCase(deleteCompanyAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
  },
})

export const { clearCompanyError } = companySlice.actions
export default companySlice.reducer