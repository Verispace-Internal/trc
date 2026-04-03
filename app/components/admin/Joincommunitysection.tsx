"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Mail, Phone, MapPin, Building2, User, MessageSquare, Trash2, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import { getJoinRequestsAction, deleteJoinRequestAction, updateJoinRequestStatusAction, type JoinRequest } from "@/app/Store/actions/joinCommunityActions"
import { clearJoinError } from "@/app/Store/reducers/joinCommunitySlice"
import type { AppDispatch, RootState } from "@/app/Store/Store"
import { Modal } from "./Shared"

type StatusFilter = "all" | "pending" | "approved" | "rejected"

const statusConfig = {
  pending:  { label: "Pending",  color: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  approved: { label: "Approved", color: "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export default function JoinCommunitySection() {
  const dispatch = useDispatch<AppDispatch>()
  const { requests, loading, error } = useSelector((state: RootState) => state.joinCommunityReducer)

  const [filter, setFilter] = useState<StatusFilter>("all")
  const [search, setSearch] = useState("")
  const [viewModal, setViewModal] = useState<JoinRequest | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getJoinRequestsAction({}))
  }, [dispatch])

  const filtered = requests.filter(r => {
    const matchStatus = filter === "all" || r.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      r.businessName.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  }

  const handleDelete = async (id: string) => {
    await dispatch(deleteJoinRequestAction(id))
    setDeleteConfirm(null)
    if (viewModal?._id === id) setViewModal(null)
  }

  const handleStatus = (id: string, status: "pending" | "approved" | "rejected") => {
    dispatch(updateJoinRequestStatusAction({ id, status }))
    if (viewModal?._id === id) {
      setViewModal(prev => prev ? { ...prev, status } : prev)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[var(--text-primary)] text-xl font-black">Join Requests</h2>
        <span className="text-[12px] text-[var(--text-muted)]">{counts.all} total · {counts.pending} pending</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-4 py-2.5 rounded-xl mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-[var(--text-muted)] text-[13px]">
          <svg className="animate-spin w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Loading requests...
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex items-center justify-center py-16 text-white/25 text-sm">
          {search ? `No results for "${search}"` : `No ${filter === "all" ? "" : filter} requests yet.`}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Business", "Owner", "Contact", "City", "Date", ""].map((h, i) => (
                  <th key={i} className="text-left text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr
                  key={r._id}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setViewModal(r)}
                >
                  <td className="px-5 py-3.5">
                    <p className="text-[var(--text-primary)] text-[13px] font-semibold">{r.businessName}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-muted)] text-[13px]">{r.ownerName}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-[var(--text-muted)] text-[12px]">{r.email}</p>
                    <p className="text-[var(--text-muted)] text-[12px]">{r.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-muted)] text-[13px]">{r.city}</td>
                 
                  <td className="px-5 py-3.5 text-[var(--text-muted)] text-[12px]">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteConfirm(r._id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 hover:bg-red-500/15 text-red-400/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── View / Edit Modal ── */}
      {viewModal && (
        <Modal title="Join Request Details" onClose={() => setViewModal(null)}>
          <div className="flex flex-col gap-4">

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <Building2 size={10} /> Business
                </div>
                <p className="text-[var(--text-primary)] text-[13px] font-semibold">{viewModal.businessName}</p>
              </div>
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <User size={10} /> Owner
                </div>
                <p className="text-[var(--text-primary)] text-[13px] font-semibold">{viewModal.ownerName}</p>
              </div>
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <Mail size={10} /> Email
                </div>
                <p className="text-[var(--accent)] text-[13px]">{viewModal.email}</p>
              </div>
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <Phone size={10} /> Phone
                </div>
                <p className="text-[var(--text-primary)] text-[13px]">{viewModal.phone}</p>
              </div>
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <MapPin size={10} /> City
                </div>
                <p className="text-[var(--text-primary)] text-[13px]">{viewModal.city}</p>
              </div>
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <Clock size={10} /> Submitted
                </div>
                <p className="text-[var(--text-muted)] text-[12px]">
                  {new Date(viewModal.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Message */}
            {viewModal.message && (
              <div className="bg-[var(--bg-main)] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">
                  <MessageSquare size={10} /> Message
                </div>
                <p className="text-[var(--text-muted)] text-[13px] leading-relaxed">{viewModal.message}</p>
              </div>
            )}


            {/* Delete */}
            <button
              onClick={() => { setViewModal(null); setDeleteConfirm(viewModal._id) }}
              className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-[13px] font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={13} /> Delete Request
            </button>

          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <div className="flex flex-col gap-5">
            <p className="text-[var(--text-muted)] text-[13px] leading-relaxed">
              Are you sure you want to delete this join request? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-[13px] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-[13px] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <><Trash2 size={13} /> Delete</>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}