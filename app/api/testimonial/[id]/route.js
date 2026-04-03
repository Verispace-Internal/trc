import { updateTestimonial, deleteTestimonial } from "../../../../controllers/testimonialController"

// PUT /api/testimonial/[id] — admin only
export async function PUT(req, params) {
  return updateTestimonial(req, params)
}

// DELETE /api/testimonial/[id] — admin only
export async function DELETE(req, params) {
  return deleteTestimonial(req, params)
}