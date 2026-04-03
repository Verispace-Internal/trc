import { NextResponse } from "next/server"
import { connectDB } from "../config/db"
import joinCommunityModel from "../models/joincommunityModel"
import { protect } from "../middleware/authMiddleware"

// ─────────────────────────────────────────────
// POST /api/join — Submit join request (public)
// ─────────────────────────────────────────────
export const createJoinRequest = async (req) => {
  try {
    await connectDB()

    const body = await req.json()
    const { businessName, ownerName, email, phone, city, message } = body

    // ── Validation ──────────────────────────────────────────────────
    if (!businessName?.trim())
      return NextResponse.json({ success: false, message: "Business name is required" }, { status: 400 })

    if (!ownerName?.trim())
      return NextResponse.json({ success: false, message: "Owner name is required" }, { status: 400 })

    if (!email?.trim())
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })

    if (!phone?.trim())
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })

    if (!city?.trim())
      return NextResponse.json({ success: false, message: "City is required" }, { status: 400 })

    // ── Duplicate check — same email or phone ───────────────────────
    const existing = await joinCommunityModel.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { phone: phone.trim() },
      ],
    })

    if (existing) {
      const field = existing.email === email.toLowerCase().trim() ? "email" : "phone number"
      return NextResponse.json(
        { success: false, message: `This ${field} has already submitted a request` },
        { status: 409 }
      )
    }

    // ── Create ──────────────────────────────────────────────────────
    const request = await joinCommunityModel.create({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      city: city.trim(),
      message: message?.trim() || "",
    })

    return NextResponse.json(
      { success: true, message: "Your request has been submitted. We will contact you shortly.", data: request },
      { status: 201 }
    )
  } catch (error) {
    console.error("[createJoinRequest]", error)
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// GET /api/join — Get all requests (admin only)
// ─────────────────────────────────────────────
export const getAllJoinRequests = async (req) => {
  try {
    await connectDB()
    await protect(req)

    const { searchParams } = new URL(req.url)
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"))
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"))
    const status = searchParams.get("status") || null
    const search = searchParams.get("search") || null

    const filter = {}
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { ownerName:    { $regex: search, $options: "i" } },
        { email:        { $regex: search, $options: "i" } },
        { city:         { $regex: search, $options: "i" } },
      ]
    }

    const skip  = (page - 1) * limit
    const total = await joinCommunityModel.countDocuments(filter)

    const requests = await joinCommunityModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[getAllJoinRequests]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// DELETE /api/join/[id] — Delete a request (admin only)
// ─────────────────────────────────────────────
export const deleteJoinRequest = async (req, { params }) => {
  try {
    await connectDB()
    await protect(req)

    const { id } = await params

    if (!id)
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })

    const request = await joinCommunityModel.findById(id)
    if (!request)
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 })

    await joinCommunityModel.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: "Request deleted successfully" })
  } catch (error) {
    console.error("[deleteJoinRequest]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}

// ─────────────────────────────────────────────
// PATCH /api/join/[id] — Update status (admin only)
// pending → approved / rejected
// ─────────────────────────────────────────────
export const updateJoinRequestStatus = async (req, { params }) => {
  try {
    await connectDB()
    await protect(req)

    const { id } = await params
    const { status } = await req.json()

    if (!id)
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })

    if (!["pending", "approved", "rejected"].includes(status))
      return NextResponse.json({ success: false, message: "Invalid status. Use: pending, approved, rejected" }, { status: 400 })

    const request = await joinCommunityModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!request)
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      message: `Request marked as ${status}`,
      data: request,
    })
  } catch (error) {
    console.error("[updateJoinRequestStatus]", error)
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 })
  }
}