"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { Modal, InputField, TextAreaField, ActionBtn } from "./Shared"
import {
  getBlogsAction,
  createBlogAction,
  updateBlogAction,
  deleteBlogAction,
  toggleBlogStatusAction,
  type Blog,
} from "@/app/Store/actions/blogActions"
import { clearBlogError } from "@/app/Store/reducers/blogsSlice"
import type { AppDispatch, RootState } from "@/app/Store/Store"

type ModalType = { type: "add" | "edit"; data?: Blog } | null

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  status: "draft" as "draft" | "published",
  isFeatured: false,
  metaTitle: "",
  metaDescription: "",
}

export default function BlogsSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogsReducer)

  const [modal, setModal] = useState<ModalType>(null)
  const [form, setForm] = useState(emptyForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState("")

  // ── Fetch on mount ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getBlogsAction())
  }, [dispatch])

  // ── Open modals ─────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm)
    setCoverFile(null)
    setCoverPreview("")
    dispatch(clearBlogError())
    setModal({ type: "add" })
  }

  const openEdit = (b: Blog) => {
    setForm({
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      category: b.category,
      tags: b.tags.join(", "),
      status: b.status,
      isFeatured: b.isFeatured,
      metaTitle: b.seo?.metaTitle ?? "",
      metaDescription: b.seo?.metaDescription ?? "",
    })
    setCoverFile(null)
    setCoverPreview(b.coverImage ?? "")
    dispatch(clearBlogError())
    setModal({ type: "edit", data: b })
  }

  const close = () => setModal(null)

  // ── Cover image handler ──────────────────────────────────────────────
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // ── Build FormData ───────────────────────────────────────────────────
  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.append("title", form.title)
    fd.append("excerpt", form.excerpt)
    fd.append("content", form.content)
    fd.append("category", form.category)
    fd.append("status", form.status)
    fd.append("isFeatured", String(form.isFeatured))
    fd.append("metaTitle", form.metaTitle)
    fd.append("metaDescription", form.metaDescription)
    // Tags — send as JSON array string (backend parseTags handles this)
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean)
    fd.append("tags", JSON.stringify(tagsArr))
    if (coverFile) fd.append("coverImage", coverFile)
    return fd
  }

  // ── Save ─────────────────────────────────────────────────────────────
  const save = async () => {
    const fd = buildFormData()
    if (modal?.type === "add") {
      const result = await dispatch(createBlogAction(fd))
      if (createBlogAction.fulfilled.match(result)) close()
    } else if (modal?.data) {
      const result = await dispatch(updateBlogAction({ id: modal.data._id, formData: fd }))
      if (updateBlogAction.fulfilled.match(result)) close()
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────
  const del = (id: string) => dispatch(deleteBlogAction(id))

  // ── Toggle status ────────────────────────────────────────────────────
  const toggleStatus = (b: Blog) => dispatch(toggleBlogStatusAction({ id: b._id, currentStatus: b.status }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[var(--text-primary)] text-xl font-black">Blog Posts</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-green-500 transition-colors"
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* Loading */}
      {loading && !modal && (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)] text-[13px]">
          <svg className="animate-spin w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading blogs...
        </div>
      )}

      {/* Blog list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {blogs.length === 0 ? (
            <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl px-5 py-10 text-center text-[var(--text-muted)] text-[13px]">
              No blog posts yet. Click "New Post" to get started.
            </div>
          ) : (
            blogs.map(b => (
              <div key={b._id} className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {b.coverImage ? (
                    <Image src={b.coverImage} alt={b.title} width={40} height={40} className="rounded-lg object-cover w-10 h-10 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[var(--text-primary)] text-[14px] font-semibold truncate mb-0.5">{b.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-[var(--text-muted)]">{b.category || "Uncategorised"}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[11px] text-[var(--text-muted)]">{b.readTime} min read</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[11px] text-[var(--text-muted)]">{b.views} views</span>
                      {b.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(b)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-colors
                      ${b.status === "published"
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 hover:bg-[var(--accent)]/20"
                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}>
                    {b.status}
                  </button>
                  <ActionBtn onClick={() => openEdit(b)} variant="edit" />
                  <ActionBtn onClick={() => del(b._id)} variant="delete" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <Modal title={modal.type === "add" ? "New Blog Post" : "Edit Blog Post"} onClose={close}>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">

            {/* Cover image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Cover Image</label>
              <div className="flex items-center gap-4">
                {coverPreview ? (
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/10">
                    <Image src={coverPreview} alt="cover" fill className="object-cover" />
                    <button
                      onClick={() => { setCoverFile(null); setCoverPreview("") }}
                      className="absolute top-1 right-1 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                    <Upload size={16} className="text-white/30" />
                    <span className="text-[9px] text-white/20 mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                  </label>
                )}
                <span className="text-[11px] text-white/25">JPG, PNG, WebP · max 5MB</span>
              </div>
            </div>

            <InputField label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Blog post title..." />
            <InputField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Technology, Film" />
            <InputField label="Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="Camera, Lighting, Audio  (comma separated)" />
            <TextAreaField label="Excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Short description shown in listings..." />
            <TextAreaField label="Content" name="content" value={form.content} onChange={handleChange} placeholder="Full blog content..." />

            {/* Status + Featured row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-main)] border border-white/[0.08] text-[var(--text-primary)] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/25 transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Featured</label>
                <div className="flex items-center h-[42px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded accent-green-500"
                    />
                    <span className="text-[13px] text-[var(--text-muted)]">Mark as featured</span>
                  </label>
                </div>
              </div>
            </div>

            <InputField label="Meta Title (SEO)" name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO title..." />
            <InputField label="Meta Description (SEO)" name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="SEO description..." />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={close} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-[13px] font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}