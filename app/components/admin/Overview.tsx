"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Users, FileText, Star, Building2 } from "lucide-react"
import { getCompaniesAction } from "@/app/Store/actions/companyActions"
import { getBlogsAction } from "@/app/Store/actions/blogActions"
import type { AppDispatch, RootState } from "@/app/Store/Store"

export default function Overview() {
  const dispatch = useDispatch<AppDispatch>()

  const { companies } = useSelector((state: RootState) => state.companyReducer)
  const { blogs } = useSelector((state: RootState) => state.blogsReducer)

  // Fetch real data on mount
  useEffect(() => {
    dispatch(getCompaniesAction())
    dispatch(getBlogsAction())
  }, [dispatch])

  const activeCompanies = companies.filter(c => c.status === "active")

  const stats = [
    {
      label: "Total Members",
      value: companies.length,
      icon: <Users size={16} />,
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent)]/10 border-[var(--accent)]/20",
    },
    {
      label: "Blog Posts",
      value: blogs.length,
      icon: <FileText size={16} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
      label: "Published Blogs",
      value: blogs.filter(b => b.status === "published").length,
      icon: <Star size={16} />,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    },
    {
      label: "Active Members",
      value: activeCompanies.length,
      icon: <Building2 size={16} />,
      color: "text-[var(--accent)]",
      bg: "bg-[var(--accent)]/10 border-[var(--accent)]/20",
    },
  ]

  return (
    <div>
      <h2 className="text-[var(--text-primary)] text-xl font-black mb-6">Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{s.value}</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Recent Members */}
        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-5">
          <h3 className="text-[var(--text-primary)] text-sm font-bold mb-4">Recent Members</h3>
          <div className="flex flex-col gap-2">
            {companies.length === 0 ? (
              <p className="text-[var(--text-muted)] text-[12px] py-4 text-center">No members yet.</p>
            ) : (
              companies.slice(0, 3).map(c => (
                <div key={c._id} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                  <div>
                    <p className="text-[var(--text-primary)] text-[13px] font-semibold">{c.companyName}</p>
                    <p className="text-[var(--text-muted)] text-[11px]">
                      {c.citiesCovered?.[0] ?? "—"}
                      {c.categoriesServed?.[0] ? ` · ${c.categoriesServed[0]}` : ""}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
                    ${c.status === "active"
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20"
                      : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>
                    {c.status ?? "active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-[var(--bg-navbar)] border border-white/[0.07] rounded-2xl p-5">
          <h3 className="text-[var(--text-primary)] text-sm font-bold mb-4">Recent Blog Posts</h3>
          <div className="flex flex-col gap-2">
            {blogs.length === 0 ? (
              <p className="text-[var(--text-muted)] text-[12px] py-4 text-center">No blog posts yet.</p>
            ) : (
              blogs.slice(0, 3).map(b => (
                <div key={b._id} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                  <div>
                    <p className="text-[var(--text-primary)] text-[13px] font-semibold line-clamp-1">{b.title}</p>
                    <p className="text-[var(--text-muted)] text-[11px]">
                      {b.category || "Uncategorised"} · {b.readTime} min read
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
                    ${b.status === "published"
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20"
                      : "bg-white/5 text-white/40 border-white/10"}`}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}