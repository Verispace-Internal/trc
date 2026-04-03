import { createSlice } from "@reduxjs/toolkit"
import {
  getBlogsAction,
  createBlogAction,
  updateBlogAction,
  deleteBlogAction,
  toggleBlogStatusAction,
  type Blog,
} from "../actions/blogActions"

interface BlogState {
  blogs: Blog[]
  loading: boolean
  error: string | null
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
}

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    // GET ALL
    builder.addCase(getBlogsAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(getBlogsAction.fulfilled, (state, action) => { state.loading = false; state.blogs = action.payload })
    builder.addCase(getBlogsAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // CREATE
    builder.addCase(createBlogAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(createBlogAction.fulfilled, (state, action) => { state.loading = false; state.blogs.unshift(action.payload) })
    builder.addCase(createBlogAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // UPDATE
    builder.addCase(updateBlogAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(updateBlogAction.fulfilled, (state, action) => {
      state.loading = false
      state.blogs = state.blogs.map(b => b._id === action.payload._id ? action.payload : b)
    })
    builder.addCase(updateBlogAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // DELETE
    builder.addCase(deleteBlogAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(deleteBlogAction.fulfilled, (state, action) => {
      state.loading = false
      state.blogs = state.blogs.filter(b => b._id !== action.payload)
    })
    builder.addCase(deleteBlogAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // TOGGLE STATUS
    builder.addCase(toggleBlogStatusAction.fulfilled, (state, action) => {
      state.blogs = state.blogs.map(b => b._id === action.payload._id ? action.payload : b)
    })
    builder.addCase(toggleBlogStatusAction.rejected, (state, action) => { state.error = action.payload as string })
  },
})

export const { clearBlogError } = blogsSlice.actions
export default blogsSlice.reducer