// models/blogModel.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Excerpt must be under 300 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    coverImage: {
      type: String,
      default: "",
    },
coverImageId: {      
  type: String,
  default: "",
},
    category: {
      type: String,
      default: "",
      trim: true,
    },

    tags: [{ type: String, trim: true }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Author is required"],
    },

    relatedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Status must be draft, published, or archived",
      },
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ✅ SEO fields — optional, for future use
    seo: {
      metaTitle:       { type: String, trim: true, default: "" },
      metaDescription: { type: String, trim: true, default: "" },
    },

    views: {
      type: Number,
      default: 0,
    },

    readTime: {
      type: Number,
      default: 1,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);