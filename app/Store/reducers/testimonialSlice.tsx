import { createSlice } from "@reduxjs/toolkit"
import {
  getTestimonialsAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  type Testimonial,
} from "../actions/testimonialActions"

interface TestimonialState {
  testimonials: Testimonial[]
  loading: boolean
  error: string | null
}

const initialState: TestimonialState = {
  testimonials: [],
  loading: false,
  error: null,
}

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearTestimonialError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {

    // GET ALL
    builder.addCase(getTestimonialsAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(getTestimonialsAction.fulfilled, (state, action) => { state.loading = false; state.testimonials = action.payload })
    builder.addCase(getTestimonialsAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // CREATE
    builder.addCase(createTestimonialAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(createTestimonialAction.fulfilled, (state, action) => { state.loading = false; state.testimonials.unshift(action.payload) })
    builder.addCase(createTestimonialAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // UPDATE
    builder.addCase(updateTestimonialAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(updateTestimonialAction.fulfilled, (state, action) => {
      state.loading = false
      state.testimonials = state.testimonials.map(t =>
        t._id === action.payload._id ? action.payload : t
      )
    })
    builder.addCase(updateTestimonialAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

    // DELETE
    builder.addCase(deleteTestimonialAction.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(deleteTestimonialAction.fulfilled, (state, action) => {
      state.loading = false
      state.testimonials = state.testimonials.filter(t => t._id !== action.payload)
    })
    builder.addCase(deleteTestimonialAction.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })

  },
})

export const { clearTestimonialError } = testimonialSlice.actions
export default testimonialSlice.reducer