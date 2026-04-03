"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Quote } from "lucide-react"
import { Modal, InputField, TextAreaField, ActionBtn } from "./Shared"
import {
  getTestimonialsAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  type Testimonial,
} from "@/app/Store/actions/testimonialActions"
import { clearTestimonialError } from "@/app/Store/reducers/testimonialSlice"
import type { AppDispatch, RootState } from "@/app/Store/Store"

type ModalType = { type: "add" | "edit"; data?: Testimonial } | null

const emptyForm = { name: "", position: "", message: "" }

export default function TestimonialsSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { testimonials, loading, error } = useSelector(
    (state: RootState) => state.testimonialReducer
  )

  const [modal, setModal] = useState<ModalType>(null)
  const [form, setForm] = useState(emptyForm)

  // Fetch all (including hidden) on mount
  useEffect(() => {
    if (testimonials.length === 0) {
      dispatch(getTestimonialsAction(false))
    }
  }, [dispatch, testimonials.length])

  const openAdd = () => {
    setForm(emptyForm)
    dispatch(clearTestimonialError())
    setModal({ type: "add" })
  }

  const openEdit = (t: Testimonial) => {
    setForm({ name: t.name, position: t.position, message: t.message })
    dispatch(clearTestimonialError())
    setModal({ type: "edit", data: t })
  }

  const close = () => setModal(null)

  const save = async () => {
    if (modal?.type === "add") {
      const result = await dispatch(createTestimonialAction(form))
      if (createTestimonialAction.fulfilled.match(result)) close()
    } else if (modal?.data) {
      const result = await dispatch(updateTestimonialAction({ id: modal.data._id, data: form }))
      if (updateTestimonialAction.fulfilled.match(result)) close()
    }
  }

  const del = (id: string) => dispatch(deleteTestimonialAction(id))

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[var(--text-primary)] text-xl font-black">Testimonials</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-green-500 transition-colors"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {/* Loading */}
      {loading && !modal && (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)] text-[13px]">
          <svg className="animate-spin w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading testimonials...
        </div>
      )}

      {/* Empty */}
      {!loading && testimonials.length === 0 && (
        <div className="flex items-center justify-center py-16 text-white/25 text-sm">
          No testimonials yet. Click "Add Testimonial" to get started.
        </div>
      )}

      {/* Grid */}
      {!loading && testimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div
              key={t._id}
              className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-white/10 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Quote size={18} className="text-[var(--accent)]/40" />
                  {/* Visibility badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    t.isVisible
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}>
                    {t.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="text-[var(--text-muted)] text-[13px] leading-relaxed line-clamp-3">
                  {t.message}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-primary)] text-[13px] font-bold">{t.name}</p>
                  <p className="text-[var(--text-muted)] text-[11px]">{t.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ActionBtn onClick={() => openEdit(t)} variant="edit" />
                  <ActionBtn onClick={() => del(t._id)} variant="delete" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal.type === "add" ? "Add Testimonial" : "Edit Testimonial"}
          onClose={close}
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Amit Joshi"
              />
              <InputField
                label="Position / Company"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Equipment Vendor, Pune"
              />
            </div>
            <TextAreaField
              label="Testimonial Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What did they say?"
            />

            {/* Visibility toggle (edit only) */}
            {modal.type === "edit" && modal.data && (
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (modal.data) {
                      dispatch(updateTestimonialAction({
                        id: modal.data._id,
                        data: { isVisible: !modal.data.isVisible },
                      }))
                      setModal(prev =>
                        prev?.data
                          ? { ...prev, data: { ...prev.data, isVisible: !prev.data.isVisible } }
                          : prev
                      )
                    }
                  }}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors ${
                    modal.data.isVisible
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 hover:bg-[var(--accent)]/20"
                      : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {modal.data.isVisible ? "Visible — click to hide" : "Hidden — click to show"}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={close}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-[13px] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
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