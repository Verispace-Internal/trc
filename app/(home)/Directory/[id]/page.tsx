"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, MapPin, Tag, Globe, Package } from "lucide-react"
import { getCompaniesAction, type Company } from "@/app/Store/actions/companyActions"
import type { AppDispatch, RootState } from "@/app/Store/Store"

/* ✅ Dynamic Imports (NO UI CHANGE) */
const Navbar = dynamic(() => import("@/app/components/home/Navbar"), {
  loading: () => <div className="h-16 bg-black" />,
})

const Footer = dynamic(() => import("@/app/components/home/Footer"), {
  loading: () => <div className="h-40 bg-black" />,
})

const tabs = ["About", "Categories served", "Cities covered", "Assets handled", "Website + socials"]

export default function DirectoryDetail() {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const id = params.id as string

  const { companies, loading } = useSelector((state: RootState) => state.companyReducer)
  const [activeTab, setActiveTab] = useState("About")

  /* ✅ Fetch only if needed */
  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompaniesAction())
    }
  }, [dispatch, companies.length])

  /* ✅ Memoized company lookup */
  const company: Company | undefined = useMemo(() => {
    return companies.find(c => c._id === id)
  }, [companies, id])

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <svg className="animate-spin w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <Footer />
      </>
    )
  }

  /* ── Not found ── */
  if (!company) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <p className="text-white/40 text-sm">Company not found.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-[var(--bg-main)] px-6 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <Link
            href="/Directory"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/90 text-sm mb-8 transition-colors"
          >
            <ChevronLeft size={14} /> Back to directory
          </Link>

          {/* Hero */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)] text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Active member
              </span>

              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
                {company.companyName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {company.citiesCovered?.[0] && (
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/40">
                    <MapPin size={13} /> {company.citiesCovered[0]}
                  </span>
                )}
                {company.categoriesServed?.[0] && (
                  <span className="flex items-center gap-1.5 text-[12.5px] text-white/40">
                    <Tag size={13} /> {company.categoriesServed[0]}
                  </span>
                )}
              </div>

              <p className="text-[13.5px] leading-relaxed text-white/55 max-w-lg">
                {company.companyInfo}
              </p>
            </div>

            {/* Logo */}
            <div className="w-full md:w-[220px] h-[180px] bg-[var(--bg-navbar)] border border-[var(--border-soft)] rounded-2xl flex items-center justify-center overflow-hidden relative">
              {company.companyLogo?.url ? (
                <Image
                  src={company.companyLogo.url}
                  alt={company.companyName}
                  fill
                  className="object-cover"
                  sizes="220px"
                  quality={80}
                />
              ) : (
                <span className="text-5xl font-black text-white/10">
                  {company.companyName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-[#0f1420] border border-[var(--border-soft)] rounded-full p-1 w-fit mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap
                  ${activeTab === tab
                    ? "bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold"
                    : "text-white/40 hover:text-white/80"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#0f1420] border border-[var(--border-soft)] rounded-2xl p-7 min-h-[340px]">

            {/* About */}
            {activeTab === "About" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Asset Types", value: company.assetsHandled?.length ?? 0 },
                    { label: "Cities", value: company.citiesCovered?.length ?? 0 },
                    { label: "Categories", value: company.categoriesServed?.length ?? 0 },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#141c2b] border border-white/[0.06] rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{stat.value}</div>
                      <div className="text-[11px] text-white/30 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[14px] leading-[1.8] text-white/55">
                  {company.about || "No description available."}
                </p>
              </div>
            )}

            {/* Categories */}
            {activeTab === "Categories served" && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Tag size={15} className="text-[var(--accent)]" />
                  <span className="text-[var(--text-primary)] text-sm font-bold">Categories Served</span>
                </div>
                {company.categoriesServed?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {company.categoriesServed.map((cat, i) => (
                      <span key={i} className="text-[13px] bg-white/5 border border-white/10 text-white/65 px-4 py-2 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm">No categories listed.</p>}
              </div>
            )}

            {/* Cities */}
            {activeTab === "Cities covered" && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={15} className="text-[var(--accent)]" />
                  <span className="text-[var(--text-primary)] text-sm font-bold">Cities Covered</span>
                </div>
                {company.citiesCovered?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {company.citiesCovered.map((city, i) => (
                      <span key={i} className="text-[13px] bg-white/5 border border-white/10 text-white/65 px-4 py-2 rounded-full">
                        {city}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm">No cities listed.</p>}
              </div>
            )}

            {/* Assets */}
            {activeTab === "Assets handled" && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Package size={15} className="text-[var(--accent)]" />
                  <span className="text-[var(--text-primary)] text-sm font-bold">Assets Handled</span>
                </div>
                {company.assetsHandled?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {company.assetsHandled.map((asset, i) => (
                      <span key={i} className="text-[13px] bg-white/5 border border-white/10 text-white/65 px-4 py-2 rounded-full">
                        {asset}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm">No assets listed.</p>}
              </div>
            )}

            {/* Links */}
            {activeTab === "Website + socials" && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Globe size={15} className="text-[var(--accent)]" />
                  <span className="text-[var(--text-primary)] text-sm font-bold">Website &amp; Socials</span>
                </div>
                {company.websiteSocials?.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {company.websiteSocials.map((link, i) => (
                      <a
                        key={i}
                        href={link.startsWith("http") ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-[var(--accent)] hover:underline break-all"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : <p className="text-white/30 text-sm">No website or socials listed.</p>}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}