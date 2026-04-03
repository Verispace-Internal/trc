import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    companyLogo: {
      url: String,
      fileId: String
    },

    companyInfo: {
      type: String,
      required: true
    },

    about: {
      type: String,
      required: true
    },

    categoriesServed: [String],
    citiesCovered: [String],
    assetsHandled: [String],

    websiteSocials: [String]
  },
  { timestamps: true }
);

export default mongoose.models.Company ||
mongoose.model("Company", companySchema);