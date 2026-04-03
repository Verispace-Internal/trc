"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { Modal, InputField, TextAreaField, ActionBtn } from "./Shared"
import {
  getCompaniesAction,
  addCompanyAction,
  updateCompanyAction,
  deleteCompanyAction,
  type Company,
} from "@/app/Store/actions/companyActions"
import { clearCompanyError } from "@/app/Store/reducers/companySlice"
import type { AppDispatch, RootState } from "@/app/Store/Store"

type ModalType = { type: "add" | "edit"; data?: Company } | null

const emptyForm = {
  companyName: "",
  companyInfo: "",
  about: "",
  categoriesServed: "",
  citiesCovered: "",
  assetsHandled: "",
  websiteSocials: "",
}

export default function MembersSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { companies, loading, error } = useSelector((state: RootState) => state.companyReducer)

  const [modal, setModal] = useState<ModalType>(null)
  const [form, setForm] = useState(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  // ── Fetch on mount ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getCompaniesAction())
  }, [dispatch])

  // ── Open modals ─────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview("")
    dispatch(clearCompanyError())
    setModal({ type: "add" })
  }

  const openEdit = (c: Company) => {
    setForm({
      companyName: c.companyName,
      companyInfo: c.companyInfo,
      about: c.about,
      categoriesServed: c.categoriesServed.join(", "),
      citiesCovered: c.citiesCovered.join(", "),
      assetsHandled: c.assetsHandled.join(", "),
      websiteSocials: c.websiteSocials.join(", "),
    })
    setLogoFile(null)
    setLogoPreview(c.companyLogo?.url ?? "")
    dispatch(clearCompanyError())
    setModal({ type: "edit", data: c })
  }

  const close = () => setModal(null)

  // ── Logo file handler ────────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  // ── Build FormData from form state ──────────────────────────────────
  const buildFormData = (): FormData => {
    const fd = new FormData()
    fd.append("companyName", form.companyName)
    fd.append("companyInfo", form.companyInfo)
    fd.append("about", form.about)

    // Arrays — send as comma-separated, backend handles parsing
    const toArr = (val: string) => val.split(",").map(s => s.trim()).filter(Boolean)
    toArr(form.categoriesServed).forEach(v => fd.append("categoriesServed", v))
    toArr(form.citiesCovered).forEach(v => fd.append("citiesCovered", v))
    toArr(form.assetsHandled).forEach(v => fd.append("assetsHandled", v))
    toArr(form.websiteSocials).forEach(v => fd.append("websiteSocials", v))

    if (logoFile) fd.append("companyLogo", logoFile)
    return fd
  }

  // ── Save ─────────────────────────────────────────────────────────────
  const save = async () => {
    const fd = buildFormData()
    if (modal?.type === "add") {
      const result = await dispatch(addCompanyAction(fd))
      if (addCompanyAction.fulfilled.match(result)) close()
    } else if (modal?.data) {
      const result = await dispatch(updateCompanyAction({ id: modal.data._id, formData: fd }))
      if (updateCompanyAction.fulfilled.match(result)) close()
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────
  const del = (id: string) => dispatch(deleteCompanyAction(id))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[var(--text-primary)] text-xl font-black">Members</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-green-500 transition-colors"
        >
          <Plus size={14} /> Add Member
        </button>
      </div>

      {/* Loading */}
      {loading && !modal && (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)] text-[13px]">
          <svg className="animate-spin w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading companies...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Company", "Info", "Categories", "Cities", ""].map((h, i) => (
                  <th key={i} className="text-left text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[var(--text-muted)] text-[13px]">
                    No companies yet. Click "Add Member" to get started.
                  </td>
                </tr>
              ) : (
                companies.map(c => (
                  <tr key={c._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.companyLogo?.url ? (
                          <Image src={c.companyLogo.url} alt={c.companyName} width={32} height={32} className="rounded-lg object-cover w-8 h-8" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/30 font-bold">
                            {c.companyName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <p className="text-[var(--text-primary)] text-[13px] font-semibold">{c.companyName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] text-[13px] max-w-[180px] truncate">{c.companyInfo}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.categoriesServed.slice(0, 2).map((cat, i) => (
                          <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">{cat}</span>
                        ))}
                        {c.categoriesServed.length > 2 && (
                          <span className="text-[10px] text-white/30">+{c.categoriesServed.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] text-[13px]">
                      {c.citiesCovered.slice(0, 2).join(", ")}
                      {c.citiesCovered.length > 2 && <span className="text-white/30"> +{c.citiesCovered.length - 2}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <ActionBtn onClick={() => openEdit(c)} variant="edit" />
                        <ActionBtn onClick={() => del(c._id)} variant="delete" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <Modal title={modal.type === "add" ? "Add Company" : "Edit Company"} onClose={close}>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">

            {/* Logo upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Company Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <Image src={logoPreview} alt="logo" fill className="object-cover" />
                    <button
                      onClick={() => { setLogoFile(null); setLogoPreview("") }}
                      className="absolute top-1 right-1 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                    <Upload size={16} className="text-white/30" />
                    <span className="text-[9px] text-white/20 mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                )}
                <span className="text-[11px] text-white/25">JPG, PNG, WebP · max 5MB</span>
              </div>
            </div>

            <InputField label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Poona Film Centre Pvt Ltd" />
            <InputField label="Company Info (short)" name="companyInfo" value={form.companyInfo} onChange={handleChange} placeholder="Brief description (10–500 chars)" />
            <TextAreaField label="About (full)" name="about" value={form.about} onChange={handleChange} placeholder="Detailed description (10–5000 chars)" />
            <InputField label="Categories Served" name="categoriesServed" value={form.categoriesServed} onChange={handleChange} placeholder="Camera, Lighting, Audio  (comma separated)" />
            <InputField label="Cities Covered" name="citiesCovered" value={form.citiesCovered} onChange={handleChange} placeholder="Pune, Mumbai, Nashik  (comma separated)" />
            <InputField label="Assets Handled" name="assetsHandled" value={form.assetsHandled} onChange={handleChange} placeholder="DSLR, Drone, Gimbal  (comma separated)" />
            <InputField label="Website & Socials" name="websiteSocials" value={form.websiteSocials} onChange={handleChange} placeholder="https://site.com, @instagram  (comma separated)" />

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