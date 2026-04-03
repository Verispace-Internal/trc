"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users, FileText, Star, LogOut, Menu, ChevronRight, UserPlus } from "lucide-react"
import { logoutAction } from "@/app/Store/actions/authActions"
import type { AppDispatch } from "@/app/Store/Store"

import Overview from "@/app/components/admin/Overview"
import MembersSection from "@/app/components/admin/MembersSections"
import BlogsSection from "@/app/components/admin/BlogSection"
import TestimonialsSection from "@/app/components/admin/TestimonialsSection"
import JoinCommunitySection from "@/app/components/admin/Joincommunitysection"

type Tab = "overview" | "members" | "blogs" | "testimonials" | "joinrequests"

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview",     label: "Overview",       icon: <LayoutDashboard size={16} /> },
  { id: "members",      label: "Members",        icon: <Users size={16} /> },
  { id: "blogs",        label: "Blog Posts",     icon: <FileText size={16} /> },
  { id: "testimonials", label: "Testimonials",   icon: <Star size={16} /> },
  { id: "joinrequests", label: "Join Requests",  icon: <UserPlus size={16} /> },
]

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const [tab, setTab] = useState<Tab>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutAction())
    router.push("/admin/login")
  }

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-hidden font-sans">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-60 flex-shrink-0
        bg-[var(--bg-navbar)] border-r border-white/[0.07]
        flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="px-6 py-5 border-b border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-primary)] text-xl font-black tracking-tight">trc.</span>
            <span className="text-[10px] font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-left
                ${tab === item.id
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                  : "text-white/45 hover:text-white hover:bg-white/[0.04]"
                }`}
            >
              {item.icon}
              {item.label}
              {tab === item.id && <ChevronRight size={12} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-5 border-t border-white/[0.07] pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[var(--bg-navbar)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white/50 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-[var(--text-primary)] text-[15px] font-black capitalize">
                {tab === "joinrequests" ? "Join Requests" : tab}
              </h1>
              <p className="text-[var(--text-muted)] text-[11px]">Manage your community data</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
            <span className="text-[var(--accent)] text-[11px] font-black">A</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {tab === "overview"      && <Overview />}
          {tab === "members"       && <MembersSection />}
          {tab === "blogs"         && <BlogsSection />}
          {tab === "testimonials"  && <TestimonialsSection />}
          {tab === "joinrequests"  && <JoinCommunitySection />}
        </main>
      </div>

    </div>
  )
}