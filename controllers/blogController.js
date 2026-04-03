import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose"; // ✅ FIX: was missing — caused getBlog to crash
import { connectDB } from "../config/db";
import blogModel from "../models/blogModel";
import companyModel from "../models/companyModel"; // ✅ FIX: must import to register "Company" schema for populate
import { protect } from "../middleware/authMiddleware";
import { uploadMedia, generateSlug } from "../lib/mediaUpload";
import { deleteMedia } from "../lib/deleteMedia";

// ── Helper: parse tags from both "AI, Tech" and ["AI","Tech"] ──
const parseTags = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((t) => t.trim()).filter(Boolean) : [];
  } catch {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
};

// ─────────────────────────────────────────────
// POST /api/blog — Create a new blog post
// ─────────────────────────────────────────────
export const createBlog = async (req) => {
  try {
    await connectDB();
    const author = await protect(req);

    const formData = await req.formData();

    const title          = formData.get("title")?.trim();
    const content        = formData.get("content")?.trim();
    const excerpt        = formData.get("excerpt")?.trim()        || "";
    const category       = formData.get("category")?.trim()       || "";
    const status         = formData.get("status")                 || "draft";
    const isFeatured     = formData.get("isFeatured") === "true";
    const tagsRaw        = formData.get("tags")                   || "";
    const metaTitle      = formData.get("metaTitle")?.trim()      || "";
    const metaDesc       = formData.get("metaDescription")?.trim() || "";
    const relatedCompany = formData.get("relatedCompany")         || null;
    const coverFile      = formData.get("coverImage");

    // ── Validation ──────────────────────────────
    if (!title)
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    if (!content)
      return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });

    // ── Slug ────────────────────────────────────
    let slug = formData.get("slug")?.trim() || generateSlug(title);
    const slugExists = await blogModel.findOne({ slug });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // ── Cover image upload ───────────────────────
    let coverImage   = "";
    let coverImageId = "";
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      const uploaded = await uploadMedia(coverFile, `trc/blogs/${slug}`);
      coverImage   = uploaded.url;
      coverImageId = uploaded.fileId;
    }

    // ── Tags ─────────────────────────────────────
    const tags = parseTags(tagsRaw);

    // ── Read time (rough estimate: 200 wpm) ──────
    const wordCount = content.split(/\s+/).length;
    const readTime  = Math.max(1, Math.ceil(wordCount / 200));

    // ── Published date ───────────────────────────
    const publishedAt = status === "published" ? new Date() : null;

    // ── Validate relatedCompany ──────────────────
    const validCompany =
      relatedCompany && isValidObjectId(relatedCompany) ? relatedCompany : null;

    const blog = await blogModel.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImageId,
      category,
      tags,
      author:         author._id,
      relatedCompany: validCompany,
      status,
      isFeatured,
      seo: { metaTitle, metaDescription: metaDesc },
      readTime,
      publishedAt,
    });

    return NextResponse.json(
      { success: true, message: "Blog created successfully", data: blog },
      { status: 201 }
    );
  } catch (error) {
    console.error("[createBlog]", error);
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// ─────────────────────────────────────────────
// GET /api/blog — Get all blogs (with filters)
// ─────────────────────────────────────────────
export const getBlogs = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const status   = searchParams.get("status")   || null;
    const category = searchParams.get("category") || null;
    const tag      = searchParams.get("tag")       || null;
    const featured = searchParams.get("featured") === "true" ? true : null;
    const search   = searchParams.get("search")   || null;
    const sortBy   = searchParams.get("sortBy")   || "createdAt";
    const order    = searchParams.get("order") === "asc" ? 1 : -1;

    const filter = {};
    if (status)            filter.status     = status;
    if (category)          filter.category   = { $regex: category, $options: "i" };
    if (tag)               filter.tags       = { $in: [tag] };
    if (featured !== null) filter.isFeatured = featured;
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (page - 1) * limit;
    const total = await blogModel.countDocuments(filter);

    const blogs = await blogModel
      .find(filter)
      .populate("author", "name email")
      .populate("relatedCompany")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .select("-content"); // omit heavy content field in list view

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages:  Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[getBlogs]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// ─────────────────────────────────────────────
// GET /api/blog/[id] — Get single blog by id or slug
// ─────────────────────────────────────────────
export const getBlog = async (req, { params }) => {
  try {
    await connectDB();

    const { id } = await params; // folder is named [id]

    if (!id)
      return NextResponse.json({ success: false, message: "Missing ID or slug" }, { status: 400 });

    // Supports both ObjectId and slug
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const blog = await blogModel
      .findOne(query)
      .populate("author", "name email")
      .populate("relatedCompany");

    if (!blog)
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    // Increment view count (fire-and-forget)
    blogModel.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("[getBlog]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// ─────────────────────────────────────────────
// PUT /api/blog/[id] — Update a blog post
// ─────────────────────────────────────────────
export const updateBlog = async (req, { params }) => {
  try {
    await connectDB();
    await protect(req);

    const { id } = await params;

    if (!id || !isValidObjectId(id))
      return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

    const blog = await blogModel.findById(id);
    if (!blog)
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    const formData = await req.formData();

    const title          = formData.get("title")?.trim();
    const content        = formData.get("content")?.trim();
    const excerpt        = formData.get("excerpt")?.trim();
    const category       = formData.get("category")?.trim();
    const status         = formData.get("status");
    const isFeatured     = formData.get("isFeatured");
    const tagsRaw        = formData.get("tags");
    const metaTitle      = formData.get("metaTitle")?.trim();
    const metaDesc       = formData.get("metaDescription")?.trim();
    const relatedCompany = formData.get("relatedCompany");
    const coverFile      = formData.get("coverImage");

    const updates = {};

    if (title) {
      updates.title = title;
      if (title !== blog.title) {
        let newSlug = formData.get("slug")?.trim() || generateSlug(title);
        const slugExists = await blogModel.findOne({ slug: newSlug, _id: { $ne: id } });
        if (slugExists) newSlug = `${newSlug}-${Date.now()}`;
        updates.slug = newSlug;
      }
    }

    if (content) {
      updates.content  = content;
      updates.readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
    }

    if (excerpt  !== undefined && excerpt  !== null) updates.excerpt  = excerpt;
    if (category !== undefined && category !== null) updates.category = category;

    // ✅ FIX: validate relatedCompany before setting
    if (relatedCompany !== undefined && relatedCompany !== null) {
      updates.relatedCompany =
        relatedCompany && isValidObjectId(relatedCompany) ? relatedCompany : null;
    }

    if (isFeatured !== undefined && isFeatured !== null)
      updates.isFeatured = isFeatured === "true";

    if (status) {
      updates.status = status;
      if (status === "published" && !blog.publishedAt)
        updates.publishedAt = new Date();
    }

    if (tagsRaw !== undefined && tagsRaw !== null)
      updates.tags = parseTags(tagsRaw);

    // ── SEO ──────────────────────────────────────
    const seoUpdates = {};
    if (metaTitle !== undefined && metaTitle !== null) seoUpdates.metaTitle       = metaTitle;
    if (metaDesc  !== undefined && metaDesc  !== null) seoUpdates.metaDescription = metaDesc;
    if (Object.keys(seoUpdates).length) {
      updates.seo = { ...(blog.seo?.toObject?.() ?? blog.seo ?? {}), ...seoUpdates };
    }

    // ── Cover image replacement ──────────────────
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      if (blog.coverImageId) await deleteMedia(blog.coverImageId);
      const uploaded       = await uploadMedia(coverFile, `trc/blogs/${blog.slug}`);
      updates.coverImage   = uploaded.url;
      updates.coverImageId = uploaded.fileId;
    }

    const updated = await blogModel
      .findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
      .populate("author", "name email")
      .populate("relatedCompany");

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[updateBlog]", error);
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/blog/[id] — Delete a blog post
// ─────────────────────────────────────────────
export const deleteBlog = async (req, { params }) => {
  try {
    await connectDB();
    await protect(req);

    const { id } = await params; // ✅ FIX: was missing await in original

    if (!id || !isValidObjectId(id))
      return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

    const blog = await blogModel.findById(id);
    if (!blog)
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    if (blog.coverImageId) await deleteMedia(blog.coverImageId);

    await blogModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("[deleteBlog]", error);
    if (error.message?.startsWith("Unauthorized"))
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};