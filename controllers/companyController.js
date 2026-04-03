import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import companyModel from "../models/companyModel";
import { currentUser } from "../middleware/authMiddleware";
import { uploadMedia, generateSlug } from "../lib/mediaUpload";
import { deleteMedia } from "../lib/deleteMedia";
import { connectDB } from "../config/db";

// ============================
// CONSTANTS
// ============================

const ALLOWED_IMAGE_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE        = 5 * 1024 * 1024; // 5 MB

const MIN_COMPANY_NAME_LEN = 2;
const MAX_COMPANY_NAME_LEN = 100;

const MIN_COMPANY_INFO_LEN = 10;
const MAX_COMPANY_INFO_LEN = 500;

const MIN_ABOUT_LEN        = 10;
const MAX_ABOUT_LEN        = 5000;

// ============================
// HELPERS
// ============================

function validateCompanyName(raw) {
  if (!raw || typeof raw !== "string" || !raw.trim()) {
    return { error: "Company name is required" };
  }
  const value = raw.trim();
  if (value.length < MIN_COMPANY_NAME_LEN)
    return { error: `Company name must be at least ${MIN_COMPANY_NAME_LEN} characters` };
  if (value.length > MAX_COMPANY_NAME_LEN)
    return { error: `Company name must not exceed ${MAX_COMPANY_NAME_LEN} characters` };
  const SAFE_NAME = /^[a-zA-Z0-9\s\-&.,''()]+$/;
  if (!SAFE_NAME.test(value))
    return { error: "Company name contains invalid characters" };
  return { value };
}

function validateRequiredText(raw, fieldName, minLen, maxLen) {
  if (!raw || typeof raw !== "string" || !raw.trim())
    return { error: `${fieldName} is required` };
  const value = raw.trim();
  if (value.length < minLen)
    return { error: `${fieldName} must be at least ${minLen} characters` };
  if (value.length > maxLen)
    return { error: `${fieldName} must not exceed ${maxLen} characters` };
  return { value };
}

function validateFile(file) {
  if (!file || file.size === 0) return { valid: false };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return { error: `Only image files are allowed (${ALLOWED_IMAGE_TYPES.join(", ")})` };
  if (file.size > MAX_FILE_SIZE)
    return { error: "Image must be under 5 MB" };
  return { valid: true };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts an array field from FormData.
 *
 * Handles all frontend patterns:
 *   1. JSON string:       formData.append("field", JSON.stringify(arr))
 *   2. Multiple appends:  arr.forEach(v => formData.append("field", v))
 *   3. Comma-separated:   formData.append("field", "a,b,c")
 */
function extractArrayField(formData, key) {
  const all = formData.getAll(key);

  if (all.length > 1) {
    // Pattern 2: multiple entries with same key
    return all.flatMap((item) => {
      if (typeof item !== "string") return [];
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return item.trim() ? [item.trim()] : [];
      }
    });
  }

  const raw = all[0];
  if (!raw || (typeof raw === "string" && !raw.trim())) return [];

  // Pattern 1: JSON array string
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // Pattern 3: comma-separated plain string
  if (typeof raw === "string") {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return [];
}

// ============================
// ADD COMPANY
// ============================

export const addCompany = async (req) => {
  try {
    await connectDB();

    const user = await currentUser(req);
    if (!user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();

    const rawName  = formData.get("companyName");
    const rawInfo  = formData.get("companyInfo");
    const rawAbout = formData.get("about");
    const file     = formData.get("companyLogo");

    const nameResult = validateCompanyName(rawName);
    if (nameResult.error)
      return NextResponse.json({ success: false, message: nameResult.error }, { status: 400 });

    const infoResult = validateRequiredText(rawInfo, "Company info", MIN_COMPANY_INFO_LEN, MAX_COMPANY_INFO_LEN);
    if (infoResult.error)
      return NextResponse.json({ success: false, message: infoResult.error }, { status: 400 });

    const aboutResult = validateRequiredText(rawAbout, "About", MIN_ABOUT_LEN, MAX_ABOUT_LEN);
    if (aboutResult.error)
      return NextResponse.json({ success: false, message: aboutResult.error }, { status: 400 });

    const fileResult = validateFile(file);
    if (fileResult.error)
      return NextResponse.json({ success: false, message: fileResult.error }, { status: 400 });

    const companyName      = nameResult.value;
    const categoriesServed = extractArrayField(formData, "categoriesServed");
    const citiesCovered    = extractArrayField(formData, "citiesCovered");
    const assetsHandled    = extractArrayField(formData, "assetsHandled");
    const websiteSocials   = extractArrayField(formData, "websiteSocials");

    // Duplicate check
    const companyCheck = await companyModel.findOne({
      companyName: { $regex: new RegExp(`^${escapeRegex(companyName)}$`, "i") },
    });
    if (companyCheck)
      return NextResponse.json(
        { success: false, message: "A company with this name already exists" },
        { status: 409 }
      );

    // Logo upload
    let logo = null;
    if (fileResult.valid) {
      const folder = `trc/companies/${generateSlug(companyName)}`;
      logo = await uploadMedia(file, folder);
    }

    const company = await companyModel.create({
      admin:          user._id,
      companyName,
      companyLogo:    logo,
      companyInfo:    infoResult.value,
      about:          aboutResult.value,
      categoriesServed,
      citiesCovered,
      assetsHandled,
      websiteSocials,
    });

    return NextResponse.json({ success: true, data: company }, { status: 201 });

  } catch (error) {
    console.error("[addCompany]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};

// ============================
// GET COMPANIES
// ============================

export const getCompanies = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const rawPage  = parseInt(searchParams.get("page"),  10);
    const rawLimit = parseInt(searchParams.get("limit"), 10);

    if (searchParams.get("page") && isNaN(rawPage))
      return NextResponse.json({ success: false, message: "page must be a positive integer" }, { status: 400 });
    if (searchParams.get("limit") && isNaN(rawLimit))
      return NextResponse.json({ success: false, message: "limit must be a positive integer" }, { status: 400 });

    const page  = Math.max(1, rawPage  || 1);
    const limit = Math.min(100, Math.max(1, rawLimit || 20));
    const skip  = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      companyModel.find({}).skip(skip).limit(limit).lean(),
      companyModel.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });

  } catch (error) {
    console.error("[getCompanies]", error);
    return NextResponse.json({ success: false, message: "Error fetching companies" }, { status: 500 });
  }
};

// ============================
// GET SINGLE COMPANY
// ============================

export const getCompany = async (req, { params }) => {
  try {
    await connectDB();

    const { id } = await params;
    if (!id || !isValidObjectId(id))
      return NextResponse.json({ success: false, message: "Invalid company ID" }, { status: 400 });

    const company = await companyModel.findById(id).lean();
    if (!company)
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: company });

  } catch (error) {
    console.error("[getCompany]", error);
    return NextResponse.json({ success: false, message: "Error fetching company" }, { status: 500 });
  }
};
// ============================
// UPDATE COMPANY
// ============================

export const updateCompany = async (req, { params }) => {
  try {
    await connectDB();

    const user = await currentUser(req);
    if (!user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!id || !isValidObjectId(id))
      return NextResponse.json({ success: false, message: "Invalid company ID" }, { status: 400 });

    const company = await companyModel.findOne({ _id: id, admin: user._id });
    if (!company)
      return NextResponse.json({ success: false, message: "Company not found or access denied" }, { status: 404 });

    const formData = await req.formData();

    const rawName  = formData.get("companyName");
    const rawInfo  = formData.get("companyInfo");
    const rawAbout = formData.get("about");
    const file     = formData.get("companyLogo");

    const nameResult = validateCompanyName(rawName);
    if (nameResult.error)
      return NextResponse.json({ success: false, message: nameResult.error }, { status: 400 });

    const infoResult = validateRequiredText(rawInfo, "Company info", MIN_COMPANY_INFO_LEN, MAX_COMPANY_INFO_LEN);
    if (infoResult.error)
      return NextResponse.json({ success: false, message: infoResult.error }, { status: 400 });

    const aboutResult = validateRequiredText(rawAbout, "About", MIN_ABOUT_LEN, MAX_ABOUT_LEN);
    if (aboutResult.error)
      return NextResponse.json({ success: false, message: aboutResult.error }, { status: 400 });

    const fileResult = validateFile(file);
    if (fileResult.error)
      return NextResponse.json({ success: false, message: fileResult.error }, { status: 400 });

    const companyName      = nameResult.value;
    const categoriesServed = extractArrayField(formData, "categoriesServed");
    const citiesCovered    = extractArrayField(formData, "citiesCovered");
    const assetsHandled    = extractArrayField(formData, "assetsHandled");
    const websiteSocials   = extractArrayField(formData, "websiteSocials");

    // Duplicate name check (exclude self)
    if (companyName.toLowerCase() !== company.companyName.toLowerCase()) {
      const duplicate = await companyModel.findOne({
        companyName: { $regex: new RegExp(`^${escapeRegex(companyName)}$`, "i") },
        _id: { $ne: id },
      });
      if (duplicate)
        return NextResponse.json(
          { success: false, message: "A company with this name already exists" },
          { status: 409 }
        );
    }

    // Atomic logo swap
    let logo = company.companyLogo;
    if (fileResult.valid) {
      const folder  = `trc/companies/${generateSlug(companyName)}`;
      const newLogo = await uploadMedia(file, folder);
      if (company.companyLogo?.fileId) {
        await deleteMedia(company.companyLogo.fileId);
      }
      logo = newLogo;
    }

    const updatedCompany = await companyModel.findByIdAndUpdate(
      id,
      {
        companyName,
        companyInfo:    infoResult.value,
        about:          aboutResult.value,
        companyLogo:    logo,
        categoriesServed,
        citiesCovered,
        assetsHandled,
        websiteSocials,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedCompany });

  } catch (error) {
    console.error("[updateCompany]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};

// ============================
// DELETE COMPANY
// ============================

export const deleteCompany = async (req, { params }) => {
  try {
    await connectDB();

    const user = await currentUser(req);
    if (!user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!id || !isValidObjectId(id))
      return NextResponse.json({ success: false, message: "Invalid company ID" }, { status: 400 });

    const company = await companyModel.findOne({ _id: id, admin: user._id });
    if (!company)
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });

    if (company.companyLogo?.fileId) {
      try {
        await deleteMedia(company.companyLogo.fileId);
      } catch (mediaError) {
        console.warn("[deleteCompany] Logo deletion failed:", mediaError);
      }
    }

    await companyModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Company deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("[deleteCompany]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};