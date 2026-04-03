import mongoose from "mongoose"

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Position / company name is required"],
      trim: true,
      maxlength: [150, "Position must not exceed 150 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message must not exceed 1000 characters"],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const testimonialModel =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema)

export default testimonialModel