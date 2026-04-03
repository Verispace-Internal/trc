import { NextResponse } from "next/server"
import { connectDB } from "../config/db"
import testimonialModel from "../models/testimonialModel"
import { protect } from "../middleware/authMiddleware"

// ─────────────────────────────────────────────
// POST /api/testimonial — Create (admin only)
// ─────────────────────────────────────────────
export const createTestimonial = async (req) => {
  try {
    await connectDB()
    await protect(req)

    const { name, position, message, isVisible } = await req.json()

    if (!name?.trim())
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 })

    if (!position?.trim())
      return NextResponse.json({ success: false, message: "Position / company name is required" }, { status: 400 })

    if (!message?.trim())
      return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 })

    const testimonial = await testimonialModel.create({
      name: name.trim(),
      position: position.trim(),
      message: message.trim(),
      isVisible: isVisible !== undefined ? isVisible : true,
    })

    return NextResponse.json(
      { success: true, message: "Testimonial created successfully", data: testimonial },
      { status: 201 }
    )
  } catch (error) {
    console.error("[createTestimonial]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// GET /api/testimonial — Get all (public)
// ─────────────────────────────────────────────
export const getTestimonials = async (req) => {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const visibleOnly = searchParams.get("visible") !== "false"

    const filter = visibleOnly ? { isVisible: true } : {}

    const testimonials = await testimonialModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error("[getTestimonials]", error)
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// PUT /api/testimonial/[id] — Update (admin only)
// ─────────────────────────────────────────────
export const updateTestimonial = async (req, { params }) => {
  try {
    await connectDB()
    await protect(req)

    const { id } = await params

    if (!id)
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })

    const body = await req.json()
    const updates = {}

    if (body.name?.trim())     updates.name     = body.name.trim()
    if (body.position?.trim()) updates.position = body.position.trim()
    if (body.message?.trim())  updates.message  = body.message.trim()
    if (body.isVisible !== undefined) updates.isVisible = body.isVisible

    const testimonial = await testimonialModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!testimonial)
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Testimonial updated successfully", data: testimonial })
  } catch (error) {
    console.error("[updateTestimonial]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// DELETE /api/testimonial/[id] — Delete (admin only)
// ─────────────────────────────────────────────
export const deleteTestimonial = async (req, { params }) => {
  try {
    await connectDB()
    await protect(req)

    const { id } = await params

    if (!id)
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })

    const testimonial = await testimonialModel.findByIdAndDelete(id)

    if (!testimonial)
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 })

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" })
  } catch (error) {
    console.error("[deleteTestimonial]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}