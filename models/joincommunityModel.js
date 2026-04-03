import mongoose from "mongoose"

const joinCommunitySchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: [2, "Business name must be at least 2 characters"],
      maxlength: [100, "Business name must not exceed 100 characters"],
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
      minlength: [2, "Owner name must be at least 2 characters"],
      maxlength: [100, "Owner name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[+\d\s\-()]{7,20}$/, "Please provide a valid phone number"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City must not exceed 100 characters"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message must not exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

const joinCommunityModel =
  mongoose.models.JoinCommunity ||
  mongoose.model("JoinCommunity", joinCommunitySchema)

export default joinCommunityModel