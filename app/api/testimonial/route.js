import { createTestimonial, getTestimonials } from "../../../controllers/testimonialController"

// GET /api/testimonial — public
export async function GET(req) {
  return getTestimonials(req)
}

// POST /api/testimonial — admin only
export async function POST(req) {
  return createTestimonial(req)
}